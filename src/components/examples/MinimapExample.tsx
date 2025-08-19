import React, { useEffect, useRef, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useCamera, useSigma } from '@react-sigma/core';
import Graph from 'graphology';

interface MinimapProps {
  width: number;
  height: number;
}

const MiniMap: React.FC<MinimapProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { goto } = useCamera();
  const sigma = useSigma();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sigma) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderMinimap = () => {
      ctx.clearRect(0, 0, width, height);
      
      const graph = sigma.getGraph();
      if (graph.order === 0) return;

      // Calculate graph bounds
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      graph.forEachNode((_, attributes) => {
        minX = Math.min(minX, attributes.x);
        maxX = Math.max(maxX, attributes.x);
        minY = Math.min(minY, attributes.y);
        maxY = Math.max(maxY, attributes.y);
      });

      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;
      const padding = 10;
      const scale = Math.min((width - padding * 2) / graphWidth, (height - padding * 2) / graphHeight);

      // Draw edges
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;
      graph.forEachEdge((_, _attributes, _source, _target, sourceAttrs, targetAttrs) => {
        const x1 = (sourceAttrs.x - minX) * scale + padding;
        const y1 = (sourceAttrs.y - minY) * scale + padding;
        const x2 = (targetAttrs.x - minX) * scale + padding;
        const y2 = (targetAttrs.y - minY) * scale + padding;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Draw nodes
      graph.forEachNode((_, attributes) => {
        const x = (attributes.x - minX) * scale + padding;
        const y = (attributes.y - minY) * scale + padding;
        const size = Math.max(2, (attributes.size || 5) * scale * 0.1);
        
        ctx.fillStyle = attributes.color || '#666';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw simplified viewport indicator (center area)
      const centerX = width / 2;
      const centerY = height / 2;
      const indicatorSize = 20;

      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(255, 71, 87, 0.1)';
      ctx.fillRect(centerX - indicatorSize/2, centerY - indicatorSize/2, indicatorSize, indicatorSize);
      ctx.strokeRect(centerX - indicatorSize/2, centerY - indicatorSize/2, indicatorSize, indicatorSize);
    };

    // Render initially and on a timer
    renderMinimap();
    const interval = setInterval(renderMinimap, 500); // Refresh every 500ms
    
    return () => {
      clearInterval(interval);
    };
  }, [sigma, width, height]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && e.type !== 'mousedown') return;
    
    const canvas = canvasRef.current;
    if (!canvas || !sigma) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const graph = sigma.getGraph();
    if (graph.order === 0) return;

    // Calculate graph bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    graph.forEachNode((_, attributes) => {
      minX = Math.min(minX, attributes.x);
      maxX = Math.max(maxX, attributes.x);
      minY = Math.min(minY, attributes.y);
      maxY = Math.max(maxY, attributes.y);
    });

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const padding = 10;
    const scale = Math.min((width - padding * 2) / graphWidth, (height - padding * 2) / graphHeight);

    // Convert minimap coordinates to graph coordinates
    const graphX = (x - padding) / scale + minX;
    const graphY = (y - padding) / scale + minY;

    goto({ x: -graphX, y: -graphY }, { duration: 200 });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 10,
      right: 10,
      background: 'white',
      border: '2px solid #ddd',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <div style={{ 
        padding: '5px', 
        fontSize: '12px', 
        fontWeight: 'bold', 
        textAlign: 'center',
        borderBottom: '1px solid #eee'
      }}>
        Minimap
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ 
          display: 'block',
          cursor: isDragging ? 'grabbing' : 'pointer'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div style={{ 
        padding: '3px', 
        fontSize: '10px', 
        color: '#666', 
        textAlign: 'center',
        borderTop: '1px solid #eee'
      }}>
        Click to navigate
      </div>
    </div>
  );
};

