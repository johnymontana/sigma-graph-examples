import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { LayoutForceAtlas2Control } from '@react-sigma/layout-forceatlas2';
import { LayoutForceControl } from '@react-sigma/layout-force';
import { LayoutNoverlapControl } from '@react-sigma/layout-noverlap';
import { useLayoutCircular } from '@react-sigma/layout-circular';
import { useLayoutCirclepack } from '@react-sigma/layout-circlepack';
import { useLayoutRandom } from '@react-sigma/layout-random';

// Layout type definitions
type RegularLayout = 'random' | 'circular' | 'circlepack';
type WorkerLayout = 'force' | 'forceatlas2' | 'noverlap';

interface LayoutControlsProps {
  onLayoutChange: (layout: RegularLayout | WorkerLayout) => void;
  currentLayout: RegularLayout | WorkerLayout;
}

const LayoutControls: React.FC<LayoutControlsProps> = ({ onLayoutChange, currentLayout }) => {
  const [activeWorkerLayout, setActiveWorkerLayout] = useState<WorkerLayout | null>(null);

  const handleLayoutChange = (layout: RegularLayout | WorkerLayout) => {
    // Stop any running worker layout
    if (activeWorkerLayout && activeWorkerLayout !== layout) {
      setActiveWorkerLayout(null);
    }
    
    // If it's a worker layout, track it
    if (['force', 'forceatlas2', 'noverlap'].includes(layout)) {
      setActiveWorkerLayout(layout as WorkerLayout);
    }
    
    onLayoutChange(layout);
  };

  const regularLayouts: { key: RegularLayout; label: string; description: string }[] = [
    { key: 'random', label: 'Random', description: 'Random node positioning' },
    { key: 'circular', label: 'Circular', description: 'Nodes arranged in a circle' },
    { key: 'circlepack', label: 'Circle Pack', description: 'Hierarchical circle packing' }
  ];

  const workerLayouts: { key: WorkerLayout; label: string; description: string }[] = [
    { key: 'force', label: 'Force', description: 'Force-directed layout (worker)' },
    { key: 'forceatlas2', label: 'ForceAtlas2', description: 'Advanced force-directed (worker)' },
    { key: 'noverlap', label: 'No Overlap', description: 'Prevents node overlap (worker)' }
  ];

  return (
    <div style={{ 
      position: 'absolute', 
      top: 10, 
      right: 10, 
      background: 'white', 
      padding: '20px', 
      borderRadius: '8px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      zIndex: 1000,
      maxWidth: '300px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '18px' }}>
        Layout Algorithms
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>
          Regular Layouts (One-time)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {regularLayouts.map(({ key, label, description }) => (
            <button
              key={key}
              onClick={() => handleLayoutChange(key)}
              style={{
                padding: '10px 12px',
                backgroundColor: currentLayout === key ? '#007bff' : '#f8f9fa',
                color: currentLayout === key ? 'white' : '#333',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (currentLayout !== key) {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                }
              }}
              onMouseLeave={(e) => {
                if (currentLayout !== key) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{label}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>{description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>
          Worker Layouts (Continuous)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {workerLayouts.map(({ key, label, description }) => (
            <button
              key={key}
              onClick={() => handleLayoutChange(key)}
              style={{
                padding: '10px 12px',
                backgroundColor: currentLayout === key ? '#28a745' : '#f8f9fa',
                color: currentLayout === key ? 'white' : '#333',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (currentLayout !== key) {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                }
              }}
              onMouseLeave={(e) => {
                if (currentLayout !== key) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{label}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>{description}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div><strong>Current:</strong> {currentLayout}</div>
        {activeWorkerLayout && (
          <div style={{ color: '#28a745', marginTop: '5px' }}>
            ⚡ {activeWorkerLayout} is running
          </div>
        )}
      </div>
    </div>
  );
};

const LayoutGraph: React.FC<{ layout: RegularLayout | WorkerLayout }> = ({ layout }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  
  // Use the layout hooks
  const { assign: assignCircular } = useLayoutCircular();
  const { assign: assignCirclepack } = useLayoutCirclepack();
  const { assign: assignRandom } = useLayoutRandom();

  useEffect(() => {
    const graph = new Graph();
    
    // Create a more complex and interesting graph
    const nodeCount = 25;
    
    // Add nodes with different properties
    for (let i = 0; i < nodeCount; i++) {
      const isHub = i % 5 === 0; // Every 5th node is a hub
      graph.addNode(`node-${i}`, {
        label: `Node ${i}`,
        size: isHub ? Math.random() * 12 + 15 : Math.random() * 8 + 8,
        color: isHub ? `hsl(${(i * 137.5) % 360}, 80%, 50%)` : `hsl(${(i * 137.5) % 360}, 60%, 60%)`,
        x: Math.random() * 1000 - 500,
        y: Math.random() * 1000 - 500,
      });
    }

    // Create a structured graph with communities
    for (let i = 0; i < nodeCount; i++) {
      // Connect to next node (ring structure)
      const nextNode = (i + 1) % nodeCount;
      if (!graph.hasEdge(`node-${i}`, `node-${nextNode}`)) {
        graph.addEdge(`node-${i}`, `node-${nextNode}`, {
          color: '#666',
          size: 2,
          type: 'line'
        });
      }
      
      // Add hub connections
      if (i % 5 === 0) {
        // Connect hub to nearby nodes
        for (let j = 1; j <= 4; j++) {
          const target = (i + j) % nodeCount;
          if (!graph.hasEdge(`node-${i}`, `node-${target}`)) {
            graph.addEdge(`node-${i}`, `node-${target}`, {
              color: '#999',
              size: 1.5,
              type: 'line'
            });
          }
        }
      }
      
      // Add some random cross-community connections
      for (let j = 0; j < 2; j++) {
        const target = Math.floor(Math.random() * nodeCount);
        if (target !== i && !graph.hasEdge(`node-${i}`, `node-${target}`)) {
          graph.addEdge(`node-${i}`, `node-${target}`, {
            color: '#ccc',
            size: 0.8,
            type: 'line'
          });
        }
      }
    }

    // Load the graph first
    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
      labelSize: 12,
      labelWeight: 'bold',
      edgeReducer: (_, attrs) => ({
        ...attrs,
        type: attrs.type || 'line'
      }),
      nodeReducer: (node, attrs) => ({
        ...attrs,
        label: attrs.label || `Node ${node}`,
      }),
    });
  }, [loadGraph, setSettings]);

  // Apply layout after graph is loaded
  useEffect(() => {
    // Small delay to ensure graph is fully loaded
    const timer = setTimeout(() => {
      switch (layout) {
        case 'circular':
          assignCircular();
          break;
        case 'random':
          assignRandom();
          break;
        case 'circlepack':
          assignCirclepack();
          break;
        case 'force':
        case 'forceatlas2':
        case 'noverlap':
          // Start with random positions for worker layouts
          assignRandom();
          break;
        default:
          assignRandom();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [layout, assignCircular, assignCirclepack, assignRandom]);

  return null;
};

const ComprehensiveLayoutsExample: React.FC = () => {
  const [currentLayout, setCurrentLayout] = useState<RegularLayout | WorkerLayout>('random');

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '600px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <LayoutGraph layout={currentLayout} />
        
        {/* Render appropriate control based on current layout */}
        {currentLayout === 'forceatlas2' && <LayoutForceAtlas2Control />}
        {currentLayout === 'force' && <LayoutForceControl />}
        {currentLayout === 'noverlap' && <LayoutNoverlapControl />}
      </SigmaContainer>
      
      <LayoutControls 
        onLayoutChange={setCurrentLayout} 
        currentLayout={currentLayout} 
      />
      
      {/* Information panel */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        fontSize: '13px',
        lineHeight: '1.4'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
          Layout Types Explained
        </h4>
        <div style={{ color: '#666' }}>
          <p><strong>Regular Layouts:</strong> Applied once to position nodes</p>
          <p><strong>Worker Layouts:</strong> Run continuously with start/stop controls</p>
          <p>Click any layout button to see it in action. Worker layouts show control buttons on the graph.</p>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveLayoutsExample;