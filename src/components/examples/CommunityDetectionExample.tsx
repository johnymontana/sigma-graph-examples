import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents, useSigma } from '@react-sigma/core';
import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';

interface CommunityMetrics {
  count: number;
  modularity: number;
  deltaComputations: number;
  nodesVisited: number;
  moves: number[];
}

interface CommunityControlsProps {
  onDetectCommunities: () => void;
  onResetCommunities: () => void;
  onResolutionChange: (resolution: number) => void;
  resolution: number;
  metrics: CommunityMetrics | null;
  isProcessing: boolean;
}

const CommunityControls: React.FC<CommunityControlsProps> = ({
  onDetectCommunities,
  onResetCommunities,
  onResolutionChange,
  resolution,
  metrics,
  isProcessing
}) => {
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
      maxWidth: '320px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '18px' }}>
        Community Detection
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>
          Louvain Algorithm
        </h4>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
            Resolution: {resolution.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={resolution}
            onChange={(e) => onResolutionChange(parseFloat(e.target.value))}
            style={{ width: '100%' }}
            disabled={isProcessing}
          />
          <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
            Higher resolution → more communities
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onDetectCommunities}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: isProcessing ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: 'bold'
            }}
          >
            {isProcessing ? 'Processing...' : 'Detect Communities'}
          </button>
          
          <button
            onClick={onResetCommunities}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: 'bold'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {metrics && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '12px',
          lineHeight: '1.4'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '13px' }}>
            Algorithm Results
          </h4>
          <div style={{ color: '#666' }}>
            <div><strong>Communities Found:</strong> {metrics.count}</div>
            <div><strong>Modularity:</strong> {metrics.modularity.toFixed(4)}</div>
            <div><strong>Delta Computations:</strong> {metrics.deltaComputations.toLocaleString()}</div>
            <div><strong>Nodes Visited:</strong> {metrics.nodesVisited.toLocaleString()}</div>
            <div><strong>Total Moves:</strong> {metrics.moves.reduce((a, b) => a + b, 0).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const CommunityGraph: React.FC<{
  onMetricsUpdate: (metrics: CommunityMetrics | null) => void;
  resolution: number;
  shouldDetect: boolean;
  shouldReset: boolean;
  onDetectionComplete: () => void;
  onResetComplete: () => void;
}> = ({
  onMetricsUpdate,
  resolution,
  shouldDetect,
  shouldReset,
  onDetectionComplete,
  onResetComplete
}) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Generate a more complex network for community detection
  useEffect(() => {
    const graph = new Graph();
    
    // Create a network with clear community structure
    const communities = [
      { id: 'A', size: 8, center: { x: -3, y: -2 } },
      { id: 'B', size: 10, center: { x: 3, y: -2 } },
      { id: 'C', size: 7, center: { x: -3, y: 2 } },
      { id: 'D', size: 9, center: { x: 3, y: 2 } },
      { id: 'E', size: 6, center: { x: 0, y: 0 } }
    ];

    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'
    ];

    // Add nodes for each community
    communities.forEach((community, commIndex) => {
      for (let i = 0; i < community.size; i++) {
        const nodeId = `${community.id}${i + 1}`;
        const angle = (i / community.size) * 2 * Math.PI;
        const radius = 0.8 + Math.random() * 0.4;
        
        graph.addNode(nodeId, {
          label: nodeId,
          size: 8 + Math.random() * 6,
          color: colors[commIndex],
          originalColor: colors[commIndex],
          x: community.center.x + Math.cos(angle) * radius,
          y: community.center.y + Math.sin(angle) * radius,
          community: community.id
        });
      }
    });

    // Add dense intra-community connections
    communities.forEach(community => {
      const nodes = Array.from({ length: community.size }, (_, i) => `${community.id}${i + 1}`);
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          // High probability of intra-community edges
          if (Math.random() > 0.3) {
            graph.addEdge(nodes[i], nodes[j], {
              color: '#666',
              size: 1.5,
              type: 'line'
            });
          }
        }
      }
    });

    // Add sparse inter-community connections
    const allNodes = graph.nodes();
    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        const node1 = allNodes[i];
        const node2 = allNodes[j];
        const comm1 = graph.getNodeAttribute(node1, 'community');
        const comm2 = graph.getNodeAttribute(node2, 'community');
        
        // Low probability of inter-community edges
        if (comm1 !== comm2 && Math.random() > 0.92 && !graph.hasEdge(node1, node2)) {
          graph.addEdge(node1, node2, {
            color: '#ccc',
            size: 0.8,
            type: 'line'
          });
        }
      }
    }

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      labelSize: 10,
      labelWeight: 'bold',
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
      nodeReducer: (node, attrs) => ({
        ...attrs,
        size: selectedNode === node ? attrs.size * 1.3 : attrs.size,
        borderColor: selectedNode === node ? '#000' : undefined,
        borderSize: selectedNode === node ? 2 : 0
      })
    });
  }, [loadGraph, setSettings, selectedNode]);

  // Handle community detection
  useEffect(() => {
    if (shouldDetect && sigma) {
      const graph = sigma.getGraph();
      if (graph) {
        try {
          // Run Louvain algorithm with detailed output
          const detailed = louvain.detailed(graph, {
            resolution,
            nodeCommunityAttribute: 'detectedCommunity'
          });

          console.log('Louvain detailed result:', detailed);
          console.log('Communities object:', detailed.communities);

          // Color nodes by detected communities and update labels
          const communityColors = [
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
            '#e67e22', '#1abc9c', '#34495e', '#f1c40f', '#8e44ad',
            '#95a5a6', '#d35400', '#27ae60', '#2980b9', '#c0392b'
          ];

          // Create community labels for better identification
          const communityLabels = [
            'Community A', 'Community B', 'Community C', 'Community D', 'Community E',
            'Community F', 'Community G', 'Community H', 'Community I', 'Community J',
            'Community K', 'Community L', 'Community M', 'Community N', 'Community O'
          ];

          // Use the communities object from the detailed result
          const communities = detailed.communities;
          
          graph.forEachNode((node: string) => {
            // Get community from the communities object instead of node attribute
            const community = communities[node];
            
            // Debug log to see what community value we're getting
            console.log(`Node ${node}: community = ${community}, type = ${typeof community}`);
            
            if (community !== undefined && community !== null) {
              const colorIndex = community % communityColors.length;
              
              // Update node color
              graph.setNodeAttribute(node, 'color', communityColors[colorIndex]);
              
              // Update node label to show community membership
              const originalLabel = graph.getNodeAttribute(node, 'label').split(' (')[0]; // Remove any existing community suffix
              const communityLabel = communityLabels[colorIndex];
              graph.setNodeAttribute(node, 'label', `${originalLabel} (${communityLabel})`);
              
              // Store the community information as node attributes
              graph.setNodeAttribute(node, 'detectedCommunity', community);
              graph.setNodeAttribute(node, 'communityLabel', communityLabel);
            } else {
              console.warn(`Node ${node} has undefined community`);
              
              // Fallback: keep original color and label
              const originalLabel = graph.getNodeAttribute(node, 'label').split(' (')[0];
              graph.setNodeAttribute(node, 'label', `${originalLabel} (undefined)`);
            }
          });

          // Update metrics
          onMetricsUpdate({
            count: detailed.count,
            modularity: detailed.modularity,
            deltaComputations: detailed.deltaComputations,
            nodesVisited: detailed.nodesVisited,
            moves: Array.isArray(detailed.moves[0]) 
              ? (detailed.moves as number[][]).map(level => level.reduce((a, b) => a + b, 0))
              : detailed.moves as number[]
          });

        } catch (error) {
          console.error('Error running community detection:', error);
          onMetricsUpdate(null);
        }
      }
      onDetectionComplete();
    }
  }, [shouldDetect, resolution, sigma, onMetricsUpdate, onDetectionComplete]);

  // Handle reset
  useEffect(() => {
    if (shouldReset && sigma) {
      const graph = sigma.getGraph();
      if (graph) {
        // Restore original colors and labels
        graph.forEachNode((node: string) => {
          const originalColor = graph.getNodeAttribute(node, 'originalColor');
          const originalLabel = graph.getNodeAttribute(node, 'label').split(' (')[0]; // Remove community suffix
          
          graph.setNodeAttribute(node, 'color', originalColor);
          graph.setNodeAttribute(node, 'label', originalLabel);
          graph.removeNodeAttribute(node, 'detectedCommunity');
          graph.removeNodeAttribute(node, 'communityLabel');
        });
        
        onMetricsUpdate(null);
      }
      onResetComplete();
    }
  }, [shouldReset, sigma, onMetricsUpdate, onResetComplete]);

  // Handle node selection
  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        setSelectedNode(selectedNode === event.node ? null : event.node);
      },
      clickStage: () => setSelectedNode(null)
    });
  }, [registerEvents, selectedNode]);

  return null;
};

