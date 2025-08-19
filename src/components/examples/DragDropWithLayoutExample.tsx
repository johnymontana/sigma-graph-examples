import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents, useSigma } from '@react-sigma/core';
import { useWorkerLayoutForce } from '@react-sigma/layout-force';
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import { useWorkerLayoutNoverlap } from '@react-sigma/layout-noverlap';
import Graph from 'graphology';

// Helper component for input fields
const ConfigInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  type?: 'number' | 'range';
}> = ({ label, value, onChange, min = 0, max = 1, step = 0.001, type = 'number' }) => (
  <div style={{ marginBottom: '8px' }}>
    <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '2px' }}>
      {label}: {value}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      style={{
        width: '100%',
        padding: '4px',
        borderRadius: '3px',
        border: '1px solid #ddd',
        fontSize: '10px'
      }}
    />
  </div>
);

// Helper component for checkbox fields
const ConfigCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div style={{ marginBottom: '8px' }}>
    <label style={{ display: 'flex', alignItems: 'center', fontSize: '10px', color: '#666' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginRight: '6px' }}
      />
      {label}
    </label>
  </div>
);

// Force Layout Configuration Panel
const ForceConfigPanel: React.FC<{
  config: any;
  onChange: (config: any) => void;
}> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10px' }}>
      <ConfigInput
        label="Attraction"
        value={config.attraction}
        onChange={(v) => updateConfig('attraction', v)}
        min={0}
        max={0.01}
        step={0.0001}
      />
      <ConfigInput
        label="Repulsion"
        value={config.repulsion}
        onChange={(v) => updateConfig('repulsion', v)}
        min={0}
        max={1}
        step={0.01}
      />
      <ConfigInput
        label="Gravity"
        value={config.gravity}
        onChange={(v) => updateConfig('gravity', v)}
        min={0}
        max={0.01}
        step={0.0001}
      />
      <ConfigInput
        label="Inertia"
        value={config.inertia}
        onChange={(v) => updateConfig('inertia', v)}
        min={0}
        max={1}
        step={0.01}
      />
      <ConfigInput
        label="Max Move"
        value={config.maxMove}
        onChange={(v) => updateConfig('maxMove', v)}
        min={1}
        max={1000}
        step={1}
      />
      <ConfigInput
        label="Scaling"
        value={config.scalingRatio}
        onChange={(v) => updateConfig('scalingRatio', v)}
        min={0.1}
        max={10}
        step={0.1}
      />
      <div style={{ gridColumn: '1 / -1' }}>
        <ConfigCheckbox
          label="Scale by node size"
          checked={config.nodeScaling}
          onChange={(v) => updateConfig('nodeScaling', v)}
        />
      </div>
    </div>
  );
};

// ForceAtlas2 Layout Configuration Panel
const ForceAtlas2ConfigPanel: React.FC<{
  config: any;
  onChange: (config: any) => void;
}> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10px' }}>
      <ConfigInput
        label="Gravity"
        value={config.gravity}
        onChange={(v) => updateConfig('gravity', v)}
        min={0}
        max={10}
        step={0.1}
      />
      <ConfigInput
        label="Edge Weight"
        value={config.edgeWeightInfluence}
        onChange={(v) => updateConfig('edgeWeightInfluence', v)}
        min={0}
        max={5}
        step={0.1}
      />
      <ConfigInput
        label="Scaling"
        value={config.scalingRatio}
        onChange={(v) => updateConfig('scalingRatio', v)}
        min={0.1}
        max={10}
        step={0.1}
      />
      <ConfigInput
        label="Slow Down"
        value={config.slowDown}
        onChange={(v) => updateConfig('slowDown', v)}
        min={0.1}
        max={10}
        step={0.1}
      />
      <div style={{ gridColumn: '1 / -1' }}>
        <ConfigCheckbox
          label="Lin-Log Mode"
          checked={config.linLogMode}
          onChange={(v) => updateConfig('linLogMode', v)}
        />
        <ConfigCheckbox
          label="Outbound Attraction Distribution"
          checked={config.outboundAttractionDistribution}
          onChange={(v) => updateConfig('outboundAttractionDistribution', v)}
        />
        <ConfigCheckbox
          label="Adjust Sizes"
          checked={config.adjustSizes}
          onChange={(v) => updateConfig('adjustSizes', v)}
        />
        <ConfigCheckbox
          label="Strong Gravity Mode"
          checked={config.strongGravityMode}
          onChange={(v) => updateConfig('strongGravityMode', v)}
        />
        <ConfigCheckbox
          label="Scale by node size"
          checked={config.nodeScaling}
          onChange={(v) => updateConfig('nodeScaling', v)}
        />
      </div>
    </div>
  );
};

