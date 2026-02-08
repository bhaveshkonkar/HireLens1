
export enum AppMode {
  IDLE = 'IDLE',
  INTERVIEW_ONBOARDING = 'INTERVIEW_ONBOARDING',
  INTERVIEW_LIVE = 'INTERVIEW_LIVE',
  INTERVIEW_FEEDBACK = 'INTERVIEW_FEEDBACK',
  TEACHING_LIVE = 'TEACHING_LIVE',
  HR_ELIGIBILITY = 'HR_ELIGIBILITY',
  HR_RESUME_UPLOAD = 'HR_RESUME_UPLOAD',
  HR_LIVE = 'HR_LIVE',
  HR_FEEDBACK = 'HR_FEEDBACK'
}

export interface InterviewConfig {
  domain: string;
  companyType: string;
  targetCompany: string;
  experienceLevel: string;
}

export interface QuestionHistory {
  question: string;
  answerType: 'coding' | 'theory';
  suggestedAnswer: string;
}

export interface FeedbackData {
  overallScore: number;
  communication: number;
  technical: number;
  fluency: number;
  postureScore: number;
  speechAnalysis: string;
  postureAnalysis: string;
  improvementSuggestions: string[];
  history: QuestionHistory[];
  youtubeRecs: { title: string; url: string }[];
  
  // Detailed Performance Metrics
  speechPaceAnalysis?: string;
  fillerWordsAnalysis?: string;
  attireAnalysis?: string;
  eyeContactAnalysis?: string;
  facialExpressionsAnalysis?: string;
  bodyPostureAnalysis?: string;
  handGesturesAnalysis?: string;
  overallCommunicationScore?: number;
  keyImprovements?: string[];
  practiceRecommendations?: string[];
}

export interface VisualElement {
  id: string;
  value: string | number;
  x?: number;
  y?: number;
  color?: string;
  label?: string;
}

export interface VisualConnection {
  from: string;
  to: string;
  type?: 'directed' | 'undirected';
}

export interface VisualPointer {
  name: string;
  elementId: string;
  color: string;
}

export interface VisualState {
  type: 'ARRAY' | 'TREE' | 'GRAPH' | 'LINKED_LIST' | 'POINTERS' | 'MATRIX';
  elements: VisualElement[];
  connections?: VisualConnection[];
  pointers?: VisualPointer[];
}

export interface ResumeAnalysis {
  candidateName: string;
  totalExperience: string;
  keySkills: string[];
  companies: string[];
  projects: string[];
  strengths: string[];
  interviewQuestions: string[];
}

// AlgoVision Pro Classroom Types
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
