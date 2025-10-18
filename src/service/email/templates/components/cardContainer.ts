import { header } from '../header';
import { footer } from '../footer';

export const cardContainer = (content: string) => `
  <div style="width:100%;max-width:570px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif; color: #333333; line-height: 1.5;">
    ${header}
    <div style="background-color: #ffffff; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-radius: 0 0 8px 8px;">
      ${content}
    </div>
    ${footer}
  </div>
`;
