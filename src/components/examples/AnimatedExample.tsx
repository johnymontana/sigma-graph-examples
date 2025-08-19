import React, { useEffect, useState, useRef } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useCamera } from '@react-sigma/core';
import Graph from 'graphology';
import { circular, random } from 'graphology-layout';

interface AnimationState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  animationType: 'growth' | 'layout' | 'morphing' | 'filtering';
  speed: number;
}

const AnimationControls: React.FC<{
  animationState: AnimationState,
  onPlayPause: () => void,
  onReset: () => void,
  onSpeedChange: (speed: number) => void,
  onAnimationTypeChange: (type: AnimationState['animationType']) => void
}> = ({ animationState, onPlayPause, onReset, onSpeedChange, onAnimationTypeChange }) => {
  const animationTypes = [
    { id: 'growth', name: '🌱 Network Growth', description: 'Watch nodes and edges appear over time' },
    { id: 'layout', name: '🔄 Layout Transitions', description: 'Smooth transitions between layouts' },
    { id: 'morphing', name: '🔮 Graph Morphing', description: 'Transform one graph structure into another' },
    { id: 'filtering', name: '🔍 Dynamic Filtering', description: 'Show/hide nodes based on properties' }
  ];

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
      minWidth: '320px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Graph Animations</h4>

      {/* Animation Type Selection */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
          Animation Type:
        </label>
        <select
          value={animationState.animationType}
          onChange={(e) => onAnimationTypeChange(e.target.value as AnimationState['animationType'])}
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '13px'
          }}
        >
          {animationTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px', fontStyle: 'italic' }}>
          {animationTypes.find(t => t.id === animationState.animationType)?.description}
        </div>
      </div>

      {/* Playback Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <button
          onClick={onPlayPause}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: animationState.isPlaying ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {animationState.isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        
        <button
          onClick={onReset}
          style={{
            padding: '10px 16px',
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
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
          <span>Progress</span>
          <span>{animationState.currentStep}/{animationState.totalSteps}</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(animationState.currentStep / animationState.totalSteps) * 100}%`,
            height: '100%',
            backgroundColor: '#007bff',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Speed Control */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
          Speed: {animationState.speed}x
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={animationState.speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Current Animation Info */}
      <div style={{
        padding: '10px',
        backgroundColor: '#e8f4fd',
        borderRadius: '6px',
        fontSize: '12px',
        border: '1px solid #bee5eb'
      }}>
        <strong>Currently Playing:</strong><br />
        {animationTypes.find(t => t.id === animationState.animationType)?.name}
      </div>
    </div>
  );
};

const AnimatedGraph: React.FC<{ 
  animationState: AnimationState,
  onStepUpdate: (step: number) => void 
}> = ({ animationState, onStepUpdate }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const { goto } = useCamera();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animation step logic
  useEffect(() => {
    if (animationState.isPlaying) {
      const interval = setInterval(() => {
        onStepUpdate(animationState.currentStep + 1);
      }, 1000 / animationState.speed);
      
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
  }, [animationState.isPlaying, animationState.speed, animationState.currentStep, onStepUpdate]);

  // Graph generation based on animation type and current step
  useEffect(() => {
    const graph = new Graph();
    const step = animationState.currentStep;
    const totalSteps = animationState.totalSteps;
    const progress = totalSteps > 0 ? step / totalSteps : 0;

    switch (animationState.animationType) {
      case 'growth':
        createGrowthAnimation(graph, step);
        break;
      case 'layout':
        createLayoutAnimation(graph, progress);
        break;
      case 'morphing':
        createMorphingAnimation(graph, progress);
        break;
      case 'filtering':
        createFilteringAnimation(graph, progress);
        break;
    }

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      renderEdgeLabels: false,
      defaultNodeColor: '#3498db',
      defaultEdgeColor: '#bdc3c7',
      labelRenderedSizeThreshold: 8,
      labelSize: 10,
    });

  }, [loadGraph, setSettings, animationState.currentStep, animationState.animationType, animationState.totalSteps]);

  return null;
};

