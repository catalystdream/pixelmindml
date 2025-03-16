import Prism from 'prismjs';

// Load prism languages
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-matlab';

export function highlightCode(content) {
  // Replace code blocks with highlighted versions
  const highlightedContent = content.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_, language, code) => {
      try {
        // Decode HTML entities in the code
        const decodedCode = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&');
        
        const highlightedCode = Prism.highlight(
          decodedCode,
          Prism.languages[language] || Prism.languages.javascript,
          language
        );
        
        return `<pre class="language-${language}"><code class="language-${language}">${highlightedCode}</code></pre>`;
      } catch (e) {
        console.error('Error highlighting code:', e);
        return _;
      }
    }
  );
  
  return highlightedContent;
}