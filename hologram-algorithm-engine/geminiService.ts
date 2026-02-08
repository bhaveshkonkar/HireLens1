
import { GoogleGenAI, Type } from "@google/genai";
import { AlgorithmMetadata, AlgorithmType, DataStructureType } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeAlgorithm(code: string, inputData: string): Promise<AlgorithmMetadata> {
  // Parse input data - handle formats like "arr: [1, 2, 3], target: 5"
  let parsedInput: any = inputData;
  try {
    // Try to parse as JSON directly first
    parsedInput = JSON.parse(inputData);
  } catch (e) {
    // If not JSON, try to extract arrays from key: value format
    if (inputData.includes(':')) {
      const parts = inputData.split(',').map((p: string) => p.trim());
      const extracted: any = {};
      let currentArray: any[] = [];
      
      for (const part of parts) {
        if (part.includes(':')) {
          // Key: value pair
          const [key, val] = part.split(':').map((s: string) => s.trim());
          try {
            extracted[key] = JSON.parse(val);
          } catch {
            extracted[key] = val;
          }
        } else {
          // Continuation of array
          try {
            const parsed = JSON.parse(part);
            if (Array.isArray(parsed)) {
              currentArray = parsed;
            } else if (!isNaN(parsed)) {
              currentArray.push(parsed);
            }
          } catch {
            // Keep as string
          }
        }
      }
      
      parsedInput = Object.keys(extracted).length > 0 ? extracted : inputData;
    }
  }
  
  const inputString = typeof parsedInput === 'string' ? parsedInput : JSON.stringify(parsedInput);
  
  const prompt = `
    Analyze the following code and input data. Provide a detailed, step-by-step execution timeline for visualization.
    
    CRITICAL RULES:
    1. INPUT PARSING: Parse the input data correctly:
       - For "arr: [1, 3, 5, 7, 9, 11, 13, 15], target: 7" extract arr = [1, 3, 5, 7, 9, 11, 13, 15]
       - For "[1, 2, 3]" use that as the array
    2. STRING HANDLING: Display characters as literal characters. NEVER convert to ASCII.
    3. DATA STRUCTURE: Identify if it's Array, Linked List, Tree, Graph, or String.
    4. LINKED LIST DETECTION: If it's a Linked List, determine the type:
       - Singly: Each node has only a 'next' pointer
       - Circular: Last node points back to first node (singly circular)
       - Doubly: Each node has both 'prev' and 'next' pointers
    5. GRAPH DETECTION: If it's a Graph, analyze and determine type:
       - Directed: Edges have direction (arrows)
       - Undirected: Edges have no direction (bidirectional edges)
       - Weighted: Edges have numerical weights/costs
       - Bidirectional: Two directed edges between vertices
       - Null: Only nodes, no edges
       - Multigraph: Multiple edges between same vertices or self-loops
       - Complete: Every vertex connected to every other
       - Connected: All vertices reachable from any starting vertex
       - Cyclic: Contains one or more cycles
       - DAG: Directed Acyclic Graph (directed, no cycles)
       - Cycle: Each vertex has exactly 2 edges
       - Bipartite: Vertices in two sets, edges only between sets
       - Euler: All vertices have even degree
       - Hamilton: Can visit all vertices without revisiting
    6. GRAPH STATE FORMAT - IMPORTANT: Always return state as JSON string containing:
       {
         "nodes": [
           {"id": "A", "label": "A"},
           {"id": "B", "label": "B"}
         ],
         "edges": [
           {"source": "A", "target": "B"},
           {"source": "A", "target": "C", "weight": 10}
         ]
       }
       Example: '{"nodes": [{"id": "A", "label": "A"}, {"id": "B", "label": "B"}], "edges": [{"source": "A", "target": "B"}]}'
    7. LINKED LIST STATE FORMAT: For linked lists, represent state as array of node values in order: [1, 2, 3, 4]
    8. TREE STATE FORMAT: For trees, the state array should contain ONLY the node VALUES (numbers in level-order). Example: [1, 2, 3, 4, 5]
       - For tree traversals (DFS, BFS, In-order, Pre-order, Post-order), populate activeElements with the INDEX of the node being visited (0-indexed)
       - Example: If visiting node at position 2 in level-order array, set activeElements: [2]
    9. ARRAY/STRING STATE FORMAT: For arrays/strings, state should contain the actual values, clean and simple. Do NOT include brackets, commas, or spaces as separate elements.
    
    TREE TRAVERSAL SPECIFICS:
    - For each step in a tree traversal algorithm, activeElements should contain the index of the currently visited node
    - Example for DFS on [1, 2, 3, 4, 5]: 
      Step 1: Visit node 0 (value 1) → activeElements: [0], description: "Visit root node 1"
      Step 2: Visit node 1 (value 2) → activeElements: [1], description: "Visit left child 2"
      Step 3: Visit node 3 (value 4) → activeElements: [3], description: "Visit left subtree node 4"
      etc.
    
    CODE:
    ${code}
    
    INPUT:
    ${inputString}
    
    Return JSON:
    {
      "name": "Algorithm Name",
      "type": "Algorithm Category",
      "structure": "Array | String | Linked List | Tree | Graph",
      "linkedListType": "Singly | Circular | Doubly" (only if structure is Linked List),
      "graphType": "Directed | Undirected | Weighted | Bidirectional | Null | Multigraph | Complete | Connected | Cyclic | DAG | Cycle | Bipartite | Euler | Hamilton" (only if structure is Graph),
      "timeComplexity": "O(...)",
      "spaceComplexity": "O(...)",
      "steps": [
        {
          "stepIndex": 0,
          "description": "Operation description",
          "codeLine": 1,
          "state": "For graphs: complete JSON string like '{\\"nodes\\": [...], \\"edges\\": [...]}'. For arrays: [1, 2, 3]. For others: appropriate format.",
          "activeElements": [list of active node IDs or indices as numbers - for trees this is the index of visited node],
          "comparedElements": [optional list of compared node IDs as numbers],
          "modifiedElements": [optional list of modified node IDs or edge info as numbers]
        }
      ]
    }
  `;

  // Retry logic for handling temporary API failures
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`API call attempt ${attempt}/${maxRetries}...`);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              structure: { type: Type.STRING },
              linkedListType: { type: Type.STRING }, // Optional: "Singly", "Circular", or "Doubly"
              graphType: { type: Type.STRING }, // Optional: graph type classification
              timeComplexity: { type: Type.STRING },
              spaceComplexity: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepIndex: { type: Type.INTEGER },
                    description: { type: Type.STRING },
                    codeLine: { type: Type.INTEGER },
                    // State as string to allow JSON objects for graphs
                    state: { type: Type.STRING },
                    // Use Type.STRING for flexible element identification (numbers or node IDs)
                    activeElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                    comparedElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                    modifiedElements: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["stepIndex", "description", "codeLine", "state", "activeElements"]
                }
              }
            },
            required: ["name", "type", "structure", "timeComplexity", "spaceComplexity", "steps"]
          }
        }
      });

      // Parse response
      const parsed = JSON.parse(response.text.trim()) as AlgorithmMetadata;
      
      // Convert string element IDs to numbers where applicable
      if (parsed.steps && Array.isArray(parsed.steps)) {
        parsed.steps = parsed.steps.map((step: any) => {
          return {
            ...step,
            // Convert string elements to numbers for arrays/linked lists
            activeElements: (step.activeElements || []).map((e: any) => {
              const num = parseInt(String(e), 10);
              return isNaN(num) ? e : num;
            }),
            comparedElements: (step.comparedElements || []).map((e: any) => {
              const num = parseInt(String(e), 10);
              return isNaN(num) ? e : num;
            }),
            modifiedElements: (step.modifiedElements || []).map((e: any) => {
              const num = parseInt(String(e), 10);
              return isNaN(num) ? e : num;
            })
          };
        });
      }
      
      return parsed; // Success
    } catch (error) {
      console.error(`API call attempt ${attempt} failed:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if error is retryable (503, 429, or temporary failures)
      const isRetryable = 
        String(error).includes('503') ||
        String(error).includes('429') ||
        String(error).includes('overloaded') ||
        String(error).includes('rate limit') ||
        String(error).includes('UNAVAILABLE');
      
      if (isRetryable && attempt < maxRetries) {
        // Calculate exponential backoff: 2s, 4s, 8s
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Retryable error detected. Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        // Non-retryable error or max attempts reached
        break;
      }
    }
  }
  
  // All retries failed
  throw lastError || new Error('Failed to analyze algorithm after multiple attempts');
}
