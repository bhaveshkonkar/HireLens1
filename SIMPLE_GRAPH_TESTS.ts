// SIMPLE GRAPH TEST - Copy this code to test graph visualization

// Test 1: Simple Directed Graph - BFS
const bfsCode = `
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue;
    
    visited.add(node);
    result.push(node);
    
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
  return result;
}
`;

const bfsInput = `
graph = new Map([
  ["A", ["B", "C"]],
  ["B", ["D"]],
  ["C", ["D"]],
  ["D", []]
])
start = "A"
`;

// Test 2: Simple Weighted Graph - Path Finding
const dijkstraCode = `
function findShortest(graph, start) {
  const dist = new Map();
  const visited = new Set();
  
  for (const [node] of graph) dist.set(node, Infinity);
  dist.set(start, 0);
  
  while (visited.size < graph.size) {
    let minNode = null;
    let minDist = Infinity;
    
    for (const [node, d] of dist) {
      if (!visited.has(node) && d < minDist) {
        minNode = node;
        minDist = d;
      }
    }
    
    if (!minNode) break;
    visited.add(minNode);
    
    for (const [neighbor, weight] of graph.get(minNode) || []) {
      const alt = dist.get(minNode) + weight;
      if (alt < dist.get(neighbor)) {
        dist.set(neighbor, alt);
      }
    }
  }
  return dist;
}
`;

const dijkstraInput = `
graph = new Map([
  ["A", [["B", 1], ["C", 4]]],
  ["B", [["C", 2], ["D", 5]]],
  ["C", [["D", 1]]],
  ["D", []]
])
start = "A"
`;

// Test 3: Cyclic Graph Detection
const cycleCode = `
function hasCycle(graph) {
  const white = new Set(graph.keys());
  const gray = new Set();
  const black = new Set();
  
  function dfs(node) {
    white.delete(node);
    gray.add(node);
    
    for (const neighbor of graph.get(node) || []) {
      if (white.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (gray.has(neighbor)) {
        return true;
      }
    }
    
    gray.delete(node);
    black.add(node);
    return false;
  }
  
  while (white.size > 0) {
    if (dfs(white.values().next().value)) return true;
  }
  return false;
}
`;

const cycleInput = `
graph = new Map([
  ["A", ["B"]],
  ["B", ["C"]],
  ["C", ["A"]]
])
`;

/**
 * HOW TO TEST:
 * 
 * 1. Go to the Hologram Algorithm Engine app
 * 2. Copy one of the code snippets above (bfsCode, dijkstraCode, or cycleCode)
 * 3. Paste it in the Code Editor
 * 4. Copy the corresponding input (bfsInput, dijkstraInput, or cycleInput)
 * 5. Paste it in the Input Data field
 * 6. Click "Analyze Algorithm"
 * 7. The graph should visualize in the center with:
 *    - Blue circles for nodes
 *    - Arrow lines for edges
 *    - Numbers on edges for weights (in weighted graphs)
 * 
 * EXPECTED OUTPUTS:
 * 
 * Test 1 (BFS):
 * - Graph Type: Directed
 * - 4 nodes: A, B, C, D
 * - Edges: A->B, A->C, B->D, C->D
 * - Visualization: Circular layout with arrows
 * 
 * Test 2 (Dijkstra):
 * - Graph Type: Weighted
 * - 4 nodes: A, B, C, D
 * - Weighted edges with numbers
 * - Visualization: Shows edge weights
 * 
 * Test 3 (Cycle):
 * - Graph Type: Cyclic
 * - 3 nodes: A, B, C
 * - Edges form a cycle: A->B->C->A
 * - Visualization: Circular pattern
 */
