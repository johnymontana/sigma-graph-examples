import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useCamera } from '@react-sigma/core';
import Graph from 'graphology';

const CameraControls: React.FC = () => {
  const { zoomIn, zoomOut, reset, goto } = useCamera();
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    zoomIn({ duration: 300 });
    setZoomLevel(prev => prev * 1.5);
  };

  const handleZoomOut = () => {
    zoomOut({ duration: 300 });
    setZoomLevel(prev => prev / 1.5);
  };

  const handleReset = () => {
    reset({ duration: 500 });
    setZoomLevel(1);
  };

  const handleCenter = () => {
    goto({ x: 0, y: 0 }, { duration: 300 });
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 10,
      left: 10,
      background: 'white',
      padding: '15px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Camera Controls:</h4>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <button
          onClick={handleZoomIn}
          style={{
            padding: '6px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Zoom In
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            padding: '6px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Zoom Out
        </button>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <button
          onClick={handleCenter}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Center
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '6px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset View
        </button>
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        Zoom: {(1 / zoomLevel).toFixed(2)}x
      </div>
    </div>
  );
};

const ViewControls: React.FC<{ onSettingsChange: (settings: Record<string, unknown>) => void }> = ({ onSettingsChange }) => {
  const [showLabels, setShowLabels] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [nodeSize, setNodeSize] = useState(10);

  const handleLabelToggle = () => {
    const newShowLabels = !showLabels;
    setShowLabels(newShowLabels);
    onSettingsChange({ renderLabels: newShowLabels });
  };

  const handleEdgeToggle = () => {
    const newShowEdges = !showEdges;
    setShowEdges(newShowEdges);
    onSettingsChange({ hideEdgesOnMove: !newShowEdges });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setNodeSize(newSize);
    onSettingsChange({ minNodeSize: newSize / 2, maxNodeSize: newSize * 2 });
  };

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      background: 'white',
      padding: '15px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <h4 style={{ margin: '0 0 15px 0' }}>View Controls:</h4>
      
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showLabels}
            onChange={handleLabelToggle}
            style={{ marginRight: '8px' }}
          />
          Show Labels
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showEdges}
            onChange={handleEdgeToggle}
            style={{ marginRight: '8px' }}
          />
          Show Edges During Movement
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          Node Size: {nodeSize}
        </label>
        <input
          type="range"
          min="5"
          max="20"
          value={nodeSize}
          onChange={handleSizeChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Use mouse wheel to zoom<br />
        Click and drag to pan
      </div>
    </div>
  );
};

const ControlsGraph: React.FC<{ settingsOverride: Record<string, unknown> }> = ({ settingsOverride }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    const graph = new Graph();
    
    // Create a network with clusters
    const clusters = [
      { center: { x: -2, y: -1 }, color: '#ff6b6b', count: 8 },
      { center: { x: 2, y: -1 }, color: '#4ecdc4', count: 6 },
      { center: { x: 0, y: 2 }, color: '#45b7d1', count: 7 },
      { center: { x: -1, y: 0.5 }, color: '#f9ca24', count: 5 },
      { center: { x: 1.5, y: 1 }, color: '#a8e6cf', count: 6 }
    ];

    let nodeId = 0;
    clusters.forEach((cluster, clusterIndex) => {
      for (let i = 0; i < cluster.count; i++) {
        const angle = (i / cluster.count) * 2 * Math.PI;
        const radius = Math.random() * 0.8 + 0.3;
        graph.addNode(`node-${nodeId}`, {
          label: `Node ${nodeId}`,
          x: cluster.center.x + Math.cos(angle) * radius,
          y: cluster.center.y + Math.sin(angle) * radius,
          size: Math.random() * 8 + 7,
          color: cluster.color,
          cluster: clusterIndex
        });
        nodeId++;
      }
    });

    // Add edges within clusters and between clusters
    graph.forEachNode((node, attributes) => {
      graph.forEachNode((otherNode, otherAttributes) => {
        if (node !== otherNode && !graph.hasEdge(node, otherNode)) {
          const sameCluster = attributes.cluster === otherAttributes.cluster;
          const distance = Math.sqrt(
            Math.pow(attributes.x - otherAttributes.x, 2) +
            Math.pow(attributes.y - otherAttributes.y, 2)
          );
          
          const connectionProbability = sameCluster ? 0.4 : 0.1;
          if (distance < 1.5 && Math.random() < connectionProbability) {
            graph.addEdge(node, otherNode, {
              color: sameCluster ? '#666' : '#ccc',
              size: sameCluster ? 2 : 1
            });
          }
        }
      });
    });

    loadGraph(graph);
  }, [loadGraph]);

  useEffect(() => {
    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
      hideEdgesOnMove: false,
      ...settingsOverride
    });
  }, [setSettings, settingsOverride]);

  return null;
};

const ControlsExample: React.FC = () => {
  const [settingsOverride, setSettingsOverride] = useState<Record<string, unknown>>({});

  const handleSettingsChange = (newSettings: Record<string, unknown>) => {
    setSettingsOverride(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <ControlsGraph settingsOverride={settingsOverride} />
        <CameraControls />
      </SigmaContainer>
      <ViewControls onSettingsChange={handleSettingsChange} />
    </div>
  );
};

export default ControlsExample;