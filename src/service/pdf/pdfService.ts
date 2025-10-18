import puppeteer, { Browser, PDFOptions } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

import { CertificateData, PDFConfig } from './interface';

let templateCache: handlebars.TemplateDelegate<CertificateData>;
let browserInstance: Promise<Browser>;

const getBrowser = async (): Promise<Browser> => {
  if (!browserInstance) {
    browserInstance = puppeteer.launch({
      headless: true,
      args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox'],
    });
  }
  return browserInstance;
};

const loadTemplate = async (): Promise<handlebars.TemplateDelegate<CertificateData>> => {
  if (!templateCache) {
    const templatePath = path.resolve(__dirname, './templates/certificate.html');
    const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
    templateCache = handlebars.compile(templateContent);
  }
  return templateCache;
};

export async function generateCertificatePDF(data: CertificateData, pdfConfig: PDFConfig = {}): Promise<Buffer> {
  const requiredFields = ['name', 'course', 'date', 'directorName', 'instructorName'];
  for (const field of requiredFields) {
    if (!data[field as keyof CertificateData]) {
      throw new Error(`Missing required certificate field: ${field}`);
    }
  }

  let browser: Browser | null = null;
  try {
    const [template, browserInstance] = await Promise.all([loadTemplate(), getBrowser()]);
    browser = browserInstance;

    // Sanitize all string fields
    const sanitizedData: CertificateData = {
      ...data,
      qrCodeUrl: data.qrCodeUrl,
      name: handlebars.Utils.escapeExpression(data.name),
      course: handlebars.Utils.escapeExpression(data.course),
      date: handlebars.Utils.escapeExpression(data.date),
      directorName: handlebars.Utils.escapeExpression(data.directorName),
      instructorName: handlebars.Utils.escapeExpression(data.instructorName),
    };

    const html = template(sanitizedData);
    const page = await browser.newPage();

    const pdfOptions: PDFOptions = {
      format: 'A4',
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      landscape: true,
      printBackground: true,
      displayHeaderFooter: !!pdfConfig.headerTemplate || !!pdfConfig.footerTemplate,
      headerTemplate: pdfConfig.headerTemplate || '',
      footerTemplate: pdfConfig.footerTemplate || '',
    };

    await page.setContent(html, {
      waitUntil: ['domcontentloaded', 'networkidle0'],
      timeout: 30000,
    });

    await Promise.race([page.waitForNetworkIdle(), new Promise((resolve) => setTimeout(resolve, 5000))]);
    const pdfBuffer = await page.pdf(pdfOptions);
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate certificate');
  }
}

process.on('SIGTERM', async () => {
  if (browserInstance) {
    const browser = await browserInstance.catch(() => null);
    await browser?.close();
  }
});