const CommunityDetectionExample: React.FC = () => {
  const [metrics, setMetrics] = useState<CommunityMetrics | null>(null);
  const [resolution, setResolution] = useState(1.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldDetect, setShouldDetect] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);

  const handleDetectCommunities = () => {
    setIsProcessing(true);
    setShouldDetect(true);
  };

  const handleResetCommunities = () => {
    setIsProcessing(true);
    setShouldReset(true);
  };

  const handleDetectionComplete = () => {
    setIsProcessing(false);
    setShouldDetect(false);
  };

  const handleResetComplete = () => {
    setIsProcessing(false);
    setShouldReset(false);
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '600px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <CommunityGraph
          onMetricsUpdate={setMetrics}
          resolution={resolution}
          shouldDetect={shouldDetect}
          shouldReset={shouldReset}
          onDetectionComplete={handleDetectionComplete}
          onResetComplete={handleResetComplete}
        />
      </SigmaContainer>
      
      <CommunityControls
        onDetectCommunities={handleDetectCommunities}
        onResetCommunities={handleResetCommunities}
        onResolutionChange={setResolution}
        resolution={resolution}
        metrics={metrics}
        isProcessing={isProcessing}
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
          Louvain Community Detection
        </h4>
        <div style={{ color: '#666' }}>
          <p><strong>Algorithm:</strong> Fast community detection based on modularity optimization</p>
          <p><strong>Features:</strong> Works with directed/undirected graphs, adjustable resolution parameter</p>
          <p><strong>Usage:</strong> Adjust resolution and click "Detect Communities" to see the algorithm identify community structures</p>
          <p><strong>Visualization:</strong> Each detected community gets a unique color and descriptive label</p>
          <p><strong>Labels:</strong> Node labels update to show community membership (e.g., "A1 (Community A)")</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetectionExample;
