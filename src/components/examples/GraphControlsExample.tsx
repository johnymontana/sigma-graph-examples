import React, { useEffect, useState } from 'react';
import {
  SigmaContainer,
  useLoadGraph,
  useSetSettings,
  useRegisterEvents,
  useSigma,
  ControlsContainer,
  FullScreenControl,
  ZoomControl
} from '@react-sigma/core';

import Graph from 'graphology';
import { random } from 'graphology-layout';

const GraphControlsGraph: React.FC = () => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const graph = new Graph();
    
    // Create a diverse network with different node types and relationships
    const nodes = [
      // Central hub nodes
      { id: 'hub1', label: 'Main Hub', type: 'hub', color: '#e74c3c', size: 25, x: 0, y: 0 },
      { id: 'hub2', label: 'Secondary Hub', type: 'hub', color: '#e74c3c', size: 22, x: 3, y: 2 },
      
      // Cluster A - Technology
      { id: 'tech1', label: 'React', type: 'technology', color: '#3498db', size: 18, x: -2, y: -1 },
      { id: 'tech2', label: 'TypeScript', type: 'technology', color: '#3498db', size: 16, x: -2.5, y: -0.5 },
      { id: 'tech3', label: 'Node.js', type: 'technology', color: '#3498db', size: 17, x: -1.5, y: -1.5 },
      { id: 'tech4', label: 'GraphQL', type: 'technology', color: '#3498db', size: 15, x: -3, y: 0.5 },
      
      // Cluster B - Data Science
      { id: 'data1', label: 'Python', type: 'data', color: '#2ecc71', size: 19, x: 2, y: -1 },
      { id: 'data2', label: 'Pandas', type: 'data', color: '#2ecc71', size: 16, x: 2.5, y: -0.5 },
      { id: 'data3', label: 'NumPy', type: 'data', color: '#2ecc71', size: 17, x: 1.5, y: -1.5 },
      { id: 'data4', label: 'Scikit-learn', type: 'data', color: '#2ecc71', size: 15, x: 3.5, y: 0.5 },
      
      // Cluster C - Design
      { id: 'design1', label: 'Figma', type: 'design', color: '#f39c12', size: 18, x: 0, y: 2 },
      { id: 'design2', label: 'Sketch', type: 'design', color: '#f39c12', size: 16, x: -0.5, y: 2.5 },
      { id: 'design3', label: 'Adobe XD', type: 'design', color: '#f39c12', size: 17, x: 0.5, y: 2.5 },
      { id: 'design4', label: 'InVision', type: 'design', color: '#f39c12', size: 15, x: 1, y: 3 },
      
      // Bridge nodes
      { id: 'bridge1', label: 'Full-Stack', type: 'bridge', color: '#9b59b6', size: 20, x: -1, y: 1 },
      { id: 'bridge2', label: 'DevOps', type: 'bridge', color: '#9b59b6', size: 19, x: 1, y: 1 },
      { id: 'bridge3', label: 'Product Manager', type: 'bridge', color: '#9b59b6', size: 18, x: 0, y: 3.5 },
      
      // Outlier nodes
      { id: 'outlier1', label: 'Blockchain', type: 'outlier', color: '#e67e22', size: 14, x: -4, y: 2 },
      { id: 'outlier2', label: 'AI/ML', type: 'outlier', color: '#e67e22', size: 16, x: 4, y: 3 },
      { id: 'outlier3', label: 'IoT', type: 'outlier', color: '#e67e22', size: 13, x: -3, y: 3.5 }
    ];

    nodes.forEach(node => {
      graph.addNode(node.id, {
        label: node.label,
        size: node.size,
        color: node.color,
        nodeType: node.type, // Store type as custom attribute instead
        x: node.x + (Math.random() - 0.5) * 0.3,
        y: node.y + (Math.random() - 0.5) * 0.3,
        highlighted: false,
        hovered: false
      });
    });

    // Add edges to create meaningful relationships
    const edges = [
      // Hub connections
      ['hub1', 'hub2'], ['hub1', 'tech1'], ['hub1', 'data1'], ['hub1', 'design1'],
      ['hub2', 'tech4'], ['hub2', 'data4'], ['hub2', 'design4'],
      
      // Technology cluster connections
      ['tech1', 'tech2'], ['tech2', 'tech3'], ['tech3', 'tech4'], ['tech4', 'tech1'],
      ['tech1', 'tech3'], ['tech2', 'tech4'],
      
      // Data science cluster connections
      ['data1', 'data2'], ['data2', 'data3'], ['data3', 'data4'], ['data4', 'data1'],
      ['data1', 'data3'], ['data2', 'data4'],
      
      // Design cluster connections
      ['design1', 'design2'], ['design2', 'design3'], ['design3', 'design4'], ['design4', 'design1'],
      ['design1', 'design3'], ['design2', 'design4'],
      
      // Bridge connections
      ['bridge1', 'tech1'], ['bridge1', 'data1'], ['bridge1', 'design1'],
      ['bridge2', 'tech3'], ['bridge2', 'data3'], ['bridge2', 'design3'],
      ['bridge3', 'hub1'], ['bridge3', 'hub2'], ['bridge3', 'design1'],
      
      // Outlier connections
      ['outlier1', 'tech4'], ['outlier1', 'bridge1'],
      ['outlier2', 'data4'], ['outlier2', 'bridge2'],
      ['outlier3', 'tech3'], ['outlier3', 'data3']
    ];

    edges.forEach(([source, target]) => {
      graph.addEdge(source, target, {
        color: '#999',
        size: 1.5,
        highlighted: false
      });
    });
    
    // Apply random layout for initial positioning
    random.assign(graph);
    
    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      labelSize: 10,
      labelWeight: 'bold',
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#999',
      nodeReducer: (_, attrs) => ({
        ...attrs,
        size: attrs.highlighted ? attrs.size * 1.4 : attrs.size,
        borderColor: attrs.hovered ? '#00ff00' : undefined,
        borderSize: attrs.hovered ? 2 : 0,
        color: attrs.highlighted ? '#ffff00' : attrs.color
      }),
      edgeReducer: (_, attrs) => ({
        ...attrs,
        color: attrs.highlighted ? '#ff0000' : '#999',
        size: attrs.highlighted ? 3 : 1.5
      })
    });
  }, [loadGraph, setSettings]);

  // Handle hover events
  useEffect(() => {
    registerEvents({
      enterNode: (e) => {
        const node = e.node;
        setHoveredNode(node);
        
        const graph = sigma.getGraph();
        graph.setNodeAttribute(node, 'hovered', true);
        
        // Highlight connected edges and nodes on hover
        graph.forEachEdge((edge) => {
          const source = graph.source(edge);
          const target = graph.target(edge);
          
          if (source === node || target === node) {
            graph.setEdgeAttribute(edge, 'highlighted', true);
            
            // Highlight connected nodes
            const connectedNode = source === node ? target : source;
            graph.setNodeAttribute(connectedNode, 'highlighted', true);
          }
        });
      },
      
      leaveNode: () => {
        if (hoveredNode && sigma) {
          const graph = sigma.getGraph();
          
          // Clear hover highlighting
          graph.setNodeAttribute(hoveredNode, 'hovered', false);
          
          // Clear edge highlighting
          graph.forEachEdge((edge) => {
            graph.setEdgeAttribute(edge, 'highlighted', false);
          });
          
          // Clear ALL node highlighting
          graph.forEachNode((node) => {
            graph.setNodeAttribute(node, 'highlighted', false);
          });
          
          // Force a refresh of the renderer
          sigma.refresh();
        }
        
        setHoveredNode(null);
      },
      
      // Double-click to focus on node
      doubleClickNode: (e) => {
        const node = e.node;
        console.log('Double-clicked node:', node);
        // Simple logging for now
      }
    });

    return () => {
      setHoveredNode(null);
    };
  }, [registerEvents, sigma, hoveredNode]);

  return null;
};

const GraphControlsExample: React.FC = () => {
  return (
    <div style={{ height: '100%', width: '100%', minHeight: '600px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <GraphControlsGraph />
        
        {/* Control Container with zoom and fullscreen controls */}
        <ControlsContainer position="bottom-right">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            padding: '10px'
          }}>
            <ZoomControl 
              style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                padding: '8px',
                zIndex: 1000
              }}
            />
            <FullScreenControl 
              style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                padding: '8px',
                zIndex: 1000
              }}
            />
          </div>
        </ControlsContainer>
      </SigmaContainer>
      
      {/* Information Panel */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '350px',
        fontSize: '13px',
        lineHeight: '1.4'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
          Graph Controls & Interaction
        </h4>
        <div style={{ color: '#666' }}>
          <p><strong>Hover:</strong> Highlight nodes and their connections</p>
          <p><strong>Double-click:</strong> Focus camera on specific nodes</p>
          <p><strong>Zoom:</strong> Use mouse wheel or zoom controls</p>
          <p><strong>Fullscreen:</strong> Toggle fullscreen view</p>
          <p><strong>Colors:</strong> Green=hover, Yellow=highlighted, Red=connections</p>
        </div>
      </div>
    </div>
  );
};

export default GraphControlsExample;
