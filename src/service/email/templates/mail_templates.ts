import {sendEmail} from '../../../config/mailer';
import config from '../../../config/envConfig';
import {button} from './components/button';
import {cardContainer} from './components/cardContainer';
import {tableRow} from './components/tableRow';
import {processHtmlForImages} from './processHtmlForImages';

// Email templates
const sendPasswordResetEmail = async ({email, resetLink}: { email: string; resetLink: string }): Promise<void> => {
    const content = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">Password Reset Request</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the button below to proceed:</p>
    ${button('Reset Password', resetLink)}
    <p style="font-size: 14px; color: #666666;">If you didn't request this, please ignore this email.</p>
  `;

    await sendEmail(config.email.from, email, 'Password Reset Request', cardContainer(content), config.other.supportEmail);
};

const sendSupportNotificationEmail = async ({clientEmail, message}: {
    clientEmail: string;
    message: string
}): Promise<void> => {
    const clientContent = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">Thank you for contacting support!</h2>
    <p>We've received your message and will get back to you soon.</p>
  `;

    const supportContent = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">New Support Message</h2>
    <p>You have received a new support message from ${clientEmail}:</p>
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0;">
      <p style="font-style: italic; margin: 0;">"${message}"</p>
    </div>
    <p>Please respond to the client as soon as possible.</p>
  `;

    await sendEmail(config.email.from, clientEmail, 'Contact Support', cardContainer(clientContent), config.other.supportEmail);
    await sendEmail(clientEmail, config.other.supportEmail, 'New Support Message', cardContainer(supportContent), clientEmail);
};

const welcomeEmail = async ({email, firstName}: { email: string; firstName: string; }): Promise<void> => {

    const content = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">Welcome aboard!</h2>
    <p>S ${firstName},</p>
    <p>We're excited to have you join the platform. Here are your account details:</p>
    
    <table width="100%" style="margin: 20px 0;">
      ${tableRow('Email', email)}
    </table>
    
    ${button('Login', `${config.other.clientUrl}/login`)}
  `;

    await sendEmail(config.email.from, email, 'Your Temporary Login Details', cardContainer(content), config.other.supportEmail);
};

const accountActivatedEmail = async ({email, firstName}: { email: string; firstName: string }): Promise<void> => {
    const content = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">Your Account is Now Active!</h2>
    <p>Dear ${firstName},</p>
    <p>We're excited to inform you that your account has been successfully activated.</p>
    <p>You can now log in and explore the platform.</p>
    ${button('Log In to Your Account', `${config.other.clientUrl}/login`)}
  `;

    await sendEmail(config.email.from, email, 'Your Account Has Been Activated', cardContainer(content), config.other.supportEmail);
};

const sendVerificationEmail = async (firstName: string, email: string, verificationUrl: string): Promise<void> => {
    const content = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">Verify Your Email Address</h2>
    <p>Dear ${firstName},</p>
    <p>Please confirm your email address by clicking the button below:</p>
    ${button('Verify Email', verificationUrl)}
    <p style="font-size: 14px; color: #666666;">If you didn't request this, please ignore this email.</p>
  `;

    await sendEmail(config.email.from, email, 'Verify Your Email Address', cardContainer(content), config.other.supportEmail);
};

const sendTransactionVerificationEmail = async (email: string, url: string): Promise<void> => {
    const content = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">Transaction Verification</h2>
    <p>Dear User,</p>
    <p>We've received your transaction. Please verify your transaction to complete the payment:</p>
    ${button('Verify Transaction', url)}
  `;

    await sendEmail(config.email.from, email, 'Verify Your Transaction', cardContainer(content), config.other.supportEmail);
};

const sendPaidTransactionEmail = async (email: string, code: string, amount: number, paymentMethod: string): Promise<void> => {
    const content = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">Payment Successfully Received</h2>
    <p>Dear User,</p>
    <p>We're pleased to inform you that your transaction has been successfully completed. Here are the details:</p>
    
    <table width="100%" style="margin: 20px 0;">
      ${tableRow('Transaction Code', code)}
      ${tableRow('Amount', `£${amount.toFixed(2)}`)}
    ${tableRow(
        'Payment Method',
        paymentMethod
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
    )}
    </table>
    
  `;

    await sendEmail(config.email.from, email, 'Payment Confirmation - Transaction Successful', cardContainer(content), config.other.supportEmail);
};

