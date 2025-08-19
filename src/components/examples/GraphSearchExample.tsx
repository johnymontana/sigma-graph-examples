import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useSetSettings } from '@react-sigma/core';
import Graph from 'graphology';
import { circular } from 'graphology-layout';

const SearchControls: React.FC<{ 
  onSearch: (query: string) => void,
  searchResults: string[],
  onResultSelect: (nodeId: string) => void,
  currentQuery: string
}> = ({ onSearch, searchResults, onResultSelect, currentQuery }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      background: 'white',
      padding: '15px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      width: '300px',
      zIndex: 1000
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Graph Search:</h4>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nodes..."
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
          {currentQuery && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                padding: '8px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {currentQuery && (
        <div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
            {searchResults.length > 0 
              ? `Found ${searchResults.length} result(s) for "${currentQuery}"`
              : `No results for "${currentQuery}"`
            }
          </div>
          
          {searchResults.length > 0 && (
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              {searchResults.map(nodeId => (
                <button
                  key={nodeId}
                  onClick={() => onResultSelect(nodeId)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '6px 8px',
                    margin: '2px 0',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9ecef';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                >
                  {nodeId}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Try searching for: "Tech", "Bio", "Finance", or specific company names
      </div>
    </div>
  );
};

const SearchGraph: React.FC<{ 
  searchQuery: string, 
  highlightedNodes: Set<string>,
  onSearchResults: (results: string[]) => void 
}> = ({ searchQuery, highlightedNodes, onSearchResults }) => {
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  useEffect(() => {
    const graph = new Graph();
    
    // Create a company network with different industries and fixed positions
    const companies = [
      // Tech companies (positioned in top-right cluster)
      { id: 'Apple', label: 'Apple Inc.', industry: 'Tech', size: 20, color: '#007AFF', x: 3, y: -2 },
      { id: 'Google', label: 'Google LLC', industry: 'Tech', size: 18, color: '#4285F4', x: 4, y: -1 },
      { id: 'Microsoft', label: 'Microsoft Corp.', industry: 'Tech', size: 17, color: '#00BCF2', x: 2, y: -3 },
      { id: 'Amazon', label: 'Amazon.com Inc.', industry: 'Tech', size: 16, color: '#FF9900', x: 5, y: -2 },
      { id: 'Meta', label: 'Meta Platforms', industry: 'Tech', size: 15, color: '#1877F2', x: 3, y: -1 },
      
      // Biotech companies (positioned in bottom-right cluster)
      { id: 'Pfizer', label: 'Pfizer Inc.', industry: 'Biotech', size: 14, color: '#0093D0', x: 3, y: 2 },
      { id: 'Moderna', label: 'Moderna Inc.', industry: 'Biotech', size: 13, color: '#D31245', x: 4, y: 3 },
      { id: 'BioNTech', label: 'BioNTech SE', industry: 'Biotech', size: 12, color: '#00B4A6', x: 2, y: 3 },
      { id: 'Gilead', label: 'Gilead Sciences', industry: 'Biotech', size: 11, color: '#7B68EE', x: 5, y: 2 },
      
      // Finance companies (positioned in bottom-left cluster)
      { id: 'JPMorgan', label: 'JPMorgan Chase', industry: 'Finance', size: 15, color: '#005EB8', x: -3, y: 2 },
      { id: 'Goldman', label: 'Goldman Sachs', industry: 'Finance', size: 14, color: '#0066CC', x: -4, y: 1 },
      { id: 'Morgan Stanley', label: 'Morgan Stanley', industry: 'Finance', size: 13, color: '#FF6600', x: -2, y: 3 },
      
      // Automotive (positioned in top-left cluster)
      { id: 'Tesla', label: 'Tesla Inc.', industry: 'Automotive', size: 16, color: '#CC0000', x: -3, y: -2 },
      { id: 'Ford', label: 'Ford Motor Co.', industry: 'Automotive', size: 12, color: '#003478', x: -4, y: -1 },
      { id: 'GM', label: 'General Motors', industry: 'Automotive', size: 11, color: '#005DAA', x: -2, y: -3 },
    ];

    companies.forEach(company => {
      const isHighlighted = highlightedNodes.has(company.id);
      graph.addNode(company.id, {
        label: company.label,
        industry: company.industry,
        size: company.size * (isHighlighted ? 1.5 : 1),
        color: isHighlighted ? '#ff4757' : company.color,
        originalColor: company.color,
        originalSize: company.size,
        x: company.x,
        y: company.y
      });
    });

    // Add relationships between companies
    const partnerships = [
      ['Apple', 'Google'], ['Apple', 'Microsoft'], ['Google', 'Amazon'],
      ['Microsoft', 'Amazon'], ['Meta', 'Microsoft'], ['Tesla', 'Google'],
      ['Pfizer', 'BioNTech'], ['Moderna', 'Gilead'], ['JPMorgan', 'Goldman'],
      ['Goldman', 'Morgan Stanley'], ['Tesla', 'Apple'], ['Ford', 'Google'],
      ['GM', 'Microsoft'], ['Amazon', 'JPMorgan'], ['Apple', 'Goldman']
    ];

    partnerships.forEach(([source, target]) => {
      const isHighlighted = highlightedNodes.has(source) || highlightedNodes.has(target);
      graph.addEdge(source, target, {
        color: isHighlighted ? '#ff4757' : '#ccc',
        size: isHighlighted ? 3 : 1
      });
    });

    // Layout is already assigned via fixed node positions

    loadGraph(graph);

    setSettings({
      allowInvalidContainer: true,
      renderLabels: true,
      defaultNodeColor: '#666',
      defaultEdgeColor: '#ccc',
      labelRenderedSizeThreshold: 0,
      labelSize: 12
    });

    // Perform search
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

const FilterControls: React.FC<{ 
  onFilterChange: (industry: string | null) => void,
  selectedFilter: string | null 
}> = ({ onFilterChange, selectedFilter }) => {
  const industries = ['All', 'Tech', 'Biotech', 'Finance', 'Automotive'];

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'white',
      padding: '15px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Filter by Industry:</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {industries.map(industry => (
          <button
            key={industry}
            onClick={() => onFilterChange(industry === 'All' ? null : industry)}
            style={{
              padding: '6px 12px',
              backgroundColor: selectedFilter === (industry === 'All' ? null : industry) 
                ? '#007bff' : '#f8f9fa',
              color: selectedFilter === (industry === 'All' ? null : industry) 
                ? 'white' : '#333',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {industry}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Current: {selectedFilter || 'All Industries'}
      </div>
    </div>
  );
};

const GraphSearchExample: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

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

  const handleResultSelect = (nodeId: string) => {
    setHighlightedNodes(new Set([nodeId]));
    // In a real implementation, you might also center the camera on the selected node
  };

  const handleFilterChange = (industry: string | null) => {
    setSelectedFilter(industry);
    if (industry) {
      setSearchQuery(industry);
    } else {
      setSearchQuery('');
      setHighlightedNodes(new Set());
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
      <SigmaContainer style={{ height: '100%', width: '100%' }} settings={{ allowInvalidContainer: true }}>
        <SearchGraph 
          searchQuery={searchQuery}
          highlightedNodes={highlightedNodes}
          onSearchResults={handleSearchResults}
        />
      </SigmaContainer>
      
      <SearchControls 
        onSearch={handleSearch}
        searchResults={searchResults}
        onResultSelect={handleResultSelect}
        currentQuery={searchQuery}
      />
      
      <FilterControls 
        onFilterChange={handleFilterChange}
        selectedFilter={selectedFilter}
      />

      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px',
        zIndex: 1000
      }}>
        <strong>Search Features:</strong><br />
        • Text search across node labels<br />
        • Industry-based filtering<br />
        • Visual highlighting of results<br />
        • Click results to focus nodes
      </div>
    </div>
  );
};

export default GraphSearchExample;