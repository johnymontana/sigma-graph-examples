import React, { useRef, useEffect } from 'react';
import { SigmaContainer } from '@react-sigma/core';

interface SafeSigmaContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  settings?: Record<string, unknown>;
}

const SafeSigmaContainer: React.FC<SafeSigmaContainerProps> = ({ 
  children, 
  style = {}, 
  settings = {} 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure container has proper dimensions
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      if (rect.height === 0) {
        container.style.height = '500px';
        container.style.minHeight = '500px';
      }
      if (rect.width === 0) {
        container.style.width = '100%';
        container.style.minWidth = '400px';
      }
    }
  }, []);

  const containerStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    minHeight: '500px',
    minWidth: '400px',
    position: 'relative',
    ...style
  };

  const sigmaSettings = {
    allowInvalidContainer: true,
    renderLabels: true,
    ...settings
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <SigmaContainer 
        style={{ height: '100%', width: '100%' }}
        settings={sigmaSettings}
      >
        {children}
      </SigmaContainer>
    </div>
  );
};

export default SafeSigmaContainer;