import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';

const GraphEvents: React.FC = () => {
  const loadGraph = useLoadGraph();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();
  const [eventLog, setEventLog] = useState<string[]>([]);

  const addToLog = (message: string) => {
    setEventLog(prev => [message, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    const graph = new Graph();
    
    // Create a simple graph
    graph.addNode('A', { label: 'Node A', x: 0, y: 0, size: 15, color: '#ff6b6b' });
    graph.addNode('B', { label: 'Node B', x: 2, y: 0, size: 15, color: '#4ecdc4' });
    graph.addNode('C', { label: 'Node C', x: 1, y: 1, size: 15, color: '#45b7d1' });
    graph.addNode('D', { label: 'Node D', x: -1, y: 1, size: 15, color: '#f9ca24' });

    graph.addEdge('A', 'B', { color: '#ccc' });
    graph.addEdge('B', 'C', { color: '#ccc' });
    graph.addEdge('C', 'D', { color: '#ccc' });
    graph.addEdge('D', 'A', { color: '#ccc' });

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      renderEdgeLabels: false,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
    });
  }, [loadGraph, setSettings]);

  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        addToLog(`Clicked node: ${event.node}`);
      },
      clickEdge: (event) => {
        addToLog(`Clicked edge: ${event.edge}`);
      },
      clickStage: () => {
        addToLog('Clicked stage (background)');
      },
      enterNode: (event) => {
        addToLog(`Entered node: ${event.node}`);
      },
      leaveNode: (event) => {
        addToLog(`Left node: ${event.node}`);
      },
      doubleClickNode: (event) => {
        addToLog(`Double-clicked node: ${event.node}`);
      }
    });
  }, [registerEvents]);

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '300px' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Event Log:</h4>
      <div style={{ fontSize: '12px', maxHeight: '150px', overflow: 'auto' }}>
        {eventLog.length === 0 ? (
          <div style={{ color: '#999' }}>Try clicking, hovering, or double-clicking nodes and edges!</div>
        ) : (
          eventLog.map((event, index) => (
            <div key={index} style={{ marginBottom: '2px', color: index === 0 ? '#007bff' : '#666' }}>
              {event}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const EventsExample: React.FC = () => {
  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <GraphEvents />
      </SigmaContainer>
    </div>
  );
};

export default EventsExample;