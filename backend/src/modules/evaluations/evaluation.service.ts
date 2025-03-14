import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Evaluation,
  EvaluationStatus,
  EvaluationType,
} from '../../entities/evaluation.entity';
import { Project, ProjectStatus } from '../../entities/project.entity';
import { Milestone, MilestoneStatus } from '../../entities/milestone.entity';
import { AgentAIService } from '../agents/agent-ai.service';
import { AgentsService } from '../agents/agents.service';

// Define a type for the AI evaluation response
interface AIEvaluationResponse {
  technicalSkills: string;
  problemSolving: string;
  communication: string;
  teamwork: string;
  creativity: string;
  deliveryQuality: string;
  projectManagement: string;
  adaptability: string;
  collaboration?: string;
  rolePerformance?: string;
  conflictResolution?: string;
  leadershipContribution?: string;
  strengths: string;
  areasForImprovement: string;
  feedback: string;
}

// Type for evaluation criteria
interface EvaluationCriteria {
  technicalSkills: number;
  problemSolving: number;
  creativity: number;
  deliveryQuality: number;
  communication?: number;
  projectManagement?: number;
  adaptability?: number;
  teamwork?: number;
  collaboration?: number;
  rolePerformance?: number;
  conflictResolution?: number;
  leadershipContribution?: number;
}

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(Evaluation)
    private evaluationRepository: Repository<Evaluation>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
    private agentAIService: AgentAIService,
    private agentsService: AgentsService,
  ) {}

  async findAll(projectId: string): Promise<Evaluation[]> {
    return this.evaluationRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Evaluation | null> {
    return this.evaluationRepository.findOne({ where: { id } });
  }

  async create(
    projectId: string,
    evaluationData: Partial<Evaluation>,
  ): Promise<Evaluation> {
    const evaluation = this.evaluationRepository.create({
      ...evaluationData,
      projectId,
    });
    return this.evaluationRepository.save(evaluation);
  }

  async update(
    id: string,
    evaluationData: Partial<Evaluation>,
  ): Promise<Evaluation | null> {
    await this.evaluationRepository.update(id, evaluationData);
    return this.findOne(id);
  }

  async analyzeSubmission(
    projectId: string,
    milestoneId: string,
  ): Promise<Evaluation> {
    // Get project and milestone data
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['agent'],
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const milestone = await this.milestoneRepository.findOne({
      where: { id: milestoneId, projectId },
    });

    if (!milestone) {
      throw new Error('Milestone not found');
    }

    // Check if milestone has a submission
    if (
      !milestone.submissionUrl ||
      !milestone.submissionNotes ||
      milestone.status !== MilestoneStatus.SUBMITTED
    ) {
      throw new Error('Milestone has no valid submission to evaluate');
    }

    // Get the agent
    const agent = project.agent;

    // Create submission object to evaluate
    const submission = {
      milestoneTitle: milestone.title,
      milestoneDescription: milestone.description,
      submissionUrl: milestone.submissionUrl,
      submissionNotes: milestone.submissionNotes,
      projectContext: {
        title: project.title,
        description: project.description,
        status: project.status,
        isGroupProject: project.isGroupProject,
      },
    };

    // Use AI service to evaluate the submission
    const aiEvaluation = (await this.agentAIService.evaluateSubmission(
      agent,
      submission,
    )) as AIEvaluationResponse;

    // Determine if this is a group or individual project
    const evaluationType = project.isGroupProject
      ? EvaluationType.GROUP
      : EvaluationType.INDIVIDUAL;

    // Extract criteria ratings from AI evaluation based on project type
    let criteria: EvaluationCriteria = {
      // Common criteria for both types
      technicalSkills: parseFloat(aiEvaluation.technicalSkills) || 0,
      problemSolving: parseFloat(aiEvaluation.problemSolving) || 0,
      creativity: parseFloat(aiEvaluation.creativity) || 0,
      deliveryQuality: parseFloat(aiEvaluation.deliveryQuality) || 0,
    };

    // Add criteria specific to the evaluation type
    if (evaluationType === EvaluationType.INDIVIDUAL) {
      criteria = {
        ...criteria,
        communication: parseFloat(aiEvaluation.communication) || 0,
        projectManagement: parseFloat(aiEvaluation.projectManagement) || 0,
        adaptability: parseFloat(aiEvaluation.adaptability) || 0,
      };
    } else {
      criteria = {
        ...criteria,
        teamwork: parseFloat(aiEvaluation.teamwork) || 0,
        collaboration: parseFloat(aiEvaluation.collaboration || '0') || 0,
        rolePerformance: parseFloat(aiEvaluation.rolePerformance || '0') || 0,
        conflictResolution:
          parseFloat(aiEvaluation.conflictResolution || '0') || 0,
        leadershipContribution:
          parseFloat(aiEvaluation.leadershipContribution || '0') || 0,
      };
    }

    // Check if there's an existing evaluation for this project
    const existingEvaluations = await this.evaluationRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });

    let evaluation: Evaluation;

    if (existingEvaluations.length > 0) {
      // Update the latest evaluation
      evaluation = existingEvaluations[0];

      // Update evaluation type if it changed (though this is unlikely)
      evaluation.type = evaluationType;

      // Merge the new criteria with the existing one, giving more weight to more recent submissions
      for (const key in criteria) {
        if (
          criteria.hasOwnProperty(key) &&
          evaluation.criteria.hasOwnProperty(key)
        ) {
          // 70% weight to new evaluation, 30% to existing
          evaluation.criteria[key] =
            criteria[key] * 0.7 + evaluation.criteria[key] * 0.3;
        } else if (criteria.hasOwnProperty(key)) {
          // Add any new criteria fields that might have been added
          evaluation.criteria[key] = criteria[key];
        }
      }

      evaluation.comments = `${evaluation.comments}\n\nUpdate based on milestone "${milestone.title}":\n${aiEvaluation.strengths}\n\nAreas for improvement:\n${aiEvaluation.areasForImprovement}`;

      await this.evaluationRepository.save(evaluation);
    } else {
      // Create a new evaluation
      evaluation = this.evaluationRepository.create({
        projectId,
        studentId: project.studentId,
        type: evaluationType,
        criteria,
        comments: `Evaluation based on milestone "${milestone.title}":\n${aiEvaluation.strengths}\n\nAreas for improvement:\n${aiEvaluation.areasForImprovement}`,
        status: EvaluationStatus.DRAFT,
      });

      await this.evaluationRepository.save(evaluation);
    }

    // Update milestone with feedback
    milestone.feedbackNotes = aiEvaluation.feedback;
    milestone.status = MilestoneStatus.APPROVED;
    await this.milestoneRepository.save(milestone);

    return evaluation;
  }

  async generateRecommendations(evaluationId: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id: evaluationId },
      relations: ['project', 'project.agent'],
    });

    if (!evaluation) {
      throw new Error('Evaluation not found');
    }

    const project = evaluation.project;
    const agent = project.agent;

    // Use agent's personality to generate recommendations
    const recommendationsForImprovement =
      await this.agentAIService.generateFeedback(
        agent,
        JSON.stringify({
          evaluationCriteria: evaluation.criteria,
          currentComments: evaluation.comments,
          projectTitle: project.title,
          projectDescription: project.description,
        }),
      );

    // Update evaluation with recommendations
    evaluation.recommendationsForImprovement = recommendationsForImprovement;
    evaluation.status = EvaluationStatus.COMPLETED;

    return this.evaluationRepository.save(evaluation);
  }

  async getSubmissionAnalysis(
    projectId: string,
    milestoneId: string,
  ): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['agent'],
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const milestone = await this.milestoneRepository.findOne({
      where: { id: milestoneId, projectId },
    });

    if (!milestone) {
      throw new Error('Milestone not found');
    }

    // Check if milestone has a submission
    if (!milestone.submissionUrl || !milestone.submissionNotes) {
      throw new Error('Milestone has no submission to analyze');
    }

    const agent = project.agent;

    // Create submission object to analyze
    const submission = {
      milestoneTitle: milestone.title,
      milestoneDescription: milestone.description,
      submissionUrl: milestone.submissionUrl,
      submissionNotes: milestone.submissionNotes,
      projectContext: {
        title: project.title,
        description: project.description,
      },
    };

    // Use AI service to evaluate the submission but only return detailed analysis
    const aiEvaluation = await this.agentAIService.evaluateSubmission(
      agent,
      submission,
    );

    return {
      analysis: aiEvaluation.feedback,
      achievements: aiEvaluation.strengths
        .split('\n')
        .filter((item) => item.trim()),
      improvementAreas: aiEvaluation.areasForImprovement
        .split('\n')
        .filter((item) => item.trim()),
    };
  }
}
