
export enum AlgorithmType {
  ARRAY = 'ARRAY',
  LINKED_LIST = 'LINKED_LIST',
  BINARY_TREE = 'BINARY_TREE',
  GRAPH = 'GRAPH',
  DP = 'DP',
  STRINGS = 'STRINGS',
  BITS = 'BITS'
}

export interface VizState {
  type: AlgorithmType;
  data: any;
  currentLine?: number;
  explanation?: string;
  pointers?: Record<string, number | string>;
}

export interface AnimationStep {
  viz: VizState;
  codeLine: number;
  message: string;
}

export interface PanelConfig {
  visible: boolean;
  minimized: boolean;
  x: number;
  y: number;
}
