export const button = (text: string, link: string, icon?: string) => `
  <div style="text-align: center; margin: 25px 0 15px 0;">
    <a href="${link}" style="background-color: #04C171; color: #ffffff; font-weight: 600; border-radius: 6px; padding: 12px 24px; text-decoration: none; display: inline-block; font-family: sans-serif;">
      ${icon ? `<span style="margin-right: 8px;">${icon}</span>` : ''}${text}
    </a>
  </div>
`;
