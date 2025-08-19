import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents, useSigma } from '@react-sigma/core';
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

const PropertyControls: React.FC<{
  settings: PropertyDisplaySettings,
  onSettingsChange: (settings: PropertyDisplaySettings) => void
}> = ({ settings, onSettingsChange }) => {
  const handleChange = (key: keyof PropertyDisplaySettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

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
      minWidth: '280px',
      fontSize: '14px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#2c3e50' }}>
        🔍 Property Graph Controls
      </h4>

      {/* Node Properties */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
          Node Properties:
        </label>
        <select
          value={settings.showNodeProperties}
          onChange={(e) => handleChange('showNodeProperties', e.target.value)}
          style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="never">Never Show</option>
          <option value="always">Always Show</option>
          <option value="onClick">Show on Click</option>
        </select>
      </div>

      {/* Relationship Properties */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
          Relationship Properties:
        </label>
        <select
          value={settings.showRelationshipProperties}
          onChange={(e) => handleChange('showRelationshipProperties', e.target.value)}
          style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="never">Never Show</option>
          <option value="always">Always Show</option>
          <option value="onClick">Show on Click</option>
        </select>
      </div>

      {/* Node Labels Toggle */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={settings.showNodeLabels}
            onChange={(e) => handleChange('showNodeLabels', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <span style={{ fontWeight: 'bold' }}>Show Node Labels</span>
        </label>
      </div>

      {/* Relationship Types Toggle */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={settings.showRelationshipTypes}
            onChange={(e) => handleChange('showRelationshipTypes', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <span style={{ fontWeight: 'bold' }}>Show Relationship Types</span>
        </label>
      </div>

      {/* Info */}
      <div style={{
        padding: '10px',
        backgroundColor: '#e8f4fd',
        borderRadius: '6px',
        fontSize: '12px',
        border: '1px solid #bee5eb'
      }}>
        <strong>Neo4j Style Graph:</strong><br />
        • Colored nodes by label type<br />
        • Directional relationships<br />
        • Rich properties on nodes & edges<br />
        • Click elements to inspect properties
      </div>
    </div>
  );
};

const PropertyDisplay: React.FC<{
  selectedElement: { type: 'node' | 'edge', id: string, data: any } | null,
  onClose: () => void
}> = ({ selectedElement, onClose }) => {
  if (!selectedElement) return null;

  const { type, data } = selectedElement;

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
      minWidth: '300px',
      maxWidth: '400px',
      border: `3px solid ${type === 'node' ? data.color : '#95a5a6'}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, color: '#2c3e50' }}>
          {type === 'node' ? '🔵 Node' : '🔗 Relationship'} Properties
        </h4>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#7f8c8d'
          }}
        >
          ×
        </button>
      </div>

      {type === 'node' ? (
        <div>
          {/* Node Labels */}
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#34495e' }}>Labels:</strong>
            <div style={{ marginTop: '4px' }}>
              {data.labels.map((label: string, index: number) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    backgroundColor: data.color,
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    marginRight: '6px',
                    marginBottom: '4px'
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Node Properties */}
          <div>
            <strong style={{ color: '#34495e' }}>Properties:</strong>
            <div style={{ marginTop: '6px' }}>
              {Object.entries(data.properties).map(([key, value]) => (
                <div key={key} style={{ 
                  marginBottom: '6px', 
                  padding: '6px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{key}:</span>{' '}
                  <span style={{ color: '#5a6c7d' }}>
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Relationship Type */}
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#34495e' }}>Type:</strong>
            <div style={{ marginTop: '4px' }}>
              <span style={{
                display: 'inline-block',
                backgroundColor: '#95a5a6',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {data.type}
              </span>
            </div>
          </div>

          {/* Relationship Direction */}
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#34495e' }}>Direction:</strong>
            <div style={{ marginTop: '4px', fontSize: '13px', color: '#5a6c7d' }}>
              {data.source} → {data.target}
            </div>
          </div>

          {/* Relationship Properties */}
          <div>
            <strong style={{ color: '#34495e' }}>Properties:</strong>
            <div style={{ marginTop: '6px' }}>
              {Object.entries(data.properties).length === 0 ? (
                <div style={{ fontSize: '13px', color: '#7f8c8d', fontStyle: 'italic' }}>
                  No properties
                </div>
              ) : (
                Object.entries(data.properties).map(([key, value]) => (
                  <div key={key} style={{ 
                    marginBottom: '6px', 
                    padding: '6px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}>
                    <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{key}:</span>{' '}
                    <span style={{ color: '#5a6c7d' }}>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PropertyGraph: React.FC<{
  settings: PropertyDisplaySettings,
  selectedElement: { type: 'node' | 'edge', id: string, data: any } | null,
  onElementSelect: (element: { type: 'node' | 'edge', id: string, data: any } | null) => void
}> = ({ settings, selectedElement, onElementSelect }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();

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
      'Location': '#009688'     // Teal
    };
    return colors[label] || '#9E9E9E'; // Default grey
  };

  useEffect(() => {
    const graph = new Graph({ type: 'directed' }); // Directed graph for Neo4j style

    // Sample property graph data (movie/person dataset similar to Neo4j examples)
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
      {
        id: 'carrie',
        label: 'Carrie-Anne Moss',
        labels: ['Person', 'Actor'],
        properties: {
          name: 'Carrie-Anne Moss',
          born: 1967,
          nationality: 'Canadian'
        },
        color: getLabelColor('Person')
      },
      {
        id: 'laurence',
        label: 'Laurence Fishburne',
        labels: ['Person', 'Actor'],
        properties: {
          name: 'Laurence Fishburne',
          born: 1961,
          nationality: 'American'
        },
        color: getLabelColor('Person')
      },
      {
        id: 'warner',
        label: 'Warner Bros.',
        labels: ['Company', 'Studio'],
        properties: {
          name: 'Warner Bros. Pictures',
          founded: 1923,
          headquarters: 'Burbank, California'
        },
        color: getLabelColor('Studio')
      },
      {
        id: 'scifi',
        label: 'Sci-Fi',
        labels: ['Genre'],
        properties: {
          name: 'Science Fiction',
          description: 'Fiction based on futuristic concepts'
        },
        color: getLabelColor('Genre')
      },
      {
        id: 'action',
        label: 'Action',
        labels: ['Genre'],
        properties: {
          name: 'Action',
          description: 'Fast-paced with physical stunts'
        },
        color: getLabelColor('Genre')
      }
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
        id: 'carrie-acted-matrix',
        source: 'carrie',
        target: 'matrix',
        type: 'ACTED_IN',
        properties: {
          role: 'Trinity',
          scenes: 38
        },
        color: '#34495e'
      },
      {
        id: 'laurence-acted-matrix',
        source: 'laurence',
        target: 'matrix',
        type: 'ACTED_IN',
        properties: {
          role: 'Morpheus',
          scenes: 32
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
      {
        id: 'warner-produced-matrix',
        source: 'warner',
        target: 'matrix',
        type: 'PRODUCED',
        properties: {
          budget: 63000000,
          distribution: 'Worldwide'
        },
        color: '#e67e22'
      },
      {
        id: 'matrix-genre-scifi',
        source: 'matrix',
        target: 'scifi',
        type: 'HAS_GENRE',
        properties: {},
        color: '#95a5a6'
      },
      {
        id: 'matrix-genre-action',
        source: 'matrix',
        target: 'action',
        type: 'HAS_GENRE',
        properties: {},
        color: '#95a5a6'
      }
    ];

    // Add nodes to graph
    nodes.forEach(node => {
      const displayLabel = settings.showNodeLabels ? node.label : '';
      let nodeLabel = displayLabel;

      // Add properties if always showing
      if (settings.showNodeProperties === 'always') {
        const props = Object.entries(node.properties)
          .slice(0, 2) // Limit to first 2 properties for display
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        nodeLabel += props ? `\n${props}` : '';
      }

      graph.addNode(node.id, {
        label: nodeLabel,
        size: 15,
        color: node.color,
        borderColor: selectedElement?.type === 'node' && selectedElement.id === node.id ? '#000' : '#fff',
        borderSize: selectedElement?.type === 'node' && selectedElement.id === node.id ? 3 : 1,
        // Store original data
        originalData: node
      });
    });

    // Add edges to graph
    edges.forEach(edge => {
      const shouldShowType = settings.showRelationshipTypes;
      const shouldShowProps = settings.showRelationshipProperties === 'always';
      
      let edgeLabel = '';
      if (shouldShowType) {
        edgeLabel = edge.type;
      }
      if (shouldShowProps && Object.keys(edge.properties).length > 0) {
        const props = Object.entries(edge.properties)
          .slice(0, 1) // Limit to first property for display
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        edgeLabel += props ? `\n${props}` : '';
      }

      graph.addEdgeWithKey(edge.id, edge.source, edge.target, {
        label: edgeLabel,
        size: selectedElement?.type === 'edge' && selectedElement.id === edge.id ? 4 : 2,
        color: selectedElement?.type === 'edge' && selectedElement.id === edge.id ? '#000' : edge.color,
        // Store original data
        originalData: edge
      });
    });

    // Apply circular layout
    circular.assign(graph);

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: settings.showNodeLabels || settings.showNodeProperties === 'always',
      renderEdgeLabels: settings.showRelationshipTypes || settings.showRelationshipProperties === 'always',
      labelRenderedSizeThreshold: 0,
      labelSize: 12,
      edgeLabelSize: 10,
      labelColor: { color: '#2c3e50' },
      edgeLabelColor: { color: '#34495e' }
    });

  }, [loadGraph, setSettings, settings, selectedElement]);

  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        try {
          const graph = sigma.getGraph();
          
          if (graph && graph.hasNode(event.node)) {
            const nodeAttributes = graph.getNodeAttributes(event.node);
            const nodeData = nodeAttributes.originalData;
            
            if (nodeData) {
              onElementSelect({ type: 'node', id: event.node, data: nodeData });
            }
          }
        } catch (error) {
          console.error('Error handling node click:', error);
        }
      },
      clickEdge: (event) => {
        try {
          const graph = sigma.getGraph();
          
          if (graph && graph.hasEdge(event.edge)) {
            const edgeAttributes = graph.getEdgeAttributes(event.edge);
            const edgeData = edgeAttributes.originalData;
            
            if (edgeData) {
              onElementSelect({ type: 'edge', id: event.edge, data: edgeData });
            }
          }
        } catch (error) {
          console.error('Error handling edge click:', error);
        }
      },
      clickStage: () => {
        onElementSelect(null);
      }
    });
  }, [registerEvents, onElementSelect, sigma]);

  return null;
};

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
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer 
        style={{ height: '100%', width: '100%' }} 
        settings={{ allowInvalidContainer: true }}
      >
        <PropertyGraph 
          settings={settings}
          selectedElement={selectedElement}
          onElementSelect={setSelectedElement}
        />
      </SigmaContainer>
      
      <PropertyControls 
        settings={settings}
        onSettingsChange={setSettings}
      />

      {selectedElement && (
        <PropertyDisplay
          selectedElement={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}

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
        maxWidth: '350px'
      }}>
        <strong>Neo4j-Style Property Graph:</strong><br />
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          Movie dataset with actors, directors, and studios. Features directional relationships,
          node labels, and rich properties. Click any node or edge to inspect its properties!
        </span>
      </div>
    </div>
  );
};

export default PropertyGraphExample;