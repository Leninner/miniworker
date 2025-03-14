import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { Evaluation } from '../../entities/evaluation.entity';

@Controller('projects/:projectId/evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Get()
  async findAll(@Param('projectId') projectId: string): Promise<Evaluation[]> {
    return this.evaluationService.findAll(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Evaluation> {
    const evaluation = await this.evaluationService.findOne(id);
    if (!evaluation) {
      throw new NotFoundException(`Evaluation with id ${id} not found`);
    }
    return evaluation;
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() evaluationData: Partial<Evaluation>,
  ): Promise<Evaluation> {
    return this.evaluationService.create(projectId, evaluationData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() evaluationData: Partial<Evaluation>,
  ): Promise<Evaluation> {
    const updated = await this.evaluationService.update(id, evaluationData);
    if (!updated) {
      throw new NotFoundException(`Evaluation with id ${id} not found`);
    }
    return updated;
  }

  @Post('/analyze-submission')
  async analyzeSubmission(
    @Param('projectId') projectId: string,
    @Body() data: { milestoneId: string },
  ): Promise<Evaluation> {
    return this.evaluationService.analyzeSubmission(
      projectId,
      data.milestoneId,
    );
  }

  @Post(':id/recommendations')
  async generateRecommendations(@Param('id') id: string): Promise<Evaluation> {
    return this.evaluationService.generateRecommendations(id);
  }

  @Get('/submission-analysis')
  async getSubmissionAnalysis(
    @Param('projectId') projectId: string,
    @Query('milestoneId') milestoneId: string,
  ): Promise<any> {
    return this.evaluationService.getSubmissionAnalysis(projectId, milestoneId);
  }
}