// Animation creation functions
const createGrowthAnimation = (graph: Graph, step: number) => {
  const maxNodes = 20;
  const maxEdges = 35;
  
  // Add nodes progressively
  const nodesToAdd = Math.min(maxNodes, Math.floor(step * 0.8));
  for (let i = 0; i < nodesToAdd; i++) {
    const nodeId = `node_${i}`;
    graph.addNode(nodeId, {
      label: nodeId,
      size: 8 + Math.random() * 6,
      color: `hsl(${(i * 25) % 360}, 70%, 60%)`,
    });
  }

  // Add edges progressively (but slower than nodes)
  const edgesToAdd = Math.min(maxEdges, Math.floor((step - 5) * 0.6));
  let edgeCount = 0;
  for (let i = 0; i < nodesToAdd && edgeCount < edgesToAdd; i++) {
    for (let j = i + 1; j < nodesToAdd && edgeCount < edgesToAdd; j++) {
      if (Math.random() > 0.7) {
        graph.addEdge(`node_${i}`, `node_${j}`, {
          color: '#95a5a6',
          size: 1 + Math.random()
        });
        edgeCount++;
      }
    }
  }

  if (graph.order > 0) {
    random.assign(graph);
  }
};

const createLayoutAnimation = (graph: Graph, progress: number) => {
  // Create a fixed set of nodes
  for (let i = 0; i < 12; i++) {
    graph.addNode(`node_${i}`, {
      label: `N${i}`,
      size: 10,
      color: '#e74c3c',
    });
  }

  // Add edges in a ring + some random connections
  for (let i = 0; i < 12; i++) {
    graph.addEdge(`node_${i}`, `node_${(i + 1) % 12}`, {
      color: '#95a5a6',
      size: 1.5
    });
  }

  // Add some cross connections
  graph.addEdge('node_0', 'node_6', { color: '#95a5a6', size: 1.5 });
  graph.addEdge('node_3', 'node_9', { color: '#95a5a6', size: 1.5 });
  graph.addEdge('node_2', 'node_8', { color: '#95a5a6', size: 1.5 });

  // Interpolate between circular and random layouts
  const circularPositions: { [key: string]: { x: number, y: number } } = {};
  const randomPositions: { [key: string]: { x: number, y: number } } = {};

  // Generate circular positions
  graph.forEachNode((nodeId, _, index) => {
    const angle = index * 2 * Math.PI / 12;
    circularPositions[nodeId] = {
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2
    };
  });

  // Generate random positions
  graph.forEachNode((nodeId) => {
    randomPositions[nodeId] = {
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4
    };
  });

  // Interpolate positions based on progress
  graph.forEachNode((nodeId) => {
    const circular = circularPositions[nodeId];
    const randomPos = randomPositions[nodeId];
    
    // Use sine wave for smooth back-and-forth transition
    const t = (Math.sin(progress * Math.PI * 2) + 1) / 2;
    
    graph.setNodeAttribute(nodeId, 'x', circular.x + (randomPos.x - circular.x) * t);
    graph.setNodeAttribute(nodeId, 'y', circular.y + (randomPos.y - circular.y) * t);
  });
};

const createMorphingAnimation = (graph: Graph, progress: number) => {
  // Morph from star network to clustered network
  const nodeCount = 15;
  
  for (let i = 0; i < nodeCount; i++) {
    const nodeId = `node_${i}`;
    graph.addNode(nodeId, {
      label: nodeId === 'node_0' ? 'Hub' : `N${i}`,
      size: nodeId === 'node_0' ? 12 : 8,
      color: nodeId === 'node_0' ? '#e74c3c' : '#3498db',
    });
  }

  // Star network edges (always present)
  for (let i = 1; i < nodeCount; i++) {
    const edgeOpacity = 1 - progress; // Fade out star edges
    graph.addEdge('node_0', `node_${i}`, {
      color: `rgba(149, 165, 166, ${edgeOpacity})`,
      size: 1 + edgeOpacity
    });
  }

  // Cluster edges (fade in)
  const clusters = [
    [1, 2, 3, 4], // First cluster
    [5, 6, 7, 8, 9], // Second cluster
    [10, 11, 12, 13, 14] // Third cluster
  ];

  clusters.forEach(cluster => {
    for (let i = 0; i < cluster.length; i++) {
      for (let j = i + 1; j < cluster.length; j++) {
        if (Math.random() > 0.6) {
          const edgeOpacity = progress; // Fade in cluster edges
          graph.addEdge(`node_${cluster[i]}`, `node_${cluster[j]}`, {
            color: `rgba(52, 152, 219, ${edgeOpacity})`,
            size: edgeOpacity * 1.5
          });
        }
      }
    }
  });

  // Position nodes: interpolate from star to clustered layout
  graph.forEachNode((nodeId, _, index) => {
    if (nodeId === 'node_0') {
      // Hub stays in center
      graph.setNodeAttribute(nodeId, 'x', 0);
      graph.setNodeAttribute(nodeId, 'y', 0);
    } else {
      // Star position
      const angle = (index - 1) * 2 * Math.PI / (nodeCount - 1);
      const starX = Math.cos(angle) * 2.5;
      const starY = Math.sin(angle) * 2.5;

      // Cluster position
      let clusterX = 0, clusterY = 0;
      clusters.forEach((cluster, clusterIndex) => {
        if (cluster.includes(index)) {
          const clusterAngle = clusterIndex * 2 * Math.PI / 3;
          const nodeInCluster = cluster.indexOf(index);
          const subAngle = nodeInCluster * 2 * Math.PI / cluster.length;
          
          clusterX = Math.cos(clusterAngle) * 3 + Math.cos(subAngle) * 0.8;
          clusterY = Math.sin(clusterAngle) * 3 + Math.sin(subAngle) * 0.8;
        }
      });

      // Interpolate positions
      graph.setNodeAttribute(nodeId, 'x', starX + (clusterX - starX) * progress);
      graph.setNodeAttribute(nodeId, 'y', starY + (clusterY - starY) * progress);
    }
  });
};