const sendOtpEmail = async ({email, otp}: { email: string; otp: number }): Promise<void> => {
    const content = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">Your OTP for Verification</h2>
    <p>Dear User,</p>
    <p>We received a request to verify your identity. Please use this One-Time Password:</p>
    
    <div style="text-align: center; margin: 25px 0;">
      <div style="display: inline-block; background-color: #f5f5f5; padding: 15px 30px; border-radius: 6px; font-size: 24px; font-weight: 600; letter-spacing: 2px;">
        ${otp}
      </div>
    </div>
    
    <p style="font-size: 14px; color: #666666;">This OTP is valid for a short time. If you didn't request this, please ignore this email.</p>
  `;

    await sendEmail(config.email.from, email, 'OTP for Verification', cardContainer(content), config.other.supportEmail);
};

const sendSupportReplyEmail = async (name: string, email: string, subject: string, message: string): Promise<void> => {
    const content = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">Support Response</h2>
    <p>Dear ${name},</p>
    <p>Thank you for reaching out to our support team. Here's our response to your inquiry:</p>
    
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <h3 style="font-size: 18px; margin-top: 0;">${subject}</h3>
      <p style="margin-bottom: 0;">${message}</p>
    </div>
    
    <p>If you have any further questions, feel free to reach out.</p>
  `;

    await sendEmail(config.email.from, email, `Support Response - ${subject}`, cardContainer(content), config.other.supportEmail);
};

const sendNotificationEmail = async ({
                                         recipientEmails,
                                         title,
                                         message,
                                         link,
                                         date,
                                         linkText,
                                         isHtml = false,
                                     }: {
    recipientEmails: string[];
    title: string;
    message: string;
    link?: string;
    date?: string;
    linkText?: string;
    isHtml?: boolean;
}): Promise<void> => {
    const {newHtml, attachments} = processHtmlForImages(message);

    const content = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">${title}</h2>
    ${isHtml ? newHtml : `<p>${message}</p>`}
    ${link ? button(linkText || 'View Details', link) : ''}
    ${date ? `<p style="color: #666666; margin-bottom: 20px;">Date: ${date}</p>` : ''}
  `;

    for (const email of recipientEmails) {
        await sendEmail(config.email.from, email, title, cardContainer(content), config.other.supportEmail, attachments);
    }
};

const sendAdminPurchaseNotificationEmail = async ({
                                                      customerEmail,
                                                      item,
                                                      amount,
                                                      paymentMethod,
                                                      transactionId,
                                                      isInstallment,
                                                  }: {
    customerEmail: string;
    item: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    isInstallment: boolean;
}): Promise<void> => {
    const formattedPaymentMethod = paymentMethod
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    const content = `
    <h2 style="font-size: 14px; font-weight: 600; margin-top: 0;">New Item Purchase Notification</h2>
    <p>Dear Admin,</p>
    <p>A new item purchase has been initiated. Here are the details:</p>
    
    <table width="100%" style="margin: 20px 0;">
      ${tableRow('Client Email', customerEmail)}
      ${tableRow('Item', item)}
      ${tableRow('Amount', `£${amount.toFixed(2)}`)}
      ${tableRow('Payment Method', formattedPaymentMethod)}
      ${tableRow('Transaction ID', transactionId)}
      ${tableRow('Installment Payment', isInstallment ? 'Yes' : 'No')}
    </table>
    
    <p style="font-size: 14px; color: #666666;">
  Please review the transaction. For bank transfers, confirm the payment in your bank account and then manually update the transaction status to 'Paid' on the admin dashboard.
</p>
  `;

    await sendEmail(
        config.email.from,
        config.other.supportEmail,
        'New Item Purchase Notification',
        cardContainer(content),
        config.other.supportEmail,
    );
};

export const emailService = {
    welcomeEmail,
    accountActivatedEmail,
    sendPasswordResetEmail,
    sendSupportNotificationEmail,
    sendVerificationEmail,
    sendTransactionVerificationEmail,
    sendPaidTransactionEmail,
    sendOtpEmail,
    sendSupportReplyEmail,
    sendNotificationEmail,
    sendAdminPurchaseNotificationEmail,
};
