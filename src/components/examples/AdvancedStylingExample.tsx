import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { circular } from 'graphology-layout';

interface NodeData {
  id: string;
  label: string;
  category: 'primary' | 'secondary' | 'tertiary';
  importance: number;
}

const ThemeControls: React.FC<{ onThemeChange: (theme: string) => void, currentTheme: string }> = ({ 
  onThemeChange, 
  currentTheme 
}) => {
  const themes = [
    { id: 'default', name: 'Default', colors: { bg: '#ffffff', text: '#333333' } },
    { id: 'dark', name: 'Dark Mode', colors: { bg: '#1a1a1a', text: '#ffffff' } },
    { id: 'ocean', name: 'Ocean', colors: { bg: '#0f3460', text: '#16537e' } },
    { id: 'sunset', name: 'Sunset', colors: { bg: '#2d1b69', text: '#f093fb' } }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      background: currentTheme === 'dark' ? '#2a2a2a' : 'white',
      color: currentTheme === 'dark' ? 'white' : '#333',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Visual Themes</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            style={{
              padding: '8px 12px',
              backgroundColor: currentTheme === theme.id ? '#007bff' : 'transparent',
              color: currentTheme === theme.id ? 'white' : 'inherit',
              border: `2px solid ${currentTheme === theme.id ? '#007bff' : '#dee2e6'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${theme.colors.bg}, ${theme.colors.text})`,
              border: '1px solid rgba(255,255,255,0.3)'
            }} />
            {theme.name}
          </button>
        ))}
      </div>

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: currentTheme === 'dark' ? '#333' : '#f8f9fa',
        borderRadius: '6px',
        fontSize: '12px' 
      }}>
        <strong>Features:</strong>
        <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
          <li>Custom node shapes & gradients</li>
          <li>Dynamic sizing based on importance</li>
          <li>Themed color palettes</li>
          <li>Animated hover effects</li>
        </ul>
      </div>
    </div>
  );
};

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
      case 'sunset':
        return {
          background: '#2d1b69',
          primary: ['#f093fb', '#f5576c', '#ff477e'],
          secondary: ['#4facfe', '#00f2fe', '#43e97b'],
          tertiary: ['#fa709a', '#fee140', '#ffd89b'],
          edges: '#9d4edd'
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

    // Create nodes with different categories and importance levels
    const nodes: NodeData[] = [
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
      { id: 'SALE1', label: 'Sales Rep 1', category: 'tertiary', importance: 3 },
      { id: 'SALE2', label: 'Sales Rep 2', category: 'tertiary', importance: 3 },
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
        // Add border color for enhanced styling
        borderColor: theme === 'dark' ? '#ffffff40' : '#00000020',
        borderSize: node.category === 'primary' ? 3 : 1,
      });
    });

    // Add hierarchical connections
    const connections = [
      // CEO connections
      ['CEO', 'CTO'], ['CEO', 'CFO'],
      // CTO connections
      ['CTO', 'ENG'], ['CTO', 'DESIGN'],
      // CFO connections  
      ['CFO', 'SALES'], ['CFO', 'MARKETING'], ['CFO', 'HR'],
      // Department to team connections
      ['ENG', 'DEV1'], ['ENG', 'DEV2'], ['ENG', 'DEV3'],
      ['DESIGN', 'DES1'], ['DESIGN', 'DES2'],
      ['SALES', 'SALE1'], ['SALES', 'SALE2'],
      // Cross-department collaborations
      ['DESIGN', 'ENG'], ['MARKETING', 'DESIGN'], ['SALES', 'MARKETING']
    ];

    connections.forEach(([source, target]) => {
      const sourceNode = graph.getNodeAttributes(source);
      const targetNode = graph.getNodeAttributes(target);
      
      // Edge thickness based on connection importance
      const edgeSize = Math.min(sourceNode.importance, targetNode.importance) / 3;
      
      graph.addEdge(source, target, {
        color: colors.edges,
        size: Math.max(1, edgeSize)
      });
    });

    // Apply circular layout for better organization
    circular.assign(graph);

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      renderEdgeLabels: false,
      defaultNodeColor: colors.primary[0],
      defaultEdgeColor: colors.edges,
      labelRenderedSizeThreshold: 0,
      labelSize: 12,
      labelWeight: 'bold',
      // Enhanced styling settings
      nodeHaloColor: theme === 'dark' ? '#ffffff20' : '#00000015',
      nodeHaloSize: 2,
      edgeHaloColor: colors.edges,
      edgeHaloSize: 1,
    });

  }, [loadGraph, setSettings, theme]);

  return null;
};

const AdvancedStylingExample: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState('default');

  const getBackgroundColor = (theme: string) => {
    switch (theme) {
      case 'dark': return '#1a1a1a';
      case 'ocean': return '#0f3460'; 
      case 'sunset': return '#2d1b69';
      default: return '#ffffff';
    }
  };

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      minHeight: '500px', 
      position: 'relative',
      backgroundColor: getBackgroundColor(currentTheme),
      transition: 'background-color 0.3s ease'
    }}>
      <SigmaContainer 
        style={{ height: '100%', width: '100%' }} 
        settings={{ 
          allowInvalidContainer: true,
          backgroundColor: getBackgroundColor(currentTheme)
        }}
      >
        <StyledGraph theme={currentTheme} />
      </SigmaContainer>
      
      <ThemeControls 
        onThemeChange={setCurrentTheme}
        currentTheme={currentTheme}
      />

      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: currentTheme === 'dark' ? '#2a2a2a' : 'rgba(255,255,255,0.95)',
        color: currentTheme === 'dark' ? 'white' : '#333',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        maxWidth: '280px'
      }}>
        <strong>Organization Hierarchy:</strong><br />
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          • Node size reflects importance level<br />
          • Colors represent different departments<br />
          • Borders highlight leadership positions
        </span>
      </div>
    </div>
  );
};

export default AdvancedStylingExample;