import React, { useEffect } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { random } from 'graphology-layout';

const LoadGraph: React.FC = () => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    const graph = new Graph();
    
    // Add nodes
    for (let i = 1; i <= 10; i++) {
      graph.addNode(`node-${i}`, {
        label: `Node ${i}`,
        size: Math.random() * 10 + 5,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      });
    }

    // Add edges
    for (let i = 1; i < 10; i++) {
      if (Math.random() > 0.5) {
        graph.addEdge(`node-${i}`, `node-${i + 1}`, {
          color: '#ccc',
          size: 2,
        });
      }
    }

    // Add some random connections
    for (let i = 1; i <= 5; i++) {
      const source = `node-${Math.ceil(Math.random() * 10)}`;
      const target = `node-${Math.ceil(Math.random() * 10)}`;
      if (source !== target && !graph.hasEdge(source, target)) {
        graph.addEdge(source, target, {
          color: '#999',
          size: 1,
        });
      }
    }

    // Apply random layout
    random.assign(graph);
    
    // Load graph
    loadGraph(graph);

    // Configure settings
    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
    });
  }, [loadGraph, setSettings]);

  return null;
};

const BasicGraphExample: React.FC = () => {
  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <LoadGraph />
      </SigmaContainer>
    </div>
  );
};

export default BasicGraphExample;