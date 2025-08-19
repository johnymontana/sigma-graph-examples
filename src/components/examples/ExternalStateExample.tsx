import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents } from '@react-sigma/core';
import Graph from 'graphology';

interface NodeInfo {
  id: string;
  label: string;
  degree: number;
  color: string;
}

const ExternalState: React.FC<{ selectedNode: string | null, onNodeSelect: (node: string | null) => void }> = ({ 
  selectedNode, 
  onNodeSelect 
}) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    const graph = new Graph();
    
    // Create a social network-like graph
    const people = [
      'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'
    ];

    people.forEach((person, index) => {
      const angle = (index / people.length) * 2 * Math.PI;
      graph.addNode(person, {
        label: person,
        x: Math.cos(angle) * 2,
        y: Math.sin(angle) * 2,
        size: 15,
        color: selectedNode === person ? '#ff4757' : '#3742fa',
        originalColor: '#3742fa'
      });
    });

    // Add relationships
    const connections = [
      ['Alice', 'Bob'], ['Alice', 'Charlie'], ['Alice', 'Diana'],
      ['Bob', 'Charlie'], ['Bob', 'Eve'], ['Bob', 'Frank'],
      ['Charlie', 'Grace'], ['Diana', 'Henry'], ['Eve', 'Ivy'],
      ['Frank', 'Jack'], ['Grace', 'Henry'], ['Henry', 'Ivy'],
      ['Ivy', 'Jack'], ['Jack', 'Alice'], ['Grace', 'Eve']
    ];

    connections.forEach(([source, target]) => {
      graph.addEdge(source, target, {
        color: (selectedNode === source || selectedNode === target) ? '#ff4757' : '#ddd',
        size: (selectedNode === source || selectedNode === target) ? 3 : 1
      });
    });

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#3742fa',
      defaultEdgeColor: '#ddd',
    });
  }, [loadGraph, setSettings, selectedNode]);

  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        const clickedNode = event.node;
        onNodeSelect(selectedNode === clickedNode ? null : clickedNode);
      },
      clickStage: () => {
        onNodeSelect(null);
      }
    });
  }, [registerEvents, selectedNode, onNodeSelect]);

  return null;
};

const NodeDetails: React.FC<{ 
  nodeInfo: NodeInfo | null, 
  neighbors: string[],
  onHighlightNeighbor: (neighbor: string) => void 
}> = ({ nodeInfo, neighbors, onHighlightNeighbor }) => {
  if (!nodeInfo) {
    return (
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'white',
        padding: '15px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '250px',
        zIndex: 1000
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Node Details:</h4>
        <p style={{ color: '#666', margin: 0 }}>Click on a node to see details</p>
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'white',
      padding: '15px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      width: '250px',
      zIndex: 1000
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Node Details:</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Name:</strong> {nodeInfo.label}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>ID:</strong> {nodeInfo.id}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Connections:</strong> {nodeInfo.degree}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Color:</strong> 
        <span style={{
          display: 'inline-block',
          width: '20px',
          height: '20px',
          backgroundColor: nodeInfo.color,
          marginLeft: '10px',
          verticalAlign: 'middle',
          border: '1px solid #ccc'
        }}></span>
      </div>

      {neighbors.length > 0 && (
        <div>
          <strong>Connected to:</strong>
          <div style={{ marginTop: '5px' }}>
            {neighbors.map(neighbor => (
              <button
                key={neighbor}
                onClick={() => onHighlightNeighbor(neighbor)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '4px 8px',
                  margin: '2px 0',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                {neighbor}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Statistics: React.FC<{ graph: Graph | null }> = ({ graph }) => {
  if (!graph) return null;

  const nodeCount = graph.order;
  const edgeCount = graph.size;
  const avgDegree = edgeCount > 0 ? (2 * edgeCount / nodeCount).toFixed(2) : '0';
  
  return (
    <div style={{
      position: 'absolute',
      bottom: 10,
      right: 10,
      background: 'white',
      padding: '15px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Graph Statistics:</h4>
      <div style={{ fontSize: '14px' }}>
        <div>Nodes: {nodeCount}</div>
        <div>Edges: {edgeCount}</div>
        <div>Avg Degree: {avgDegree}</div>
      </div>
    </div>
  );
};

const ExternalStateExample: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null);
  const [neighbors, setNeighbors] = useState<string[]>([]);
  const [graph, setGraph] = useState<Graph | null>(null);

  // Simulate getting graph reference (in real app you'd use useGraph hook inside SigmaContainer)
  useEffect(() => {
    const mockGraph = new Graph();
    const people = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
    
    people.forEach(person => {
      mockGraph.addNode(person, { label: person, color: '#3742fa' });
    });

    const connections = [
      ['Alice', 'Bob'], ['Alice', 'Charlie'], ['Alice', 'Diana'],
      ['Bob', 'Charlie'], ['Bob', 'Eve'], ['Bob', 'Frank'],
      ['Charlie', 'Grace'], ['Diana', 'Henry'], ['Eve', 'Ivy'],
      ['Frank', 'Jack'], ['Grace', 'Henry'], ['Henry', 'Ivy'],
      ['Ivy', 'Jack'], ['Jack', 'Alice'], ['Grace', 'Eve']
    ];

    connections.forEach(([source, target]) => {
      mockGraph.addEdge(source, target);
    });

    setGraph(mockGraph);
  }, []);

  useEffect(() => {
    if (selectedNode && graph) {
      const nodeAttrs = graph.getNodeAttributes(selectedNode);
      const degree = graph.degree(selectedNode);
      const nodeNeighbors = graph.neighbors(selectedNode);
      
      setNodeInfo({
        id: selectedNode,
        label: nodeAttrs.label,
        degree: degree,
        color: nodeAttrs.color || '#3742fa'
      });
      setNeighbors(nodeNeighbors);
    } else {
      setNodeInfo(null);
      setNeighbors([]);
    }
  }, [selectedNode, graph]);

  const handleNeighborHighlight = (neighbor: string) => {
    setSelectedNode(neighbor);
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <ExternalState 
          selectedNode={selectedNode} 
          onNodeSelect={setSelectedNode}
        />
      </SigmaContainer>
      
      <NodeDetails 
        nodeInfo={nodeInfo}
        neighbors={neighbors}
        onHighlightNeighbor={handleNeighborHighlight}
      />
      
      <Statistics graph={graph} />

      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px',
        zIndex: 1000
      }}>
        <strong>External State Demo:</strong><br />
        Click nodes to update React state<br />
        State changes reflect in graph styling
      </div>
    </div>
  );
};

export default ExternalStateExample;