import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Project } from '../../entities/project.entity';
import { Evaluation } from '../../entities/evaluation.entity';
import { Milestone } from '../../entities/milestone.entity';
import { User } from '../../entities/user.entity';
import { Agent } from '../../entities/agent.entity';
import { EvaluationModule } from '../evaluations/evaluation.module';
import { AgentsModule } from '../agents/agents.module';
import { ReportGeneratorFactory } from './factories/report-generator.factory';
import { ProjectReportGenerator } from './generators/project-report.generator';
import { EvaluationReportGenerator } from './generators/evaluation-report.generator';
import { StudentPerformanceReportGenerator } from './generators/student-performance-report.generator';
import { Conversation } from '../../entities/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Evaluation,
      Milestone,
      User,
      Agent,
      Conversation,
    ]),
    EvaluationModule,
    AgentsModule,
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportGeneratorFactory,
    ProjectReportGenerator,
    EvaluationReportGenerator,
    StudentPerformanceReportGenerator,
  ],
  exports: [ReportsService],
})
export class ReportsModule {}
