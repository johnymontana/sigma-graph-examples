import React, { useState } from 'react';
import SimpleBasicExample from './examples/SimpleBasicExample';
import ErrorBoundary from './ErrorBoundary';
import CodePanel from './CodePanel';
import EventsExample from './examples/EventsExample';
import DragDropExample from './examples/DragDropExample';
import LayoutsExample from './examples/LayoutsExample';
import ControlsExample from './examples/ControlsExample';
import ExternalStateExample from './examples/ExternalStateExample';
import GraphSearchExample from './examples/GraphSearchExample';
import MinimapExample from './examples/MinimapExample';
import AdvancedStylingExample from './examples/AdvancedStylingExample';
import DynamicDataExample from './examples/DynamicDataExample';
import NetworkAnalysisExample from './examples/NetworkAnalysisExample';
import MultiGraphExample from './examples/MultiGraphExample';
import AnimatedExample from './examples/AnimatedExample';
import PropertyGraphExample from './examples/PropertyGraphExample';

interface Example {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  features: string[];
  code: string;
  fileName: string;
}

const examples: Example[] = [
  {
    id: 'basic',
    title: 'Basic Graph Loading',
    description: 'Learn how to create and load a simple graph with nodes and edges using React Sigma.',
    component: SimpleBasicExample,
    difficulty: 'Beginner',
    features: ['Graph creation', 'Node and edge styling', 'Random layout', 'Basic configuration'],
    fileName: 'SimpleBasicExample.tsx',
    code: `// Basic Graph Loading Example
// This example demonstrates how to create and display a simple graph
// with nodes and edges using React Sigma.js

import React, { useEffect } from 'react';
import { useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { random } from 'graphology-layout';
import SafeSigmaContainer from '../SafeSigmaContainer';

const LoadGraph: React.FC = () => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    // Step 1: Create a new graph instance
    const graph = new Graph();
    
    // Step 2: Add nodes with attributes
    for (let i = 1; i <= 10; i++) {
      graph.addNode(\`node-\${i}\`, {
        label: \`Node \${i}\`,
        size: Math.random() * 10 + 5,
        color: \`hsl(\${Math.random() * 360}, 70%, 60%)\`,
      });
    }

    // Step 3: Add edges between nodes
    for (let i = 1; i < 10; i++) {
      if (Math.random() > 0.5) {
        graph.addEdge(\`node-\${i}\`, \`node-\${i + 1}\`, {
          color: '#ccc',
        });
      }
    }

    // Step 4: Add some random connections for complexity
    for (let i = 1; i <= 5; i++) {
      const source = \`node-\${Math.ceil(Math.random() * 10)}\`;
      const target = \`node-\${Math.ceil(Math.random() * 10)}\`;
      if (source !== target && !graph.hasEdge(source, target)) {
        graph.addEdge(source, target, {
          color: '#999',
        });
      }
    }

    // Step 5: Apply a layout algorithm
    random.assign(graph);
    
    // Step 6: Load the graph into Sigma
    loadGraph(graph);

    // Step 7: Configure visual settings
    setSettings({
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
    });
  }, [loadGraph, setSettings]);

  return null; // This component doesn't render anything
};

// Main component that renders the graph
const SimpleBasicExample: React.FC = () => {
  return (
    <SafeSigmaContainer>
      <LoadGraph />
    </SafeSigmaContainer>
  );
};

export default SimpleBasicExample;`
  },
  {
    id: 'events',
    title: 'Event Handling',
    description: 'Handle user interactions like clicks, hovers, and double-clicks on nodes and edges.',
    component: EventsExample,
    difficulty: 'Beginner',
    features: ['Click events', 'Hover events', 'Event logging', 'Stage interactions'],
    fileName: 'EventsExample.tsx',
    code: `import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';

const GraphEvents: React.FC = () => {
  const loadGraph = useLoadGraph();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();
  const [eventLog, setEventLog] = useState<string[]>([]);

  const addToLog = (message: string) => {
    setEventLog(prev => [message, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    const graph = new Graph();
    
    // Create a simple graph
    graph.addNode('A', { label: 'Node A', x: 0, y: 0, size: 15, color: '#ff6b6b' });
    graph.addNode('B', { label: 'Node B', x: 2, y: 0, size: 15, color: '#4ecdc4' });
    graph.addNode('C', { label: 'Node C', x: 1, y: 1, size: 15, color: '#45b7d1' });
    graph.addNode('D', { label: 'Node D', x: -1, y: 1, size: 15, color: '#f9ca24' });

    graph.addEdge('A', 'B', { color: '#ccc' });
    graph.addEdge('B', 'C', { color: '#ccc' });
    graph.addEdge('C', 'D', { color: '#ccc' });
    graph.addEdge('D', 'A', { color: '#ccc' });

    loadGraph(graph);
    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      renderEdgeLabels: false,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
    });
  }, [loadGraph, setSettings]);

  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        addToLog(\`Clicked node: \${event.node}\`);
      },
      clickEdge: (event) => {
        addToLog(\`Clicked edge: \${event.edge}\`);
      },
      clickStage: () => {
        addToLog('Clicked stage (background)');
      },
      enterNode: (event) => {
        addToLog(\`Entered node: \${event.node}\`);
      },
      leaveNode: (event) => {
        addToLog(\`Left node: \${event.node}\`);
      },
      doubleClickNode: (event) => {
        addToLog(\`Double-clicked node: \${event.node}\`);
      }
    });
  }, [registerEvents]);

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '300px' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Event Log:</h4>
      <div style={{ fontSize: '12px', maxHeight: '150px', overflow: 'auto' }}>
        {eventLog.length === 0 ? (
          <div style={{ color: '#999' }}>Try clicking, hovering, or double-clicking nodes and edges!</div>
        ) : (
          eventLog.map((event, index) => (
            <div key={index} style={{ marginBottom: '2px', color: index === 0 ? '#007bff' : '#666' }}>
              {event}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const EventsExample: React.FC = () => {
  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <GraphEvents />
      </SigmaContainer>
    </div>
  );
};

export default EventsExample;`
  },
  {
    id: 'drag-drop',
    title: 'Drag & Drop',
    description: 'Enable interactive node dragging functionality with visual feedback.',
    component: DragDropExample,
    difficulty: 'Intermediate',
    features: ['Node dragging', 'Cursor changes', 'Mouse event handling', 'Position updates'],
    fileName: 'DragDropExample.tsx',
    code: `import React, { useEffect } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents } from '@react-sigma/core';
import Graph from 'graphology';
import { random } from 'graphology-layout';

const DragDropGraph: React.FC = () => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    const graph = new Graph();
    
    // Create nodes
    const nodes = [
      { id: 'A', label: 'Draggable A', color: '#ff6b6b' },
      { id: 'B', label: 'Draggable B', color: '#4ecdc4' },
      { id: 'C', label: 'Draggable C', color: '#45b7d1' },
      { id: 'D', label: 'Draggable D', color: '#f9ca24' },
      { id: 'E', label: 'Draggable E', color: '#a8e6cf' },
      { id: 'F', label: 'Draggable F', color: '#ff8b94' }
    ];

    nodes.forEach(node => {
      graph.addNode(node.id, {
        label: node.label,
        size: 20,
        color: node.color,
      });
    });

    // Add edges
    graph.addEdge('A', 'B', { color: '#ccc', size: 2 });
    graph.addEdge('B', 'C', { color: '#ccc', size: 2 });
    graph.addEdge('C', 'D', { color: '#ccc', size: 2 });
    graph.addEdge('D', 'E', { color: '#ccc', size: 2 });
    graph.addEdge('E', 'F', { color: '#ccc', size: 2 });
    graph.addEdge('F', 'A', { color: '#ccc', size: 2 });
    graph.addEdge('A', 'D', { color: '#999', size: 1 });
    graph.addEdge('B', 'E', { color: '#999', size: 1 });

    // Apply random layout
    random.assign(graph);
    
    loadGraph(graph);
    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
    });
  }, [loadGraph, setSettings]);

  useEffect(() => {
    registerEvents({
      enterNode: () => {
        document.body.style.cursor = 'grab';
      },
      leaveNode: () => {
        document.body.style.cursor = 'default';
      },
      clickNode: (event) => {
        // Simple demonstration - just log the clicked node
        console.log('Clicked node for dragging:', event.node);
      }
    });

    return () => {
      document.body.style.cursor = 'default';
    };
  }, [registerEvents]);

  return (
    <div style={{ 
      position: 'absolute', 
      top: 10, 
      left: 10, 
      background: 'rgba(255,255,255,0.9)', 
      padding: '10px', 
      borderRadius: '5px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontSize: '14px'
    }}>
      <strong>Drag & Drop Instructions:</strong><br />
      • Click and drag any node to move it<br />
      • Cursor changes to indicate drag state<br />
      • Node connections are maintained
    </div>
  );
};

const DragDropExample: React.FC = () => {
  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <DragDropGraph />
      </SigmaContainer>
    </div>
  );
};

export default DragDropExample;`
  },
  {
    id: 'layouts',
    title: 'Layout Algorithms',
    description: 'Explore different layout algorithms including random, circular, and force-directed layouts.',
    component: LayoutsExample,
    difficulty: 'Intermediate',
    features: ['Multiple layouts', 'ForceAtlas2', 'Circular layout', 'Dynamic switching'],
    fileName: 'LayoutsExample.tsx',
    code: `import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { random, circular } from 'graphology-layout';
import { LayoutForceAtlas2Control } from '@react-sigma/layout-forceatlas2';

const LayoutControls: React.FC<{ onLayoutChange: (layout: string) => void }> = ({ onLayoutChange }) => {
  const [currentLayout, setCurrentLayout] = useState('random');

  const handleLayoutChange = (layout: string) => {
    setCurrentLayout(layout);
    onLayoutChange(layout);
  };

  return (
    <div style={{ position: 'absolute', top: 10, right: 10, background: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 1000 }}>
      <h4>Layout Algorithms:</h4>
      <button onClick={() => handleLayoutChange('random')}>Random</button>
      <button onClick={() => handleLayoutChange('circular')}>Circular</button>
      <button onClick={() => handleLayoutChange('forceatlas2')}>ForceAtlas2</button>
    </div>
  );
};

const LayoutGraph: React.FC<{ layout: string }> = ({ layout }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    const graph = new Graph();
    
    // Create nodes
    for (let i = 0; i < 20; i++) {
      graph.addNode(\`node-\${i}\`, {
        label: \`Node \${i}\`,
        size: Math.random() * 8 + 5,
        color: \`hsl(\${(i * 137.5) % 360}, 70%, 60%)\`,
      });
    }

    // Add edges
    for (let i = 0; i < 20; i++) {
      graph.addEdge(\`node-\${i}\`, \`node-\${(i + 1) % 20}\`, { color: '#ccc' });
    }

    // Apply selected layout
    switch (layout) {
      case 'circular':
        circular.assign(graph);
        break;
      case 'random':
        random.assign(graph);
        break;
      case 'forceatlas2':
        random.assign(graph); // Start with random positions
        break;
      default:
        random.assign(graph);
    }

    loadGraph(graph);
    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
    });
  }, [loadGraph, setSettings, layout]);

  return null;
};

const LayoutsExample: React.FC = () => {
  const [currentLayout, setCurrentLayout] = useState('random');

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <LayoutGraph layout={currentLayout} />
        {currentLayout === 'forceatlas2' && <LayoutForceAtlas2Control />}
      </SigmaContainer>
      <LayoutControls onLayoutChange={setCurrentLayout} />
    </div>
  );
};`
  },
  {
    id: 'controls',
    title: 'Camera Controls & UI',
    description: 'Implement camera controls, zoom functionality, and customizable view settings.',
    component: ControlsExample,
    difficulty: 'Intermediate',
    features: ['Camera controls', 'Zoom controls', 'View settings', 'UI components'],
    fileName: 'ControlsExample.tsx',
    code: `import React, { useState, useEffect } from 'react';
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

  return (
    <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'white', padding: '15px' }}>
      <h4>Camera Controls:</h4>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
      <button onClick={() => reset({ duration: 500 })}>Reset View</button>
      <div>Zoom: {(1 / zoomLevel).toFixed(2)}x</div>
    </div>
  );
};

const ControlsGraph: React.FC = () => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    const graph = new Graph();
    // Create clustered network...
    loadGraph(graph);
    setSettings({ allowInvalidContainer: true, renderLabels: true });
  }, [loadGraph, setSettings]);

  return null;
};

const ControlsExample: React.FC = () => {
  return (
    <SigmaContainer>
      <ControlsGraph />
      <CameraControls />
    </SigmaContainer>
  );
};`
  },
  {
    id: 'external-state',
    title: 'External State Management',
    description: 'Integrate graph interactions with React state management for dynamic UIs.',
    component: ExternalStateExample,
    difficulty: 'Intermediate',
    features: ['State management', 'Dynamic styling', 'Node selection', 'Statistics display'],
    fileName: 'ExternalStateExample.tsx',
    code: `import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents } from '@react-sigma/core';
import Graph from 'graphology';

interface NodeInfo {
  id: string;
  label: string;
  degree: number;
  color: string;
}

const ExternalState: React.FC<{ selectedNode: string | null, onNodeSelect: (node: string | null) => void }> = ({ selectedNode, onNodeSelect }) => {
  const loadGraph = useLoadGraph();
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    const graph = new Graph();
    
    // Create social network
    const people = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    people.forEach((person, index) => {
      graph.addNode(person, {
        label: person,
        color: selectedNode === person ? '#ff4757' : '#3742fa',
      });
    });

    // Add connections
    graph.addEdge('Alice', 'Bob');
    graph.addEdge('Bob', 'Charlie');
    // ... more connections

    loadGraph(graph);
  }, [loadGraph, selectedNode]);

  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        const clickedNode = event.node;
        onNodeSelect(selectedNode === clickedNode ? null : clickedNode);
      },
      clickStage: () => onNodeSelect(null)
    });
  }, [registerEvents, selectedNode, onNodeSelect]);

  return null;
};

const ExternalStateExample: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null);

  return (
    <div style={{ position: 'relative' }}>
      <SigmaContainer>
        <ExternalState selectedNode={selectedNode} onNodeSelect={setSelectedNode} />
      </SigmaContainer>
      {nodeInfo && (
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'white', padding: '15px' }}>
          <h4>Node Details:</h4>
          <div><strong>Name:</strong> {nodeInfo.label}</div>
          <div><strong>Connections:</strong> {nodeInfo.degree}</div>
        </div>
      )}
    </div>
  );
};`
  },
  {
    id: 'search',
    title: 'Graph Search & Filtering',
    description: 'Implement search functionality with filtering and result highlighting.',
    component: GraphSearchExample,
    difficulty: 'Advanced',
    features: ['Text search', 'Filtering', 'Result highlighting', 'Industry categorization'],
    fileName: 'GraphSearchExample.tsx',
    code: `// Graph Search & Filtering Example
// This example demonstrates search functionality with stable positioning
// and filtering with industry-based categories

import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';

const SearchGraph: React.FC<{ 
  searchQuery: string, 
  highlightedNodes: Set<string>,
  onSearchResults: (results: string[]) => void 
}> = ({ searchQuery, highlightedNodes, onSearchResults }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    const graph = new Graph();
    
    // Create company network with fixed positions for stable layout
    const companies = [
      // Tech companies (top-right cluster)
      { id: 'Apple', label: 'Apple Inc.', industry: 'Tech', size: 20, color: '#007AFF', x: 3, y: -2 },
      { id: 'Google', label: 'Google LLC', industry: 'Tech', size: 18, color: '#4285F4', x: 4, y: -1 },
      { id: 'Microsoft', label: 'Microsoft Corp.', industry: 'Tech', size: 17, color: '#00BCF2', x: 2, y: -3 },
      { id: 'Amazon', label: 'Amazon.com Inc.', industry: 'Tech', size: 16, color: '#FF9900', x: 5, y: -2 },
      { id: 'Meta', label: 'Meta Platforms', industry: 'Tech', size: 15, color: '#1877F2', x: 3, y: -1 },
      
      // Biotech companies (bottom-right cluster)
      { id: 'Pfizer', label: 'Pfizer Inc.', industry: 'Biotech', size: 14, color: '#0093D0', x: 3, y: 2 },
      { id: 'Moderna', label: 'Moderna Inc.', industry: 'Biotech', size: 13, color: '#D31245', x: 4, y: 3 },
      { id: 'BioNTech', label: 'BioNTech SE', industry: 'Biotech', size: 12, color: '#00B4A6', x: 2, y: 3 },
      { id: 'Gilead', label: 'Gilead Sciences', industry: 'Biotech', size: 11, color: '#7B68EE', x: 5, y: 2 },
      
      // Finance companies (bottom-left cluster)
      { id: 'JPMorgan', label: 'JPMorgan Chase', industry: 'Finance', size: 15, color: '#005EB8', x: -3, y: 2 },
      { id: 'Goldman', label: 'Goldman Sachs', industry: 'Finance', size: 14, color: '#0066CC', x: -4, y: 1 },
      { id: 'Morgan Stanley', label: 'Morgan Stanley', industry: 'Finance', size: 13, color: '#FF6600', x: -2, y: 3 },
      
      // Automotive (top-left cluster)
      { id: 'Tesla', label: 'Tesla Inc.', industry: 'Automotive', size: 16, color: '#CC0000', x: -3, y: -2 },
      { id: 'Ford', label: 'Ford Motor Co.', industry: 'Automotive', size: 12, color: '#003478', x: -4, y: -1 },
      { id: 'GM', label: 'General Motors', industry: 'Automotive', size: 11, color: '#005DAA', x: -2, y: -3 },
    ];

    // Add nodes with fixed positions to prevent movement
    companies.forEach(company => {
      const isHighlighted = highlightedNodes.has(company.id);
      graph.addNode(company.id, {
        label: company.label,
        industry: company.industry,
        size: company.size * (isHighlighted ? 1.5 : 1),
        color: isHighlighted ? '#ff4757' : company.color,
        x: company.x,  // Fixed position
        y: company.y   // Fixed position
      });
    });

    // Add relationships between companies
    const partnerships = [
      ['Apple', 'Google'], ['Apple', 'Microsoft'], ['Google', 'Amazon'],
      ['Microsoft', 'Amazon'], ['Meta', 'Microsoft'], ['Tesla', 'Google'],
      ['Pfizer', 'BioNTech'], ['Moderna', 'Gilead'], ['JPMorgan', 'Goldman'],
      ['Goldman', 'Morgan Stanley'], ['Tesla', 'Apple'], ['Ford', 'Google']
    ];

    partnerships.forEach(([source, target]) => {
      const isHighlighted = highlightedNodes.has(source) || highlightedNodes.has(target);
      graph.addEdge(source, target, {
        color: isHighlighted ? '#ff4757' : '#ccc',
        size: isHighlighted ? 3 : 1
      });
    });

    // No layout algorithm needed - using fixed positions for stability
    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      labelRenderedSizeThreshold: 0,
      labelSize: 12
    });

    // Perform search across node labels and industries
    if (searchQuery) {
      const results: string[] = [];
      graph.forEachNode((nodeId, attributes) => {
        const label = attributes.label.toLowerCase();
        const industry = attributes.industry.toLowerCase();
        const query = searchQuery.toLowerCase();
        
        if (label.includes(query) || industry.includes(query) || nodeId.toLowerCase().includes(query)) {
          results.push(nodeId);
        }
      });
      onSearchResults(results);
    } else {
      onSearchResults([]);
    }
  }, [loadGraph, setSettings, searchQuery, highlightedNodes, onSearchResults]);

  return null;
};

// Main component with search controls and filtering
const GraphSearchExample: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setHighlightedNodes(new Set());
    }
  };

  const handleSearchResults = (results: string[]) => {
    setSearchResults(results);
    setHighlightedNodes(new Set(results));
  };

  return (
    <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
      <SearchGraph 
        searchQuery={searchQuery}
        highlightedNodes={highlightedNodes}
        onSearchResults={handleSearchResults}
      />
      {/* Search controls and filter UI components would be rendered here */}
    </SigmaContainer>
  );
};`
  },
  {
    id: 'minimap',
    title: 'Minimap Navigation',
    description: 'Add a custom minimap component for navigation and overview of large graphs.',
    component: MinimapExample,
    difficulty: 'Advanced',
    features: ['Custom minimap', 'Click navigation', 'Viewport indicator', 'Resizable interface'],
    fileName: 'MinimapExample.tsx',
    code: `import React, { useRef, useEffect } from 'react';
import { SigmaContainer, useLoadGraph, useCamera, useSigma } from '@react-sigma/core';
import Graph from 'graphology';

const MiniMap: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { goto } = useCamera();
  const sigma = useSigma();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sigma) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderMinimap = () => {
      ctx.clearRect(0, 0, width, height);
      
      const graph = sigma.getGraph();
      if (graph.order === 0) return;

      // Draw nodes and edges in minimap
      graph.forEachNode((_, attributes) => {
        const x = (attributes.x * 50) + width/2;
        const y = (attributes.y * 50) + height/2;
        
        ctx.fillStyle = attributes.color || '#666';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    renderMinimap();
    const interval = setInterval(renderMinimap, 500);
    
    return () => clearInterval(interval);
  }, [sigma, width, height]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left - width/2;
    const y = e.clientY - rect.top - height/2;
    
    goto({ x: -x/50, y: -y/50 }, { duration: 200 });
  };

  return (
    <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'white', border: '2px solid #ddd' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};

const MinimapExample: React.FC = () => {
  const [minimapWidth, setMinimapWidth] = useState(160);
  const [minimapHeight, setMinimapHeight] = useState(120);

  return (
    <SigmaContainer>
      {/* Graph loading component */}
      <MiniMap width={minimapWidth} height={minimapHeight} />
    </SigmaContainer>
  );
};`
  },
  {
    id: 'advanced-styling',
    title: 'Advanced Styling & Themes',
    description: 'Explore custom node renderers, visual themes, and sophisticated styling options.',
    component: AdvancedStylingExample,
    difficulty: 'Advanced',
    features: ['Custom themes', 'Dynamic styling', 'Node gradients', 'Importance-based sizing'],
    fileName: 'AdvancedStylingExample.tsx',
    code: `// Advanced Styling & Themes Example
// This example demonstrates sophisticated visual styling options
// including custom themes, node gradients, and dynamic sizing

import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { circular } from 'graphology-layout';

const StyledGraph: React.FC<{ theme: string }> = ({ theme }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'dark':
        return {
          background: '#1a1a1a',
          primary: ['#ff6b6b', '#ee5a52', '#ff8e88'],
          secondary: ['#4ecdc4', '#45b7d1', '#96ceb4'],
          tertiary: ['#ffe66d', '#ffcc5c', '#f9ca24'],
          edges: '#555555'
        };
      case 'ocean':
        return {
          background: '#0f3460',
          primary: ['#16537e', '#1e6091', '#266ba1'],
          secondary: ['#0077b6', '#0096c7', '#00b4d8'],
          tertiary: ['#90e0ef', '#caf0f8', '#ade8f4'],
          edges: '#16537e'
        };
      default:
        return {
          background: '#ffffff',
          primary: ['#e74c3c', '#c0392b', '#f39c12'],
          secondary: ['#3498db', '#2980b9', '#1abc9c'],
          tertiary: ['#9b59b6', '#8e44ad', '#e67e22'],
          edges: '#bdc3c7'
        };
    }
  };

  useEffect(() => {
    const graph = new Graph();
    const colors = getThemeColors(theme);

    // Create organizational hierarchy with different importance levels
    const nodes = [
      // Primary nodes (most important)
      { id: 'CEO', label: 'Chief Executive', category: 'primary', importance: 10 },
      { id: 'CTO', label: 'Chief Technology', category: 'primary', importance: 9 },
      { id: 'CFO', label: 'Chief Financial', category: 'primary', importance: 9 },
      
      // Secondary nodes (department heads)
      { id: 'ENG', label: 'Engineering', category: 'secondary', importance: 7 },
      { id: 'DESIGN', label: 'Design Team', category: 'secondary', importance: 6 },
      { id: 'SALES', label: 'Sales Team', category: 'secondary', importance: 7 },
      { id: 'MARKETING', label: 'Marketing', category: 'secondary', importance: 6 },
      { id: 'HR', label: 'Human Resources', category: 'secondary', importance: 5 },
      
      // Tertiary nodes (team members)
      { id: 'DEV1', label: 'Frontend Dev', category: 'tertiary', importance: 4 },
      { id: 'DEV2', label: 'Backend Dev', category: 'tertiary', importance: 4 },
      { id: 'DEV3', label: 'DevOps', category: 'tertiary', importance: 4 },
      { id: 'DES1', label: 'UI Designer', category: 'tertiary', importance: 3 },
      { id: 'DES2', label: 'UX Designer', category: 'tertiary', importance: 3 },
    ];

    nodes.forEach((node, index) => {
      const colorSet = colors[node.category];
      const colorIndex = index % colorSet.length;
      
      graph.addNode(node.id, {
        label: node.label,
        category: node.category,
        importance: node.importance,
        size: Math.max(8, node.importance * 2), // Size based on importance
        color: colorSet[colorIndex],
        borderColor: theme === 'dark' ? '#ffffff40' : '#00000020',
        borderSize: node.category === 'primary' ? 3 : 1,
      });
    });

    // Add hierarchical connections
    const connections = [
      ['CEO', 'CTO'], ['CEO', 'CFO'],
      ['CTO', 'ENG'], ['CTO', 'DESIGN'],
      ['CFO', 'SALES'], ['CFO', 'MARKETING'], ['CFO', 'HR'],
      ['ENG', 'DEV1'], ['ENG', 'DEV2'], ['ENG', 'DEV3'],
      ['DESIGN', 'DES1'], ['DESIGN', 'DES2'],
      ['DESIGN', 'ENG'], ['MARKETING', 'DESIGN']
    ];

    connections.forEach(([source, target]) => {
      const sourceNode = graph.getNodeAttributes(source);
      const targetNode = graph.getNodeAttributes(target);
      const edgeSize = Math.min(sourceNode.importance, targetNode.importance) / 3;
      
      graph.addEdge(source, target, {
        color: colors.edges,
        size: Math.max(1, edgeSize)
      });
    });

    circular.assign(graph);
    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      labelSize: 12,
      labelWeight: 'bold',
      backgroundColor: colors.background
    });

  }, [loadGraph, setSettings, theme]);

  return null;
};

// Theme Controls Component
const ThemeControls: React.FC<{ onThemeChange: (theme: string) => void, currentTheme: string }> = ({ 
  onThemeChange, currentTheme 
}) => {
  const themes = [
    { id: 'default', name: 'Default' },
    { id: 'dark', name: 'Dark Mode' },
    { id: 'ocean', name: 'Ocean' }
  ];

  return (
    <div style={{ position: 'absolute', top: 10, right: 10, background: 'white', padding: '15px' }}>
      <h4>Visual Themes</h4>
      {themes.map(theme => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme.id)}
          style={{
            padding: '8px 12px',
            backgroundColor: currentTheme === theme.id ? '#007bff' : 'transparent',
            color: currentTheme === theme.id ? 'white' : 'inherit',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            cursor: 'pointer',
            margin: '4px'
          }}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
};

// Main Component
const AdvancedStylingExample: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState('default');

  return (
    <SigmaContainer style={{ height: '100%', width: '100%' }}>
      <StyledGraph theme={currentTheme} />
      <ThemeControls onThemeChange={setCurrentTheme} currentTheme={currentTheme} />
    </SigmaContainer>
  );
};`
  },
  {
    id: 'dynamic-data',
    title: 'Dynamic Data Loading',
    description: 'Real-time data updates with animated transitions and live network changes.',
    component: DynamicDataExample,
    difficulty: 'Advanced',
    features: ['Real-time updates', 'Animated transitions', 'Data streaming', 'Live metrics'],
    fileName: 'DynamicDataExample.tsx',
    code: `// Dynamic Data Loading Example
// This example demonstrates real-time data updates with animated transitions
// simulating a live server network monitoring system

import React, { useEffect, useState, useRef } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { random } from 'graphology-layout';

interface DataPoint {
  timestamp: number;
  nodes: { id: string; label: string; value: number; connections: string[] }[];
}

const DynamicGraph: React.FC<{ currentData: DataPoint | null }> = ({ currentData }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    if (!currentData) return;

    const graph = new Graph();

    // Add nodes from current data with dynamic properties
    currentData.nodes.forEach(node => {
      graph.addNode(node.id, {
        label: node.label,
        size: Math.max(8, node.value * 2), // Size based on current value
        color: \`hsl(\${(node.value * 30) % 360}, 70%, 60%)\`, // Color based on value
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

    if (graph.order > 0) {
      random.assign(graph);
    }

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      labelSize: 11,
    });

  }, [loadGraph, setSettings, currentData]);

  return null;
};

// Data Controls Component
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
    <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: '15px' }}>
      <h4>Live Data Simulation</h4>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={onPlayPause}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button onClick={onReset}>🔄 Reset</button>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div>Progress: {currentStep}/{totalSteps}</div>
        <div style={{ width: '200px', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
          <div style={{
            width: \`\${(currentStep / totalSteps) * 100}%\`,
            height: '100%',
            backgroundColor: '#007bff',
            borderRadius: '4px'
          }} />
        </div>
      </div>

      <div>
        <label>Speed: {speed}x</label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};

// Main Component
const DynamicDataExample: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [currentData, setCurrentData] = useState<DataPoint | null>(null);

  // Generate sample time-series data
  const generateTimeSeriesData = (): DataPoint[] => {
    const data: DataPoint[] = [];
    const baseNodes = ['Server1', 'Server2', 'Database', 'API', 'Cache'];
    
    for (let i = 0; i < 20; i++) {
      const timestamp = Date.now() + i * 1000;
      const nodes: DataPoint['nodes'] = [];
      
      baseNodes.forEach((nodeId) => {
        if (Math.random() > 0.1) { // 90% chance to include
          nodes.push({
            id: nodeId,
            label: nodeId,
            value: Math.random() * 10 + 2,
            connections: []
          });
        }
      });

      // Add dynamic client nodes
      const clientCount = Math.floor(Math.random() * 5) + 2;
      for (let j = 0; j < clientCount; j++) {
        nodes.push({
          id: \`Client\${j + 1}\`,
          label: \`Client\${j + 1}\`,
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

  // Animation control logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
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
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speed]);

  return (
    <SigmaContainer style={{ height: '100%', width: '100%' }}>
      <DynamicGraph currentData={currentData} />
      <DataControls 
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStep(0);
          timeSeriesData.current = generateTimeSeriesData();
          setCurrentData(timeSeriesData.current[0]);
        }}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStep}
        totalSteps={timeSeriesData.current.length}
      />
    </SigmaContainer>
  );
};`
  },
  {
    id: 'network-analysis',
    title: 'Network Analysis & Metrics',
    description: 'Comprehensive network analysis with centrality measures and statistical insights.',
    component: NetworkAnalysisExample,
    difficulty: 'Advanced',
    features: ['Centrality measures', 'Network metrics', 'Statistical analysis', 'Interactive exploration'],
    fileName: 'NetworkAnalysisExample.tsx',
    code: `// Network Analysis & Metrics Example
// This example demonstrates comprehensive network analysis capabilities
// including various centrality measures and network statistics

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

const AnalysisGraph: React.FC<{ 
  analysisType: string,
  onMetricsCalculated: (metrics: NetworkMetrics) => void,
  selectedNode: string | null,
  onNodeSelect: (nodeId: string | null) => void
}> = ({ analysisType, onMetricsCalculated, selectedNode, onNodeSelect }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();

  // Calculate different centrality measures
  const calculateCentralities = (graph: Graph, type: string): { [nodeId: string]: number } => {
    const centralities: { [nodeId: string]: number } = {};
    
    switch (type) {
      case 'degree':
        graph.forEachNode((nodeId) => {
          centralities[nodeId] = graph.degree(nodeId);
        });
        break;
        
      case 'closeness':
        // Simplified closeness centrality implementation
        graph.forEachNode((nodeId) => {
          let totalDistance = 0;
          let reachableNodes = 0;
          
          graph.forEachNode((targetId) => {
            if (nodeId !== targetId) {
              // Simple distance calculation
              const distance = graph.hasEdge(nodeId, targetId) ? 1 : 2;
              totalDistance += distance;
              reachableNodes += 1;
            }
          });
          
          centralities[nodeId] = reachableNodes > 0 ? reachableNodes / totalDistance : 0;
        });
        break;
        
      case 'betweenness':
        // Simplified betweenness centrality
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
        // Simplified eigenvector centrality using power iteration
        graph.forEachNode((nodeId) => {
          centralities[nodeId] = 1;
        });
        
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

    // Create a complex network structure for analysis
    const networkData = {
      core: ['Hub1', 'Hub2', 'Hub3'],
      communityA: ['A1', 'A2', 'A3', 'A4', 'A5'],
      communityB: ['B1', 'B2', 'B3', 'B4'],
      communityC: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
      bridges: ['Bridge1', 'Bridge2']
    };

    // Add nodes with different roles and colors
    Object.entries(networkData).forEach(([category, nodes]) => {
      nodes.forEach((nodeId) => {
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

    // Create community structures and inter-community connections
    const addCommunityEdges = (community: string[]) => {
      for (let i = 0; i < community.length; i++) {
        for (let j = i + 1; j < community.length; j++) {
          if (Math.random() > 0.4) {
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

    // Connect hubs to communities
    networkData.core.forEach(coreNode => {
      [...networkData.communityA, ...networkData.communityB, ...networkData.communityC].forEach(node => {
        if (Math.random() > 0.3) {
          graph.addEdge(coreNode, node, { color: '#e74c3c', size: 2 });
        }
      });
    });

    // Add bridge connections
    graph.addEdge('Bridge1', 'A1', { color: '#9b59b6', size: 2 });
    graph.addEdge('Bridge1', 'B1', { color: '#9b59b6', size: 2 });
    graph.addEdge('Bridge2', 'B2', { color: '#9b59b6', size: 2 });
    graph.addEdge('Bridge2', 'C1', { color: '#9b59b6', size: 2 });

    // Calculate centralities and update visual properties
    const centralities = calculateCentralities(graph, analysisType);
    const maxCentrality = Math.max(...Object.values(centralities));
    
    graph.forEachNode((nodeId, attributes) => {
      const centrality = centralities[nodeId];
      const normalizedCentrality = maxCentrality > 0 ? centrality / maxCentrality : 0;
      
      graph.setNodeAttribute(nodeId, 'size', 8 + normalizedCentrality * 20);
      
      if (selectedNode === nodeId) {
        graph.setNodeAttribute(nodeId, 'color', '#ff4757');
        graph.setNodeAttribute(nodeId, 'size', (8 + normalizedCentrality * 20) * 1.2);
      }
    });

    circular.assign(graph);
    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      labelSize: 10,
    });

    // Calculate network metrics
    const nodeCount = graph.order;
    const edgeCount = graph.size;
    const density = nodeCount > 1 ? (2 * edgeCount) / (nodeCount * (nodeCount - 1)) : 0;
    const totalDegree = graph.nodes().reduce((sum, nodeId) => sum + graph.degree(nodeId), 0);
    const averageDegree = nodeCount > 0 ? totalDegree / nodeCount : 0;

    // Calculate clustering coefficient
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
      clickNode: (event) => onNodeSelect(event.node),
      clickStage: () => onNodeSelect(null)
    });
  }, [registerEvents, onNodeSelect]);

  return null;
};

// Main Component
const NetworkAnalysisExample: React.FC = () => {
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [analysisType, setAnalysisType] = useState('degree');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <SigmaContainer style={{ height: '100%', width: '100%' }}>
      <AnalysisGraph 
        analysisType={analysisType}
        onMetricsCalculated={setMetrics}
        selectedNode={selectedNode}
        onNodeSelect={setSelectedNode}
      />
      {/* Analysis controls and metrics display would be rendered here */}
    </SigmaContainer>
  );
};`
  },
  {
    id: 'multi-graph',
    title: 'Multi-Graph Comparison',
    description: 'Side-by-side comparison of different network topologies and structures.',
    component: MultiGraphExample,
    difficulty: 'Advanced',
    features: ['Side-by-side views', 'Network topology comparison', 'Interactive selection', 'Grid layout'],
    fileName: 'MultiGraphExample.tsx',
    code: `// Multi-Graph Comparison Example  
// This example demonstrates side-by-side comparison of different
// network topologies to understand structural differences

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

// Individual graph component for each comparison view
const SingleGraph: React.FC<{ graphData: GraphData }> = ({ graphData }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    const graph = new Graph();

    // Generate different network types
    switch (graphData.id) {
      case 'social':
        createSocialNetwork(graph, graphData.color);
        break;
      case 'hierarchy':
        createHierarchicalNetwork(graph, graphData.color);
        break;
      case 'random':
        createRandomNetwork(graph, graphData.color);
        break;
      case 'star':
        createStarNetwork(graph, graphData.color);
        break;
      case 'ring':
        createRingNetwork(graph, graphData.color);
        break;
      case 'smallworld':
        createSmallWorldNetwork(graph, graphData.color);
        break;
    }

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: false,
      defaultNodeColor: graphData.color,
      defaultEdgeColor: \`\${graphData.color}80\`,
    });

  }, [loadGraph, setSettings, graphData]);

  return null;
};

// Network generation functions
const createSocialNetwork = (graph: Graph, color: string) => {
  // Create 3 communities with dense internal connections
  const communities = [
    Array.from({length: 6}, (_, i) => \`A\${i+1}\`),
    Array.from({length: 5}, (_, i) => \`B\${i+1}\`),
    Array.from({length: 4}, (_, i) => \`C\${i+1}\`)
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
          graph.addEdge(community[i], community[j], { color: \`\${color}80\` });
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
        graph.addEdge(node1, node2, { color: \`\${color}60\` });
      }
    });
  });
};

const createHierarchicalNetwork = (graph: Graph, color: string) => {
  // Tree structure with root and multiple levels
  graph.addNode('root', { label: 'Root', size: 12, color: color, x: 0, y: -2 });

  // Level 1 - 3 nodes
  for (let i = 0; i < 3; i++) {
    const nodeId = \`L1_\${i}\`;
    graph.addNode(nodeId, {
      label: nodeId,
      size: 8,
      color: color,
      x: (i - 1) * 2,
      y: -1
    });
    graph.addEdge('root', nodeId, { color: \`\${color}80\` });

    // Level 2 - children for each L1 node
    const childCount = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < childCount; j++) {
      const childId = \`L2_\${i}_\${j}\`;
      graph.addNode(childId, {
        label: childId,
        size: 5,
        color: color,
        x: (i - 1) * 2 + (j - childCount/2 + 0.5) * 0.8,
        y: 0.5
      });
      graph.addEdge(nodeId, childId, { color: \`\${color}80\` });
    }
  }
};

const createStarNetwork = (graph: Graph, color: string) => {
  // Central hub with radiating spokes
  graph.addNode('hub', { label: 'Hub', size: 15, color: color, x: 0, y: 0 });

  for (let i = 0; i < 12; i++) {
    const nodeId = \`spoke\${i}\`;
    const angle = i * 2 * Math.PI / 12;
    graph.addNode(nodeId, {
      label: nodeId,
      size: 5,
      color: color,
      x: Math.cos(angle) * 2.5,
      y: Math.sin(angle) * 2.5
    });
    graph.addEdge('hub', nodeId, { color: \`\${color}80\` });
  }
};

// Graph selection controls
const ComparisonControls: React.FC<{
  selectedGraphs: string[],
  onGraphToggle: (graphId: string) => void,
  availableGraphs: GraphData[]
}> = ({ selectedGraphs, onGraphToggle, availableGraphs }) => {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: '15px' }}>
      <h4>Graph Comparison</h4>
      <div>Select up to 4 graphs to compare:</div>
      
      {availableGraphs.map(graph => (
        <label key={graph.id} style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={selectedGraphs.includes(graph.id)}
            onChange={() => onGraphToggle(graph.id)}
            style={{ marginRight: '8px' }}
          />
          <strong>{graph.title}</strong> - {graph.nodeCount} nodes, {graph.edgeCount} edges
        </label>
      ))}
    </div>
  );
};

// Main component
const MultiGraphExample: React.FC = () => {
  const availableGraphs: GraphData[] = [
    { id: 'social', title: 'Social Network', description: 'Clustered communities', nodeCount: 15, edgeCount: 25, color: '#e74c3c' },
    { id: 'hierarchy', title: 'Hierarchical Tree', description: 'Tree-like structure', nodeCount: 12, edgeCount: 11, color: '#2ecc71' },
    { id: 'random', title: 'Random Network', description: 'Erdős–Rényi model', nodeCount: 15, edgeCount: 18, color: '#3498db' },
    { id: 'star', title: 'Star Network', description: 'Central hub model', nodeCount: 13, edgeCount: 12, color: '#f39c12' }
  ];

  const [selectedGraphs, setSelectedGraphs] = useState<string[]>(['social', 'hierarchy', 'random', 'star']);

  const handleGraphToggle = (graphId: string) => {
    setSelectedGraphs(prev => {
      if (prev.includes(graphId)) {
        return prev.filter(id => id !== graphId);
      } else if (prev.length < 4) {
        return [...prev, graphId];
      } else {
        return [prev[1], prev[2], prev[3], graphId];
      }
    });
  };

  const getGridLayout = (count: number) => {
    if (count <= 2) return { cols: Math.max(1, count), rows: 1 };
    return { cols: 2, rows: 2 };
  };

  const gridLayout = getGridLayout(selectedGraphs.length);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <ComparisonControls 
        selectedGraphs={selectedGraphs}
        onGraphToggle={handleGraphToggle}
        availableGraphs={availableGraphs}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(\${gridLayout.cols}, 1fr)\`,
        gridTemplateRows: \`repeat(\${gridLayout.rows}, 1fr)\`,
        height: '100%',
        width: '100%',
        gap: '2px',
        backgroundColor: '#ecf0f1'
      }}>
        {selectedGraphs.map((graphId) => {
          const graphData = availableGraphs.find(g => g.id === graphId);
          if (!graphData) return null;

          return (
            <div key={graphId} style={{ position: 'relative', backgroundColor: 'white' }}>
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: 1000
              }}>
                {graphData.title}
              </div>
              
              <SigmaContainer style={{ height: '100%', width: '100%' }}>
                <SingleGraph graphData={graphData} />
              </SigmaContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};`
  },
  {
    id: 'animated',
    title: 'Animated Transitions',
    description: 'Smooth animations and transitions between different graph states and layouts.',
    component: AnimatedExample,
    difficulty: 'Advanced',
    features: ['Smooth transitions', 'Layout morphing', 'Growth animations', 'Dynamic filtering'],
    fileName: 'AnimatedExample.tsx',
    code: `// Animated Transitions Example
// This example demonstrates various animation patterns including
// network growth, layout transitions, and graph morphing

import React, { useEffect, useState, useRef } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { circular, random } from 'graphology-layout';

interface AnimationState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  animationType: 'growth' | 'layout' | 'morphing' | 'filtering';
  speed: number;
}

const AnimatedGraph: React.FC<{ 
  animationState: AnimationState,
  onStepUpdate: (step: number) => void 
}> = ({ animationState, onStepUpdate }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle animation timing
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

  // Generate graph based on animation type and current step
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
      labelSize: 10,
    });

  }, [loadGraph, setSettings, animationState.currentStep, animationState.animationType, animationState.totalSteps]);

  return null;
};

// Animation creation functions
const createGrowthAnimation = (graph: Graph, step: number) => {
  const maxNodes = 20;
  
  // Add nodes progressively
  const nodesToAdd = Math.min(maxNodes, Math.floor(step * 0.8));
  for (let i = 0; i < nodesToAdd; i++) {
    graph.addNode(\`node_\${i}\`, {
      label: \`node_\${i}\`,
      size: 8 + Math.random() * 6,
      color: \`hsl(\${(i * 25) % 360}, 70%, 60%)\`,
    });
  }

  // Add edges progressively  
  const edgesToAdd = Math.min(35, Math.floor((step - 5) * 0.6));
  let edgeCount = 0;
  for (let i = 0; i < nodesToAdd && edgeCount < edgesToAdd; i++) {
    for (let j = i + 1; j < nodesToAdd && edgeCount < edgesToAdd; j++) {
      if (Math.random() > 0.7) {
        graph.addEdge(\`node_\${i}\`, \`node_\${j}\`, {
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
  // Create fixed set of nodes
  for (let i = 0; i < 12; i++) {
    graph.addNode(\`node_\${i}\`, {
      label: \`N\${i}\`,
      size: 10,
      color: '#e74c3c',
    });
  }

  // Add ring connections
  for (let i = 0; i < 12; i++) {
    graph.addEdge(\`node_\${i}\`, \`node_\${(i + 1) % 12}\`, {
      color: '#95a5a6',
      size: 1.5
    });
  }

  // Interpolate between circular and random layouts
  const circularPositions: { [key: string]: { x: number, y: number } } = {};
  const randomPositions: { [key: string]: { x: number, y: number } } = {};

  graph.forEachNode((nodeId, _, index) => {
    const angle = index * 2 * Math.PI / 12;
    circularPositions[nodeId] = {
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2
    };
    randomPositions[nodeId] = {
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4
    };
  });

  // Smooth interpolation using sine wave
  graph.forEachNode((nodeId) => {
    const circular = circularPositions[nodeId];
    const randomPos = randomPositions[nodeId];
    const t = (Math.sin(progress * Math.PI * 2) + 1) / 2;
    
    graph.setNodeAttribute(nodeId, 'x', circular.x + (randomPos.x - circular.x) * t);
    graph.setNodeAttribute(nodeId, 'y', circular.y + (randomPos.y - circular.y) * t);
  });
};

const createMorphingAnimation = (graph: Graph, progress: number) => {
  // Morph from star to clustered network
  const nodeCount = 15;
  
  for (let i = 0; i < nodeCount; i++) {
    const nodeId = \`node_\${i}\`;
    graph.addNode(nodeId, {
      label: nodeId === 'node_0' ? 'Hub' : \`N\${i}\`,
      size: nodeId === 'node_0' ? 12 : 8,
      color: nodeId === 'node_0' ? '#e74c3c' : '#3498db',
    });
  }

  // Star edges fade out as progress increases
  for (let i = 1; i < nodeCount; i++) {
    const opacity = 1 - progress;
    graph.addEdge('node_0', \`node_\${i}\`, {
      color: \`rgba(149, 165, 166, \${opacity})\`,
      size: 1 + opacity
    });
  }

  // Cluster edges fade in as progress increases
  const clusters = [[1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14]];
  clusters.forEach(cluster => {
    for (let i = 0; i < cluster.length; i++) {
      for (let j = i + 1; j < cluster.length; j++) {
        if (Math.random() > 0.6) {
          graph.addEdge(\`node_\${cluster[i]}\`, \`node_\${cluster[j]}\`, {
            color: \`rgba(52, 152, 219, \${progress})\`,
            size: progress * 1.5
          });
        }
      }
    }
  });

  // Interpolate node positions from star to clusters
  graph.forEachNode((nodeId, _, index) => {
    if (nodeId === 'node_0') {
      graph.setNodeAttribute(nodeId, 'x', 0);
      graph.setNodeAttribute(nodeId, 'y', 0);
    } else {
      // Calculate star and cluster positions
      const angle = (index - 1) * 2 * Math.PI / (nodeCount - 1);
      const starX = Math.cos(angle) * 2.5;
      const starY = Math.sin(angle) * 2.5;

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

      graph.setNodeAttribute(nodeId, 'x', starX + (clusterX - starX) * progress);
      graph.setNodeAttribute(nodeId, 'y', starY + (clusterY - starY) * progress);
    }
  });
};

// Animation controls component
const AnimationControls: React.FC<{
  animationState: AnimationState,
  onPlayPause: () => void,
  onReset: () => void,
  onSpeedChange: (speed: number) => void,
  onAnimationTypeChange: (type: AnimationState['animationType']) => void
}> = ({ animationState, onPlayPause, onReset, onSpeedChange, onAnimationTypeChange }) => {
  const animationTypes = [
    { id: 'growth', name: '🌱 Network Growth' },
    { id: 'layout', name: '🔄 Layout Transitions' },
    { id: 'morphing', name: '🔮 Graph Morphing' },
    { id: 'filtering', name: '🔍 Dynamic Filtering' }
  ];

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: '15px' }}>
      <h4>Graph Animations</h4>

      <div style={{ marginBottom: '15px' }}>
        <label>Animation Type:</label>
        <select
          value={animationState.animationType}
          onChange={(e) => onAnimationTypeChange(e.target.value as AnimationState['animationType'])}
          style={{ width: '100%', padding: '4px' }}
        >
          {animationTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <button onClick={onPlayPause}>
          {animationState.isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button onClick={onReset}>🔄 Reset</button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div>Progress: {animationState.currentStep}/{animationState.totalSteps}</div>
        <div style={{ width: '200px', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
          <div style={{
            width: \`\${(animationState.currentStep / animationState.totalSteps) * 100}%\`,
            height: '100%',
            backgroundColor: '#007bff',
            borderRadius: '4px'
          }} />
        </div>
      </div>

      <div>
        <label>Speed: {animationState.speed}x</label>
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
    </div>
  );
};

// Main component
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
    setAnimationState(prev => ({ ...prev, isPlaying: false, currentStep: 0 }));
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
    <SigmaContainer style={{ height: '100%', width: '100%' }}>
      <AnimatedGraph 
        animationState={animationState}
        onStepUpdate={handleStepUpdate}
      />
      <AnimationControls
        animationState={animationState}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        onSpeedChange={(speed) => setAnimationState(prev => ({ ...prev, speed }))}
        onAnimationTypeChange={(animationType) => 
          setAnimationState(prev => ({ ...prev, animationType, currentStep: 0, isPlaying: false }))
        }
      />
    </SigmaContainer>
  );
};`
  },
  {
    id: 'property-graph',
    title: 'Property Graph (Neo4j Style)',
    description: 'Labeled property graph with node labels, relationship types, directions, and rich properties.',
    component: PropertyGraphExample,
    difficulty: 'Advanced',
    features: ['Node labels', 'Relationship types', 'Directed edges', 'Property inspection', 'Neo4j styling'],
    fileName: 'PropertyGraphExample.tsx',
    code: `// Property Graph Example (Neo4j Style)
// This example demonstrates a labeled property graph with node labels,
// relationship types, directions, and rich properties similar to Neo4j

import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents } from '@react-sigma/core';
import Graph from 'graphology';
import { circular } from 'graphology-layout';

interface NodeData {
  id: string;
  label: string;
  labels: string[];
  properties: { [key: string]: any };
  color: string;
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  type: string;
  properties: { [key: string]: any };
  color: string;
}

interface PropertyDisplaySettings {
  showNodeProperties: 'always' | 'never' | 'onClick';
  showRelationshipProperties: 'always' | 'never' | 'onClick';
  showNodeLabels: boolean;
  showRelationshipTypes: boolean;
}

// Neo4j style colors for different node labels
const getLabelColor = (label: string): string => {
  const colors: { [key: string]: string } = {
    'Person': '#4CAF50',      // Green
    'Movie': '#2196F3',       // Blue  
    'Actor': '#FF9800',       // Orange
    'Director': '#9C27B0',    // Purple
    'Genre': '#F44336',       // Red
    'Studio': '#607D8B',      // Blue Grey
    'Company': '#795548',     // Brown
  };
  return colors[label] || '#9E9E9E'; // Default grey
};

const PropertyGraph: React.FC<{
  settings: PropertyDisplaySettings,
  selectedElement: { type: 'node' | 'edge', id: string, data: any } | null,
  onElementSelect: (element: { type: 'node' | 'edge', id: string, data: any } | null) => void
}> = ({ settings, selectedElement, onElementSelect }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    const graph = new Graph({ type: 'directed' });

    // Sample movie database (similar to Neo4j movie example)
    const nodes: NodeData[] = [
      {
        id: 'keanu',
        label: 'Keanu Reeves',
        labels: ['Person', 'Actor'],
        properties: {
          name: 'Keanu Reeves',
          born: 1964,
          nationality: 'Canadian',
          height: '1.86m'
        },
        color: getLabelColor('Person')
      },
      {
        id: 'matrix',
        label: 'The Matrix',
        labels: ['Movie'],
        properties: {
          title: 'The Matrix',
          released: 1999,
          rating: 8.7,
          budget: 63000000,
          revenue: 467200000
        },
        color: getLabelColor('Movie')
      },
      {
        id: 'wachowski',
        label: 'Lana Wachowski',
        labels: ['Person', 'Director'],
        properties: {
          name: 'Lana Wachowski',
          born: 1965,
          nationality: 'American'
        },
        color: getLabelColor('Director')
      },
      // ... more nodes
    ];

    const edges: EdgeData[] = [
      {
        id: 'keanu-acted-matrix',
        source: 'keanu',
        target: 'matrix',
        type: 'ACTED_IN',
        properties: {
          role: 'Neo',
          scenes: 45,
          salary: 10000000
        },
        color: '#34495e'
      },
      {
        id: 'wachowski-directed-matrix',
        source: 'wachowski',
        target: 'matrix',
        type: 'DIRECTED',
        properties: {
          year: 1999,
          credit: 'Director'
        },
        color: '#8e44ad'
      },
      // ... more relationships
    ];

    // Build graph with conditional labeling
    nodes.forEach(node => {
      const displayLabel = settings.showNodeLabels ? node.label : '';
      let nodeLabel = displayLabel;

      // Add properties if always showing
      if (settings.showNodeProperties === 'always') {
        const props = Object.entries(node.properties)
          .slice(0, 2)
          .map(([key, value]) => \`\${key}: \${value}\`)
          .join('\\n');
        nodeLabel += props ? \`\\n\${props}\` : '';
      }

      graph.addNode(node.id, {
        label: nodeLabel,
        size: 15,
        color: node.color,
        borderColor: selectedElement?.type === 'node' && selectedElement.id === node.id ? '#000' : '#fff',
        borderSize: selectedElement?.type === 'node' && selectedElement.id === node.id ? 3 : 1,
        originalData: node
      });
    });

    edges.forEach(edge => {
      const shouldShowType = settings.showRelationshipTypes;
      const shouldShowProps = settings.showRelationshipProperties === 'always';
      
      let edgeLabel = '';
      if (shouldShowType) {
        edgeLabel = edge.type;
      }
      if (shouldShowProps && Object.keys(edge.properties).length > 0) {
        const props = Object.entries(edge.properties)
          .slice(0, 1)
          .map(([key, value]) => \`\${key}: \${value}\`)
          .join(', ');
        edgeLabel += props ? \`\\n\${props}\` : '';
      }

      graph.addEdge(edge.id, edge.source, edge.target, {
        label: edgeLabel,
        size: selectedElement?.type === 'edge' && selectedElement.id === edge.id ? 4 : 2,
        color: selectedElement?.type === 'edge' && selectedElement.id === edge.id ? '#000' : edge.color,
        originalData: edge
      });
    });

    circular.assign(graph);
    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: settings.showNodeLabels || settings.showNodeProperties === 'always',
      renderEdgeLabels: settings.showRelationshipTypes || settings.showRelationshipProperties === 'always',
      labelRenderedSizeThreshold: 0,
      labelSize: 12,
      edgeLabelSize: 10
    });

  }, [loadGraph, setSettings, settings, selectedElement]);

  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        const nodeData = event.data.originalData;
        if (nodeData) {
          onElementSelect({ type: 'node', id: event.node, data: nodeData });
        }
      },
      clickEdge: (event) => {
        const edgeData = event.data.originalData;
        if (edgeData) {
          onElementSelect({ type: 'edge', id: event.edge, data: edgeData });
        }
      },
      clickStage: () => onElementSelect(null)
    });
  }, [registerEvents, onElementSelect]);

  return null;
};

// Property Controls Component
const PropertyControls: React.FC<{
  settings: PropertyDisplaySettings,
  onSettingsChange: (settings: PropertyDisplaySettings) => void
}> = ({ settings, onSettingsChange }) => {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: '15px' }}>
      <h4>Property Graph Controls</h4>
      
      <div>
        <label>Node Properties:</label>
        <select
          value={settings.showNodeProperties}
          onChange={(e) => onSettingsChange({ ...settings, showNodeProperties: e.target.value as any })}
        >
          <option value="never">Never Show</option>
          <option value="always">Always Show</option>
          <option value="onClick">Show on Click</option>
        </select>
      </div>

      <div>
        <label>Relationship Properties:</label>
        <select
          value={settings.showRelationshipProperties}
          onChange={(e) => onSettingsChange({ ...settings, showRelationshipProperties: e.target.value as any })}
        >
          <option value="never">Never Show</option>
          <option value="always">Always Show</option>
          <option value="onClick">Show on Click</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.showNodeLabels}
            onChange={(e) => onSettingsChange({ ...settings, showNodeLabels: e.target.checked })}
          />
          Show Node Labels
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.showRelationshipTypes}
            onChange={(e) => onSettingsChange({ ...settings, showRelationshipTypes: e.target.checked })}
          />
          Show Relationship Types
        </label>
      </div>
    </div>
  );
};

// Main Component
const PropertyGraphExample: React.FC = () => {
  const [settings, setSettings] = useState<PropertyDisplaySettings>({
    showNodeProperties: 'onClick',
    showRelationshipProperties: 'onClick',
    showNodeLabels: true,
    showRelationshipTypes: true
  });

  const [selectedElement, setSelectedElement] = useState<{
    type: 'node' | 'edge',
    id: string,
    data: any
  } | null>(null);

  return (
    <SigmaContainer style={{ height: '100%', width: '100%' }}>
      <PropertyGraph 
        settings={settings}
        selectedElement={selectedElement}
        onElementSelect={setSelectedElement}
      />
      <PropertyControls 
        settings={settings}
        onSettingsChange={setSettings}
      />
      {/* Property display panel would be rendered here when element is selected */}
    </SigmaContainer>
  );
};`
  }
];

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const getColor = (level: string) => {
    switch (level) {
      case 'Beginner': return '#28a745';
      case 'Intermediate': return '#ffc107';
      case 'Advanced': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <span style={{
      backgroundColor: getColor(difficulty),
      color: 'white',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold'
    }}>
      {difficulty}
    </span>
  );
};

