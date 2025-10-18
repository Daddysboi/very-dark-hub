export const certificateContainer = (content: string) => `
  <div style="
    width: 1000px;
    margin: 0 auto;
    font-family: 'Inter', Arial, sans-serif;
    color: #333;
    background-color: #fff;
    padding: 60px;
    line-height: 1.6;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transform: rotate(0deg); /* Optional: just for aesthetics */
  ">
    ${content}
  </div>
`;
