import { Injectable } from '@nestjs/common';
import { BaseReportGenerator } from './base-report.generator';
import {
  ReportData,
  ReportOptions,
} from '../interfaces/report-generator.interface';
import * as PDFDocument from 'pdfkit';

interface EvaluationReportData extends ReportData {
  projectTitle: string;
  studentName: string;
  evaluationDate: Date;
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
  comments: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendationsForImprovement: string;
  overallRating?: number;
}

@Injectable()
export class EvaluationReportGenerator extends BaseReportGenerator {
  protected async addContent(
    doc: PDFKit.PDFDocument,
    data: EvaluationReportData,
    options: ReportOptions,
  ): Promise<void> {
    // Student and project information
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Evaluation Details', { underline: true })
      .moveDown(0.5);

    doc
      .font('Helvetica')
      .fontSize(12)
      .text(`Project: ${data.projectTitle}`)
      .text(`Student: ${data.studentName}`)
      .text(
        `Evaluation Date: ${data.evaluationDate.toLocaleDateString(
          options.language === 'es' ? 'es-ES' : 'en-US',
        )}`,
      )
      .moveDown();

    // Performance radar chart (simulated with text)
    doc
      .font('Helvetica-Bold')
      .text('Performance Metrics', { underline: true })
      .moveDown(0.5);

    // Draw criteria ratings as a table
    this.drawCriteriaTable(doc, data.criteria);
    doc.moveDown();

    // Strengths
    doc
      .font('Helvetica-Bold')
      .text('Strengths', { underline: true })
      .moveDown(0.5);

    doc.font('Helvetica');
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

    // Recommendations
    doc
      .font('Helvetica-Bold')
      .text('Recommendations', { underline: true })
      .moveDown(0.5);

    doc.font('Helvetica').text(data.recommendationsForImprovement).moveDown();

    // Overall comments
    doc
      .font('Helvetica-Bold')
      .text('Additional Comments', { underline: true })
      .moveDown(0.5);

    doc.font('Helvetica').text(data.comments).moveDown(2);

    // Overall rating if available
    if (data.overallRating !== undefined) {
      doc
        .font('Helvetica-Bold')
        .text('Overall Rating', { underline: true })
        .moveDown(0.5);

      // Create a visual representation of the rating
      const rating = Math.min(Math.max(data.overallRating, 0), 10);
      doc
        .font('Helvetica')
        .text(`${rating} / 10`, { align: 'center' })
        .fontSize(15);

      // Draw a rating bar
      this.drawRatingBar(doc, rating);
    }
  }

  /**
   * Helper method to draw a table of criteria ratings
   */
  private drawCriteriaTable(
    doc: PDFKit.PDFDocument,
    criteria: EvaluationReportData['criteria'],
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
      { label: 'Technical Skills', value: criteria.technicalSkills },
      { label: 'Problem Solving', value: criteria.problemSolving },
      { label: 'Communication', value: criteria.communication },
      { label: 'Teamwork', value: criteria.teamwork },
      { label: 'Creativity', value: criteria.creativity },
      { label: 'Delivery Quality', value: criteria.deliveryQuality },
      { label: 'Project Management', value: criteria.projectManagement },
      { label: 'Adaptability', value: criteria.adaptability },
    ];

    criteriaItems.forEach((item, index) => {
      doc
        .text(item.label, startX, currentY)
        .text(item.value.toString(), startX + colWidth, currentY);

      currentY += rowHeight;
    });

    // Update document y position
    doc.y = currentY + 10;
  }

  /**
   * Helper method to draw a visual rating bar
   */
  private drawRatingBar(doc: PDFKit.PDFDocument, rating: number): void {
    const startX = 100;
    const startY = doc.y + 10;
    const width = 400;
    const height = 20;

    // Draw empty bar
    doc.rect(startX, startY, width, height).stroke();

    // Draw filled portion based on rating
    const fillWidth = (rating / 10) * width;
    doc.rect(startX, startY, fillWidth, height).fill('#007bff');

    // Update document y position
    doc.y = startY + height + 20;
  }

  /**
   * Validate that the evaluation report data contains all required fields
   */
  validateReportData(data: ReportData): boolean {
    const evalData = data as EvaluationReportData;
    return !!(
      evalData.projectTitle &&
      evalData.studentName &&
      evalData.evaluationDate &&
      evalData.criteria &&
      evalData.comments &&
      evalData.strengths &&
      evalData.areasForImprovement &&
      evalData.recommendationsForImprovement
    );
  }

  /**
   * Generate a filename for the evaluation report
   */
  getReportFilename(data: ReportData): string {
    const evalData = data as EvaluationReportData;
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedProjectName = evalData.projectTitle
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    return `evaluation_${sanitizedProjectName}_${timestamp}.pdf`;
  }
}
