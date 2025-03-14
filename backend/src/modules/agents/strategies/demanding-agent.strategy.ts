import { Injectable } from '@nestjs/common';
import { Agent } from '../../../entities/agent.entity';
import { AgentStrategy } from './agent-strategy.interface';
import { OpenAIService } from '../openai.service';

@Injectable()
export class DemandingAgentStrategy implements AgentStrategy {
  constructor(private openaiService: OpenAIService) {}

  async generateGreeting(agent: Agent): Promise<string> {
    const systemPrompt = `You are ${agent.name}, a demanding AI agent who expects high quality work. Your personality is firm but fair, and you have high standards.
    You are an expert in ${agent.problemCategory}. Create a greeting message for a student who is starting to work with you.
    Set clear expectations and be direct about your standards. Your tone should be professional and authoritative.`;

    const userPrompt = `Generate a greeting message as ${agent.name}, a demanding AI agent with expertise in ${agent.problemCategory}.
    Include a brief introduction about the agent's personality, its expertise in ${agent.problemCategory}, and what the student can expect from working with you.
    Be direct about your high standards and expectations.`;

    try {
      return await this.openaiService.generateCompletionWithSystemPrompt(
        systemPrompt,
        userPrompt,
      );
    } catch (e) {
      console.error('Error generating greeting:', e);
      return `Hello there. I'm ${agent.name}, and I will be assisting you with ${agent.problemCategory}. I expect high-quality work and will provide honest feedback to help you improve.`;
    }
  }

  async generateFeedback(agent: Agent, message: string): Promise<string> {
    const systemPrompt = `You are ${agent.name}, a demanding AI agent with expertise in ${agent.problemCategory}.
    You have high standards and provide thorough, constructive feedback. Your tone is direct, but you acknowledge strengths while focusing on areas for improvement.
    Respond to the student's message with constructive feedback, specific suggestions, and clear expectations for improvement.`;

    try {
      return await this.openaiService.generateCompletionWithSystemPrompt(
        systemPrompt,
        message,
      );
    } catch (e) {
      console.error('Error generating feedback:', e);
      return `I've reviewed your message regarding ${agent.problemCategory}. Your approach shows promise, but there are several areas where more rigor is needed. Please refine your work with more attention to detail and accuracy.`;
    }
  }

