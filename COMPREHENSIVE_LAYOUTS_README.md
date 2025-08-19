# Comprehensive Layouts Example

This example demonstrates all the available layout algorithms in React Sigma, providing a comprehensive showcase of both regular layouts and worker layouts.

## Overview

The comprehensive layouts example showcases all six layout algorithms available in React Sigma:

### Regular Layouts (One-time Application)
These layouts are applied once to position nodes and then remain static:

1. **Random Layout** - Random node positioning for initial graph setup
2. **Circular Layout** - Nodes arranged in a perfect circle
3. **Circle Pack Layout** - Hierarchical circle packing for nested structures

### Worker Layouts (Continuous Processing)
These layouts run continuously with start/stop controls:

1. **Force Layout** - Basic force-directed layout using physics simulation
2. **ForceAtlas2 Layout** - Advanced force-directed algorithm with better convergence
3. **No Overlap Layout** - Prevents node overlap while maintaining structure

## Features

- **Interactive Controls**: Click any layout button to see it in action
- **Visual Feedback**: Clear indication of which layout is currently active
- **Worker Layout Management**: Automatic start/stop of continuous layouts
- **Layout Comparison**: Easy switching between different algorithms
- **Educational Information**: Explanatory panels describing layout types
- **Responsive Design**: Clean, modern UI with hover effects

## Technical Implementation

### Layout Controls Component
The `LayoutControls` component provides:
- Separate sections for regular vs worker layouts
- Visual distinction between layout types
- Active layout tracking
- Worker layout status indicators

### Graph Component
The `LayoutGraph` component:
- Creates a complex, structured graph with 25 nodes
- Implements hub-and-spoke architecture with communities
- Uses React Sigma layout hooks for regular layouts
- Handles layout switching seamlessly

### Layout Integration
Each layout type integrates with its respective control:
- **Regular layouts** use React Sigma layout hooks (`useLayoutCircular`, `useLayoutCirclepack`, `useLayoutRandom`)
- **Worker layouts** render appropriate control components (`LayoutForceControl`, `LayoutForceAtlas2Control`, `LayoutNoverlapControl`)
- Automatic cleanup when switching between layouts

## Usage

1. **Select a Layout**: Click any layout button in the right panel
2. **Observe Changes**: Watch the graph transform to the new layout
3. **Worker Layouts**: For continuous layouts, use the control buttons that appear on the graph
4. **Compare Results**: Switch between layouts to see how they affect the same graph structure

## Layout Characteristics

### Random Layout
- **Best for**: Initial graph setup, testing
- **Performance**: Instant
- **Use case**: When you need a quick starting point

### Circular Layout
- **Best for**: Ring structures, equal importance nodes
- **Performance**: Instant
- **Use case**: Social networks, organizational charts

### Circle Pack Layout
- **Best for**: Hierarchical data, nested structures
- **Performance**: Instant
- **Use case**: File systems, organizational hierarchies

### Force Layout
- **Best for**: General purpose, organic layouts
- **Performance**: Continuous (adjustable)
- **Use case**: Social networks, knowledge graphs

### ForceAtlas2 Layout
- **Best for**: Large graphs, better convergence
- **Performance**: Continuous (adjustable)
- **Use case**: Complex networks, research applications

### No Overlap Layout
- **Best for**: Dense graphs, readability
- **Performance**: Continuous (adjustable)
- **Use case**: Cluttered visualizations, presentation

## Dependencies

This example requires the following React Sigma layout packages:

```bash
npm install @react-sigma/layout-core
npm install @react-sigma/layout-circular
npm install @react-sigma/layout-circlepack
npm install @react-sigma/layout-force
npm install @react-sigma/layout-forceatlas2
npm install @react-sigma/layout-noverlap
npm install @react-sigma/layout-random
```

## Code Structure

```
ComprehensiveLayoutsExample.tsx
├── LayoutControls (UI component for layout selection)
├── LayoutGraph (Graph rendering with layout hooks)
└── ComprehensiveLayoutsExample (Main component with worker controls)
```

### Key Components

- **LayoutControls**: Interactive UI for selecting between regular and worker layouts
- **LayoutGraph**: Graph rendering using React Sigma layout hooks for regular layouts
- **Worker Layout Controls**: Built-in control components for continuous layouts

## Customization

The example can be easily customized by:
- Modifying the graph structure in `LayoutGraph`
- Adding new layout types to the controls
- Changing the visual styling of controls and panels
- Adjusting the graph complexity and node count

## Performance Considerations

- **Regular layouts** are instant and suitable for real-time switching
- **Worker layouts** run continuously and should be stopped when not needed
- **Large graphs** (>100 nodes) may benefit from performance tuning
- **Layout switching** automatically manages worker layout lifecycle

## Browser Compatibility

This example works in all modern browsers that support:
- ES6+ features
- Canvas API
- Web Workers (for worker layouts)
- CSS Grid and Flexbox

## Related Documentation

- [React Sigma Layouts Documentation](https://sim51.github.io/react-sigma/docs/example/layouts/)
- [Graphology Layout Library](https://graphology.github.io/standard-library/layout.html)
- [Sigma.js Documentation](https://www.sigmajs.org/)
