// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isOnline: boolean;
}

// Auth related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Agent related types
export interface Agent {
  id: string;
  name: string;
  description: string;
  personality: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project related types
export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  agentId?: string;
  agent?: Agent;
  createdAt: Date;
  updatedAt: Date;
}

// Message related types
export interface Message {
  id: string;
  content: string;
  sender: string;
  projectId: string;
  createdAt: Date;
}

// Evaluation related types
export interface EvaluationMetric {
  name: string;
  value: number;
  maxValue: number;
  description: string;
}

export interface Evaluation {
  id: string;
  projectId: string;
  metrics: EvaluationMetric[];
  feedback: string;
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Report related types
export interface ReportOptions {
  includeTitle: boolean;
  includeLogo: boolean;
  includeTimestamp: boolean;
  language: 'es' | 'en';
  colorScheme: 'default' | 'dark' | 'light';
  format: 'A4' | 'Letter';
}

// Course related types
export interface Course {
  id: string;
  name: string;
  description: string;
  code: string;
  startDate: Date;
  endDate: Date;
  professorId: string;
  professor?: User;
  students?: User[];
  groups?: CourseGroup[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseGroup {
  id: string;
  name: string;
  description?: string;
  courseId: string;
  course?: Course;
  students?: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseQRCode {
  qrCodeUrl: string;
  enrollmentUrl: string;
} 