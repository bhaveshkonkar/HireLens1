
export enum InterviewStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  REVIEWING = 'REVIEWING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface Message {
  role: 'interviewer' | 'candidate';
  text: string;
  timestamp: number;
}

export interface CodeContext {
  code: string;
  language: string;
  fileName: string;
}

export interface FeedbackData {
  correctness: number;
  readability: number;
  complexity: number;
  overall: string;
}

export enum AuditStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
