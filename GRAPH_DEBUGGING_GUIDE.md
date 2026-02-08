# Graph Visualization - Debugging & Testing

## Issues Fixed ✅

### 1. State Parsing Issue
- **Problem**: Graph state comes as a string from AI but wasn't being parsed properly
- **Solution**: Added JSON.parse handling in both HologramRenderer.tsx and App.tsx
- **Location**: Lines 95-100 in HologramRenderer.tsx, Lines 574-585 in App.tsx

### 2. Edge Property Names Mismatch
- **Problem**: Code was looking for `edge.from` and `edge.to` but AI returns `edge.source` and `edge.target`
- **Solution**: Updated App.tsx graph renderer to check for both formats
- **Location**: Lines 590-600 in App.tsx

### 3. Missing Graph Type Detection
- **Problem**: App.tsx wasn't properly detecting graph structures
- **Solution**: Added normalized string comparisons for graph detection
- **Location**: Lines 421-425 in App.tsx

### 4. Graph Data Format
- **Problem**: AI wasn't consistently formatting nodes as objects with `id` and `label`
- **Solution**: Added mapping in App.tsx to normalize node format
- **Location**: Lines 588-591 in App.tsx

## How Graph Visualization Works

### Step 1: Code Analysis
When user submits graph algorithm code:
```typescript
// AI receives this and analyzes it
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  // ... algorithm code
}
```

### Step 2: AI Detection
The Gemini AI:
1. **Identifies** it's a graph algorithm
2. **Detects graph type** (Directed, Weighted, Cyclic, etc.)
3. **Extracts nodes**: ["A", "B", "C", "D"]
4. **Extracts edges**: `[{source: "A", target: "B"}, ...]`
5. **Returns structured JSON**

### Step 3: State Format
AI returns state as:
```json
{
  "nodes": [
    {"id": "A", "label": "A"},
    {"id": "B", "label": "B"},
    {"id": "C", "label": "C"}
  ],
  "edges": [
    {"source": "A", "target": "B"},
    {"source": "A", "target": "C"},
    {"source": "B", "target": "C"}
  ]
}
```

As a **JSON string** in the step state field:
```
"state": "{\"nodes\": [...], \"edges\": [...]}"
```

### Step 4: Rendering Pipeline

#### HologramRenderer.tsx:
```
1. Receives currentStep.state (string)
2. Checks if struct === DataStructureType.GRAPH
3. Pre-parses state from string to object (line 95)
4. Extracts nodes and edges
5. Calculates circular layout positions
6. Renders SVG edges with arrows for directed graphs
7. Renders node circles with colors based on activity state
```

#### App.tsx HologramRendererInline:
```
1. Similar process in renderStructure()
2. Adds logging for debugging (console.log)
3. Handles both formats: {source/target} and {from/to}
4. Displays graph type in title
5. Shows edge weights for weighted graphs
6. Applies active/compared/modified styling
```

## Testing Instructions

### Option 1: Simple BFS (Recommended First Test)
```
Code:
function bfs(graph, start) {
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
  return visited;
}

Input:
graph = new Map([
  ["A", ["B", "C"]],
  ["B", ["D"]],
  ["C", ["D"]],
  ["D", []]
])
start = "A"
```

**Expected Output:**
- Graph type: Directed
- 4 circular nodes: A, B, C, D
- 4 edges: A→B, A→C, B→D, C→D
- Edges have arrow indicators

### Option 2: Weighted Graph (Dijkstra)
```
Code:
function dijkstra(graph, start) {
  const dist = new Map();
  for (const [node] of graph) dist.set(node, Infinity);
  dist.set(start, 0);
  const visited = new Set();
  
  while (visited.size < graph.size) {
    let minNode = null, minDist = Infinity;
    for (const [node, d] of dist) {
      if (!visited.has(node) && d < minDist) {
        minNode = node; minDist = d;
      }
    }
    if (!minNode) break;
    visited.add(minNode);
    
    for (const [nb, w] of graph.get(minNode) || []) {
      const alt = dist.get(minNode) + w;
      if (alt < dist.get(nb)) dist.set(nb, alt);
    }
  }
  return dist;
}

Input:
graph = new Map([
  ["A", [["B", 1], ["C", 4]]],
  ["B", [["C", 2], ["D", 5]]],
  ["C", [["D", 1]]],
  ["D", []]
])
start = "A"
```

