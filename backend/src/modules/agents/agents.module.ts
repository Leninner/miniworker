import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../../entities/agent.entity';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { OpenAIService } from './openai.service';
import { AgentAIService } from './agent-ai.service';
import { AgentStrategyFactory } from './strategies/agent-strategy.factory';
import { DemandingAgentStrategy } from './strategies/demanding-agent.strategy';
import { SupportiveAgentStrategy } from './strategies/supportive-agent.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  controllers: [AgentsController],
  providers: [
    AgentsService,
    OpenAIService,
    AgentAIService,
    AgentStrategyFactory,
    DemandingAgentStrategy,
    SupportiveAgentStrategy,
  ],
  exports: [AgentsService, AgentAIService],
})
export class AgentsModule {}
