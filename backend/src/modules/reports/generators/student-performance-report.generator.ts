import { Injectable } from '@nestjs/common';
import { BaseReportGenerator } from './base-report.generator';
import {
  ReportData,
  ReportOptions,
} from '../interfaces/report-generator.interface';
import * as PDFKit from 'pdfkit';

interface StudentPerformanceReportData extends ReportData {
  studentName: string;
  studentId: string;
  evaluationPeriod: string;
  projects: Array<{
    projectTitle: string;
    projectId: string;
    startDate: Date;
    endDate: Date;
    status: string;
    agentName: string;
    criteria: {
      technicalSkills: number;
      problemSolving: number;
      communication: number;
      teamwork: number;
      creativity: number;
      deliveryQuality: number;
      projectManagement: number;
      adaptability: number;
    };
    milestones: Array<{
      title: string;
      status: string;
      dueDate: Date;
      submissionDate?: Date;
    }>;
  }>;
  averagePerformance: {
    technicalSkills: number;
    problemSolving: number;
    communication: number;
    teamwork: number;
    creativity: number;
    deliveryQuality: number;
    projectManagement: number;
    adaptability: number;
  };
  strengths: string[];
  areasForImprovement: string[];
  professionalDevelopmentSuggestions: string[];
}

@Injectable()
export class StudentPerformanceReportGenerator extends BaseReportGenerator {
  protected async addContent(
    doc: PDFKit.PDFDocument,
    data: StudentPerformanceReportData,
    options: ReportOptions,
  ): Promise<void> {
    // Student information
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Student Information', { underline: true })
      .moveDown(0.5);

    doc
      .font('Helvetica')
      .fontSize(12)
      .text(`Name: ${data.studentName}`)
      .text(`Student ID: ${data.studentId}`)
      .text(`Evaluation Period: ${data.evaluationPeriod}`)
      .moveDown();

    // Average performance metrics
    doc
      .font('Helvetica-Bold')
      .text('Average Performance Metrics', { underline: true })
      .moveDown(0.5);

    // Draw average performance metrics as a table
    this.drawPerformanceTable(doc, data.averagePerformance);
    doc.moveDown();

    // Projects summary
    doc
      .font('Helvetica-Bold')
      .text('Projects Summary', { underline: true })
      .moveDown(0.5);

    // List all projects with their details
    data.projects.forEach((project, index) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(`${index + 1}. ${project.projectTitle}`)
        .font('Helvetica')
        .fontSize(10)
        .text(`Status: ${project.status}`)
        .text(
          `Period: ${project.startDate.toLocaleDateString()} - ${project.endDate.toLocaleDateString()}`,
        )
        .text(`Agent: ${project.agentName}`)
        .moveDown(0.5);

      // List milestones
      if (project.milestones.length > 0) {
        doc.font('Helvetica-Bold').text('Milestones:').font('Helvetica');

        project.milestones.forEach((milestone, mIndex) => {
          const submissionInfo = milestone.submissionDate
            ? `Submitted: ${milestone.submissionDate.toLocaleDateString()}`
            : 'Not submitted';

          doc.text(
            `    • ${milestone.title} - ${milestone.status} - Due: ${milestone.dueDate.toLocaleDateString()} - ${submissionInfo}`,
          );
        });
      }

      doc.moveDown();
    });

    // Strengths
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Strengths', { underline: true })
      .moveDown(0.5);

    doc.font('Helvetica').fontSize(12);

    data.strengths.forEach((strength, index) => {
      doc.text(`${index + 1}. ${strength}`);
    });
    doc.moveDown();

    // Areas for improvement
    doc
      .font('Helvetica-Bold')
      .text('Areas for Improvement', { underline: true })
      .moveDown(0.5);

    doc.font('Helvetica');
    data.areasForImprovement.forEach((area, index) => {
      doc.text(`${index + 1}. ${area}`);
    });
    doc.moveDown();

    // Professional development suggestions
    doc
      .font('Helvetica-Bold')
      .text('Professional Development Suggestions', { underline: true })
      .moveDown(0.5);

    doc.font('Helvetica');
    data.professionalDevelopmentSuggestions.forEach((suggestion, index) => {
      doc.text(`${index + 1}. ${suggestion}`);
    });
  }

  /**
   * Draw a table showing performance metrics
   */
  private drawPerformanceTable(
    doc: PDFKit.PDFDocument,
    performance: StudentPerformanceReportData['averagePerformance'],
  ): void {
    const startX = 100;
    const startY = doc.y;
    const colWidth = 200;
    const rowHeight = 20;

    // Table headers
    doc
      .font('Helvetica-Bold')
      .text('Criteria', startX, startY)
      .text('Rating (0-10)', startX + colWidth, startY);

    doc
      .moveTo(startX, startY + rowHeight)
      .lineTo(startX + colWidth * 2, startY + rowHeight)
      .stroke();

    let currentY = startY + rowHeight + 5;

    // Table rows
    doc.font('Helvetica');

    const criteriaItems = [
      { label: 'Technical Skills', value: performance.technicalSkills },
      { label: 'Problem Solving', value: performance.problemSolving },
      { label: 'Communication', value: performance.communication },
      { label: 'Teamwork', value: performance.teamwork },
      { label: 'Creativity', value: performance.creativity },
      { label: 'Delivery Quality', value: performance.deliveryQuality },
      { label: 'Project Management', value: performance.projectManagement },
      { label: 'Adaptability', value: performance.adaptability },
    ];

    criteriaItems.forEach((item) => {
      doc
        .text(item.label, startX, currentY)
        .text(item.value.toString(), startX + colWidth, currentY);

      currentY += rowHeight;
    });

    // Update document y position
    doc.y = currentY + 10;
  }

  /**
   * Validate the report data
   */
  validateReportData(data: ReportData): boolean {
    const studentData = data as StudentPerformanceReportData;
    return !!(
      studentData.studentName &&
      studentData.studentId &&
      studentData.evaluationPeriod &&
      studentData.projects &&
      studentData.averagePerformance &&
      studentData.strengths &&
      studentData.areasForImprovement &&
      studentData.professionalDevelopmentSuggestions
    );
  }

  /**
   * Generate a filename for the student performance report
   */
  getReportFilename(data: ReportData): string {
    const studentData = data as StudentPerformanceReportData;
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedName = studentData.studentName
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    return `performance_${sanitizedName}_${timestamp}.pdf`;
  }
}