**Expected Output:**
- Graph type: Weighted
- Edges display numbers (1, 4, 2, 5, 1)
- Directed arrows
- Active node highlighted in blue during traversal

### Option 3: Cycle Detection
```
Code:
function hasCycle(graph) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  
  function dfs(node) {
    color.set(node, GRAY);
    for (const neighbor of graph.get(node) || []) {
      if (color.get(neighbor) === GRAY) return true;
      if (color.get(neighbor) !== BLACK) {
        if (dfs(neighbor)) return true;
      }
    }
    color.set(node, BLACK);
    return false;
  }
  
  for (const [node] of graph) {
    if (color.get(node) !== BLACK) {
      if (dfs(node)) return true;
    }
  }
  return false;
}

Input:
graph = new Map([
  ["A", ["B"]],
  ["B", ["C"]],
  ["C", ["A"]]
])
```

**Expected Output:**
- Graph type: Cyclic
- 3 nodes: A, B, C
- Creates triangle: A→B→C→A
- Cycle path highlighted during detection

## Debugging Console Output

When graph visualization runs, check browser console for:

```
Graph Debug: { 
  nodes: [{id: "A", label: "A"}, ...], 
  edges: [{source: "A", target: "B"}, ...],
  rawState: {...}
}
```

If you see this, the parsing is working correctly.

## Common Issues & Solutions

### Issue: Nothing Displays
**Cause**: Graph state not parsed properly
**Fix**: Check browser console for "Graph Debug" output
**Verify**: Step has `structure: "Graph"`

### Issue: Edges Not Showing
**Cause**: Node names in edges don't match node IDs
**Fix**: Ensure AI returns consistent node IDs
**Check**: nodes[i].id === edges[j].source/target (exact match)

### Issue: Nodes Disappear
**Cause**: Scale/transform overflow
**Fix**: Auto-scales radius based on node count (line 588)
**Verify**: radius = Math.max(120, nodeCount * 35)

### Issue: Wrong Edge Direction
**Cause**: Graph type not detected as Directed
**Fix**: Check metadata.graphType in console
**Verify**: AI prompt includes directed graph detection

## Files Modified

1. **types.ts**
   - Added GraphType enum (14 types)
   - Updated AlgorithmMetadata interface

2. **geminiService.ts**
   - Enhanced AI prompt with graph detection rules
   - Updated response schema for graphType

3. **HologramRenderer.tsx**
   - Added pre-processing for graph state parsing
   - Implemented graph rendering with circular layout
   - Added SVG arrow markers for directed edges
   - Support for weighted edge labels

4. **App.tsx**
   - Fixed graph detection with normalized comparisons
   - Updated graph visualization with proper edge properties
   - Added console logging for debugging
   - Support for both source/target and from/to edge formats

## Performance Notes

- Graphs up to 20 nodes: Smooth animation
- 21-50 nodes: Optimized rendering
- 50+ nodes: Consider simplifying visualization
- Edge count: Linear performance with node count
- Layout: O(n) circular positioning

## Next Steps

1. Test with simple graph code (BFS first)
2. Check browser console for debug output
3. Verify nodes and edges display
4. Test weighted graph (with numbers on edges)
5. Test cyclic graphs
6. Test directed vs undirected detection

## Success Criteria ✅

- [ ] Nodes appear in circular layout
- [ ] Edges display between nodes
- [ ] Directed graphs show arrows
- [ ] Weighted graphs show edge labels
- [ ] Active nodes highlight in blue
- [ ] Graph type displayed in title
- [ ] No console errors
- [ ] Smooth animation on playback