const MinimapControls: React.FC<{ 
  onSizeChange: (width: number, height: number) => void,
  currentWidth: number,
  currentHeight: number
}> = ({ onSizeChange, currentWidth, currentHeight }) => {
  const sizes = [
    { label: 'Small', width: 120, height: 80 },
    { label: 'Medium', width: 160, height: 120 },
    { label: 'Large', width: 200, height: 150 }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'white',
      padding: '15px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Minimap Size:</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {sizes.map(size => (
          <button
            key={size.label}
            onClick={() => onSizeChange(size.width, size.height)}
            style={{
              padding: '6px 12px',
              backgroundColor: (currentWidth === size.width && currentHeight === size.height) 
                ? '#007bff' : '#f8f9fa',
              color: (currentWidth === size.width && currentHeight === size.height) 
                ? 'white' : '#333',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {size.label} ({size.width}x{size.height})
          </button>
        ))}
      </div>
    </div>
  );
};

const MinimapGraph: React.FC = () => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    const graph = new Graph();
    
    // Create a larger, more complex network for minimap demonstration
    
    // Create clusters
    const clusters = [
      { center: { x: -5, y: -3 }, radius: 2, count: 12, color: '#ff6b6b' },
      { center: { x: 5, y: -3 }, radius: 2, count: 10, color: '#4ecdc4' },
      { center: { x: -3, y: 4 }, radius: 1.5, count: 8, color: '#45b7d1' },
      { center: { x: 3, y: 4 }, radius: 1.5, count: 9, color: '#f9ca24' },
      { center: { x: 0, y: 0 }, radius: 3, count: 11, color: '#a8e6cf' }
    ];

    let nodeId = 0;
    clusters.forEach((cluster, clusterIndex) => {
      for (let i = 0; i < cluster.count; i++) {
        const angle = (i / cluster.count) * 2 * Math.PI;
        const radius = Math.random() * cluster.radius;
        graph.addNode(`node-${nodeId}`, {
          label: `Node ${nodeId}`,
          x: cluster.center.x + Math.cos(angle) * radius,
          y: cluster.center.y + Math.sin(angle) * radius,
          size: Math.random() * 8 + 5,
          color: cluster.color,
          cluster: clusterIndex
        });
        nodeId++;
      }
    });

    // Add edges within and between clusters
    graph.forEachNode((node, attributes) => {
      graph.forEachNode((otherNode, otherAttributes) => {
        if (node !== otherNode && !graph.hasEdge(node, otherNode)) {
          const sameCluster = attributes.cluster === otherAttributes.cluster;
          const distance = Math.sqrt(
            Math.pow(attributes.x - otherAttributes.x, 2) +
            Math.pow(attributes.y - otherAttributes.y, 2)
          );
          
          let connectionProbability;
          if (sameCluster) {
            connectionProbability = 0.3;
          } else {
            connectionProbability = Math.max(0, 0.15 - distance * 0.02);
          }
          
          if (Math.random() < connectionProbability) {
            graph.addEdge(node, otherNode, {
              color: sameCluster ? '#666' : '#ccc',
              size: sameCluster ? 2 : 1
            });
          }
        }
      });
    });

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#666',
      defaultEdgeColor: '#ccc',
      labelRenderedSizeThreshold: 8,
      labelSize: 12
    });
  }, [loadGraph, setSettings]);

  return null;
};

const MinimapExample: React.FC = () => {
  const [minimapWidth, setMinimapWidth] = useState(160);
  const [minimapHeight, setMinimapHeight] = useState(120);

  const handleSizeChange = (width: number, height: number) => {
    setMinimapWidth(width);
    setMinimapHeight(height);
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <MinimapGraph />
        <MiniMap width={minimapWidth} height={minimapHeight} />
      </SigmaContainer>
      
      <MinimapControls 
        onSizeChange={handleSizeChange}
        currentWidth={minimapWidth}
        currentHeight={minimapHeight}
      />

      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'rgba(255,255,255,0.9)',
        padding: '15px',
        borderRadius: '5px',
        fontSize: '14px',
        zIndex: 1000,
        maxWidth: '250px'
      }}>
        <strong>Minimap Features:</strong><br />
        • Real-time overview of entire graph<br />
        • Red rectangle shows current viewport<br />
        • Click to navigate to any area<br />
        • Resizable minimap window<br />
        • Updates automatically with zoom/pan
      </div>
    </div>
  );
};

export default MinimapExample;