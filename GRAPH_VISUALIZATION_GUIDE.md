# Graph Visualization System Guide

## Overview
The system now supports comprehensive graph visualization and analysis. It detects different graph types and visualizes them accordingly.

## Supported Graph Types

### 1. **Directed Graph**
- Edges have directional arrows
- Example: `A -> B -> C`
- Visualization: Nodes in circular layout with directional arrows

### 2. **Undirected Graph**
- Edges are bidirectional (no arrows)
- Example: `A -- B -- C`
- Visualization: Nodes connected with straight lines

### 3. **Weighted Graph**
- Edges have numerical weights/costs
- Example: `A --10--> B --5--> C`
- Visualization: Edge weights displayed as labels on connections

### 4. **Bidirectional Graph**
- Two directed edges between vertices
- Example: `A <--> B <--> C`
- Visualization: Curved edges showing both directions

### 5. **Directed Acyclic Graph (DAG)**
- Directed graph with no cycles
- Visualization: Clear hierarchical flow with directional arrows

### 6. **Cyclic Graph**
- Contains cycles (paths that loop back)
- Visualization: Circular edge patterns with active highlighting

### 7. **Complete Graph**
- Every vertex connected to every other vertex
- Visualization: Fully connected mesh pattern

### 8. **Bipartite Graph**
- Vertices divided into two sets
- Edges only between sets, not within
- Visualization: Two groups with cross-connections

## AI Detection Process

When you submit code, the system:
1. **Analyzes the code structure** to identify if it's a graph algorithm
2. **Determines the graph type** based on data structures and operations
3. **Extracts nodes and edges** from the algorithm
4. **Generates simulation steps** for visualization

## Graph State Format

The AI returns graph data in this format:

```json
{
  "name": "Breadth-First Search",
  "type": "Graph Algorithm",
  "structure": "Graph",
  "graphType": "Directed",
  "timeComplexity": "O(V + E)",
  "spaceComplexity": "O(V)",
  "steps": [
    {
      "stepIndex": 0,
      "description": "Initialize queue with start node A",
      "codeLine": 1,
      "state": {
        "nodes": [
          {"id": "A", "label": "A"},
          {"id": "B", "label": "B"},
          {"id": "C", "label": "C"},
          {"id": "D", "label": "D"}
        ],
        "edges": [
          {"source": "A", "target": "B"},
          {"source": "A", "target": "C"},
          {"source": "B", "target": "D"},
          {"source": "C", "target": "D"}
        ]
      },
      "activeElements": ["A"],
      "comparedElements": [],
      "modifiedElements": []
    }
  ]
}
```

## Example Graph Algorithms

### BFS (Breadth-First Search)
```typescript
function bfs(graph: Map<string, string[]>, start: string) {
  const visited = new Set();
  const queue = [start];
  
  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
}
```
**Graph Type Detected**: Directed Graph
**Visualization**: Nodes expand outward as they're visited

### Dijkstra's Shortest Path
```typescript
function dijkstra(graph: Map<string, {node: string, cost: number}[]>, start: string) {
  const distances = new Map();
  const visited = new Set();
  
  for (const [key] of graph) {
    distances.set(key, Infinity);
  }
  distances.set(start, 0);
  
  while (visited.size < graph.size) {
    // Find unvisited node with minimum distance
    let minNode = null;
    let minDist = Infinity;
    
    for (const [node, dist] of distances) {
      if (!visited.has(node) && (dist as number) < minDist) {
        minNode = node;
        minDist = dist as number;
      }
    }
    
    visited.add(minNode);
    
    // Update neighbors
    for (const { node: neighbor, cost } of graph.get(minNode) || []) {
      const newDist = (distances.get(minNode) || 0) + cost;
      if (newDist < (distances.get(neighbor) || Infinity)) {
        distances.set(neighbor, newDist);
      }
    }
  }
  
  return distances;
}
```
**Graph Type Detected**: Weighted Directed Graph
**Visualization**: Edges show weights, visited nodes highlight active path

### Union-Find (Disjoint Set Union)
```typescript
class UnionFind {
  parent: Map<string, string>;
  
  constructor(nodes: string[]) {
    this.parent = new Map();
    for (const node of nodes) {
      this.parent.set(node, node);
    }
  }
  
  find(x: string): string {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }
  
  union(x: string, y: string) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX !== rootY) {
      this.parent.set(rootY, rootX);
    }
  }
}
```
**Graph Type Detected**: Undirected Graph (Connected Components)
**Visualization**: Nodes group into connected components

## Visualization Features

### Node Display
- **Active nodes** (blue): Currently being processed
- **Compared nodes** (amber): Nodes in comparison operations
- **Modified nodes** (red): Recently changed nodes
- **Default nodes** (dark): Not currently active

### Edge Display
- **Directed edges**: Arrow indicators for direction
- **Weighted edges**: Numerical labels on connections
- **Active edges**: Highlighted during traversal
- **Curved edges**: For bidirectional connections

### Interactive Features
- **Pan**: Drag to move the visualization
- **Zoom**: Scroll to zoom in/out
- **Node highlighting**: Color-coded by operation state
- **Real-time updates**: Live simulation as you step through

## Implementation Details

### Graph Type Detection Rules
The AI analyzes code for:
- **Edge direction**: `->` or bidirectional operators
- **Edge weights**: Numerical values on connections
- **Node connectivity**: Patterns of connections
- **Cycles**: Recursive or circular references
- **Vertex partitioning**: Two-set division rules

### Rendering Algorithm
1. **Layout**: Circular arrangement of nodes
2. **Edge drawing**: Line segments with optional arrows
3. **Weight labels**: Text positioned on edges
4. **Highlighting**: Color changes based on active state

### State Representation
Each simulation step includes:
- **State structure**: Complete graph with all nodes and edges
- **Active elements**: Currently processing elements
- **Compared elements**: Elements under comparison
- **Modified elements**: Recently changed elements

## Usage in Audit/Analysis

When you submit graph code in CodeAudit:
1. Code is analyzed by AI
2. Graph type automatically detected
3. Node and edge structure extracted
4. Step-by-step simulation generated
5. Interactive visualization rendered

Example code that triggers graph analysis:
```typescript
// DFS - Depth-First Search
function dfs(graph: Map<string, string[]>, start: string) {
  const visited = new Set<string>();
  
  function explore(node: string) {
    visited.add(node);
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        explore(neighbor);
      }
    }
  }
  
  explore(start);
  return visited;
}
```

## Performance Considerations

- **Small graphs** (< 20 nodes): Full animation smooth
- **Medium graphs** (20-100 nodes): Optimized rendering
- **Large graphs** (> 100 nodes): Simplified visualization

## Future Enhancements

- Force-directed layout algorithm
- Interactive node movement
- Edge bundling for dense graphs
- Subgraph highlighting
- Graph metrics display
- Layout customization options
