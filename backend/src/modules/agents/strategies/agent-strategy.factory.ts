import { Injectable } from '@nestjs/common';
import { Agent, AgentPersonality } from '../../../entities/agent.entity';
import { AgentStrategy } from './agent-strategy.interface';
import { DemandingAgentStrategy } from './demanding-agent.strategy';
import { SupportiveAgentStrategy } from './supportive-agent.strategy';
import { OpenAIService } from '../openai.service';

@Injectable()
export class AgentStrategyFactory {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly demandingStrategy: DemandingAgentStrategy,
    private readonly supportiveStrategy: SupportiveAgentStrategy,
  ) {}

  getStrategy(agent: Agent): AgentStrategy {
    switch (agent.personality) {
      case AgentPersonality.DEMANDING:
        return this.demandingStrategy;
      case AgentPersonality.SUPPORTIVE:
        return this.supportiveStrategy;
      case AgentPersonality.ANALYTICAL:
      case AgentPersonality.CREATIVE:
      case AgentPersonality.CHALLENGING:
      default:
        // Default to supportive for any other personality type
        return this.supportiveStrategy;
    }
  }
}
