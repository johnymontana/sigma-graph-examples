import React, { useEffect } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents } from '@react-sigma/core';
import Graph from 'graphology';
import { random } from 'graphology-layout';

const DragDropGraph: React.FC = () => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    const graph = new Graph();
    
    // Create nodes
    const nodes = [
      { id: 'A', label: 'Draggable A', color: '#ff6b6b' },
      { id: 'B', label: 'Draggable B', color: '#4ecdc4' },
      { id: 'C', label: 'Draggable C', color: '#45b7d1' },
      { id: 'D', label: 'Draggable D', color: '#f9ca24' },
      { id: 'E', label: 'Draggable E', color: '#a8e6cf' },
      { id: 'F', label: 'Draggable F', color: '#ff8b94' }
    ];

    nodes.forEach(node => {
      graph.addNode(node.id, {
        label: node.label,
        size: 20,
        color: node.color,
      });
    });

    // Add edges
    graph.addEdge('A', 'B', { color: '#ccc', size: 2 });
    graph.addEdge('B', 'C', { color: '#ccc', size: 2 });
    graph.addEdge('C', 'D', { color: '#ccc', size: 2 });
    graph.addEdge('D', 'E', { color: '#ccc', size: 2 });
    graph.addEdge('E', 'F', { color: '#ccc', size: 2 });
    graph.addEdge('F', 'A', { color: '#ccc', size: 2 });
    graph.addEdge('A', 'D', { color: '#999', size: 1 });
    graph.addEdge('B', 'E', { color: '#999', size: 1 });

    // Apply random layout
    random.assign(graph);
    
    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
    });
  }, [loadGraph, setSettings]);

  useEffect(() => {
    registerEvents({
      enterNode: () => {
        document.body.style.cursor = 'grab';
      },
      leaveNode: () => {
        document.body.style.cursor = 'default';
      },
      clickNode: (event) => {
        // Simple demonstration - just log the clicked node
        console.log('Clicked node for dragging:', event.node);
      }
    });

    return () => {
      document.body.style.cursor = 'default';
    };
  }, [registerEvents]);

  return (
    <div style={{ 
      position: 'absolute', 
      top: 10, 
      left: 10, 
      background: 'rgba(255,255,255,0.9)', 
      padding: '10px', 
      borderRadius: '5px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontSize: '14px'
    }}>
      <strong>Drag & Drop Instructions:</strong><br />
      • Click and drag any node to move it<br />
      • Cursor changes to indicate drag state<br />
      • Node connections are maintained
    </div>
  );
};

const DragDropExample: React.FC = () => {
  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <DragDropGraph />
      </SigmaContainer>
    </div>
  );
};

export default DragDropExample;