const createFilteringAnimation = (graph: Graph, progress: number) => {
  const nodeTypes = ['important', 'medium', 'low'];
  const colors = ['#e74c3c', '#f39c12', '#95a5a6'];
  
  // Create nodes with different importance levels
  for (let i = 0; i < 20; i++) {
    const typeIndex = Math.floor(Math.random() * 3);
    const nodeType = nodeTypes[typeIndex];
    const importance = 1 - (typeIndex / 3); // important=1, medium=0.66, low=0.33
    
    // Filter based on progress: show high importance first
    const showThreshold = 1 - progress;
    const shouldShow = importance >= showThreshold;
    
    if (shouldShow) {
      graph.addNode(`node_${i}`, {
        label: `${nodeType.toUpperCase()}_${i}`,
        size: 6 + importance * 8,
        color: colors[typeIndex],
        importance,
        type: nodeType
      });
    }
  }

  // Add edges between visible nodes
  const visibleNodes = graph.nodes();
  for (let i = 0; i < visibleNodes.length; i++) {
    for (let j = i + 1; j < visibleNodes.length; j++) {
      if (Math.random() > 0.7) {
        const node1 = graph.getNodeAttributes(visibleNodes[i]);
        const node2 = graph.getNodeAttributes(visibleNodes[j]);
        const avgImportance = (node1.importance + node2.importance) / 2;
        
        graph.addEdge(visibleNodes[i], visibleNodes[j], {
          color: `rgba(149, 165, 166, ${avgImportance})`,
          size: avgImportance * 2
        });
      }
    }
  }

  if (graph.order > 0) {
    random.assign(graph);
  }
};

const AnimatedExample: React.FC = () => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isPlaying: false,
    currentStep: 0,
    totalSteps: 50,
    animationType: 'growth',
    speed: 1
  });

  const handlePlayPause = () => {
    setAnimationState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleReset = () => {
    setAnimationState(prev => ({
      ...prev,
      isPlaying: false,
      currentStep: 0
    }));
  };

  const handleSpeedChange = (speed: number) => {
    setAnimationState(prev => ({ ...prev, speed }));
  };

  const handleAnimationTypeChange = (animationType: AnimationState['animationType']) => {
    setAnimationState(prev => ({
      ...prev,
      animationType,
      currentStep: 0,
      isPlaying: false
    }));
  };

  const handleStepUpdate = (step: number) => {
    setAnimationState(prev => {
      if (step >= prev.totalSteps) {
        return { ...prev, currentStep: prev.totalSteps, isPlaying: false };
      }
      return { ...prev, currentStep: step };
    });
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <AnimatedGraph 
          animationState={animationState}
          onStepUpdate={handleStepUpdate}
        />
      </SigmaContainer>
      
      <AnimationControls
        animationState={animationState}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        onSpeedChange={handleSpeedChange}
        onAnimationTypeChange={handleAnimationTypeChange}
      />

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
        maxWidth: '300px'
      }}>
        <strong>Dynamic Graph Animations:</strong><br />
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          Explore how networks evolve over time through various animation patterns 
          including growth, layout transitions, morphing, and dynamic filtering.
        </span>
      </div>
    </div>
  );
};

export default AnimatedExample;