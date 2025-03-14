import {
  Controller,
  Get,
  Param,
  Res,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { ReportsService } from './reports.service';
import { ReportOptions } from './interfaces/report-generator.interface';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Generate a PDF report for a project
   */
  @Get('project/:id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.STUDENT)
  async generateProjectReport(
    @Param('id') projectId: string,
    @Res() res: Response,
    @Query() options: ReportOptions,
  ): Promise<void> {
    try {
      return await this.reportsService.generateProjectReport(
        projectId,
        res,
        options,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error generating project report',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generate a PDF report for an evaluation
   */
  @Get('evaluation/:id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.STUDENT)
  async generateEvaluationReport(
    @Param('id') evaluationId: string,
    @Res() res: Response,
    @Query() options: ReportOptions,
  ): Promise<void> {
    try {
      return await this.reportsService.generateEvaluationReport(
        evaluationId,
        res,
        options,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error generating evaluation report',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generate a PDF report for student performance
   */
  @Get('student-performance/:id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.STUDENT)
  async generateStudentPerformanceReport(
    @Param('id') studentId: string,
    @Res() res: Response,
    @Query() options: ReportOptions,
  ): Promise<void> {
    try {
      return await this.reportsService.generateStudentPerformanceReport(
        studentId,
        res,
        options,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error generating student performance report',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
