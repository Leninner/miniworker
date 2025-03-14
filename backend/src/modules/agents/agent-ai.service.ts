import { Injectable } from '@nestjs/common';
import { Agent } from '../../entities/agent.entity';
import { AgentStrategyFactory } from './strategies/agent-strategy.factory';
import { AgentsService } from './agents.service';

@Injectable()
export class AgentAIService {
  constructor(
    private agentStrategyFactory: AgentStrategyFactory,
    private agentsService: AgentsService,
  ) {}

  private getStrategy(agent: Agent) {
    return this.agentStrategyFactory.getStrategy(agent);
  }

  async generateGreeting(agent: Agent): Promise<string> {
    const strategy = this.getStrategy(agent);
    return strategy.generateGreeting(agent);
  }

  async generateFeedback(agent: Agent, message: string): Promise<string> {
    const strategy = this.getStrategy(agent);
    return strategy.generateFeedback(agent, message);
  }

  async evaluateSubmission(agent: Agent, submission: any): Promise<any> {
    const strategy = this.getStrategy(agent);
    return strategy.evaluateSubmission(agent, submission);
  }

  async generateNextSteps(agent: Agent, projectId?: string): Promise<string[]> {
    const strategy = this.getStrategy(agent);
    return strategy.generateNextSteps(agent, projectId);
  }
}
