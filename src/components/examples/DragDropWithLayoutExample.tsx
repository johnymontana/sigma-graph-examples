import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents, useSigma } from '@react-sigma/core';
import { useWorkerLayoutForce } from '@react-sigma/layout-force';
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import { useWorkerLayoutNoverlap } from '@react-sigma/layout-noverlap';
import Graph from 'graphology';

interface DragLayoutControlsProps {
  layout: string;
  onLayoutChange: (layout: string) => void;
  isLayoutRunning: boolean;
  onToggleLayout: () => void;
  dragMode: boolean;
  onToggleDragMode: () => void;
  draggedNode: string | null;
  dragLockMode: 'none' | 'fixed' | 'pinned';
  onDragLockModeChange: (mode: 'none' | 'fixed' | 'pinned') => void;
}

const DragLayoutControls: React.FC<DragLayoutControlsProps> = ({
  layout,
  onLayoutChange,
  isLayoutRunning,
  onToggleLayout,
  dragMode,
  onToggleDragMode,
  draggedNode,
  dragLockMode,
  onDragLockModeChange
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
        Drag & Drop + Layouts
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>
          Layout Algorithm
        </h4>
        <select
          value={layout}
          onChange={(e) => onLayoutChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        >
          <option value="none">No Layout</option>
          <option value="force">Force Layout</option>
          <option value="forceatlas2">ForceAtlas2</option>
          <option value="noverlap">Noverlap</option>
        </select>
        
        <button
          onClick={onToggleLayout}
          disabled={layout === 'none'}
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '10px',
            backgroundColor: layout === 'none' ? '#6c757d' : (isLayoutRunning ? '#dc3545' : '#28a745'),
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: layout === 'none' ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {isLayoutRunning ? 'Stop Layout' : 'Start Layout'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>
          Drag Mode
        </h4>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={dragMode}
              onChange={onToggleDragMode}
              style={{ marginRight: '8px' }}
            />
            Enable Dragging
          </label>
        </div>

        {dragMode && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
              Drag Lock Mode:
            </label>
            <select
              value={dragLockMode}
              onChange={(e) => onDragLockModeChange(e.target.value as 'none' | 'fixed' | 'pinned')}
              style={{
                width: '100%',
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '12px'
              }}
            >
              <option value="none">None (Free movement)</option>
              <option value="fixed">Fixed (Temporary lock)</option>
              <option value="pinned">Pinned (Permanent lock)</option>
            </select>
          </div>
        )}
      </div>

      {draggedNode && (
        <div style={{
          padding: '12px',
          backgroundColor: '#e3f2fd',
          borderRadius: '6px',
          fontSize: '12px',
          lineHeight: '1.4',
          marginBottom: '15px'
        }}>
          <div style={{ color: '#1976d2', fontWeight: 'bold' }}>
            Dragging: {draggedNode}
          </div>
          <div style={{ color: '#666', marginTop: '4px' }}>
            Mode: {dragLockMode}
          </div>
        </div>
      )}

      <div style={{
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '11px',
        lineHeight: '1.4'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '12px' }}>
          How It Works
        </h4>
        <div style={{ color: '#666' }}>
          <p><strong>Layout + Drag:</strong> Continuous layouts run while allowing manual node positioning</p>
          <p><strong>Lock Modes:</strong> Control how dragged nodes interact with layout forces</p>
          <p><strong>None:</strong> Nodes can be freely moved but layouts will continue to affect them</p>
          <p><strong>Fixed:</strong> Temporarily locks position during drag, releases after</p>
          <p><strong>Pinned:</strong> Permanently excludes nodes from layout calculations</p>
        </div>
      </div>
    </div>
  );
};

const DragLayoutGraph: React.FC<{
  layout: string;
  isLayoutRunning: boolean;
  dragMode: boolean;
  draggedNode: string | null;
  setDraggedNode: (node: string | null) => void;
  dragLockMode: 'none' | 'fixed' | 'pinned';
}> = ({
  layout,
  isLayoutRunning,
  dragMode,
  draggedNode,
  setDraggedNode,
  dragLockMode
}) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();

  // Layout workers
  const forceLayout = useWorkerLayoutForce();
  const forceAtlas2Layout = useWorkerLayoutForceAtlas2();
  const noverlapLayout = useWorkerLayoutNoverlap();

  useEffect(() => {
    const graph = new Graph();
    
    // Create a larger network for better layout demonstration
    const nodes = [
      { id: 'central', label: 'Central Hub', color: '#e74c3c', size: 25, x: 0, y: 0 },
      { id: 'cluster1-1', label: 'C1-1', color: '#3498db', size: 15, x: -2, y: -1 },
      { id: 'cluster1-2', label: 'C1-2', color: '#3498db', size: 15, x: -2.5, y: -0.5 },
      { id: 'cluster1-3', label: 'C1-3', color: '#3498db', size: 15, x: -1.5, y: -1.5 },
      { id: 'cluster2-1', label: 'C2-1', color: '#2ecc71', size: 15, x: 2, y: -1 },
      { id: 'cluster2-2', label: 'C2-2', color: '#2ecc71', size: 15, x: 2.5, y: -0.5 },
      { id: 'cluster2-3', label: 'C2-3', color: '#2ecc71', size: 15, x: 1.5, y: -1.5 },
      { id: 'cluster3-1', label: 'C3-1', color: '#f39c12', size: 15, x: 0, y: 2 },
      { id: 'cluster3-2', label: 'C3-2', color: '#f39c12', size: 15, x: -0.5, y: 2.5 },
      { id: 'cluster3-3', label: 'C3-3', color: '#f39c12', size: 15, x: 0.5, y: 2.5 },
      { id: 'outlier1', label: 'Outlier 1', color: '#9b59b6', size: 12, x: -3, y: 2 },
      { id: 'outlier2', label: 'Outlier 2', color: '#9b59b6', size: 12, x: 3, y: 2 },
      { id: 'bridge1', label: 'Bridge 1', color: '#e67e22', size: 18, x: -1, y: 1 },
      { id: 'bridge2', label: 'Bridge 2', color: '#e67e22', size: 18, x: 1, y: 1 }
    ];

    nodes.forEach(node => {
      graph.addNode(node.id, {
        label: node.label,
        size: node.size,
        color: node.color,
        x: node.x + (Math.random() - 0.5) * 0.5,
        y: node.y + (Math.random() - 0.5) * 0.5,
        highlighted: false,
        fixed: false,
        pinned: false
      });
    });

    // Add edges to create clusters
    const edges = [
      // Central hub connections
      ['central', 'cluster1-1'], ['central', 'cluster2-1'], ['central', 'cluster3-1'],
      ['central', 'bridge1'], ['central', 'bridge2'],
      
      // Cluster 1 internal connections
      ['cluster1-1', 'cluster1-2'], ['cluster1-2', 'cluster1-3'], ['cluster1-3', 'cluster1-1'],
      
      // Cluster 2 internal connections
      ['cluster2-1', 'cluster2-2'], ['cluster2-2', 'cluster2-3'], ['cluster2-3', 'cluster2-1'],
      
      // Cluster 3 internal connections
      ['cluster3-1', 'cluster3-2'], ['cluster3-2', 'cluster3-3'], ['cluster3-3', 'cluster3-1'],
      
      // Bridge connections
      ['bridge1', 'cluster1-2'], ['bridge1', 'cluster3-2'],
      ['bridge2', 'cluster2-2'], ['bridge2', 'cluster3-3'],
      
      // Outlier connections
      ['outlier1', 'bridge1'], ['outlier2', 'bridge2'],
      ['outlier1', 'cluster1-3'], ['outlier2', 'cluster2-3']
    ];

    edges.forEach(([source, target]) => {
      graph.addEdge(source, target, {
        color: '#999',
        size: 1.5
      });
    });
    
    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      labelSize: 10,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#999',
      nodeReducer: (_, attrs) => ({
        ...attrs,
        size: attrs.highlighted ? attrs.size * 1.3 : attrs.size,
        borderColor: attrs.highlighted ? '#000' : (attrs.pinned ? '#ff0000' : (attrs.fixed ? '#ff9900' : undefined)),
        borderSize: attrs.highlighted ? 3 : (attrs.pinned || attrs.fixed ? 2 : 0)
      })
    });
  }, [loadGraph, setSettings]);

  // Handle layout workers
  useEffect(() => {
    if (!isLayoutRunning) {
      forceLayout.stop();
      forceAtlas2Layout.stop();
      noverlapLayout.stop();
      return;
    }

    switch (layout) {
      case 'force':
        forceLayout.start();
        break;
      case 'forceatlas2':
        forceAtlas2Layout.start();
        break;
      case 'noverlap':
        noverlapLayout.start();
        break;
    }

    return () => {
      forceLayout.stop();
      forceAtlas2Layout.stop();
      noverlapLayout.stop();
    };
  }, [layout, isLayoutRunning, forceLayout, forceAtlas2Layout, noverlapLayout]);

  // Handle drag events
  useEffect(() => {
    if (!dragMode) {
      registerEvents({});
      return;
    }

    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node);
        const graph = sigma.getGraph();
        graph.setNodeAttribute(e.node, 'highlighted', true);
        
        // Apply drag lock mode
        if (dragLockMode === 'fixed') {
          graph.setNodeAttribute(e.node, 'fixed', true);
        } else if (dragLockMode === 'pinned') {
          graph.setNodeAttribute(e.node, 'pinned', true);
        }
        
        document.body.style.cursor = 'grabbing';
      },
      
      mousemovebody: (e) => {
        if (!draggedNode) return;
        
        const pos = sigma.viewportToGraph(e);
        const graph = sigma.getGraph();
        graph.setNodeAttribute(draggedNode, 'x', pos.x);
        graph.setNodeAttribute(draggedNode, 'y', pos.y);

        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      
      mouseup: () => {
        if (draggedNode) {
          const graph = sigma.getGraph();
          graph.setNodeAttribute(draggedNode, 'highlighted', false);
          
          // Handle drag lock mode release
          if (dragLockMode === 'fixed') {
            // Release fixed lock after drag
            graph.setNodeAttribute(draggedNode, 'fixed', false);
          }
          // For pinned mode, keep the pinned state
          
          setDraggedNode(null);
          document.body.style.cursor = 'default';
        }
      },
      
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
      
      enterNode: () => {
        if (!draggedNode) {
          document.body.style.cursor = 'grab';
        }
      },
      
      leaveNode: () => {
        if (!draggedNode) {
          document.body.style.cursor = 'default';
        }
      },
      
      // Double-click to toggle pinned state
      doubleClickNode: (e) => {
        const graph = sigma.getGraph();
        const isPinned = graph.getNodeAttribute(e.node, 'pinned') || false;
        graph.setNodeAttribute(e.node, 'pinned', !isPinned);
      }
    });

    return () => {
      document.body.style.cursor = 'default';
    };
  }, [registerEvents, sigma, draggedNode, dragMode, dragLockMode, setDraggedNode]);

  return null;
};

