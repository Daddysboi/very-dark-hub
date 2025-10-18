import * as cheerio from 'cheerio';
import { Attachment } from 'nodemailer/lib/mailer';

export const processHtmlForImages = (html: string): { newHtml: string; attachments: Attachment[] } => {
  const attachments: Attachment[] = [];
  const $ = cheerio.load(html);

  $('img').each((index, element) => {
    const src = $(element).attr('src');
    if (src && src.startsWith('data:image')) {
      const match = src.match(/^data:(image\/[^;]+);base64,(.+)$/);
      if (match) {
        const imageType = match[1];
        const base64Data = match[2];
        const cid = `image-${Date.now()}-${index}`;

        attachments.push({
          filename: `image-${index}.png`,
          content: Buffer.from(base64Data, 'base64'),
          cid,
          contentType: imageType,
        });

        $(element).attr('src', `cid:${cid}`);

        const existingStyle = $(element).attr('style') || '';
        $(element).attr('style', `max-width: 100%; height: auto; ${existingStyle}`);
      }
    }
  });

  return { newHtml: $('body').html() || '', attachments };
};