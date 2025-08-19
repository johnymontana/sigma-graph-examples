import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings, useRegisterEvents, useSigma } from '@react-sigma/core';
import Graph from 'graphology';


const DragDropGraph: React.FC = () => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  useEffect(() => {
    const graph = new Graph();
    
    // Create nodes with more interesting positions
    const nodes = [
      { id: 'A', label: 'Draggable A', color: '#ff6b6b', x: -2, y: -1 },
      { id: 'B', label: 'Draggable B', color: '#4ecdc4', x: 2, y: -1 },
      { id: 'C', label: 'Draggable C', color: '#45b7d1', x: 2, y: 1 },
      { id: 'D', label: 'Draggable D', color: '#f9ca24', x: -2, y: 1 },
      { id: 'E', label: 'Draggable E', color: '#a8e6cf', x: 0, y: 0 },
      { id: 'F', label: 'Draggable F', color: '#ff8b94', x: 0, y: -2 }
    ];

    nodes.forEach(node => {
      graph.addNode(node.id, {
        label: node.label,
        size: 20,
        color: node.color,
        x: node.x,
        y: node.y,
        highlighted: false
      });
    });

    // Add edges
    graph.addEdge('A', 'B', { color: '#ccc', size: 2 });
    graph.addEdge('B', 'C', { color: '#ccc', size: 2 });
    graph.addEdge('C', 'D', { color: '#ccc', size: 2 });
    graph.addEdge('D', 'A', { color: '#ccc', size: 2 });
    graph.addEdge('A', 'E', { color: '#999', size: 1 });
    graph.addEdge('B', 'E', { color: '#999', size: 1 });
    graph.addEdge('C', 'E', { color: '#999', size: 1 });
    graph.addEdge('D', 'E', { color: '#999', size: 1 });
    graph.addEdge('E', 'F', { color: '#666', size: 1.5 });
    
    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#ec5148',
      defaultEdgeColor: '#ccc',
      nodeReducer: (_, attrs) => ({
        ...attrs,
        size: attrs.highlighted ? attrs.size * 1.2 : attrs.size,
        borderColor: attrs.highlighted ? '#000' : undefined,
        borderSize: attrs.highlighted ? 2 : 0
      })
    });
  }, [loadGraph, setSettings]);

  useEffect(() => {
    // Register the drag and drop events
    registerEvents({
      // On mouse down on a node, we enable the dragging mode
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, 'highlighted', true);
        document.body.style.cursor = 'grabbing';
      },
      
      // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
      mousemovebody: (e) => {
        if (!draggedNode) return;
        
        // Get new position of node in graph coordinates
        const pos = sigma.viewportToGraph(e);
        sigma.getGraph().setNodeAttribute(draggedNode, 'x', pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, 'y', pos.y);

        // Prevent sigma to move camera
        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      
      // On mouse up, we reset the dragging mode
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().setNodeAttribute(draggedNode, 'highlighted', false);
          document.body.style.cursor = 'default';
        }
      },
      
      // Disable the autoscale at the first down interaction
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
      
      // Change cursor on hover
      enterNode: () => {
        if (!draggedNode) {
          document.body.style.cursor = 'grab';
        }
      },
      
      leaveNode: () => {
        if (!draggedNode) {
          document.body.style.cursor = 'default';
        }
      }
    });

    return () => {
      document.body.style.cursor = 'default';
    };
  }, [registerEvents, sigma, draggedNode]);

  return (
    <div style={{ 
      position: 'absolute', 
      top: 10, 
      left: 10, 
      background: 'rgba(255,255,255,0.9)', 
      padding: '15px', 
      borderRadius: '8px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      fontSize: '14px',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
        Drag & Drop Instructions
      </h4>
      <div style={{ color: '#666', lineHeight: '1.4' }}>
        <p><strong>• Click and drag</strong> any node to move it independently</p>
        <p><strong>• Cursor changes:</strong> grab → grabbing → default</p>
        <p><strong>• Node highlighting:</strong> Selected nodes get larger with borders</p>
        <p><strong>• Camera lock:</strong> Dragging nodes won't move the camera</p>
        <p><strong>• Connections:</strong> Edges follow nodes as they move</p>
      </div>
      {draggedNode && (
        <div style={{ 
          marginTop: '10px', 
          padding: '8px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          fontSize: '12px',
          color: '#1976d2'
        }}>
          <strong>Dragging:</strong> {draggedNode}
        </div>
      )}
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

export default DragDropExample;