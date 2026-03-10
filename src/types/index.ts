// Course types
export interface Course {
  id: string;
  name: string;
  instructor: string;
  location: string;
  credits: number;
  color: string;
  schedule: CourseSchedule[];
  semester: string;
  category: 'required' | 'elective' | 'general';
  createdAt: number;
  updatedAt: number;
}

export interface CourseSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  weekStart?: number;
  weekEnd?: number;
  weeks?: number[]; // Specific weeks
}

// Assignment types
export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: number; // timestamp
  status: 'todo' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  reminder: 'none' | '1day' | '3days' | '1week';
  reminderShown?: boolean;
  createdAt: number;
  updatedAt: number;
}

// Exam types
export interface Exam {
  id: string;
  courseId: string;
  title: string;
  date: number; // timestamp
  duration: number; // minutes
  location: string;
  type: 'midterm' | 'final' | 'quiz' | 'other';
  notes: string;
  reminder: 'none' | '1day' | '3days' | '1week';
  reminderShown?: boolean;
  createdAt: number;
  updatedAt: number;
}

// Grade types
export interface Grade {
  id: string;
  courseId: string;
  courseName: string;
  credits: number;
  score: number;
  gradePoint: number;
  semester: string;
  category: 'required' | 'elective' | 'general';
  createdAt: number;
  updatedAt: number;
}

// Quote types
export interface Quote {
  id: string;
  text: string;
  author: string;
  category: 'motivational' | 'learning' | 'famous';
  bookmarked: boolean;
}

// Screenshot recognition types
export interface RecognitionResult {
  id: string;
  type: 'schedule' | 'grades' | 'credits';
  data: Course[] | Grade[];
  confidence: number;
  rawText: string;
  timestamp: number;
}

// Settings types
export interface Settings {
  theme: 'light' | 'dark' | 'system';
  targetGPA: number;
  totalRequiredCredits: number;
  requiredCredits: number;
  electiveCredits: number;
  generalCredits: number;
  startHour: number;
  endHour: number;
  weekStartsOn: 0 | 1; // Sunday or Monday
}

// Navigation types
export type ViewType = 'dashboard' | 'courses' | 'assignments' | 'exams' | 'statistics' | 'settings';

// Time slot for schedule view
export interface TimeSlot {
  hour: number;
  minutes: number[];
}

// Statistics types
export interface SemesterStats {
  semester: string;
  gpa: number;
  credits: number;
  avgScore: number;
}

export interface CreditStats {
  total: number;
  completed: number;
  required: { total: number; completed: number };
  elective: { total: number; completed: number };
  general: { total: number; completed: number };
}

export interface GradeDistribution {
  range: string;
  count: number;
}
