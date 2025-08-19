import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { circular, random } from 'graphology-layout';

interface GraphData {
  id: string;
  title: string;
  description: string;
  nodeCount: number;
  edgeCount: number;
  color: string;
}

const ComparisonControls: React.FC<{
  selectedGraphs: string[],
  onGraphToggle: (graphId: string) => void,
  availableGraphs: GraphData[]
}> = ({ selectedGraphs, onGraphToggle, availableGraphs }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      background: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      minWidth: '280px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Graph Comparison</h4>
      
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
        Select up to 4 graphs to compare side by side:
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {availableGraphs.map(graph => (
          <label
            key={graph.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              backgroundColor: selectedGraphs.includes(graph.id) ? '#e3f2fd' : '#f8f9fa',
              borderRadius: '6px',
              cursor: 'pointer',
              border: selectedGraphs.includes(graph.id) ? '2px solid #2196f3' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              type="checkbox"
              checked={selectedGraphs.includes(graph.id)}
              onChange={() => onGraphToggle(graph.id)}
              style={{ marginRight: '8px' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '13px',
                color: selectedGraphs.includes(graph.id) ? '#1976d2' : '#333'
              }}>
                {graph.title}
              </div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                {graph.nodeCount} nodes, {graph.edgeCount} edges
              </div>
            </div>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: graph.color,
              borderRadius: '50%',
              marginLeft: '8px'
            }} />
          </label>
        ))}
      </div>

      <div style={{
        marginTop: '12px',
        padding: '8px',
        backgroundColor: '#fff3cd',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#856404'
      }}>
        💡 <strong>Tip:</strong> Compare different network types to understand structural differences
      </div>
    </div>
  );
};

const SingleGraph: React.FC<{ 
  graphData: GraphData,
  style: React.CSSProperties 
}> = ({ graphData, style }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    const graph = new Graph();

    // Generate different types of networks based on graph type
    switch (graphData.id) {
      case 'social':
        // Social network - clustered communities
        createSocialNetwork(graph, graphData.color);
        break;
      case 'hierarchy':
        // Hierarchical network - tree-like structure  
        createHierarchicalNetwork(graph, graphData.color);
        break;
      case 'random':
        // Random network - Erdős–Rényi model
        createRandomNetwork(graph, graphData.color);
        break;
      case 'star':
        // Star network - one central hub
        createStarNetwork(graph, graphData.color);
        break;
      case 'ring':
        // Ring network - circular connections
        createRingNetwork(graph, graphData.color);
        break;
      case 'smallworld':
        // Small world network - high clustering, short paths
        createSmallWorldNetwork(graph, graphData.color);
        break;
      default:
        createRandomNetwork(graph, graphData.color);
    }

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: false, // Disable labels for cleaner comparison
      renderEdgeLabels: false,
      defaultNodeColor: graphData.color,
      defaultEdgeColor: `${graphData.color}80`, // Semi-transparent
      labelRenderedSizeThreshold: 100, // Very high threshold to effectively disable
    });

  }, [loadGraph, setSettings, graphData]);

  return null;
};

// Network generation functions
const createSocialNetwork = (graph: Graph, color: string) => {
  // Create 3 communities
  const communities = [
    Array.from({length: 6}, (_, i) => `A${i+1}`),
    Array.from({length: 5}, (_, i) => `B${i+1}`),
    Array.from({length: 4}, (_, i) => `C${i+1}`)
  ];

  communities.forEach((community, commIndex) => {
    community.forEach((nodeId, nodeIndex) => {
      graph.addNode(nodeId, {
        label: nodeId,
        size: 6 + Math.random() * 4,
        color: color,
        x: Math.cos(commIndex * 2 * Math.PI / 3) * 2 + Math.cos(nodeIndex * 2 * Math.PI / community.length) * 0.8,
        y: Math.sin(commIndex * 2 * Math.PI / 3) * 2 + Math.sin(nodeIndex * 2 * Math.PI / community.length) * 0.8
      });
    });

    // Dense connections within community
    for (let i = 0; i < community.length; i++) {
      for (let j = i + 1; j < community.length; j++) {
        if (Math.random() > 0.3) {
          graph.addEdge(community[i], community[j], { color: `${color}80` });
        }
      }
    }
  });

  // Sparse connections between communities
  communities.forEach((comm1, i) => {
    communities.forEach((comm2, j) => {
      if (i < j) {
        const node1 = comm1[Math.floor(Math.random() * comm1.length)];
        const node2 = comm2[Math.floor(Math.random() * comm2.length)];
        graph.addEdge(node1, node2, { color: `${color}60` });
      }
    });
  });
};

const createHierarchicalNetwork = (graph: Graph, color: string) => {
  // Root node
  graph.addNode('root', { label: 'Root', size: 12, color: color, x: 0, y: -2 });

  // Level 1 - 3 nodes
  for (let i = 0; i < 3; i++) {
    const nodeId = `L1_${i}`;
    graph.addNode(nodeId, {
      label: nodeId,
      size: 8,
      color: color,
      x: (i - 1) * 2,
      y: -1
    });
    graph.addEdge('root', nodeId, { color: `${color}80` });

    // Level 2 - 2-4 nodes per L1 node
    const childCount = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < childCount; j++) {
      const childId = `L2_${i}_${j}`;
      graph.addNode(childId, {
        label: childId,
        size: 5,
        color: color,
        x: (i - 1) * 2 + (j - childCount/2 + 0.5) * 0.8,
        y: 0.5
      });
      graph.addEdge(nodeId, childId, { color: `${color}80` });
    }
  }
};

const createRandomNetwork = (graph: Graph, color: string) => {
  // Erdős–Rényi random graph
  const nodeCount = 15;
  const edgeProbability = 0.15;

  // Add nodes
  for (let i = 0; i < nodeCount; i++) {
    graph.addNode(`n${i}`, {
      label: `n${i}`,
      size: 5 + Math.random() * 5,
      color: color
    });
  }

  // Add random edges
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (Math.random() < edgeProbability) {
        graph.addEdge(`n${i}`, `n${j}`, { color: `${color}80` });
      }
    }
  }

  random.assign(graph);
};

const createStarNetwork = (graph: Graph, color: string) => {
  // Central hub
  graph.addNode('hub', { label: 'Hub', size: 15, color: color, x: 0, y: 0 });

  // Spokes
  for (let i = 0; i < 12; i++) {
    const nodeId = `spoke${i}`;
    const angle = i * 2 * Math.PI / 12;
    graph.addNode(nodeId, {
      label: nodeId,
      size: 5,
      color: color,
      x: Math.cos(angle) * 2.5,
      y: Math.sin(angle) * 2.5
    });
    graph.addEdge('hub', nodeId, { color: `${color}80` });
  }
};

const createRingNetwork = (graph: Graph, color: string) => {
  const nodeCount = 12;
  
  // Add nodes in a circle
  for (let i = 0; i < nodeCount; i++) {
    const angle = i * 2 * Math.PI / nodeCount;
    graph.addNode(`r${i}`, {
      label: `r${i}`,
      size: 6,
      color: color,
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2
    });
  }

  // Connect adjacent nodes
  for (let i = 0; i < nodeCount; i++) {
    graph.addEdge(`r${i}`, `r${(i + 1) % nodeCount}`, { color: `${color}80` });
  }
};

const createSmallWorldNetwork = (graph: Graph, color: string) => {
  const nodeCount = 16;
  const k = 4; // Each node connected to k nearest neighbors
  const p = 0.3; // Rewiring probability

  // Start with ring lattice
  for (let i = 0; i < nodeCount; i++) {
    const angle = i * 2 * Math.PI / nodeCount;
    graph.addNode(`sw${i}`, {
      label: `sw${i}`,
      size: 5,
      color: color,
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2
    });
  }

  // Connect to k nearest neighbors
  for (let i = 0; i < nodeCount; i++) {
    for (let j = 1; j <= k/2; j++) {
      const neighbor = (i + j) % nodeCount;
      if (!graph.hasEdge(`sw${i}`, `sw${neighbor}`)) {
        graph.addEdge(`sw${i}`, `sw${neighbor}`, { color: `${color}80` });
      }
    }
  }

  // Rewire some edges randomly
  const edges = graph.edges();
  edges.forEach(edgeId => {
    if (Math.random() < p) {
      const [source, target] = graph.extremities(edgeId);
      graph.dropEdge(edgeId);
      
      // Find random target that's not already connected
      let newTarget;
      do {
        newTarget = `sw${Math.floor(Math.random() * nodeCount)}`;
      } while (newTarget === source || graph.hasEdge(source, newTarget));
      
      graph.addEdge(source, newTarget, { color: `${color}60` });
    }
  });
};

const MultiGraphExample: React.FC = () => {
  const availableGraphs: GraphData[] = [
    {
      id: 'social',
      title: 'Social Network',
      description: 'Clustered communities with inter-group connections',
      nodeCount: 15,
      edgeCount: 25,
      color: '#e74c3c'
    },
    {
      id: 'hierarchy',
      title: 'Hierarchical Tree',
      description: 'Tree-like structure with clear levels',
      nodeCount: 12,
      edgeCount: 11,
      color: '#2ecc71'
    },
    {
      id: 'random',
      title: 'Random Network',
      description: 'Erdős–Rényi random graph model',
      nodeCount: 15,
      edgeCount: 18,
      color: '#3498db'
    },
    {
      id: 'star',
      title: 'Star Network',
      description: 'Central hub with radiating connections',
      nodeCount: 13,
      edgeCount: 12,
      color: '#f39c12'
    },
    {
      id: 'ring',
      title: 'Ring Network',
      description: 'Circular chain of connections',
      nodeCount: 12,
      edgeCount: 12,
      color: '#9b59b6'
    },
    {
      id: 'smallworld',
      title: 'Small World',
      description: 'High clustering with short path lengths',
      nodeCount: 16,
      edgeCount: 32,
      color: '#1abc9c'
    }
  ];

  const [selectedGraphs, setSelectedGraphs] = useState<string[]>(['social', 'hierarchy', 'random', 'star']);

  const handleGraphToggle = (graphId: string) => {
    setSelectedGraphs(prev => {
      if (prev.includes(graphId)) {
        return prev.filter(id => id !== graphId);
      } else if (prev.length < 4) {
        return [...prev, graphId];
      } else {
        // Replace the first one if we're at the limit
        return [prev[1], prev[2], prev[3], graphId];
      }
    });
  };

  const getGridLayout = (count: number) => {
    if (count === 1) return { cols: 1, rows: 1 };
    if (count === 2) return { cols: 2, rows: 1 };
    if (count <= 4) return { cols: 2, rows: 2 };
    return { cols: 2, rows: 2 }; // Max 4 graphs
  };

  const gridLayout = getGridLayout(selectedGraphs.length);

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <ComparisonControls 
        selectedGraphs={selectedGraphs}
        onGraphToggle={handleGraphToggle}
        availableGraphs={availableGraphs}
      />

      {/* Graph Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridLayout.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gridLayout.rows}, 1fr)`,
        height: '100%',
        width: '100%',
        gap: '2px',
        backgroundColor: '#ecf0f1'
      }}>
        {selectedGraphs.map((graphId, index) => {
          const graphData = availableGraphs.find(g => g.id === graphId);
          if (!graphData) return null;

          return (
            <div
              key={graphId}
              style={{
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              {/* Graph Title */}
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'rgba(255,255,255,0.95)',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: graphData.color,
                zIndex: 1000,
                border: `1px solid ${graphData.color}40`
              }}>
                {graphData.title}
              </div>

              {/* Graph Stats */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(255,255,255,0.95)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                color: '#666',
                zIndex: 1000
              }}>
                {graphData.nodeCount}N, {graphData.edgeCount}E
              </div>

              <SigmaContainer 
                style={{ height: '100%', width: '100%' }}
                settings={{ allowInvalidContainer: true }}
              >
                <SingleGraph graphData={graphData} style={{}} />
              </SigmaContainer>
            </div>
          );
        })}
      </div>

      {/* Info Panel */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        background: 'rgba(255,255,255,0.95)',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        maxWidth: '280px'
      }}>
        <strong>Network Topology Comparison:</strong><br />
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          Compare different network structures side by side to understand their unique properties and characteristics.
        </span>
      </div>
    </div>
  );
};

export default MultiGraphExample;