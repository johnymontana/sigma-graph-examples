import React, { useEffect, useState, useRef } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { random } from 'graphology-layout';

interface DataPoint {
  timestamp: number;
  nodes: { id: string; label: string; value: number; connections: string[] }[];
}

const DataControls: React.FC<{ 
  isPlaying: boolean,
  onPlayPause: () => void,
  onReset: () => void,
  speed: number,
  onSpeedChange: (speed: number) => void,
  currentStep: number,
  totalSteps: number
}> = ({ isPlaying, onPlayPause, onReset, speed, onSpeedChange, currentStep, totalSteps }) => {
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
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Live Data Simulation</h4>
      
      {/* Playback Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={onPlayPause}
          style={{
            padding: '8px 16px',
            backgroundColor: isPlaying ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        
        <button
          onClick={onReset}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
          <span>Progress</span>
          <span>{currentStep}/{totalSteps}</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(currentStep / totalSteps) * 100}%`,
            height: '100%',
            backgroundColor: '#007bff',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Speed Control */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
          Speed: {speed}x
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Stats */}
      <div style={{ 
        fontSize: '12px', 
        backgroundColor: '#f8f9fa', 
        padding: '8px', 
        borderRadius: '4px' 
      }}>
        <strong>Simulation Features:</strong>
        <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
          <li>Real-time node additions/removals</li>
          <li>Dynamic connection updates</li>
          <li>Value-based node sizing</li>
          <li>Automatic layout updates</li>
        </ul>
      </div>
    </div>
  );
};

const DynamicGraph: React.FC<{ currentData: DataPoint | null }> = ({ currentData }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    if (!currentData) return;

    const graph = new Graph();

    // Add nodes from current data
    currentData.nodes.forEach(node => {
      graph.addNode(node.id, {
        label: node.label,
        size: Math.max(8, node.value * 2), // Size based on value
        color: `hsl(${(node.value * 30) % 360}, 70%, 60%)`, // Color based on value
        value: node.value,
      });
    });

    // Add edges based on connections
    currentData.nodes.forEach(node => {
      node.connections.forEach(targetId => {
        if (graph.hasNode(targetId) && !graph.hasEdge(node.id, targetId)) {
          graph.addEdge(node.id, targetId, {
            color: '#ccc',
            size: Math.random() * 2 + 1,
          });
        }
      });
    });

    // Apply layout if we have nodes
    if (graph.order > 0) {
      random.assign(graph);
    }

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      renderEdgeLabels: false,
      defaultNodeColor: '#666',
      defaultEdgeColor: '#ccc',
      labelRenderedSizeThreshold: 0,
      labelSize: 11,
    });

  }, [loadGraph, setSettings, currentData]);

  return null;
};

const NetworkStats: React.FC<{ currentData: DataPoint | null }> = ({ currentData }) => {
  if (!currentData) return null;

  const nodeCount = currentData.nodes.length;
  const totalConnections = currentData.nodes.reduce((sum, node) => sum + node.connections.length, 0);
  const avgValue = currentData.nodes.reduce((sum, node) => sum + node.value, 0) / nodeCount;

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
      minWidth: '200px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Network Metrics</h4>
      
      <div style={{ fontSize: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Nodes:</span>
          <strong>{nodeCount}</strong>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Connections:</span>
          <strong>{totalConnections}</strong>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Avg Value:</span>
          <strong>{avgValue.toFixed(1)}</strong>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Timestamp:</span>
          <strong>{currentData.timestamp}</strong>
        </div>
      </div>

      <div style={{ 
        marginTop: '12px',
        padding: '8px',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        📈 <strong>Live Updates:</strong> Watch as nodes appear, disappear, and change values in real-time
      </div>
    </div>
  );
};

const DynamicDataExample: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [currentData, setCurrentData] = useState<DataPoint | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate sample time-series data
  const generateTimeSeriesData = (): DataPoint[] => {
    const data: DataPoint[] = [];
    const baseNodes = ['Server1', 'Server2', 'Database', 'API', 'Cache'];
    
    for (let i = 0; i < 20; i++) {
      const timestamp = Date.now() + i * 1000;
      const nodes: DataPoint['nodes'] = [];
      
      // Add base nodes with varying values
      baseNodes.forEach((nodeId, _) => {
        const shouldInclude = Math.random() > 0.1; // 90% chance to include
        if (shouldInclude) {
          nodes.push({
            id: nodeId,
            label: nodeId,
            value: Math.random() * 10 + 2, // Random value between 2-12
            connections: []
          });
        }
      });

      // Add some dynamic nodes
      const dynamicNodeCount = Math.floor(Math.random() * 5) + 2;
      for (let j = 0; j < dynamicNodeCount; j++) {
        const nodeId = `Client${j + 1}`;
        nodes.push({
          id: nodeId,
          label: nodeId,
          value: Math.random() * 8 + 1,
          connections: []
        });
      }

      // Create connections
      nodes.forEach(node => {
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        const availableTargets = nodes.filter(n => n.id !== node.id);
        
        for (let k = 0; k < Math.min(connectionCount, availableTargets.length); k++) {
          const target = availableTargets[Math.floor(Math.random() * availableTargets.length)];
          if (!node.connections.includes(target.id)) {
            node.connections.push(target.id);
          }
        }
      });

      data.push({ timestamp, nodes });
    }
    
    return data;
  };

  const timeSeriesData = useRef(generateTimeSeriesData());

  useEffect(() => {
    // Set initial data
    if (timeSeriesData.current.length > 0) {
      setCurrentData(timeSeriesData.current[0]);
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= timeSeriesData.current.length) {
            setIsPlaying(false);
            return prev;
          }
          setCurrentData(timeSeriesData.current[next]);
          return next;
        });
      }, 1000 / speed);
      
      intervalRef.current = interval;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    timeSeriesData.current = generateTimeSeriesData(); // Generate new data
    if (timeSeriesData.current.length > 0) {
      setCurrentData(timeSeriesData.current[0]);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <DynamicGraph currentData={currentData} />
      </SigmaContainer>
      
      <DataControls 
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStep}
        totalSteps={timeSeriesData.current.length}
      />

      <NetworkStats currentData={currentData} />

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
        maxWidth: '300px'
      }}>
        <strong>Server Network Simulation:</strong><br />
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          This example simulates a dynamic server network where nodes represent different services 
          and their connections change over time based on load and availability.
        </span>
      </div>
    </div>
  );
};

export default DynamicDataExample;