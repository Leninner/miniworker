import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import {
  ReportData,
  ReportGenerator,
  ReportOptions,
} from '../interfaces/report-generator.interface';

export abstract class BaseReportGenerator implements ReportGenerator {
  /**
   * Template method for generating a PDF report
   */
  async generateReport(
    data: ReportData,
    res: Response,
    options: ReportOptions = {},
  ): Promise<void> {
    // Validate data
    if (!this.validateReportData(data)) {
      throw new Error('Invalid report data');
    }

    // Set response headers
    const filename = this.getReportFilename(data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Create PDF document
    const doc = new PDFDocument({
      size: options.format || 'A4',
      margin: 50,
      info: {
        Title: data.title || 'Report',
        Author: 'MiniWorker Platform',
        CreationDate: new Date(),
      },
    });

    // Pipe PDF to response
    doc.pipe(res);

    // Add common header (optional)
    if (options.includeTitle !== false) {
      this.addHeader(doc, data, options);
    }

    // Add custom content (implemented by subclasses)
    await this.addContent(doc, data, options);

    // Add common footer (optional)
    if (options.includeTimestamp !== false) {
      this.addFooter(doc, options);
    }

    // Finalize PDF and send response
    doc.end();
  }

  /**
   * Abstract method for adding report-specific content
   */
  protected abstract addContent(
    doc: PDFKit.PDFDocument,
    data: ReportData,
    options: ReportOptions,
  ): Promise<void>;

  /**
   * Default implementation for adding common header
   */
  protected addHeader(
    doc: PDFKit.PDFDocument,
    data: ReportData,
    options: ReportOptions,
  ): void {
    // Add logo if requested
    if (options.includeLogo) {
      // Placeholder for logo implementation
      // doc.image('path/to/logo.png', 50, 45, { width: 50 });
    }

    // Add title
    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .text(data.title || 'Report', { align: 'center' })
      .moveDown();

    // Add subtitle if available
    if (data.subtitle) {
      doc
        .font('Helvetica')
        .fontSize(14)
        .text(data.subtitle, { align: 'center' })
        .moveDown();
    }

    // Add separator line
    doc
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke()
      .moveDown();
  }

  /**
   * Default implementation for adding common footer
   */
  protected addFooter(doc: PDFKit.PDFDocument, options: ReportOptions): void {
    // Move to bottom of page
    doc
      .fontSize(10)
      .text(
        `Generated on ${new Date().toLocaleString(
          options.language === 'es' ? 'es-ES' : 'en-US',
        )}`,
        50,
        doc.page.height - 50,
        { align: 'center' },
      );
  }

  /**
   * Default implementation for validateReportData
   * Subclasses should override this to provide specific validation
   */
  validateReportData(data: ReportData): boolean {
    return !!data;
  }

  /**
   * Default implementation for getReportFilename
   * Subclasses should override this to provide specific filenames
   */
  getReportFilename(data: ReportData): string {
    return `report-${Date.now()}.pdf`;
  }
}
