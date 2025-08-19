import React, { useState } from 'react';

interface CodePanelProps {
  title: string;
  code: string;
  language?: string;
}

const CodePanel: React.FC<CodePanelProps> = ({ 
  title, 
  code, 
  language = 'typescript' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div style={{
      borderTop: '1px solid #e9ecef',
      backgroundColor: '#f8f9fa',
    }}>
      {/* Header */}
      <div 
        style={{
          padding: '12px 20px',
          backgroundColor: '#e9ecef',
          borderBottom: isExpanded ? '1px solid #dee2e6' : 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            marginRight: '8px',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            fontSize: '14px'
          }}>
            ▶
          </span>
          <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '12px',
            color: '#666',
            backgroundColor: '#fff',
            padding: '2px 6px',
            borderRadius: '3px',
            border: '1px solid #dee2e6'
          }}>
            {language}
          </span>
          <span style={{ fontSize: '12px', color: '#666' }}>
            {isExpanded ? 'Hide Code' : 'Show Code'}
          </span>
        </div>
      </div>

      {/* Code Content */}
      {isExpanded && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '4px 8px',
              backgroundColor: copied ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '12px',
              cursor: 'pointer',
              zIndex: 1000,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.backgroundColor = '#5a6268';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.backgroundColor = '#6c757d';
              }
            }}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <pre style={{
            margin: 0,
            padding: '20px',
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontSize: '13px',
            lineHeight: '1.4',
            overflow: 'auto',
            height: 'calc(40vh - 100px)',
            maxHeight: '500px',
            fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
            whiteSpace: 'pre-wrap'
          }}>
            <code style={{ display: 'block' }}>
              {code.split('\n').map((line, index) => (
                <div key={index} style={{ display: 'flex' }}>
                  <span style={{ 
                    color: '#999', 
                    marginRight: '15px', 
                    userSelect: 'none',
                    minWidth: '30px',
                    textAlign: 'right'
                  }}>
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodePanel;