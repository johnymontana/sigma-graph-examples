import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents } from '@react-sigma/core';
import Graph from 'graphology';
import { circular } from 'graphology-layout';

interface NetworkMetrics {
  nodeCount: number;
  edgeCount: number;
  density: number;
  averageDegree: number;
  clustering: number;
  centralities: { [nodeId: string]: number };
}

const MetricsPanel: React.FC<{ 
  metrics: NetworkMetrics | null,
  selectedNode: string | null,
  onAnalysisTypeChange: (type: string) => void,
  analysisType: string
}> = ({ metrics, selectedNode, onAnalysisTypeChange, analysisType }) => {
  if (!metrics) return null;

  const analysisTypes = [
    { id: 'degree', name: 'Degree Centrality', description: 'Number of direct connections' },
    { id: 'closeness', name: 'Closeness Centrality', description: 'Average distance to all nodes' },
    { id: 'betweenness', name: 'Betweenness Centrality', description: 'Bridge between communities' },
    { id: 'eigenvector', name: 'Eigenvector Centrality', description: 'Influence based on connections' }
  ];

  const topNodes = Object.entries(metrics.centralities)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      minWidth: '320px',
      maxWidth: '400px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>Network Analysis</h4>

      {/* Basic Metrics */}
      <div style={{ marginBottom: '15px' }}>
        <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Basic Metrics</h5>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
          <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', color: '#007bff' }}>{metrics.nodeCount}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Nodes</div>
          </div>
          <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', color: '#28a745' }}>{metrics.edgeCount}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Edges</div>
          </div>
          <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', color: '#ffc107' }}>{metrics.density.toFixed(3)}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Density</div>
          </div>
          <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', color: '#dc3545' }}>{metrics.averageDegree.toFixed(1)}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Avg Degree</div>
          </div>
        </div>
      </div>

      {/* Analysis Type Selection */}
      <div style={{ marginBottom: '15px' }}>
        <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Centrality Analysis</h5>
        <select
          value={analysisType}
          onChange={(e) => onAnalysisTypeChange(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '13px'
          }}
        >
          {analysisTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px', fontStyle: 'italic' }}>
          {analysisTypes.find(t => t.id === analysisType)?.description}
        </div>
      </div>

      {/* Top Nodes by Current Analysis */}
      <div style={{ marginBottom: '15px' }}>
        <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Top Nodes</h5>
        <div style={{ maxHeight: '150px', overflow: 'auto' }}>
          {topNodes.map(([nodeId, score], index) => (
            <div
              key={nodeId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 8px',
                backgroundColor: selectedNode === nodeId ? '#e3f2fd' : '#f8f9fa',
                borderRadius: '4px',
                marginBottom: '4px',
                fontSize: '12px',
                border: selectedNode === nodeId ? '1px solid #2196f3' : '1px solid transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#e9ecef',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: index < 3 ? 'white' : '#666'
                }}>
                  {index + 1}
                </span>
                <span style={{ fontWeight: selectedNode === nodeId ? 'bold' : 'normal' }}>
                  {nodeId}
                </span>
              </div>
              <span style={{ 
                fontFamily: 'monospace', 
                color: '#666',
                fontWeight: 'bold'
              }}>
                {score.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div style={{
          padding: '10px',
          backgroundColor: '#e8f5e8',
          borderRadius: '6px',
          border: '1px solid #28a745'
        }}>
          <h6 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#155724' }}>
            Selected: {selectedNode}
          </h6>
          <div style={{ fontSize: '12px', color: '#155724' }}>
            <strong>{analysisTypes.find(t => t.id === analysisType)?.name}:</strong>{' '}
            {metrics.centralities[selectedNode]?.toFixed(4) || 'N/A'}
          </div>
        </div>
      )}
    </div>
  );
};

const AnalysisGraph: React.FC<{ 
  analysisType: string,
  onMetricsCalculated: (metrics: NetworkMetrics) => void,
  selectedNode: string | null,
  onNodeSelect: (nodeId: string | null) => void
}> = ({ analysisType, onMetricsCalculated, selectedNode, onNodeSelect }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();

  // Calculate centrality measures
  const calculateCentralities = (graph: Graph, type: string): { [nodeId: string]: number } => {
    const centralities: { [nodeId: string]: number } = {};
    
    switch (type) {
      case 'degree':
        graph.forEachNode((nodeId) => {
          centralities[nodeId] = graph.degree(nodeId);
        });
        break;
        
      case 'closeness':
        // Simplified closeness centrality
        graph.forEachNode((nodeId) => {
          let totalDistance = 0;
          let reachableNodes = 0;
          
          graph.forEachNode((targetId) => {
            if (nodeId !== targetId) {
              // Simple distance calculation (direct neighbors = 1, others = 2)
              if (graph.hasEdge(nodeId, targetId)) {
                totalDistance += 1;
                reachableNodes += 1;
              } else {
                totalDistance += 2;
                reachableNodes += 1;
              }
            }
          });
          
          centralities[nodeId] = reachableNodes > 0 ? reachableNodes / totalDistance : 0;
        });
        break;
        
      case 'betweenness':
        // Simplified betweenness (based on degree and clustering)
        graph.forEachNode((nodeId) => {
          const neighbors = graph.neighbors(nodeId);
          const degree = neighbors.length;
          
          if (degree < 2) {
            centralities[nodeId] = 0;
          } else {
            let edgesBetweenNeighbors = 0;
            for (let i = 0; i < neighbors.length; i++) {
              for (let j = i + 1; j < neighbors.length; j++) {
                if (graph.hasEdge(neighbors[i], neighbors[j])) {
                  edgesBetweenNeighbors++;
                }
              }
            }
            
            const possibleEdges = (degree * (degree - 1)) / 2;
            const clustering = possibleEdges > 0 ? edgesBetweenNeighbors / possibleEdges : 0;
            centralities[nodeId] = degree * (1 - clustering);
          }
        });
        break;
        
      case 'eigenvector':
        // Simplified eigenvector centrality (iterative approximation)
        graph.forEachNode((nodeId) => {
          centralities[nodeId] = 1;
        });
        
        // Power iteration (simplified)
        for (let iter = 0; iter < 10; iter++) {
          const newCentralities: { [nodeId: string]: number } = {};
          
          graph.forEachNode((nodeId) => {
            let sum = 0;
            graph.forEachNeighbor(nodeId, (neighborId) => {
              sum += centralities[neighborId];
            });
            newCentralities[nodeId] = sum;
          });
          
          // Normalize
          const maxValue = Math.max(...Object.values(newCentralities));
          if (maxValue > 0) {
            Object.keys(newCentralities).forEach(nodeId => {
              centralities[nodeId] = newCentralities[nodeId] / maxValue;
            });
          }
        }
        break;
    }
    
    return centralities;
  };

  useEffect(() => {
    const graph = new Graph();

    // Create a complex network for analysis
    const networkData = {
      // Core nodes (highly connected)
      core: ['Hub1', 'Hub2', 'Hub3'],
      // Community A
      communityA: ['A1', 'A2', 'A3', 'A4', 'A5'],
      // Community B  
      communityB: ['B1', 'B2', 'B3', 'B4'],
      // Community C
      communityC: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
      // Bridge nodes
      bridges: ['Bridge1', 'Bridge2']
    };

    // Add all nodes
    Object.entries(networkData).forEach(([category, nodes]) => {
      nodes.forEach((nodeId, _) => {
        graph.addNode(nodeId, {
          label: nodeId,
          size: 12,
          color: category === 'core' ? '#e74c3c' : 
                category === 'communityA' ? '#3498db' :
                category === 'communityB' ? '#2ecc71' :
                category === 'communityC' ? '#f39c12' : '#9b59b6',
          category
        });
      });
    });

    // Add edges within communities
    const addCommunityEdges = (community: string[]) => {
      for (let i = 0; i < community.length; i++) {
        for (let j = i + 1; j < community.length; j++) {
          if (Math.random() > 0.4) { // 60% chance of connection
            graph.addEdge(community[i], community[j], {
              color: '#bdc3c7',
              size: 1
            });
          }
        }
      }
    };

    addCommunityEdges(networkData.communityA);
    addCommunityEdges(networkData.communityB);
    addCommunityEdges(networkData.communityC);

    // Connect core nodes to everything
    networkData.core.forEach(coreNode => {
      [...networkData.communityA, ...networkData.communityB, ...networkData.communityC].forEach(node => {
        if (Math.random() > 0.3) { // 70% chance
          graph.addEdge(coreNode, node, {
            color: '#e74c3c',
            size: 2
          });
        }
      });
    });

    // Connect communities through bridges
    graph.addEdge('Bridge1', 'A1', { color: '#9b59b6', size: 2 });
    graph.addEdge('Bridge1', 'B1', { color: '#9b59b6', size: 2 });
    graph.addEdge('Bridge2', 'B2', { color: '#9b59b6', size: 2 });
    graph.addEdge('Bridge2', 'C1', { color: '#9b59b6', size: 2 });

    // Calculate centralities
    const centralities = calculateCentralities(graph, analysisType);

    // Update node sizes and colors based on centrality
    const maxCentrality = Math.max(...Object.values(centralities));
    graph.forEachNode((nodeId, _) => {
      const centrality = centralities[nodeId];
      const normalizedCentrality = maxCentrality > 0 ? centrality / maxCentrality : 0;
      
      graph.setNodeAttribute(nodeId, 'size', 8 + normalizedCentrality * 20);
      
      // Highlight selected node
      if (selectedNode === nodeId) {
        graph.setNodeAttribute(nodeId, 'color', '#ff4757');
        graph.setNodeAttribute(nodeId, 'size', (8 + normalizedCentrality * 20) * 1.2);
      }
    });

    // Apply layout
    circular.assign(graph);

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      renderEdgeLabels: false,
      defaultNodeColor: '#666',
      defaultEdgeColor: '#bdc3c7',
      labelRenderedSizeThreshold: 0,
      labelSize: 10,
    });

    // Calculate and report metrics
    const nodeCount = graph.order;
    const edgeCount = graph.size;
    const density = nodeCount > 1 ? (2 * edgeCount) / (nodeCount * (nodeCount - 1)) : 0;
    const totalDegree = graph.nodes().reduce((sum, nodeId) => sum + graph.degree(nodeId), 0);
    const averageDegree = nodeCount > 0 ? totalDegree / nodeCount : 0;

    // Simple clustering coefficient
    let totalClustering = 0;
    graph.forEachNode((nodeId) => {
      const neighbors = graph.neighbors(nodeId);
      const degree = neighbors.length;
      
      if (degree < 2) return;
      
      let edgesBetweenNeighbors = 0;
      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          if (graph.hasEdge(neighbors[i], neighbors[j])) {
            edgesBetweenNeighbors++;
          }
        }
      }
      
      const possibleEdges = (degree * (degree - 1)) / 2;
      const clustering = possibleEdges > 0 ? edgesBetweenNeighbors / possibleEdges : 0;
      totalClustering += clustering;
    });

    const clustering = nodeCount > 0 ? totalClustering / nodeCount : 0;

    onMetricsCalculated({
      nodeCount,
      edgeCount,
      density,
      averageDegree,
      clustering,
      centralities
    });

  }, [loadGraph, setSettings, analysisType, selectedNode, onMetricsCalculated]);

  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        onNodeSelect(event.node);
      },
      clickStage: () => {
        onNodeSelect(null);
      }
    });
  }, [registerEvents, onNodeSelect]);

  return null;
};

const NetworkAnalysisExample: React.FC = () => {
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [analysisType, setAnalysisType] = useState('degree');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <AnalysisGraph 
          analysisType={analysisType}
          onMetricsCalculated={setMetrics}
          selectedNode={selectedNode}
          onNodeSelect={setSelectedNode}
        />
      </SigmaContainer>
      
      <MetricsPanel 
        metrics={metrics}
        selectedNode={selectedNode}
        onAnalysisTypeChange={setAnalysisType}
        analysisType={analysisType}
      />

      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'rgba(255,255,255,0.95)',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        maxWidth: '320px'
      }}>
        <strong>Network Analysis Features:</strong><br />
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          • Multiple centrality measures<br />
          • Real-time metric calculations<br />
          • Interactive node selection<br />
          • Community structure visualization<br />
          <em>Click nodes to analyze their importance!</em>
        </span>
      </div>
    </div>
  );
};

export default NetworkAnalysisExample;