import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentAIService } from './agent-ai.service';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly agentAIService: AgentAIService,
  ) {}

  @Get()
  async findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Post()
  async create(@Body() agentData: any) {
    return this.agentsService.create(agentData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() agentData: any) {
    return this.agentsService.update(id, agentData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }

  // AI Interaction endpoints
  @Get(':id/greeting')
  async getGreeting(@Param('id') id: string) {
    const agent = await this.agentsService.findOne(id);
    const greeting = await this.agentAIService.generateGreeting(agent);
    return { greeting };
  }

  @Post(':id/feedback')
  async getFeedback(
    @Param('id') id: string,
    @Body() data: { message: string },
  ) {
    const agent = await this.agentsService.findOne(id);
    const feedback = await this.agentAIService.generateFeedback(
      agent,
      data.message,
    );
    return { feedback };
  }

  @Post(':id/evaluate')
  async evaluateSubmission(@Param('id') id: string, @Body() submission: any) {
    const agent = await this.agentsService.findOne(id);
    const evaluation = await this.agentAIService.evaluateSubmission(
      agent,
      submission,
    );
    return evaluation;
  }

  @Get(':id/nextSteps')
  async getNextSteps(
    @Param('id') id: string,
    @Query('projectId') projectId: string,
  ) {
    const agent = await this.agentsService.findOne(id);
    const steps = await this.agentAIService.generateNextSteps(agent, projectId);
    return { steps };
  }
}
