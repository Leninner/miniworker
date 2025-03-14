import { Agent } from '../../../entities/agent.entity';

export interface AgentStrategy {
  generateGreeting(agent: Agent): Promise<string>;
  generateFeedback(agent: Agent, message: string): Promise<string>;
  evaluateSubmission(
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
  }>;
  generateNextSteps(agent: Agent, projectId?: string): Promise<string[]>;
}
