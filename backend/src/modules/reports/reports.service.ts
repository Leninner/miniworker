import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Response } from 'express';
import { Project } from '../../entities/project.entity';
import { Evaluation } from '../../entities/evaluation.entity';
import { Milestone, MilestoneStatus } from '../../entities/milestone.entity';
import { User } from '../../entities/user.entity';
import { Agent } from '../../entities/agent.entity';
import { Conversation } from '../../entities/conversation.entity';
import {
  ReportGeneratorFactory,
  ReportType,
} from './factories/report-generator.factory';
import { ReportOptions } from './interfaces/report-generator.interface';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Evaluation)
    private evaluationRepository: Repository<Evaluation>,
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    private reportGeneratorFactory: ReportGeneratorFactory,
  ) {}

  /**
   * Generate a project report
   */
  async generateProjectReport(
    projectId: string,
    res: Response,
    options?: ReportOptions,
  ): Promise<void> {
    // Get project with relations
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['student', 'professor', 'agent'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Get milestones
    const milestones = await this.milestoneRepository.find({
      where: { projectId },
    });

    // Get evaluation if exists
    const evaluation = await this.evaluationRepository.findOne({
      where: { projectId },
    });

    // Get conversations
    const conversations = await this.conversationRepository.find({
      where: { projectId },
      order: { createdAt: 'ASC' },
    });

    // Prepare report data
    const reportData = {
      title: `Project Report: ${project.title}`,
      subtitle: `Status: ${project.status}`,
      projectTitle: project.title,
      projectId: project.id,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      student: {
        id: project.student.id,
        name: `${project.student.firstName} ${project.student.lastName}`,
        email: project.student.email,
      },
      professor: {
        id: project.professor.id,
        name: `${project.professor.firstName} ${project.professor.lastName}`,
        email: project.professor.email,
      },
      agent: {
        id: project.agent.id,
        name: project.agent.name,
        personality: project.agent.personality,
        problemCategory: project.agent.problemCategory,
      },
      milestones: milestones.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        dueDate: m.dueDate,
        status: m.status,
        submissionUrl: m.submissionUrl,
        submissionNotes: m.submissionNotes,
        feedbackNotes: m.feedbackNotes,
        weight: m.weight,
      })),
      evaluation: evaluation
        ? {
            criteria: evaluation.criteria,
            strengths: evaluation.criteria
              ? Object.keys(evaluation.criteria)
                  .filter((key) => evaluation.criteria[key] >= 8)
                  .map((key) => this.formatCriteriaLabel(key))
              : [],
            areasForImprovement: evaluation.criteria
              ? Object.keys(evaluation.criteria)
                  .filter((key) => evaluation.criteria[key] <= 5)
                  .map((key) => this.formatCriteriaLabel(key))
              : [],
            comments: evaluation.comments,
            recommendationsForImprovement:
              evaluation.recommendationsForImprovement,
          }
        : undefined,
      conversations: conversations.map((c) => ({
        sender: c.sender,
        message: c.message,
        timestamp: c.createdAt,
      })),
    };

    // Get generator and generate report
    const generator = this.reportGeneratorFactory.getGenerator(
      ReportType.PROJECT,
    );
    return generator.generateReport(reportData, res, options);
  }

  /**
   * Generate an evaluation report
   */
  async generateEvaluationReport(
    evaluationId: string,
    res: Response,
    options?: ReportOptions,
  ): Promise<void> {
    // Get evaluation with relations
    const evaluation = await this.evaluationRepository.findOne({
      where: { id: evaluationId },
      relations: ['project', 'project.student'],
    });

    if (!evaluation) {
      throw new NotFoundException(
        `Evaluation with ID ${evaluationId} not found`,
      );
    }

    const project = evaluation.project;
    const student = evaluation.project.student;

    // Prepare report data
    const reportData = {
      title: `Evaluation Report: ${project.title}`,
      subtitle: `Student: ${student.firstName} ${student.lastName}`,
      projectTitle: project.title,
      studentName: `${student.firstName} ${student.lastName}`,
      evaluationDate: evaluation.createdAt,
      criteria: evaluation.criteria,
      comments: evaluation.comments,
      strengths: Object.keys(evaluation.criteria)
        .filter((key) => evaluation.criteria[key] >= 8)
        .map((key) => this.formatCriteriaLabel(key)),
      areasForImprovement: Object.keys(evaluation.criteria)
        .filter((key) => evaluation.criteria[key] <= 5)
        .map((key) => this.formatCriteriaLabel(key)),
      recommendationsForImprovement: evaluation.recommendationsForImprovement,
      overallRating: this.calculateOverallRating(evaluation.criteria),
    };

    // Get generator and generate report
    const generator = this.reportGeneratorFactory.getGenerator(
      ReportType.EVALUATION,
    );
    return generator.generateReport(reportData, res, options);
  }

  /**
   * Generate a student performance report
   */
  async generateStudentPerformanceReport(
    studentId: string,
    res: Response,
    options?: ReportOptions,
  ): Promise<void> {
    // Get student
    const student = await this.userRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Get all projects for the student
    const projects = await this.projectRepository.find({
      where: { studentId },
      relations: ['agent'],
    });

    // Get evaluations for these projects
    const projectIds = projects.map((p) => p.id);
    const evaluations = await this.evaluationRepository.find({
      where: { projectId: In(projectIds) },
    });

    // Get milestones for these projects
    const milestones = await this.milestoneRepository.find({
      where: { projectId: In(projectIds) },
    });

    // Calculate average performance across all evaluations
    const averagePerformance = this.calculateAveragePerformance(evaluations);

    // Identify strengths and areas for improvement
    const strengths = this.identifyStrengths(averagePerformance);
    const areasForImprovement =
      this.identifyAreasForImprovement(averagePerformance);

    // Generate professional development suggestions
    const professionalDevelopmentSuggestions =
      this.generateProfessionalDevelopmentSuggestions(areasForImprovement);

    // Prepare report data
    const reportData = {
      title: `Student Performance Report`,
      subtitle: `${student.firstName} ${student.lastName}`,
      studentName: `${student.firstName} ${student.lastName}`,
      studentId: student.id,
      evaluationPeriod: `${new Date(Math.min(...projects.map((p) => p.startDate.getTime()))).toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
      projects: projects.map((project) => {
        const projectMilestones = milestones.filter(
          (m) => m.projectId === project.id,
        );
        const projectEvaluation = evaluations.find(
          (e) => e.projectId === project.id,
        );

        return {
          projectTitle: project.title,
          projectId: project.id,
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status,
          agentName: project.agent.name,
          criteria: projectEvaluation ? projectEvaluation.criteria : undefined,
          milestones: projectMilestones.map((m) => ({
            title: m.title,
            status: m.status,
            dueDate: m.dueDate,
            submissionDate:
              m.status === MilestoneStatus.SUBMITTED ||
              m.status === MilestoneStatus.APPROVED
                ? m.updatedAt
                : undefined,
          })),
        };
      }),
      averagePerformance,
      strengths,
      areasForImprovement,
      professionalDevelopmentSuggestions,
    };

    // Get generator and generate report
    const generator = this.reportGeneratorFactory.getGenerator(
      ReportType.STUDENT_PERFORMANCE,
    );
    return generator.generateReport(reportData, res, options);
  }

  /**
   * Calculate overall rating from criteria
   */
  private calculateOverallRating(criteria: Evaluation['criteria']): number {
    if (!criteria) return 0;

    const values = Object.values(criteria);
    return values.length > 0
      ? values.reduce((sum, val) => sum + val, 0) / values.length
      : 0;
  }

  /**
   * Calculate average performance across evaluations
   */
  private calculateAveragePerformance(
    evaluations: Evaluation[],
  ): Record<string, number> {
    const performance: Record<string, { sum: number; count: number }> = {};

    // Calculate sums and counts for each criteria
    evaluations.forEach((evaluation) => {
      if (evaluation.criteria) {
        Object.keys(evaluation.criteria).forEach((key) => {
          if (!performance[key]) {
            performance[key] = { sum: 0, count: 0 };
          }
          if (typeof evaluation.criteria[key] === 'number') {
            performance[key].sum += evaluation.criteria[key];
            performance[key].count += 1;
          }
        });
      }
    });

    // Calculate averages
    const averagePerformance: Record<string, number> = {};
    Object.keys(performance).forEach((key) => {
      averagePerformance[key] =
        performance[key].count > 0
          ? performance[key].sum / performance[key].count
          : 0;
    });

    return averagePerformance;
  }

  /**
   * Identify strengths based on performance
   */
  private identifyStrengths(performance: Record<string, number>): string[] {
    return Object.keys(performance)
      .filter((key) => performance[key] >= 7.5)
      .map((key) => this.formatCriteriaLabel(key));
  }

  /**
   * Identify areas for improvement based on performance
   */
  private identifyAreasForImprovement(
    performance: Record<string, number>,
  ): string[] {
    return Object.keys(performance)
      .filter((key) => performance[key] < 6)
      .map((key) => this.formatCriteriaLabel(key));
  }

  /**
   * Format criteria label for display
   */
  private formatCriteriaLabel(key: string): string {
    // Convert camelCase to Title Case with spaces
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (match) => match.toUpperCase());
  }

  /**
   * Generate professional development suggestions
   */
  private generateProfessionalDevelopmentSuggestions(
    areasForImprovement: string[],
  ): string[] {
    const suggestions: { [key: string]: string[] } = {
      'Technical Skills': [
        'Consider taking online courses to strengthen technical foundations',
        'Join coding meetups or hackathons to practice skills',
        'Work on side projects to build a portfolio',
      ],
      'Problem Solving': [
        'Practice algorithmic thinking with coding challenges',
        'Break down complex problems into smaller steps',
        'Study design patterns and system architecture',
      ],
      Communication: [
        'Join Toastmasters or public speaking groups',
        'Practice writing technical documentation',
        'Ask for feedback on presentations and emails',
      ],
      Teamwork: [
        'Volunteer for group projects',
        'Participate in team-building activities',
        'Practice active listening and constructive feedback',
      ],
      Creativity: [
        'Explore new technologies outside your comfort zone',
        'Brainstorm multiple solutions before implementation',
        'Study innovative approaches in your field',
      ],
      'Delivery Quality': [
        'Implement code reviews and testing in your workflow',
        'Set personal quality standards for your work',
        'Study best practices for your development environment',
      ],
      'Project Management': [
        'Learn a project management methodology (Agile, Scrum)',
        'Use project management tools for personal projects',
        'Practice estimating and tracking time for tasks',
      ],
      Adaptability: [
        'Regularly learn new technologies or frameworks',
        'Seek feedback and adjust approaches accordingly',
        'Practice responding positively to change',
      ],
    };

    // For each area of improvement, add relevant suggestions
    const result: string[] = [];
    areasForImprovement.forEach((area) => {
      const key = Object.keys(suggestions).find((k) => area.includes(k));
      if (key && suggestions[key]) {
        result.push(...suggestions[key]);
      }
    });

    // If no specific suggestions, return generic ones
    if (result.length === 0) {
      return [
        'Continue to seek feedback on your work and identify areas for growth',
        'Consider finding a mentor in your field of interest',
        'Set specific, measurable goals for your professional development',
      ];
    }

    return result;
  }
}
