import { createTransport, SendMailOptions, SentMessageInfo } from 'nodemailer';

import config from './envConfig';
import { Attachment } from 'nodemailer/lib/mailer/index.js';
import logger from "../utils/logger";

const transporter = createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: false,
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.password,
  },
});

if (config.env !== 'development') {
  transporter.verify((error: Error | null) => {
    if (error) {
      logger.error(error || 'Unable to connect to email server. Please check SMTP options.');
    } else {
      logger.info('Email transporter verified successfully');
    }
  });
}

export const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  html: string,
  replyTo: string | undefined,
  attachments?: Attachment[],
): Promise<SentMessageInfo> => {
  const mailOptions: SendMailOptions = {
    from: `"D Ace Academy" <${from}>`,
    to,
    subject,
    html,
    replyTo,
    attachments,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error('Mail error: ', err);
    throw err;
  }
};
