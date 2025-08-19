import React, { useEffect } from 'react';
import { useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { random } from 'graphology-layout';
import SafeSigmaContainer from '../SafeSigmaContainer';

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
        });
      }
    }

    // Apply random layout
    random.assign(graph);
    
    // Load graph
    loadGraph(graph);

    // Configure settings
    setSettings({
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
    });
  }, [loadGraph, setSettings]);

  return null;
};

const SimpleBasicExample: React.FC = () => {
  return (
    <SafeSigmaContainer>
      <LoadGraph />
    </SafeSigmaContainer>
  );
};

export default SimpleBasicExample;