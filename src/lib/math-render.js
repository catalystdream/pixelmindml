import katex from 'katex';

export function renderMath(content) {
  // Replace inline math: $...$ 
  let processedContent = content.replace(/\$([^\$]+)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { 
        displayMode: false,
        throwOnError: false
      });
    } catch (e) {
      console.error('KaTeX error:', e);
      return match; // Return original if rendering fails
    }
  });
  
  // Replace display math: $$...$$
  processedContent = processedContent.replace(/\$\$([^\$]+)\$\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { 
        displayMode: true,
        throwOnError: false
      });
    } catch (e) {
      console.error('KaTeX error:', e);
      return match; // Return original if rendering fails
    }
  });
  
  return processedContent;
}