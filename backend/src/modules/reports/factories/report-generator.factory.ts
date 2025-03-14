import { Injectable } from '@nestjs/common';
import { ReportGenerator } from '../interfaces/report-generator.interface';
import { ProjectReportGenerator } from '../generators/project-report.generator';
import { EvaluationReportGenerator } from '../generators/evaluation-report.generator';
import { StudentPerformanceReportGenerator } from '../generators/student-performance-report.generator';

export enum ReportType {
  PROJECT = 'project',
  EVALUATION = 'evaluation',
  STUDENT_PERFORMANCE = 'student_performance',
}

@Injectable()
export class ReportGeneratorFactory {
  constructor(
    private readonly projectReportGenerator: ProjectReportGenerator,
    private readonly evaluationReportGenerator: EvaluationReportGenerator,
    private readonly studentPerformanceReportGenerator: StudentPerformanceReportGenerator,
  ) {}

  /**
   * Factory method that returns the appropriate report generator based on the report type
   */
  getGenerator(type: ReportType): ReportGenerator {
    switch (type) {
      case ReportType.PROJECT:
        return this.projectReportGenerator;
      case ReportType.EVALUATION:
        return this.evaluationReportGenerator;
      case ReportType.STUDENT_PERFORMANCE:
        return this.studentPerformanceReportGenerator;
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }
}
