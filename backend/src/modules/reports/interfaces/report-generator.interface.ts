import { Response } from 'express';

export interface ReportData {
  [key: string]: any;
}

export interface ReportOptions {
  includeTitle?: boolean;
  includeLogo?: boolean;
  includeTimestamp?: boolean;
  language?: 'es' | 'en';
  colorScheme?: 'default' | 'dark' | 'light';
  format?: 'A4' | 'Letter';
}

export interface ReportGenerator {
  /**
   * Generates a PDF report and sends it directly to the HTTP response
   */
  generateReport(
    data: ReportData,
    res: Response,
    options?: ReportOptions,
  ): Promise<void>;

  /**
   * Validates that the data contains all required fields for the report
   */
  validateReportData(data: ReportData): boolean;

  /**
   * Returns the filename for the report
   */
  getReportFilename(data: ReportData): string;
}
