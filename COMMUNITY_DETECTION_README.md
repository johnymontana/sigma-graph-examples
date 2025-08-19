# Community Detection Example

This example demonstrates the implementation of community detection algorithms in React Sigma, focusing on the **Louvain algorithm** for modularity optimization as described in the [Graphology Communities Louvain documentation](https://graphology.github.io/standard-library/communities-louvain.html).

## Overview

The community detection example showcases how to identify and visualize communities within network structures using the Louvain algorithm, which is one of the most popular and efficient methods for community detection in networks.

## Features

- **Louvain Algorithm Implementation**: Fast community detection based on modularity optimization
- **Interactive Controls**: Adjustable resolution parameter for fine-tuning community detection
- **Real-time Visualization**: Communities are colored distinctly and labeled for easy identification
- **Dynamic Labeling**: Node labels update to show community membership (e.g., "A1 (Community A)")
- **Performance Metrics**: Detailed algorithm statistics including modularity, computations, and moves
- **Reset Functionality**: Easily restore original graph coloring and labels
- **Node Selection**: Click nodes to highlight and inspect individual elements

## Technical Implementation

### Core Algorithm
The example uses the `graphology-communities-louvain` package which implements:

- **Modularity Optimization**: Maximizes the modularity measure to find optimal community partitions
- **Resolution Parameter**: Adjustable parameter that controls community granularity
- **Detailed Output**: Comprehensive statistics about the algorithm's execution
- **Multi-graph Support**: Works with both directed and undirected graphs

### Graph Structure
The example creates a synthetic network with:
- **5 distinct communities** (A, B, C, D, E) with different sizes
- **Dense intra-community connections** (high clustering within communities)
- **Sparse inter-community connections** (few bridges between communities)
- **Fixed positioning** for consistent visualization

### Key Components

#### CommunityGraph Component
- Generates structured network data with clear community patterns
- Handles algorithm execution with proper error handling
- Manages node coloring based on detected communities
- Provides detailed performance metrics

#### CommunityControls Component
- Interactive resolution slider (0.1 to 2.0)
- Detection and reset buttons with processing states
- Real-time metrics display
- User-friendly parameter explanations

## Algorithm Details

### Louvain Method
The [Louvain algorithm](https://graphology.github.io/standard-library/communities-louvain.html) works by:

1. **Local Optimization**: Each node joins the community that maximizes modularity gain
2. **Community Aggregation**: Creates a new graph where communities become nodes
3. **Iteration**: Repeats until no further modularity improvement is possible
4. **Hierarchy**: Produces a dendrogram of community structures

### Resolution Parameter
- **Lower values (0.1-0.5)**: Fewer, larger communities
- **Default value (1.0)**: Standard modularity optimization
- **Higher values (1.5-2.0)**: More, smaller communities

### Performance Metrics
The algorithm provides detailed statistics:

- **Communities Found**: Number of distinct communities detected
- **Modularity**: Quality measure of the partition (higher is better)
- **Delta Computations**: Number of modularity calculations performed
- **Nodes Visited**: Total node visits during optimization
- **Total Moves**: Sum of node movements between communities

## Usage Instructions

1. **Load the Example**: Navigate to "Community Detection (Louvain)" in the gallery
2. **Adjust Resolution**: Use the slider to change community granularity
3. **Detect Communities**: Click "Detect Communities" to run the algorithm
4. **View Results**: Observe the colored communities, updated labels, and metrics
5. **Reset**: Click "Reset" to restore original colors and labels
6. **Experiment**: Try different resolution values to see how it affects results

## Expected Results

With the default resolution (1.0), the algorithm should typically detect:
- **4-6 communities** corresponding to the original structure
- **High modularity** (typically > 0.4) indicating good community separation
- **Efficient execution** with reasonable computation counts

## Code Structure

```
CommunityDetectionExample.tsx
├── CommunityControls (Interactive UI for algorithm parameters)
├── CommunityGraph (Graph generation and algorithm execution)
└── CommunityDetectionExample (Main component with state management)
```

## Dependencies

This example requires:

```bash
npm install graphology-communities-louvain
```

## Algorithm Performance

The Louvain algorithm is known for:
- **Speed**: O(n log n) complexity for sparse networks
- **Quality**: High modularity results
- **Scalability**: Works well on large networks (thousands of nodes)
- **Robustness**: Handles various network topologies

## Educational Value

This example demonstrates:
- **Community Structure**: How to identify clusters in networks
- **Modularity Optimization**: Understanding of community quality measures
- **Parameter Effects**: Impact of resolution on community granularity
- **Algorithm Visualization**: Real-time feedback on algorithm performance
- **Interactive Analysis**: Hands-on exploration of community detection

## Research Applications

Community detection is used in:
- **Social Networks**: Friend groups, influence clusters
- **Biological Networks**: Protein complexes, gene modules
- **Information Networks**: Topic clusters, citation groups
- **Infrastructure Networks**: Routing communities, service areas
- **Recommendation Systems**: User segments, product categories

## References

The implementation is based on several foundational papers:

- **Blondel et al. (2008)**: "Fast unfolding of communities in large networks" - Original Louvain paper
- **Newman (2006)**: "Modularity and community structure in networks" - Modularity definition
- **Traag et al. (2019)**: "From Louvain to Leiden" - Algorithm improvements

## Customization

The example can be extended by:
- **Adding other algorithms**: Label propagation, modularity-based methods
- **Custom graph structures**: Different network topologies
- **Enhanced visualization**: Community statistics, hierarchical views
- **Parameter comparison**: Side-by-side resolution effects
- **Export functionality**: Save detected communities

This comprehensive example provides both educational value and practical implementation guidance for community detection in network analysis applications.
