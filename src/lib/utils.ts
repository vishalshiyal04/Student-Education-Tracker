import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Course, Grade, Assignment, Exam, CreditStats, SemesterStats, GradeDistribution } from '@/types';

// Utility function for merging class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Color palette for courses
export const courseColors = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#ec4899', // pink
];

// Get a random color for new courses
export function getRandomCourseColor(): string {
  return courseColors[Math.floor(Math.random() * courseColors.length)];
}

// Convert score to grade point (common 4.0 scale)
export function scoreToGradePoint(score: number): number {
  if (score >= 90) return 4.0;
  if (score >= 85) return 3.7;
  if (score >= 82) return 3.3;
  if (score >= 78) return 3.0;
  if (score >= 75) return 2.7;
  if (score >= 72) return 2.3;
  if (score >= 68) return 2.0;
  if (score >= 64) return 1.5;
  if (score >= 60) return 1.0;
  return 0;
}

// Convert score to letter grade
export function scoreToLetterGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 82) return 'B+';
  if (score >= 78) return 'B';
  if (score >= 75) return 'B-';
  if (score >= 72) return 'C+';
  if (score >= 68) return 'C';
  if (score >= 64) return 'C-';
  if (score >= 60) return 'D';
  return 'F';
}

// Calculate GPA from grades
export function calculateGPA(grades: Grade[]): number {
  if (grades.length === 0) return 0;
  
  const totalPoints = grades.reduce((sum, grade) => sum + grade.gradePoint * grade.credits, 0);
  const totalCredits = grades.reduce((sum, grade) => sum + grade.credits, 0);
  
  return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
}

// Calculate credit statistics
export function calculateCreditStats(grades: Grade[], settings: { totalRequiredCredits: number; requiredCredits: number; electiveCredits: number; generalCredits: number }): CreditStats {
  const completed = grades.reduce((sum, grade) => sum + grade.credits, 0);
  
  const required = grades
    .filter((g) => g.category === 'required')
    .reduce((sum, grade) => sum + grade.credits, 0);
  
  const elective = grades
    .filter((g) => g.category === 'elective')
    .reduce((sum, grade) => sum + grade.credits, 0);
  
  const general = grades
    .filter((g) => g.category === 'general')
    .reduce((sum, grade) => sum + grade.credits, 0);

  return {
    total: settings.totalRequiredCredits,
    completed,
    required: { total: settings.requiredCredits, completed: required },
    elective: { total: settings.electiveCredits, completed: elective },
    general: { total: settings.generalCredits, completed: general },
  };
}

// Calculate semester statistics
export function calculateSemesterStats(grades: Grade[]): SemesterStats[] {
  const semesterMap = new Map<string, Grade[]>();
  
  grades.forEach((grade) => {
    const existing = semesterMap.get(grade.semester) || [];
    existing.push(grade);
    semesterMap.set(grade.semester, existing);
  });

  return Array.from(semesterMap.entries())
    .map(([semester, semesterGrades]) => {
      const gpa = calculateGPA(semesterGrades);
      const credits = semesterGrades.reduce((sum, g) => sum + g.credits, 0);
      const avgScore = semesterGrades.reduce((sum, g) => sum + g.score, 0) / semesterGrades.length;
      
      return {
        semester,
        gpa,
        credits,
        avgScore: Number(avgScore.toFixed(1)),
      };
    })
    .sort((a, b) => a.semester.localeCompare(b.semester));
}

// Calculate grade distribution
export function calculateGradeDistribution(grades: Grade[]): GradeDistribution[] {
  const ranges = [
    { range: '90-100', min: 90, max: 100 },
    { range: '80-89', min: 80, max: 89 },
    { range: '70-79', min: 70, max: 79 },
    { range: '60-69', min: 60, max: 69 },
    { range: '<60', min: 0, max: 59 },
  ];

  return ranges.map(({ range, min, max }) => ({
    range,
    count: grades.filter((g) => g.score >= min && g.score <= max).length,
  }));
}

// Get today's courses
export function getTodayCourses(courses: Course[]): (Course & { schedule: NonNullable<Course['schedule']>[0] })[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  const result: (Course & { schedule: NonNullable<Course['schedule']>[0] })[] = [];
  
  courses.forEach((course) => {
    course.schedule.forEach((sched) => {
      if (sched.dayOfWeek === dayOfWeek) {
        result.push({ ...course, schedule: sched });
      }
    });
  });
  
  return result.sort((a, b) => a.schedule.startTime.localeCompare(b.schedule.startTime));
}

// Get upcoming assignments
export function getUpcomingAssignments(assignments: Assignment[], limit: number = 5): Assignment[] {
  const now = Date.now();
  return assignments
    .filter((a) => a.status !== 'completed' && a.dueDate > now)
    .sort((a, b) => a.dueDate - b.dueDate)
    .slice(0, limit);
}

// Get upcoming exams
export function getUpcomingExams(exams: Exam[], limit: number = 5): Exam[] {
  const now = Date.now();
  return exams
    .filter((e) => e.date > now)
    .sort((a, b) => a.date - b.date)
    .slice(0, limit);
}

// Update assignment status based on due date
export function updateAssignmentStatus(assignments: Assignment[]): Assignment[] {
  const now = Date.now();
  return assignments.map((a) => {
    if (a.status !== 'completed' && a.dueDate < now) {
      return { ...a, status: 'overdue' as const };
    }
    return a;
  });
}

// Format time for display
export function formatTime(time: string): string {
  return time;
}

// Format date for display
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format datetime for display
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Get relative time string
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (diff < 0) {
    const absDiff = Math.abs(diff);
    const absDays = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    if (absDays > 0) return `${absDays}d overdue`;
    const absHours = Math.floor(absDiff / (1000 * 60 * 60));
    if (absHours > 0) return `${absHours}h overdue`;
    return 'Just now';
  }

  if (days > 0) return `${days}d left`;
  if (hours > 0) return `${hours}h left`;
  if (minutes > 0) return `${minutes}m left`;
  return 'Now';
}

// Get day name
export function getDayName(dayOfWeek: number, short: boolean = false): string {
  const days = short
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || '';
}

// Generate time slots for schedule
export function generateTimeSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

// Check if a reminder should be shown
export function shouldShowReminder(dueDate: number, reminder: string): boolean {
  const now = Date.now();
  const diff = dueDate - now;
  const days = diff / (1000 * 60 * 60 * 24);

  switch (reminder) {
    case '1day':
      return days <= 1 && days > 0;
    case '3days':
      return days <= 3 && days > 0;
    case '1week':
      return days <= 7 && days > 0;
    default:
      return false;
  }
}

// Parse time string to minutes from midnight
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Get course by ID
export function getCourseById(courses: Course[], id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

// Get course name by ID
export function getCourseNameById(courses: Course[], id: string): string {
  const course = getCourseById(courses, id);
  return course?.name || 'Unknown Course';
}
