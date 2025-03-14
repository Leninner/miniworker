/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { BaseReportGenerator } from './base-report.generator';
import { ReportData } from '../interfaces/report-generator.interface';

interface EvaluationCriteria {
  technicalSkills: number;
  problemSolving: number;
  communication: number;
  teamwork: number;
  creativity: number;
  deliveryQuality: number;
  projectManagement: number;
  adaptability: number;
}

interface ProjectReportData extends ReportData {
  projectTitle: string;
  projectId: string;
  description: string;
  status: string;
  startDate: Date;
  endDate: Date;
  student: {
    id: string;
    name: string;
    email: string;
  };
  professor: {
    id: string;
    name: string;
    email: string;
  };
  agent: {
    id: string;
    name: string;
    personality: string;
    problemCategory: string;
  };
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    status: string;
    submissionUrl?: string;
    submissionNotes?: string;
    feedbackNotes?: string;
    weight: number;
  }>;
  evaluation?: {
    criteria: EvaluationCriteria;
    strengths: string[];
    areasForImprovement: string[];
    comments: string;
    recommendationsForImprovement: string;
  };
  conversations?: Array<{
    sender: string;
    message: string;
    timestamp: Date;
  }>;
}

@Injectable()
export class ProjectReportGenerator extends BaseReportGenerator {
  protected async addContent(
    doc: PDFKit.PDFDocument,
    data: ProjectReportData,
  ): Promise<void> {
    // Project information section
    this.addProjectInformation(doc, data);

    // Calculate progress and add progress section
    this.addProjectProgress(doc, data);

    // Add milestones section
    this.addMilestonesSection(doc, data);

    // Add evaluation section if available
    if (data.evaluation) {
      this.addEvaluationSection(doc, data);
    }

    // Add conversation highlights if available
    if (data.conversations && data.conversations.length > 0) {
      this.addConversationHighlights(doc, data);
    }
  }

  /**
   * Add project information section
   */
  private addProjectInformation(
    doc: PDFKit.PDFDocument,
    data: ProjectReportData,
  ): void {
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Project Information', { underline: true })
      .moveDown(0.5);

    doc
      .font('Helvetica')
      .fontSize(12)
      .text(`Project Title: ${data.projectTitle}`)
      .text(`Status: ${data.status}`)
      .text(
        `Duration: ${data.startDate.toLocaleDateString()} - ${data.endDate.toLocaleDateString()}`,
      )
      .moveDown();

    // Description
    doc
      .font('Helvetica-Bold')
      .text('Description:')
      .font('Helvetica')
      .text(data.description)
      .moveDown();

    // People involved
    doc
      .font('Helvetica-Bold')
      .text('Student:')
      .font('Helvetica')
      .text(`${data.student.name} (${data.student.email})`)
      .moveDown(0.5);

    doc
      .font('Helvetica-Bold')
      .text('Professor:')
      .font('Helvetica')
      .text(`${data.professor.name} (${data.professor.email})`)
      .moveDown(0.5);

    doc
      .font('Helvetica-Bold')
      .text('Agent:')
      .font('Helvetica')
      .text(
        `${data.agent.name} - ${data.agent.personality} (${data.agent.problemCategory})`,
      )
      .moveDown();
  }

  /**
   * Add project progress section with visual indicators
   */
  private addProjectProgress(
    doc: PDFKit.PDFDocument,
    data: ProjectReportData,
  ): void {
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Project Progress', { underline: true })
      .moveDown(0.5);

    // Calculate completed milestones percentage
    const totalMilestones = data.milestones.length;
    const completedMilestones = data.milestones.filter(
      (m) => m.status === 'approved' || m.status === 'submitted',
    ).length;
    const progressPercentage =
      totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;

    // Progress text
    doc
      .font('Helvetica')
      .fontSize(12)
      .text(
        `Overall Progress: ${progressPercentage}% (${completedMilestones} of ${totalMilestones} milestones)`,
      )
      .moveDown();

    // Draw progress bar
    const startX = 100;
    const startY = doc.y;
    const width = 400;
    const height = 20;

    // Draw empty bar
    doc.rect(startX, startY, width, height).stroke();

    // Draw filled portion based on progress
    const fillWidth = (progressPercentage / 100) * width;
    let fillColor = '#FF9800'; // Orange

    if (progressPercentage < 30) {
      fillColor = '#F44336'; // Red
    } else if (progressPercentage > 70) {
      fillColor = '#4CAF50'; // Green
    }

    doc.rect(startX, startY, fillWidth, height).fill(fillColor);

    // Add percentage text in the middle of the bar
    doc
      .fillColor('black')
      .fontSize(12)
      .text(
        `${progressPercentage}%`,
        startX + width / 2 - 15,
        startY + height / 2 - 6,
      );

    // Update document y position
    doc.y = startY + height + 20;
  }