// Noverlap Layout Configuration Panel
const NoverlapConfigPanel: React.FC<{
  config: any;
  onChange: (config: any) => void;
}> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10px' }}>
      <ConfigInput
        label="Margin"
        value={config.margin}
        onChange={(v) => updateConfig('margin', v)}
        min={0}
        max={50}
        step={1}
      />
      <ConfigInput
        label="Expansion"
        value={config.expansion}
        onChange={(v) => updateConfig('expansion', v)}
        min={1}
        max={5}
        step={0.1}
      />
      <ConfigInput
        label="Grid Size"
        value={config.gridSize}
        onChange={(v) => updateConfig('gridSize', v)}
        min={5}
        max={100}
        step={1}
      />
      <ConfigInput
        label="Speed"
        value={config.speed}
        onChange={(v) => updateConfig('speed', v)}
        min={1}
        max={20}
        step={1}
      />
      <ConfigInput
        label="Max Iterations"
        value={config.maxIterations}
        onChange={(v) => updateConfig('maxIterations', v)}
        min={50}
        max={2000}
        step={50}
      />
      <div style={{ gridColumn: '1 / -1' }}>
        <ConfigCheckbox
          label="Scale by node size"
          checked={config.nodeScaling}
          onChange={(v) => updateConfig('nodeScaling', v)}
        />
      </div>
    </div>
  );
};

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
  forceConfig: any;
  onForceConfigChange: (config: any) => void;
  forceAtlas2Config: any;
  onForceAtlas2ConfigChange: (config: any) => void;
  noverlapConfig: any;
  onNoverlapConfigChange: (config: any) => void;
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
  onDragLockModeChange,
  forceConfig,
  onForceConfigChange,
  forceAtlas2Config,
  onForceAtlas2ConfigChange,
  noverlapConfig,
  onNoverlapConfigChange
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
      maxWidth: '400px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '18px' }}>
        Drag & Drop + Layouts (Large Network)
      </h3>
      <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '12px' }}>
        200 nodes, ~800+ edges - Perfect for testing layout algorithms
      </p>
      
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

      {/* Layout Configuration */}
      {layout !== 'none' && (
        <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#fff3cd', borderRadius: '6px', border: '1px solid #ffeaa7' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#555', fontSize: '12px' }}>
            {layout.charAt(0).toUpperCase() + layout.slice(1)} Configuration
          </h4>
          
          {layout === 'force' && (
            <ForceConfigPanel config={forceConfig} onChange={onForceConfigChange} />
          )}
          
          {layout === 'forceatlas2' && (
            <ForceAtlas2ConfigPanel config={forceAtlas2Config} onChange={onForceAtlas2ConfigChange} />
          )}
          
          {layout === 'noverlap' && (
            <NoverlapConfigPanel config={noverlapConfig} onChange={onNoverlapConfigChange} />
          )}
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
  forceConfig: any;
  forceAtlas2Config: any;
  noverlapConfig: any;
}> = ({
  layout,
  isLayoutRunning,
  dragMode,
  draggedNode,
  setDraggedNode,
  dragLockMode,
  forceConfig,
  forceAtlas2Config,
  noverlapConfig
}) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();

  // Layout workers
  const forceLayout = useWorkerLayoutForce();
  const forceAtlas2Layout = useWorkerLayoutForceAtlas2();
  const noverlapLayout = useWorkerLayoutNoverlap();

  // Apply configuration changes by modifying graph structure and restarting layout
  const applyConfigurationChanges = () => {
    if (!sigma || !isLayoutRunning) return;
    
    const graph = sigma.getGraph();
    
    // Apply node scaling if enabled
    if (forceConfig.nodeScaling || forceAtlas2Config.nodeScaling || noverlapConfig.nodeScaling) {
      graph.forEachNode((nodeId) => {
        const node = graph.getNodeAttributes(nodeId);
        if (node.scaleFactor) {
          // Apply scaling to node properties that affect layout behavior
          if (forceConfig.nodeScaling && layout === 'force') {
            // Scale node size based on configuration
            const scaledSize = node.baseSize * (1 + (forceConfig.scalingRatio - 1) * node.scaleFactor);
            graph.setNodeAttribute(nodeId, 'size', scaledSize);
          }
          if (forceAtlas2Config.nodeScaling && layout === 'forceatlas2') {
            // Scale node size based on configuration
            const scaledSize = node.baseSize * (1 + (forceAtlas2Config.scalingRatio - 1) * node.scaleFactor);
            graph.setNodeAttribute(nodeId, 'size', scaledSize);
          }
          if (noverlapConfig.nodeScaling && layout === 'noverlap') {
            // Scale node size based on configuration
            const scaledSize = node.baseSize * (1 + (noverlapConfig.margin / 10) * node.scaleFactor);
            graph.setNodeAttribute(nodeId, 'size', scaledSize);
          }
        }
      });
    }

    // Restart layout to apply new configuration
    if (isLayoutRunning) {
      // Stop current layout
      forceLayout.stop();
      forceAtlas2Layout.stop();
      noverlapLayout.stop();
      
      // Small delay to ensure stop is complete, then restart
      setTimeout(() => {
        if (isLayoutRunning) {
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
        }
      }, 100);
    }
  };

  useEffect(() => {
    const graph = new Graph();
    
    // Create a much larger, more connected network for better layout demonstration
    const nodeCount = 200;
    const nodes = [];
    
    // Generate nodes with different types and sizes
    for (let i = 0; i < nodeCount; i++) {
      let nodeType, color, size, label;
      
      if (i < 20) {
        // Major hubs (20 nodes)
        nodeType = 'major-hub';
        color = '#e74c3c';
        size = 28;
        label = `Hub ${i + 1}`;
      } else if (i < 60) {
        // Secondary hubs (40 nodes)
        nodeType = 'secondary-hub';
        color = '#3498db';
        size = 22;
        label = `Sec ${i - 19}`;
      } else if (i < 120) {
        // Connector nodes (60 nodes)
        nodeType = 'connector';
        color = '#2ecc71';
        size = 18;
        label = `Conn ${i - 59}`;
      } else {
        // Leaf nodes (80 nodes)
        nodeType = 'leaf';
        color = '#9b59b6';
        size = 14;
        label = `Leaf ${i - 119}`;
      }
      
      nodes.push({
        id: `node-${i}`,
        label,
        color,
        size,
        nodeType,
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20
      });
    }

    // Add all nodes to the graph
    nodes.forEach(node => {
      graph.addNode(node.id, {
        label: node.label,
        size: node.size,
        color: node.color,
        x: node.x,
        y: node.y,
        highlighted: false,
        fixed: false,
        pinned: false,
        // Add properties for node scaling
        baseSize: node.size,
        scaleFactor: Math.max(0.5, Math.min(3, node.size / 15)) // Normalize size for scaling
      });
    });

    // Create connections based on node types
    let edgeCount = 0;
    
    // Major hubs connect to many nodes (8-15 connections each)
    for (let i = 0; i < 20; i++) {
      const hubNode = `node-${i}`;
      const connections = Math.floor(Math.random() * 8) + 8;
      
             for (let j = 0; j < connections; j++) {
         const target = Math.floor(Math.random() * nodeCount);
         if (target !== i && !graph.hasEdge(hubNode, `node-${target}`)) {
           graph.addEdge(hubNode, `node-${target}`, {
             color: '#e74c3c',
             size: 3
           });
           edgeCount++;
         }
       }
    }
    
    // Secondary hubs connect to 5-10 nodes each
    for (let i = 20; i < 60; i++) {
      const secHubNode = `node-${i}`;
      const connections = Math.floor(Math.random() * 6) + 5;
      
             for (let j = 0; j < connections; j++) {
         const target = Math.floor(Math.random() * nodeCount);
         if (target !== i && !graph.hasEdge(secHubNode, `node-${target}`)) {
           graph.addEdge(secHubNode, `node-${target}`, {
             color: '#3498db',
             size: 2.5
           });
           edgeCount++;
         }
       }
    }
    
    // Connector nodes bridge between different areas (3-6 connections each)
    for (let i = 60; i < 120; i++) {
      const connectorNode = `node-${i}`;
      const connections = Math.floor(Math.random() * 4) + 3;
      
             for (let j = 0; j < connections; j++) {
         const target = Math.floor(Math.random() * nodeCount);
         if (target !== i && !graph.hasEdge(connectorNode, `node-${target}`)) {
           graph.addEdge(connectorNode, `node-${target}`, {
             color: '#2ecc71',
             size: 2
           });
           edgeCount++;
         }
       }
    }
    
    // Leaf nodes connect to 1-3 other nodes
    for (let i = 120; i < nodeCount; i++) {
      const leafNode = `node-${i}`;
      const connections = Math.floor(Math.random() * 3) + 1;
      
             for (let j = 0; j < connections; j++) {
         const target = Math.floor(Math.random() * nodeCount);
         if (target !== i && !graph.hasEdge(leafNode, `node-${target}`)) {
           graph.addEdge(leafNode, `node-${target}`, {
             color: '#9b59b6',
             size: 1.5
           });
           edgeCount++;
         }
       }
    }
    
    // Add some random cross-connections to increase density and create cycles
         for (let i = 0; i < 150; i++) {
       const source = Math.floor(Math.random() * nodeCount);
       const target = Math.floor(Math.random() * nodeCount);
       if (source !== target && !graph.hasEdge(`node-${source}`, `node-${target}`)) {
         graph.addEdge(`node-${source}`, `node-${target}`, {
           color: '#95a5a6',
           size: Math.random() * 1.5 + 0.5
         });
         edgeCount++;
       }
     }
    
    console.log(`Created graph with ${nodeCount} nodes and ${edgeCount} edges`);
    
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

  // Handle configuration changes - restart layout when config changes
  useEffect(() => {
    if (isLayoutRunning) {
      applyConfigurationChanges();
    }
  }, [forceConfig, forceAtlas2Config, noverlapConfig, isLayoutRunning, layout, applyConfigurationChanges]);

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

  // Layout configuration states
  const [forceConfig, setForceConfig] = useState({
    attraction: 0.0005,
    repulsion: 0.1,
    gravity: 0.0001,
    inertia: 0.6,
    maxMove: 200,
    scalingRatio: 1,
    nodeScaling: false, // Scale force by node size
    nodeProperty: 'size' // Property to use for scaling
  });

  const [forceAtlas2Config, setForceAtlas2Config] = useState({
    linLogMode: false,
    outboundAttractionDistribution: false,
    adjustSizes: false,
    edgeWeightInfluence: 1,
    scalingRatio: 1,
    strongGravityMode: false,
    gravity: 1,
    slowDown: 1,
    barnesHutOptimize: false,
    barnesHutTheta: 0.5,
    nodeScaling: false, // Scale gravity by node size
    nodeProperty: 'size' // Property to use for scaling
  });

  const [noverlapConfig, setNoverlapConfig] = useState({
    margin: 5,
    expansion: 1.1,
    gridSize: 20,
    speed: 3,
    maxIterations: 500,
    nodeScaling: false, // Scale margin by node size
    nodeProperty: 'size' // Property to use for scaling
  });

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
          forceConfig={forceConfig}
          forceAtlas2Config={forceAtlas2Config}
          noverlapConfig={noverlapConfig}
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
        forceConfig={forceConfig}
        onForceConfigChange={setForceConfig}
        forceAtlas2Config={forceAtlas2Config}
        onForceAtlas2ConfigChange={setForceAtlas2Config}
        noverlapConfig={noverlapConfig}
        onNoverlapConfigChange={setNoverlapConfig}
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
