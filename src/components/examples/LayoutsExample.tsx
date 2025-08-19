import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { random, circular } from 'graphology-layout';
import { LayoutForceAtlas2Control } from '@react-sigma/layout-forceatlas2';

const LayoutControls: React.FC<{ onLayoutChange: (layout: string) => void }> = ({ onLayoutChange }) => {
  const [currentLayout, setCurrentLayout] = useState('random');

  const handleLayoutChange = (layout: string) => {
    setCurrentLayout(layout);
    onLayoutChange(layout);
  };

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
      <h4 style={{ margin: '0 0 10px 0' }}>Layout Algorithms:</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => handleLayoutChange('random')}
          style={{
            padding: '8px 12px',
            backgroundColor: currentLayout === 'random' ? '#007bff' : '#f8f9fa',
            color: currentLayout === 'random' ? 'white' : '#333',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Random
        </button>
        <button
          onClick={() => handleLayoutChange('circular')}
          style={{
            padding: '8px 12px',
            backgroundColor: currentLayout === 'circular' ? '#007bff' : '#f8f9fa',
            color: currentLayout === 'circular' ? 'white' : '#333',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Circular
        </button>
        <button
          onClick={() => handleLayoutChange('forceatlas2')}
          style={{
            padding: '8px 12px',
            backgroundColor: currentLayout === 'forceatlas2' ? '#007bff' : '#f8f9fa',
            color: currentLayout === 'forceatlas2' ? 'white' : '#333',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ForceAtlas2
        </button>
      </div>
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Current: <strong>{currentLayout}</strong>
      </div>
    </div>
  );
};

const LayoutGraph: React.FC<{ layout: string }> = ({ layout }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    const graph = new Graph();
    
    // Create a more complex graph
    const nodeCount = 20;
    for (let i = 0; i < nodeCount; i++) {
      graph.addNode(`node-${i}`, {
        label: `Node ${i}`,
        size: Math.random() * 8 + 5,
        color: `hsl(${(i * 137.5) % 360}, 70%, 60%)`,
      });
    }

    // Create a connected graph with some clustering
    for (let i = 0; i < nodeCount; i++) {
      // Connect to next node (ring structure)
      graph.addEdge(`node-${i}`, `node-${(i + 1) % nodeCount}`, {
        color: '#ccc',
        size: 1,
      });
      
      // Add some random connections for clustering
      for (let j = 0; j < 3; j++) {
        const target = Math.floor(Math.random() * nodeCount);
        if (target !== i && !graph.hasEdge(`node-${i}`, `node-${target}`)) {
          graph.addEdge(`node-${i}`, `node-${target}`, {
            color: '#999',
            size: 0.5,
          });
        }
      }
    }

    // Apply the selected layout
    switch (layout) {
      case 'circular':
        circular.assign(graph);
        break;
      case 'random':
        random.assign(graph);
        break;
      case 'forceatlas2':
        // ForceAtlas2 will be handled by the supervisor
        random.assign(graph); // Start with random positions
        break;
      default:
        random.assign(graph);
    }

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
    });
  }, [loadGraph, setSettings, layout]);

  return null;
};

const LayoutsExample: React.FC = () => {
  const [currentLayout, setCurrentLayout] = useState('random');

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <LayoutGraph layout={currentLayout} />
        {currentLayout === 'forceatlas2' && (
          <LayoutForceAtlas2Control />
        )}
      </SigmaContainer>
      <LayoutControls onLayoutChange={setCurrentLayout} />
    </div>
  );
};

export default LayoutsExample;