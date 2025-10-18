import { PDFOptions } from 'puppeteer';

export interface CertificateData {
  name: string;
  course: string;
  date: string;
  syllabusCount: string;
  sessionYear: string;
  certificateNumber: string;
  directorName: string;
  directorSignature?: string;
  instructorName: string;
  instructorSignature?: string;
  verificationCode: string;
  qrCodeUrl: string;
}

export interface PDFConfig {
  format?: PDFOptions['format'];
  margin?: PDFOptions['margin'];
  landscape?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
}