const DragDropWithLayoutExample: React.FC = () => {
  const [layout, setLayout] = useState('force');
  const [isLayoutRunning, setIsLayoutRunning] = useState(false);
  const [dragMode, setDragMode] = useState(true);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragLockMode, setDragLockMode] = useState<'none' | 'fixed' | 'pinned'>('fixed');

  const handleToggleLayout = () => {
    setIsLayoutRunning(!isLayoutRunning);
  };

  const handleToggleDragMode = () => {
    setDragMode(!dragMode);
    if (draggedNode) {
      setDraggedNode(null);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '600px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <DragLayoutGraph
          layout={layout}
          isLayoutRunning={isLayoutRunning}
          dragMode={dragMode}
          draggedNode={draggedNode}
          setDraggedNode={setDraggedNode}
          dragLockMode={dragLockMode}
        />
      </SigmaContainer>
      
      <DragLayoutControls
        layout={layout}
        onLayoutChange={setLayout}
        isLayoutRunning={isLayoutRunning}
        onToggleLayout={handleToggleLayout}
        dragMode={dragMode}
        onToggleDragMode={handleToggleDragMode}
        draggedNode={draggedNode}
        dragLockMode={dragLockMode}
        onDragLockModeChange={setDragLockMode}
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
        maxWidth: '350px',
        fontSize: '13px',
        lineHeight: '1.4'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
          Drag & Drop + Continuous Layouts
        </h4>
        <div style={{ color: '#666' }}>
          <p><strong>Concept:</strong> Combine manual node positioning with automatic layout algorithms</p>
          <p><strong>Interactions:</strong> Drag nodes while layouts continuously run in background</p>
          <p><strong>Lock Modes:</strong> Control how dragged nodes interact with layout forces</p>
          <p><strong>Double-click:</strong> Toggle permanent pinning for any node</p>
          <p><strong>Borders:</strong> Orange=fixed, Red=pinned, Black=dragging</p>
        </div>
      </div>
    </div>
  );
};

export default DragDropWithLayoutExample;