  /**
   * Add milestones section
   */
  private addMilestonesSection(
    doc: PDFKit.PDFDocument,
    data: ProjectReportData,
  ): void {
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Milestones', { underline: true })
      .moveDown(0.5);

    // No milestones case
    if (data.milestones.length === 0) {
      doc
        .font('Helvetica')
        .fontSize(12)
        .text('No milestones have been defined for this project.')
        .moveDown();
      return;
    }

    // Sort milestones by due date
    const sortedMilestones = [...data.milestones].sort(
      (a, b) => a.dueDate.getTime() - b.dueDate.getTime(),
    );

    // Add each milestone
    sortedMilestones.forEach((milestone, index) => {
      // Status color
      let statusColor = '#000000'; // Black (default)

      switch (milestone.status.toLowerCase()) {
        case 'approved':
          statusColor = '#4CAF50'; // Green
          break;
        case 'submitted':
          statusColor = '#2196F3'; // Blue
          break;
        case 'rejected':
          statusColor = '#F44336'; // Red
          break;
        case 'overdue':
          statusColor = '#FF5722'; // Deep Orange
          break;
        case 'pending':
          statusColor = '#FF9800'; // Orange
          break;
      }

      // Milestone header
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(`${index + 1}. ${milestone.title}`)
        .moveDown(0.2);

      // Milestone details
      doc
        .font('Helvetica')
        .fontSize(10)
        .text(`Due Date: ${milestone.dueDate.toLocaleDateString()}`)
        .fillColor(statusColor)
        .text(`Status: ${milestone.status}`)
        .fillColor('black')
        .text(`Weight: ${milestone.weight}%`);

      if (milestone.description) {
        doc.text(`Description: ${milestone.description}`);
      }

      if (milestone.submissionUrl) {
        doc.text(`Submission URL: ${milestone.submissionUrl}`);
      }

      if (milestone.submissionNotes) {
        doc.text(`Submission Notes: ${milestone.submissionNotes}`);
      }

      if (milestone.feedbackNotes) {
        doc
          .font('Helvetica-Bold')
          .text('Feedback:')
          .font('Helvetica')
          .text(milestone.feedbackNotes);
      }

      doc.moveDown();
    });
  }

  /**
   * Add evaluation section if available
   */
  private addEvaluationSection(
    doc: PDFKit.PDFDocument,
    data: ProjectReportData,
  ): void {
    if (!data.evaluation) return;

    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Project Evaluation', { underline: true })
      .moveDown(0.5);

    // Draw criteria ratings as a table
    this.drawEvaluationTable(doc, data.evaluation.criteria);
    doc.moveDown();

    // Strengths
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Strengths:')
      .font('Helvetica');

    data.evaluation.strengths.forEach((strength) => {
      doc.text(`• ${strength}`);
    });
    doc.moveDown();

    // Areas for improvement
    doc.font('Helvetica-Bold').text('Areas for Improvement:').font('Helvetica');

    data.evaluation.areasForImprovement.forEach((area) => {
      doc.text(`• ${area}`);
    });
    doc.moveDown();

    // Comments
    if (data.evaluation.comments) {
      doc
        .font('Helvetica-Bold')
        .text('Comments:')
        .font('Helvetica')
        .text(data.evaluation.comments)
        .moveDown();
    }

    // Recommendations
    if (data.evaluation.recommendationsForImprovement) {
      doc
        .font('Helvetica-Bold')
        .text('Recommendations:')
        .font('Helvetica')
        .text(data.evaluation.recommendationsForImprovement);
    }
  }

  /**
   * Draw a table showing evaluation criteria
   */
  private drawEvaluationTable(
    doc: PDFKit.PDFDocument,
    criteria: EvaluationCriteria,
  ): void {
    if (!criteria) return;

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
   * Add conversation highlights if available
   */
  private addConversationHighlights(
    doc: PDFKit.PDFDocument,
    data: ProjectReportData,
  ): void {
    if (!data.conversations || data.conversations.length === 0) return;

    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Conversation Highlights', { underline: true })
      .moveDown(0.5);

    // Only include a limited number of conversations (e.g., most recent 5)
    const conversations = data.conversations.slice(
      Math.max(0, data.conversations.length - 5),
    );

    conversations.forEach((conv) => {
      const senderName =
        conv.sender === 'agent' ? data.agent.name : data.student.name;
      const timestamp = conv.timestamp.toLocaleString();

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(`${senderName} (${timestamp}):`)
        .font('Helvetica')
        .text(conv.message)
        .moveDown();
    });
  }

  /**
   * Validate the report data
   */
  validateReportData(data: ReportData): boolean {
    const projectData = data as ProjectReportData;
    return !!(
      projectData.projectTitle &&
      projectData.status &&
      projectData.startDate &&
      projectData.endDate &&
      projectData.student &&
      projectData.professor &&
      projectData.agent &&
      projectData.milestones
    );
  }

  /**
   * Generate a filename for the project report
   */
  getReportFilename(data: ReportData): string {
    const projectData = data as ProjectReportData;
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedProjectName = projectData.projectTitle
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    return `project_${sanitizedProjectName}_${timestamp}.pdf`;
  }
}