const ExampleCard: React.FC<{ 
  example: Example, 
  isSelected: boolean, 
  onSelect: () => void 
}> = ({ example, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: '15px',
        border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: isSelected ? '#f8f9ff' : 'white',
        transition: 'all 0.2s ease',
        marginBottom: '10px'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#adb5bd';
          e.currentTarget.style.backgroundColor = '#f8f9fa';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#ddd';
          e.currentTarget.style.backgroundColor = 'white';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, color: isSelected ? '#007bff' : '#333' }}>
          {example.title}
        </h4>
        <DifficultyBadge difficulty={example.difficulty} />
      </div>
      
      <p style={{ 
        margin: '8px 0', 
        color: '#666', 
        fontSize: '14px', 
        lineHeight: '1.4' 
      }}>
        {example.description}
      </p>
      
      <div style={{ marginTop: '10px' }}>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>
          <strong>Features:</strong>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {example.features.map(feature => (
            <span
              key={feature}
              style={{
                backgroundColor: '#e9ecef',
                color: '#495057',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px'
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterControls: React.FC<{ 
  selectedDifficulty: string | null,
  onDifficultyChange: (difficulty: string | null) => void
}> = ({ selectedDifficulty, onDifficultyChange }) => {
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Filter by Difficulty:</h4>
      <div style={{ display: 'flex', gap: '8px' }}>
        {difficulties.map(difficulty => (
          <button
            key={difficulty}
            onClick={() => onDifficultyChange(difficulty === 'All' ? null : difficulty)}
            style={{
              padding: '6px 12px',
              backgroundColor: selectedDifficulty === (difficulty === 'All' ? null : difficulty) 
                ? '#007bff' : '#f8f9fa',
              color: selectedDifficulty === (difficulty === 'All' ? null : difficulty) 
                ? 'white' : '#333',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {difficulty}
          </button>
        ))}
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<string>('basic');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const filteredExamples = examples.filter(example => 
    !difficultyFilter || example.difficulty === difficultyFilter
  );

  const currentExample = examples.find(ex => ex.id === selectedExample);
  const ExampleComponent = currentExample?.component;

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: '350px', 
        backgroundColor: '#f8f9fa', 
        padding: '20px',
        borderRight: '1px solid #dee2e6',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Sigma.js Gallery</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Interactive examples showcasing React Sigma.js features and capabilities
          </p>
        </div>
        
        <FilterControls 
          selectedDifficulty={difficultyFilter}
          onDifficultyChange={setDifficultyFilter}
        />
        
        <div>
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
            Examples ({filteredExamples.length})
          </h4>
          {filteredExamples.map(example => (
            <ExampleCard
              key={example.id}
              example={example}
              isSelected={selectedExample === example.id}
              onSelect={() => setSelectedExample(example.id)}
            />
          ))}
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>Resources:</h5>
          <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
            <a href="https://www.sigmajs.org/docs/" target="_blank" rel="noopener noreferrer" 
               style={{ color: '#007bff', textDecoration: 'none', display: 'block', marginBottom: '5px' }}>
              📚 Sigma.js Documentation
            </a>
            <a href="https://sim51.github.io/react-sigma/" target="_blank" rel="noopener noreferrer"
               style={{ color: '#007bff', textDecoration: 'none', display: 'block', marginBottom: '5px' }}>
              ⚛️ React Sigma Documentation
            </a>
            <a href="https://github.com/graphology/graphology" target="_blank" rel="noopener noreferrer"
               style={{ color: '#007bff', textDecoration: 'none', display: 'block' }}>
              📈 Graphology Library
            </a>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white',
          borderBottom: '1px solid #dee2e6'
        }}>
          {currentExample && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, color: '#333' }}>{currentExample.title}</h3>
                <DifficultyBadge difficulty={currentExample.difficulty} />
              </div>
              <p style={{ margin: 0, color: '#666' }}>{currentExample.description}</p>
            </>
          )}
        </div>
        
        {/* Example content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {ExampleComponent && currentExample && (
            <>
              {/* Graph visualization - takes up most of the space */}
              <div style={{ 
                flex: 1, 
                minHeight: '60vh', 
                maxHeight: 'calc(100vh - 200px)', 
                position: 'relative',
                overflow: 'hidden'
              }}>
                <ErrorBoundary>
                  <ExampleComponent />
                </ErrorBoundary>
              </div>
              
              {/* Code panel - flexible height but doesn't push graph too small */}
              <div style={{ 
                flexShrink: 0,
                maxHeight: '40vh',
                overflow: 'hidden'
              }}>
                <CodePanel 
                  title={`${currentExample.fileName} - Source Code`}
                  code={currentExample.code}
                  language="typescript"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;