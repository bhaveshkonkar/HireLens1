
export enum AlgorithmType {
  SORTING = 'Sorting',
  SEARCHING = 'Searching',
  TREE_TRAVERSAL = 'Tree Traversal',
  GRAPH_ALGORITHM = 'Graph Algorithm',
  DYNAMIC_PROGRAMMING = 'Dynamic Programming'
}

export enum DataStructureType {
  ARRAY = 'Array',
  STRING = 'String',
  LINKED_LIST = 'Linked List',
  TREE = 'Tree',
  GRAPH = 'Graph'
}

export enum LinkedListType {
  SINGLY = 'Singly',
  CIRCULAR = 'Circular',
  DOUBLY = 'Doubly'
}

export enum GraphType {
  DIRECTED = 'Directed',
  UNDIRECTED = 'Undirected',
  WEIGHTED = 'Weighted',
  BIDIRECTIONAL = 'Bidirectional',
  NULL = 'Null',
  MULTIGRAPH = 'Multigraph',
  COMPLETE = 'Complete',
  CONNECTED = 'Connected',
  CYCLIC = 'Cyclic',
  DAG = 'DAG',
  CYCLE = 'Cycle',
  BIPARTITE = 'Bipartite',
  EULER = 'Euler',
  HAMILTON = 'Hamilton'
}

export interface VisualState {
  data: any;
  highlights: number[]; // indices or node IDs
  comparisonIndices?: number[];
  swapIndices?: number[];
  activeLine: number;
  explanation: string;
}

export interface SimulationStep {
  stepIndex: number;
  description: string;
  codeLine: number;
  state: any;
  activeElements: (string | number)[];
  comparedElements?: (string | number)[];
  modifiedElements?: (string | number)[];
}

export interface AlgorithmMetadata {
  name: string;
  type: AlgorithmType;
  structure: DataStructureType;
  linkedListType?: LinkedListType | string; // For linked lists: 'Singly', 'Circular', or 'Doubly'
  graphType?: GraphType | string; // For graphs: type of graph structure
  timeComplexity: string;
  spaceComplexity: string;
  steps: SimulationStep[];
}