  async evaluateSubmission(
    agent: Agent,
    submission: any,
  ): Promise<{
    technicalSkills: string;
    problemSolving: string;
    communication: string;
    teamwork: string;
    creativity: string;
    deliveryQuality: string;
    projectManagement: string;
    adaptability: string;
    strengths: string;
    areasForImprovement: string;
    feedback: string;
    overallRating: string;
  }> {
    const systemPrompt = `You are ${agent.name}, a demanding AI agent who evaluates student submissions with high standards and rigorous assessment.
    You specialize in ${agent.problemCategory} and will evaluate the submission based on multiple criteria.
    
    Your evaluation must be thorough, specific, and constructive. You should acknowledge strengths but be direct about weaknesses and how to improve them.
    
    Rate each criterion on a scale of 1-10 where:
    1-3: Significantly below expectations
    4-5: Below expectations
    6-7: Meets basic expectations
    8-9: Exceeds expectations
    10: Exceptional
    
    For each criterion, provide a specific, numerical rating that reflects your assessment.
    
    Then, provide a list of specific strengths (what was done well), and a list of specific areas for improvement.
    
    Finally, provide overall constructive feedback that the student can use to improve their work.`;

    const userPrompt = `Please evaluate this submission for project "${submission.projectContext?.title || 'Unnamed Project'}":
    
    Milestone Title: ${submission.milestoneTitle || 'Not specified'}
    Milestone Description: ${submission.milestoneDescription || 'Not specified'}
    
    Submission URL: ${submission.submissionUrl || 'Not provided'}
    Submission Notes:
    ${submission.submissionNotes || 'Not provided'}
    
    Evaluate this submission across the following criteria:
    1. Technical Skills: Proficiency in relevant technologies and methodologies
    2. Problem Solving: Ability to identify and address challenges
    3. Communication: Clarity of documentation and explanation
    4. Teamwork: Evidence of collaboration and coordination (if applicable)
    5. Creativity: Innovative approaches and solutions
    6. Delivery Quality: Completeness, correctness, and polish of deliverables
    7. Project Management: Organization, planning, and time management
    8. Adaptability: Flexibility in responding to changes or feedback
    
    Format your response as follows:
    {
      "technicalSkills": "8",
      "problemSolving": "7",
      "communication": "6",
      "teamwork": "8",
      "creativity": "7",
      "deliveryQuality": "8",
      "projectManagement": "7",
      "adaptability": "6",
      "strengths": "- Strength 1\\n- Strength 2\\n- Strength 3",
      "areasForImprovement": "- Area 1\\n- Area 2\\n- Area 3",
      "feedback": "Overall feedback text here...",
      "overallRating": "7.5"
    }`;

    try {
      const response =
        await this.openaiService.generateCompletionWithSystemPrompt(
          systemPrompt,
          userPrompt,
          'gpt-4',
          1500,
        );

      // Parse the JSON response
      try {
        const parsedResponse = JSON.parse(response);
        return parsedResponse;
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // Return dummy data in case of parsing error
        return {
          technicalSkills: '6',
          problemSolving: '6',
          communication: '5',
          teamwork: '6',
          creativity: '5',
          deliveryQuality: '6',
          projectManagement: '5',
          adaptability: '5',
          strengths:
            '- Shows basic understanding of concepts\n- Attempted to complete all requirements',
          areasForImprovement:
            '- Need more attention to detail\n- Documentation is insufficient\n- Code quality needs improvement',
          feedback:
            'The submission meets minimum requirements but lacks the polish and attention to detail that would elevate it to a higher standard. Significant improvement is needed in documentation, code quality, and overall deliverable completeness.',
          overallRating: '5.5',
        };
      }
    } catch (error) {
      console.error('Error evaluating submission:', error);
      // Return dummy data in case of API error
      return {
        technicalSkills: '5',
        problemSolving: '5',
        communication: '4',
        teamwork: '5',
        creativity: '4',
        deliveryQuality: '5',
        projectManagement: '4',
        adaptability: '4',
        strengths:
          '- Basic implementation completed\n- Some understanding of requirements shown',
        areasForImprovement:
          '- Need more thorough implementation\n- Documentation missing\n- Quality control needed',
        feedback:
          'This submission falls below expectations. The implementation is basic and lacks attention to detail. Significant improvements are needed across all areas, particularly in documentation and overall quality.',
        overallRating: '4.5',
      };
    }
  }

  async generateNextSteps(agent: Agent, projectId?: string): Promise<string[]> {
    const systemPrompt = `You are ${agent.name}, a demanding AI agent with expertise in ${agent.problemCategory}.
    You are providing next steps for a student working on a project related to your area of expertise.
    Your recommendations should be specific, actionable, and set high expectations for quality and rigor.
    Provide steps that will challenge the student to excel and improve their work.`;

    const userPrompt = `Generate 4-6 specific next steps for a student working on a project in ${agent.problemCategory}.
    These should be clear, actionable items that will help them make significant progress.
    Each step should be concise but specific, providing clear direction without being too general.
    The steps should reflect high standards and expectations for quality work.`;

    try {
      const response =
        await this.openaiService.generateCompletionWithSystemPrompt(
          systemPrompt,
          userPrompt,
        );

      // Split the response into an array of steps
      const steps = response
        .split('\n')
        .filter((step) => step.trim().length > 0)
        .map((step) => step.replace(/^\d+\.\s+/, '').trim());

      return steps.length > 0
        ? steps
        : [
            `Conduct a comprehensive review of current research in ${agent.problemCategory}`,
            'Develop a detailed project plan with specific milestones and deadlines',
            'Implement rigorous testing protocols for all components of your solution',
            'Prepare a thorough analysis of potential edge cases and failure modes',
            'Document your methodology with precision and clarity',
          ];
    } catch (error) {
      console.error('Error generating next steps:', error);
      return [
        `Research best practices in ${agent.problemCategory}`,
        'Create a detailed implementation plan',
        'Develop a comprehensive testing strategy',
        'Document your approach thoroughly',
        'Prepare to present and defend your methodology',
      ];
    }
  }
}
