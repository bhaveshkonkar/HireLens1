import { analyzeAlgorithm } from './geminiService';

/**
 * GRAPH VISUALIZATION TEST CASES
 * 
 * These test cases demonstrate how different graph algorithms
 * are analyzed and visualized
 */

// Test 1: Directed Graph - BFS
const testBFS = `
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue;
    
    visited.add(node);
    result.push(node);
    
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}
`;

const testBFSInput = `
graph = new Map([
  ["A", ["B", "C"]],
  ["B", ["D", "E"]],
  ["C", ["F", "G"]],
  ["D", []],
  ["E", []],
  ["F", []],
  ["G", []]
])
start = "A"
`;

// Test 2: Weighted Graph - Dijkstra
const testDijkstra = `
function dijkstra(graph, start) {
  const distances = new Map();
  const visited = new Set();
  
  for (const [node] of graph) {
    distances.set(node, Infinity);
  }
  distances.set(start, 0);
  
  while (visited.size < graph.size) {
    let minNode = null;
    let minDist = Infinity;
    
    for (const [node, dist] of distances) {
      if (!visited.has(node) && dist < minDist) {
        minNode = node;
        minDist = dist;
      }
    }
    
    if (minNode === null) break;
    visited.add(minNode);
    
    for (const [neighbor, weight] of graph.get(minNode) || []) {
      const newDist = distances.get(minNode) + weight;
      if (newDist < distances.get(neighbor)) {
        distances.set(neighbor, newDist);
      }
    }
  }
  
  return distances;
}
`;

const testDijkstraInput = `
graph = new Map([
  ["A", [["B", 4], ["C", 2]]],
  ["B", [["D", 5], ["C", 1]]],
  ["C", [["D", 8], ["E", 10]]],
  ["D", [["E", 2]]],
  ["E", []]
])
start = "A"
`;

// Test 3: Undirected Graph - Connected Components
const testConnectedComponents = `
function findConnectedComponents(graph) {
  const visited = new Set();
  const components = [];
  
  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      const component = [];
      const stack = [node];
      
      while (stack.length > 0) {
        const current = stack.pop();
        if (visited.has(current)) continue;
        
        visited.add(current);
        component.push(current);
        
        for (const neighbor of graph.get(current) || []) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
      
      components.push(component);
    }
  }
  
  return components;
}
`;

const testConnectedComponentsInput = `
graph = new Map([
  ["A", ["B"]],
  ["B", ["A", "C"]],
  ["C", ["B"]],
  ["D", ["E"]],
  ["E", ["D", "F"]],
  ["F", ["E"]]
])
`;

// Test 4: Cyclic Graph - Cycle Detection
const testCycleDetection = `
function hasCycle(graph) {
  const visited = new Set();
  const recursionStack = new Set();
  
  function dfs(node) {
    visited.add(node);
    recursionStack.add(node);
    
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }
    
    recursionStack.delete(node);
    return false;
  }
  
  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      if (dfs(node)) return true;
    }
  }
  
  return false;
}
`;

const testCycleDetectionInput = `
graph = new Map([
  ["A", ["B", "C"]],
  ["B", ["D"]],
  ["C", ["D"]],
  ["D", ["E"]],
  ["E", ["B"]]
])
`;

// Test execution simulation
export async function runGraphTests() {
  console.log('🔵 Running Graph Visualization Tests...\n');

  // Test 1: BFS
  console.log('Test 1: BFS (Directed Graph)');
  try {
    const resultBFS = await analyzeAlgorithm(testBFS, testBFSInput);
    console.log('✅ BFS Analysis:');
    console.log('  - Graph Type:', resultBFS.graphType);
    console.log('  - Steps:', resultBFS.steps.length);
    console.log('  - Time Complexity:', resultBFS.timeComplexity);
  } catch (error) {
    console.error('❌ BFS Analysis failed:', error);
  }

  // Test 2: Dijkstra
  console.log('\nTest 2: Dijkstra (Weighted Graph)');
  try {
    const resultDijkstra = await analyzeAlgorithm(testDijkstra, testDijkstraInput);
    console.log('✅ Dijkstra Analysis:');
    console.log('  - Graph Type:', resultDijkstra.graphType);
    console.log('  - Steps:', resultDijkstra.steps.length);
    console.log('  - Time Complexity:', resultDijkstra.timeComplexity);
  } catch (error) {
    console.error('❌ Dijkstra Analysis failed:', error);
  }

  // Test 3: Connected Components
  console.log('\nTest 3: Connected Components (Undirected Graph)');
  try {
    const resultCC = await analyzeAlgorithm(testConnectedComponents, testConnectedComponentsInput);
    console.log('✅ Connected Components Analysis:');
    console.log('  - Graph Type:', resultCC.graphType);
    console.log('  - Steps:', resultCC.steps.length);
    console.log('  - Time Complexity:', resultCC.timeComplexity);
  } catch (error) {
    console.error('❌ Connected Components Analysis failed:', error);
  }

  // Test 4: Cycle Detection
  console.log('\nTest 4: Cycle Detection (Cyclic Graph)');
  try {
    const resultCycle = await analyzeAlgorithm(testCycleDetection, testCycleDetectionInput);
    console.log('✅ Cycle Detection Analysis:');
    console.log('  - Graph Type:', resultCycle.graphType);
    console.log('  - Steps:', resultCycle.steps.length);
    console.log('  - Time Complexity:', resultCycle.timeComplexity);
  } catch (error) {
    console.error('❌ Cycle Detection Analysis failed:', error);
  }
}

/**
 * EXPECTED OUTPUTS
 * 
 * Test 1 (BFS):
 * - graphType: "Directed"
 * - nodes: ["A", "B", "C", "D", "E", "F", "G"]
 * - edges: [A->B, A->C, B->D, B->E, C->F, C->G]
 * - Visualization: Circular layout with nodes expanding outward
 * 
 * Test 2 (Dijkstra):
 * - graphType: "Weighted"
 * - Weighted edges: A--4-->B, A--2-->C, etc.
 * - Active path highlighted during execution
 * - Edge weights displayed as labels
 * 
 * Test 3 (Connected Components):
 * - graphType: "Undirected"
 * - Two separate components identified
 * - Nodes grouped and highlighted distinctly
 * 
 * Test 4 (Cycle Detection):
 * - graphType: "Cyclic"
 * - Cycle path highlighted: D -> E -> B -> D
 * - Active nodes show traversal order
 */
