import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './MarkdownRenderer.scss';

const MarkdownRenderer = ({ content }) => {
  let safeContent = '';
  if (typeof content === 'string') {
    safeContent = content;
  } else if (content) {
    safeContent = JSON.stringify(content, null, 2);
  }
  return (
    <div className="md-renderer">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          
          h1: ({ node, ...props }) => <h1 className="md-renderer__h1" {...props} />,
          h2: ({ node, ...props }) => <h2 className="md-renderer__h2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="md-renderer__h3" {...props} />,
          h4: ({ node, ...props }) => <h4 className="md-renderer__h4" {...props} />,
          
          
          p: ({ node, ...props }) => <p className="md-renderer__p" {...props} />,
          a: ({ node, ...props }) => <a className="md-renderer__a" target="_blank" rel="noopener noreferrer" {...props} />,
          strong: ({ node, ...props }) => <strong className="md-renderer__strong" {...props} />,
          em: ({ node, ...props }) => <em className="md-renderer__em" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="md-renderer__blockquote" {...props} />,

        
          ul: ({ node, ...props }) => <ul className="md-renderer__ul" {...props} />,
          ol: ({ node, ...props }) => <ol className="md-renderer__ol" {...props} />,
          li: ({ node, ...props }) => <li className="md-renderer__li" {...props} />,

    
          pre: ({ node, ...props }) => <>{props.children}</>,

      
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');

            return !isInline && match ? (
              <div className="md-renderer__code-wrapper">
                <div className="md-renderer__code-header">
                  <span>{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={dracula}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="md-renderer__inline-code" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {safeContent}
      </Markdown>
    </div>
  );
};

export default MarkdownRenderer;