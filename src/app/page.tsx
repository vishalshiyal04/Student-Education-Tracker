'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarDays,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Download,
  Upload,
  ImagePlus,
  X,
  Check,
  AlertCircle,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  TrendingUp,
  Target,
  Award,
  Sun,
  Moon,
  Monitor,
  MoreHorizontal,
  GripVertical,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { format, startOfWeek, addDays, isToday, isSameDay, addWeeks, subWeeks } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { v4 as uuidv4 } from 'uuid';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useEduTrackStore } from '@/store/edutrack-store';
import { useAuthStore } from '@/store/auth-store';
import {
  LoginDialog,
  RegisterDialog,
  UserAvatar,
  AuthButtons,
} from '@/components/edutrack/AuthDailogs';
import { WelcomePage } from '@/components/edutrack/welcome-page';
import {
  Course,
  Assignment,
  Exam,
  Grade,
  ViewType,
  CourseSchedule,
} from '@/types';
import {
  courseColors,
  getRandomCourseColor,
  calculateGPA,
  getTodayCourses,
  getUpcomingAssignments,
  getUpcomingExams,
  formatDate,
  formatTime,
  getRelativeTime,
  getDayName,
  timeToMinutes,
  calculateCreditStats,
  calculateSemesterStats,
  calculateGradeDistribution,
  scoreToLetterGrade,
} from '@/lib/utils';

// ============ ICONS COMPONENT ============
const ViewIcons = {
  dashboard: LayoutDashboard,
  courses: BookOpen,
  assignments: ClipboardList,
  exams: CalendarDays,
  statistics: BarChart3,
  settings: Settings,
};

// ============ DAILY QUOTE CARD ============
function DailyQuoteCard() {
  const { currentQuote, refreshQuote, toggleBookmark } = useEduTrackStore();

  if (!currentQuote) return null;

  return (
    <Card className="bg-muted/30 border-none shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl text-muted-foreground/30 select-none">"</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              {currentQuote.text}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground/70">— {currentQuote.author}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => toggleBookmark(currentQuote.id)}
                >
                  {currentQuote.bookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={refreshQuote}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ THEME TOGGLE ============
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1">
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={resolvedTheme === 'light' ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => setTheme('light')}
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={resolvedTheme === 'dark' ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => setTheme('dark')}
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={resolvedTheme !== 'light' && resolvedTheme !== 'dark' ? 'default' : 'ghost'}
        size="icon"
        className="h-7 w-7"
        onClick={() => setTheme('system')}
        title="System mode"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ============ SIDEBAR NAVIGATION ============
function SidebarNav({ onLoginClick, onRegisterClick, onNavigate }: { 
  onLoginClick: () => void; 
  onRegisterClick: () => void;
  onNavigate?: () => void;
}) {
  const { currentView, setCurrentView, courses, assignments, exams, grades } = useEduTrackStore();
  const { user, isAuthenticated } = useAuthStore();

  const navItems: { id: ViewType; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'courses', label: 'Courses' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'exams', label: 'Exams' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'settings', label: 'Settings' },
  ];

  const overdueCount = assignments.filter((a) => a.status === 'overdue').length;
  const upcomingExamCount = exams.filter((e) => e.date > Date.now() && e.date < Date.now() + 7 * 24 * 60 * 60 * 1000).length;

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight">EduTrack</h1>
            <p className="text-xs text-muted-foreground">Student Assistant</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = ViewIcons[item.id];
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.id === 'assignments' && overdueCount > 0 && (
                  <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                    {overdueCount}
                  </Badge>
                )}
                {item.id === 'exams' && upcomingExamCount > 0 && (
                  <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                    {upcomingExamCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Quick Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold tabular-nums">{courses.length}</div>
              <div className="text-xs text-muted-foreground">Courses</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold tabular-nums">{assignments.filter(a => a.status !== 'completed').length}</div>
              <div className="text-xs text-muted-foreground">Tasks</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold tabular-nums">{calculateGPA(grades).toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">GPA</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2 text-center">
              <div className="text-lg font-semibold tabular-nums">{grades.reduce((sum, g) => sum + g.credits, 0)}</div>
              <div className="text-xs text-muted-foreground">Credits</div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-3">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between">
            <UserAvatar user={user} />
            <ThemeToggle />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <AuthButtons onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
          </>
        )}
      </div>
    </div>
  );
}

// ============ MOBILE HEADER ============
function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentView } = useEduTrackStore();
  const { user, isAuthenticated } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const viewLabels: Record<ViewType, string> = {
    dashboard: 'Dashboard',
    courses: 'Courses',
    assignments: 'Assignments',
    exams: 'Exams',
    statistics: 'Statistics',
    settings: 'Settings',
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onMenuClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">{viewLabels[currentView]}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          {isAuthenticated && user && (
            <UserAvatar user={user} />
          )}
        </div>
      </div>
    </header>
  );
}

// ============ COURSE FORM DIALOG ============
interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course;
}

function CourseFormDialog({ open, onOpenChange, course }: CourseFormDialogProps) {
  const { addCourse, updateCourse, courses } = useEduTrackStore();
  
  const defaultFormData = useMemo(() => ({
    name: '',
    instructor: '',
    location: '',
    credits: 3,
    color: getRandomCourseColor(),
    semester: '',
    category: 'required' as const,
    schedule: [{ dayOfWeek: 1, startTime: '09:00', endTime: '10:30' }] as CourseSchedule[],
  }), []);

  const courseFormData = useMemo(() => course ? {
    name: course.name,
    instructor: course.instructor,
    location: course.location,
    credits: course.credits,
    color: course.color,
    semester: course.semester,
    category: course.category,
    schedule: course.schedule.length > 0 ? course.schedule : [{ dayOfWeek: 1, startTime: '09:00', endTime: '10:30' }],
  } : defaultFormData, [course, defaultFormData]);

  const [formData, setFormData] = useState(courseFormData);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData(course ? courseFormData : defaultFormData);
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (course) {
      updateCourse(course.id, formData);
    } else {
      addCourse(formData);
    }
    handleOpenChange(false);
  };

  const addScheduleSlot = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { dayOfWeek: 1, startTime: '09:00', endTime: '10:30' }],
    }));
  };

  const removeScheduleSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };

  const updateScheduleSlot = (index: number, updates: Partial<CourseSchedule>) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((s, i) => (i === index ? { ...s, ...updates } : s)),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg" key={course?.id || 'new'}>
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Add Course'}</DialogTitle>
          <DialogDescription>
            Enter the course details and schedule information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Computer Science, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData((prev) => ({ ...prev, instructor: e.target.value }))}
                placeholder="Name of the instructor"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder=" "
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min={1}
                max={10}
                value={formData.credits}
                onChange={(e) => setFormData((prev) => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                value={formData.semester}
                onChange={(e) => setFormData((prev) => ({ ...prev, semester: e.target.value }))}
                placeholder=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: 'required' | 'elective' | 'general') =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="general">General Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Schedule</Label>
              <Button variant="outline" size="sm" onClick={addScheduleSlot}>
                <Plus className="h-3 w-3 mr-1" /> Add Time
              </Button>
            </div>
            <div className="space-y-2">
              {formData.schedule.map((slot, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Select
                    value={slot.dayOfWeek.toString()}
                    onValueChange={(value) =>
                      updateScheduleSlot(index, { dayOfWeek: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {getDayName(day, true)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateScheduleSlot(index, { startTime: e.target.value })}
                    className="w-28"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateScheduleSlot(index, { endTime: e.target.value })}
                    className="w-28"
                  />
                  {formData.schedule.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeScheduleSlot(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {courseColors.map((color) => (
                <button
                  key={color}
                  className={cn(
                    'h-6 w-6 rounded-full border-2 transition-transform',
                    formData.color === color ? 'border-foreground scale-110' : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
            {course ? 'Save Changes' : 'Add Course'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============ ASSIGNMENT FORM DIALOG ============
interface AssignmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment?: Assignment;
}

function AssignmentFormDialog({ open, onOpenChange, assignment }: AssignmentFormDialogProps) {
  const { addAssignment, updateAssignment, courses } = useEduTrackStore();
  
  const defaultFormData = useMemo(() => ({
    courseId: courses[0]?.id || '',
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '23:59',
    status: 'todo' as const,
    priority: 'medium' as const,
    reminder: 'none' as const,
  }), [courses]);

  const assignmentFormData = useMemo(() => assignment ? {
    courseId: assignment.courseId,
    title: assignment.title,
    description: assignment.description,
    dueDate: format(new Date(assignment.dueDate), 'yyyy-MM-dd'),
    dueTime: format(new Date(assignment.dueDate), 'HH:mm'),
    status: assignment.status,
    priority: assignment.priority,
    reminder: assignment.reminder,
  } : defaultFormData, [assignment, defaultFormData]);

  const [formData, setFormData] = useState(assignmentFormData);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData(assignment ? assignmentFormData : defaultFormData);
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.dueDate) return;

    const dueDate = new Date(`${formData.dueDate}T${formData.dueTime}`).getTime();

    if (assignment) {
      updateAssignment(assignment.id, {
        ...formData,
        dueDate,
      });
    } else {
      addAssignment({
        ...formData,
        dueDate,
      });
    }
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent key={assignment?.id || 'new'}>
        <DialogHeader>
          <DialogTitle>{assignment ? 'Edit Assignment' : 'Add Assignment'}</DialogTitle>
          <DialogDescription>Enter the assignment details and deadline.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Homework 3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, courseId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime">Due Time</Label>
              <Input
                id="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueTime: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Assignment details..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder">Reminder</Label>
            <Select
              value={formData.reminder}
              onValueChange={(value: 'none' | '1day' | '3days' | '1week') =>
                setFormData((prev) => ({ ...prev, reminder: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
                <SelectItem value="3days">3 days before</SelectItem>
                <SelectItem value="1week">1 week before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title.trim() || !formData.dueDate}>
            {assignment ? 'Save Changes' : 'Add Assignment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============ EXAM FORM DIALOG ============
interface ExamFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam?: Exam;
}

function ExamFormDialog({ open, onOpenChange, exam }: ExamFormDialogProps) {
  const { addExam, updateExam, courses } = useEduTrackStore();
  
  const defaultFormData = useMemo(() => ({
    courseId: courses[0]?.id || '',
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration: 120,
    location: '',
    type: 'midterm' as const,
    notes: '',
    reminder: '3days' as const,
  }), [courses]);

  const examFormData = useMemo(() => exam ? {
    courseId: exam.courseId,
    title: exam.title,
    date: format(new Date(exam.date), 'yyyy-MM-dd'),
    time: format(new Date(exam.date), 'HH:mm'),
    duration: exam.duration,
    location: exam.location,
    type: exam.type,
    notes: exam.notes,
    reminder: exam.reminder,
  } : defaultFormData, [exam, defaultFormData]);

  const [formData, setFormData] = useState(examFormData);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData(exam ? examFormData : defaultFormData);
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.date) return;

    const examDate = new Date(`${formData.date}T${formData.time}`).getTime();

    if (exam) {
      updateExam(exam.id, {
        ...formData,
        date: examDate,
      });
    } else {
      addExam({
        ...formData,
        date: examDate,
      });
    }
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent key={exam?.id || 'new'}>
        <DialogHeader>
          <DialogTitle>{exam ? 'Edit Exam' : 'Add Exam'}</DialogTitle>
          <DialogDescription>Enter the exam details and schedule.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Midterm Exam"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, courseId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'midterm' | 'final' | 'quiz' | 'other') =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="midterm">Midterm</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                min={15}
                max={300}
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, duration: parseInt(e.target.value) || 120 }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder">Reminder</Label>
              <Select
                value={formData.reminder}
                onValueChange={(value: 'none' | '1day' | '3days' | '1week') =>
                  setFormData((prev) => ({ ...prev, reminder: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="1day">1 day before</SelectItem>
                  <SelectItem value="3days">3 days before</SelectItem>
                  <SelectItem value="1week">1 week before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title.trim() || !formData.date}>
            {exam ? 'Save Changes' : 'Add Exam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============ SCREENSHOT RECOGNITION DIALOG ============
interface ScreenshotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ScreenshotDialog({ open, onOpenChange }: ScreenshotDialogProps) {
  const { addCourse, addGrade, importCourses, importGrades } = useEduTrackStore();
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [recognizing, setRecognizing] = useState(false);
  const [result, setResult] = useState<{
    type: string;
    courses?: Partial<Course>[];
    grades?: Partial<Grade>[];
  } | null>(null);
  const [editedData, setEditedData] = useState<{
    courses: Partial<Course>[];
    grades: Partial<Grade>[];
  }>({ courses: [], grades: [] });

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const base64 = ev.target?.result as string;
            setImages((prev) => [...prev, base64]);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setImages((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const base64 = ev.target?.result as string;
          setImages((prev) => [...prev, base64]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('paste', handlePaste);
    } else {
      document.removeEventListener('paste', handlePaste);
      setImages([]);
      setResult(null);
      setEditedData({ courses: [], grades: [] });
      setCurrentImageIndex(0);
    }
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [open, handlePaste]);

  const recognizeImage = async () => {
    if (images.length === 0) return;

    setRecognizing(true);
    try {
      const response = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: images[currentImageIndex],
          type: 'auto',
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
        if (data.data.courses) {
          setEditedData({
            courses: data.data.courses.map((c: Partial<Course>) => ({
              ...c,
              id: uuidv4(),
              color: getRandomCourseColor(),
              category: c.category || 'required',
              schedule: c.schedule || [],
            })),
            grades: [],
          });
        } else if (data.data.grades) {
          setEditedData({
            courses: [],
            grades: data.data.grades.map((g: Partial<Grade>) => ({
              ...g,
              id: uuidv4(),
              category: g.category || 'required',
            })),
          });
        }
      }
    } catch (error) {
      console.error('Recognition failed:', error);
    } finally {
      setRecognizing(false);
    }
  };

  const handleImport = () => {
    if (editedData.courses.length > 0) {
      importCourses(
        editedData.courses.map((c) => ({
          id: uuidv4(),
          name: c.name || 'Unknown Course',
          instructor: c.instructor || '',
          location: c.location || '',
          credits: c.credits || 3,
          color: c.color || getRandomCourseColor(),
          schedule: c.schedule || [],
          semester: c.semester || '',
          category: c.category || 'required',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }))
      );
    }
    if (editedData.grades.length > 0) {
      importGrades(
        editedData.grades.map((g) => ({
          id: uuidv4(),
          courseId: '',
          courseName: g.courseName || 'Unknown Course',
          credits: g.credits || 3,
          score: g.score || 0,
          gradePoint: g.gradePoint || 0,
          semester: g.semester || '',
          category: g.category || 'required',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }))
      );
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            Screenshot Recognition
          </DialogTitle>
          <DialogDescription>
            Upload, paste, or drag-and-drop screenshots from your academic system.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {images.length === 0 ? (
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Drag & drop images, paste from clipboard, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Supports class schedules, transcripts, and credit summaries
              </p>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      'h-2 w-2 rounded-full transition-colors',
                      index === currentImageIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-2">
                  Image {currentImageIndex + 1} of {images.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    setImages([]);
                    setResult(null);
                    setEditedData({ courses: [], grades: [] });
                  }}
                >
                  Clear
                </Button>
              </div>

              <div className="relative">
                <img
                  src={images[currentImageIndex]}
                  alt="Screenshot"
                  className="max-h-64 mx-auto rounded-lg border object-contain"
                />
              </div>

              {!result && (
                <Button onClick={recognizeImage} disabled={recognizing} className="w-full">
                  {recognizing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Recognizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Recognize Screenshot
                    </>
                  )}
                </Button>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {result.type === 'schedule' ? 'Class Schedule' : 'Grades/Transcript'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Found {editedData.courses.length || editedData.grades.length} items
                    </span>
                  </div>

                  <ScrollArea className="h-64">
                    {editedData.courses.length > 0 && (
                      <div className="space-y-2">
                        {editedData.courses.map((course, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: course.color }}
                              />
                              <Input
                                value={course.name}
                                onChange={(e) => {
                                  const newCourses = [...editedData.courses];
                                  newCourses[index] = { ...newCourses[index], name: e.target.value };
                                  setEditedData({ ...editedData, courses: newCourses });
                                }}
                                className="h-7 font-medium"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Instructor:</span>
                                <Input
                                  value={course.instructor || ''}
                                  onChange={(e) => {
                                    const newCourses = [...editedData.courses];
                                    newCourses[index] = {
                                      ...newCourses[index],
                                      instructor: e.target.value,
                                    };
                                    setEditedData({ ...editedData, courses: newCourses });
                                  }}
                                  className="h-6 text-sm"
                                />
                              </div>
                              <div>
                                <span className="text-muted-foreground">Location:</span>
                                <Input
                                  value={course.location || ''}
                                  onChange={(e) => {
                                    const newCourses = [...editedData.courses];
                                    newCourses[index] = {
                                      ...newCourses[index],
                                      location: e.target.value,
                                    };
                                    setEditedData({ ...editedData, courses: newCourses });
                                  }}
                                  className="h-6 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {editedData.grades.length > 0 && (
                      <div className="space-y-2">
                        {editedData.grades.map((grade, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Input
                                value={grade.courseName}
                                onChange={(e) => {
                                  const newGrades = [...editedData.grades];
                                  newGrades[index] = { ...newGrades[index], courseName: e.target.value };
                                  setEditedData({ ...editedData, grades: newGrades });
                                }}
                                className="h-7 font-medium flex-1"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Credits:</span>
                                <Input
                                  type="number"
                                  value={grade.credits}
                                  onChange={(e) => {
                                    const newGrades = [...editedData.grades];
                                    newGrades[index] = {
                                      ...newGrades[index],
                                      credits: parseInt(e.target.value) || 0,
                                    };
                                    setEditedData({ ...editedData, grades: newGrades });
                                  }}
                                  className="h-6 text-sm"
                                />
                              </div>
                              <div>
                                <span className="text-muted-foreground">Score:</span>
                                <Input
                                  type="number"
                                  value={grade.score}
                                  onChange={(e) => {
                                    const newGrades = [...editedData.grades];
                                    newGrades[index] = {
                                      ...newGrades[index],
                                      score: parseInt(e.target.value) || 0,
                                    };
                                    setEditedData({ ...editedData, grades: newGrades });
                                  }}
                                  className="h-6 text-sm"
                                />
                              </div>
                              <div>
                                <span className="text-muted-foreground">GP:</span>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={grade.gradePoint}
                                  onChange={(e) => {
                                    const newGrades = [...editedData.grades];
                                    newGrades[index] = {
                                      ...newGrades[index],
                                      gradePoint: parseFloat(e.target.value) || 0,
                                    };
                                    setEditedData({ ...editedData, grades: newGrades });
                                  }}
                                  className="h-6 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {result && (
            <Button onClick={handleImport}>
              <Download className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============ WEEKLY SCHEDULE VIEW ============
function WeeklySchedule() {
  const { courses, settings } = useEduTrackStore();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: settings.weekStartsOn })
  );

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let h = settings.startHour; h <= settings.endHour; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, [settings.startHour, settings.endHour]);

  const getCoursesForDay = (dayIndex: number) => {
    return courses.filter((course) =>
      course.schedule.some((s) => s.dayOfWeek === dayIndex)
    );
  };

  const getCourseBlocks = (course: Course, dayIndex: number) => {
    return course.schedule
      .filter((s) => s.dayOfWeek === dayIndex)
      .map((s) => {
        const startMinutes = timeToMinutes(s.startTime);
        const endMinutes = timeToMinutes(s.endTime);
        const top = ((startMinutes - settings.startHour * 60) / 60) * 60;
        const height = ((endMinutes - startMinutes) / 60) * 60;
        return { ...s, top, height };
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold">Weekly Schedule</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: settings.weekStartsOn }))}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 bg-muted/50">
              <div className="p-2 text-center text-xs text-muted-foreground border-r">Time</div>
              {weekDays.map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-2 text-center border-r last:border-r-0',
                    isToday(day) && 'bg-primary/5'
                  )}
                >
                  <div className="text-xs text-muted-foreground">{getDayName(day.getDay(), true)}</div>
                  <div className={cn(
                    'text-sm font-medium',
                    isToday(day) && 'text-primary'
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative grid grid-cols-8" style={{ height: `${timeSlots.length * 60}px` }}>
              <div className="border-r">
                {timeSlots.map((slot, i) => (
                  <div
                    key={slot}
                    className="h-[60px] px-2 text-xs text-muted-foreground text-right"
                    style={{ borderTop: i > 0 ? '1px solid hsl(var(--border))' : 'none' }}
                  >
                    {slot}
                  </div>
                ))}
              </div>

              {weekDays.map((day, dayIndex) => {
                const dayCourses = getCoursesForDay(day.getDay());
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      'relative border-r last:border-r-0',
                      isToday(day) && 'bg-primary/5'
                    )}
                  >
                    {timeSlots.map((_, i) => (
                      <div
                        key={i}
                        className="h-[60px]"
                        style={{ borderTop: '1px solid hsl(var(--border))' }}
                      />
                    ))}
                    {dayCourses.flatMap((course) =>
                      getCourseBlocks(course, day.getDay()).map((block, blockIndex) => (
                        <div
                          key={`${course.id}-${blockIndex}`}
                          className="absolute left-1 right-1 rounded-md p-1.5 text-xs overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          style={{
                            top: block.top,
                            height: block.height,
                            backgroundColor: course.color + '20',
                            borderLeft: `3px solid ${course.color}`,
                          }}
                        >
                          <div className="font-medium truncate">{course.name}</div>
                          <div className="text-muted-foreground truncate">
                            {block.startTime} - {block.endTime}
                          </div>
                          {course.location && (
                            <div className="text-muted-foreground truncate">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {course.location}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ DASHBOARD VIEW ============
function DashboardView() {
  const { courses, assignments, exams, grades, settings } = useEduTrackStore();
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [screenshotDialogOpen, setScreenshotDialogOpen] = useState(false);

  const todayCourses = useMemo(() => getTodayCourses(courses), [courses]);
  const upcomingAssignments = useMemo(() => getUpcomingAssignments(assignments, 5), [assignments]);
  const upcomingExams = useMemo(() => getUpcomingExams(exams, 3), [exams]);
  const gpa = useMemo(() => calculateGPA(grades), [grades]);
  const creditStats = useMemo(() => calculateCreditStats(grades, settings), [grades, settings]);

  return (
    <div className="space-y-6">
      <DailyQuoteCard />

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setScreenshotDialogOpen(true)}>
          <ImagePlus className="h-4 w-4 mr-2" />
          Recognize Screenshot
        </Button>
        <Button variant="outline" onClick={() => setCourseDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
        <Button variant="outline" onClick={() => setAssignmentDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold tabular-nums">{gpa.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground mb-1">/ 4.00</div>
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <Target className="h-3 w-3 mr-1" />
              Target: {settings.targetGPA.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold tabular-nums">{creditStats.completed}</div>
              <div className="text-sm text-muted-foreground mb-1">/ {creditStats.total}</div>
            </div>
            <Progress
              value={(creditStats.completed / creditStats.total) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{todayCourses.length}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              {todayCourses.length > 0
                ? `Next: ${todayCourses[0].name}`
                : 'No classes today'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">
              {assignments.filter((a) => a.status !== 'completed').length}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {assignments.filter((a) => a.status === 'overdue').length} overdue
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {todayCourses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No classes scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayCourses.map((course, index) => (
                  <motion.div
                    key={`${course.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className="h-10 w-1.5 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{course.name}</div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.schedule.startTime} - {course.schedule.endTime}
                        </span>
                        {course.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {course.location}
                          </span>
                        )}
                      </div>
                    </div>
                    {course.instructor && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {course.instructor}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAssignments.length === 0 && upcomingExams.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming deadlines</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => {
                  const course = courses.find((c) => c.id === assignment.courseId);
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: course?.color + '20',
                          color: course?.color,
                        }}
                      >
                        {course?.name.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{assignment.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {course?.name || 'Unknown Course'}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            assignment.priority === 'high'
                              ? 'destructive'
                              : assignment.priority === 'medium'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          {getRelativeTime(assignment.dueDate)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}

                {upcomingExams.map((exam) => {
                  const course = courses.find((c) => c.id === exam.courseId);
                  return (
                    <div
                      key={exam.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border-l-2 border-red-500"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{exam.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {course?.name || 'Unknown Course'} • {format(new Date(exam.date), 'MMM d, HH:mm')}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-red-500 border-red-500">
                        {getRelativeTime(exam.date)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CourseFormDialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen} />
      <AssignmentFormDialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen} />
      <ScreenshotDialog open={screenshotDialogOpen} onOpenChange={setScreenshotDialogOpen} />
    </div>
  );
}

// ============ COURSES VIEW ============
function CoursesView() {
  const { courses, deleteCourse } = useEduTrackStore();
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Courses</h2>
          <p className="text-muted-foreground">Manage your course schedule</p>
        </div>
        <Button onClick={() => setCourseDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      <WeeklySchedule />

      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
          <CardDescription>All registered courses for this semester</CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No courses added yet</p>
              <Button variant="link" onClick={() => setCourseDialogOpen(true)}>
                Add your first course
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: course.color + '20',
                      color: course.color,
                    }}
                  >
                    {course.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{course.name}</div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      {course.instructor && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {course.instructor}
                        </span>
                      )}
                      {course.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {course.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {course.credits} credits
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setEditingCourse(course);
                        setCourseDialogOpen(true);
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                      onClick={() => setDeleteId(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CourseFormDialog
        open={courseDialogOpen}
        onOpenChange={(open) => {
          setCourseDialogOpen(open);
          if (!open) setEditingCourse(undefined);
        }}
        course={editingCourse}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) deleteCourse(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============ ASSIGNMENTS VIEW ============
function AssignmentsView() {
  const { assignments, updateAssignment, deleteAssignment, courses } = useEduTrackStore();
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed' | 'overdue'>('all');

  const filteredAssignments = useMemo(() => {
    let filtered = assignments;
    if (filter !== 'all') {
      filtered = assignments.filter((a) => a.status === filter);
    }
    return filtered.sort((a, b) => a.dueDate - b.dueDate);
  }, [assignments, filter]);

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-muted-foreground">Track your assignments and deadlines</p>
        </div>
        <Button onClick={() => setAssignmentDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'todo', 'in_progress', 'completed', 'overdue'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'All' : status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <Badge variant="secondary" className="ml-2">
                {assignments.filter((a) => a.status === status).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No assignments found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssignments.map((assignment) => {
                const course = courses.find((c) => c.id === assignment.courseId);
                return (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <button
                      className="h-5 w-5 rounded border-2 flex items-center justify-center transition-colors"
                      style={{
                        borderColor: assignment.status === 'completed' ? 'hsl(var(--primary))' : undefined,
                        backgroundColor: assignment.status === 'completed' ? 'hsl(var(--primary))' : undefined,
                      }}
                      onClick={() =>
                        updateAssignment(assignment.id, {
                          status: assignment.status === 'completed' ? 'todo' : 'completed',
                        })
                      }
                    >
                      {assignment.status === 'completed' && <Check className="h-3 w-3 text-primary-foreground" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={cn('font-medium', assignment.status === 'completed' && 'line-through text-muted-foreground')}>
                        {assignment.title}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{course?.name || 'Unknown Course'}</span>
                        <span>Due: {format(new Date(assignment.dueDate), 'MMM d, HH:mm')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[assignment.status]}>
                        {assignment.status === 'in_progress' ? 'In Progress' : assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">
                        {getRelativeTime(assignment.dueDate)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingAssignment(assignment);
                              setAssignmentDialogOpen(true);
                            }}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {assignment.status !== 'in_progress' && (
                            <DropdownMenuItem onClick={() => updateAssignment(assignment.id, { status: 'in_progress' })}>
                              Start Working
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteId(assignment.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AssignmentFormDialog
        open={assignmentDialogOpen}
        onOpenChange={(open) => {
          setAssignmentDialogOpen(open);
          if (!open) setEditingAssignment(undefined);
        }}
        assignment={editingAssignment}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assignment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) deleteAssignment(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============ EXAMS VIEW ============
function ExamsView() {
  const { exams, deleteExam, courses } = useEduTrackStore();
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sortedExams = useMemo(() => {
    return [...exams].sort((a, b) => a.date - b.date);
  }, [exams]);

  const upcomingExams = useMemo(() => {
    return sortedExams.filter((e) => e.date > Date.now());
  }, [sortedExams]);

  const pastExams = useMemo(() => {
    return sortedExams.filter((e) => e.date <= Date.now());
  }, [sortedExams]);

  const typeColors = {
    midterm: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    final: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    quiz: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Exams</h2>
          <p className="text-muted-foreground">Manage your exam schedule</p>
        </div>
        <Button onClick={() => setExamDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Exam
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingExams.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastExams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="grid gap-4">
            {upcomingExams.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming exams</p>
                </CardContent>
              </Card>
            ) : (
              upcomingExams.map((exam) => {
                const course = courses.find((c) => c.id === exam.courseId);
                return (
                  <Card key={exam.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="h-12 w-12 rounded-lg flex items-center justify-center text-lg font-semibold"
                          style={{
                            backgroundColor: course?.color + '20',
                            color: course?.color,
                          }}
                        >
                          {exam.title.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{exam.title}</h3>
                            <Badge className={typeColors[exam.type]}>
                              {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{course?.name || 'Unknown Course'}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <CalendarDays className="h-4 w-4" />
                              {format(new Date(exam.date), 'EEEE, MMMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {format(new Date(exam.date), 'HH:mm')} ({exam.duration} min)
                            </span>
                            {exam.location && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {exam.location}
                              </span>
                            )}
                          </div>
                          {exam.notes && (
                            <p className="mt-2 text-sm text-muted-foreground">{exam.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-lg">
                            {getRelativeTime(exam.date)}
                          </Badge>
                          <div className="mt-2 flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingExam(exam);
                                setExamDialogOpen(true);
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                              onClick={() => setDeleteId(exam.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {pastExams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No past exams</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pastExams.map((exam) => {
                    const course = courses.find((c) => c.id === exam.courseId);
                    return (
                      <div
                        key={exam.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 opacity-60"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{exam.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {course?.name || 'Unknown Course'} • {format(new Date(exam.date), 'MMM d, yyyy')}
                          </div>
                        </div>
                        <Badge className={typeColors[exam.type]}>
                          {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ExamFormDialog
        open={examDialogOpen}
        onOpenChange={(open) => {
          setExamDialogOpen(open);
          if (!open) setEditingExam(undefined);
        }}
        exam={editingExam}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this exam? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) deleteExam(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============ STATISTICS VIEW ============
function StatisticsView() {
  const { grades, settings, courses } = useEduTrackStore();
  const [showAddGrade, setShowAddGrade] = useState(false);

  const gpa = useMemo(() => calculateGPA(grades), [grades]);
  const creditStats = useMemo(() => calculateCreditStats(grades, settings), [grades, settings]);
  const semesterStats = useMemo(() => calculateSemesterStats(grades), [grades]);
  const gradeDistribution = useMemo(() => calculateGradeDistribution(grades), [grades]);

  const avgScore = useMemo(() => {
    if (grades.length === 0) return 0;
    return grades.reduce((sum, g) => sum + g.score, 0) / grades.length;
  }, [grades]);

  const highestScore = useMemo(() => {
    if (grades.length === 0) return 0;
    return Math.max(...grades.map((g) => g.score));
  }, [grades]);

  const creditPieData = [
    { name: 'Required', value: creditStats.required.completed, color: '#3b82f6' },
    { name: 'Elective', value: creditStats.elective.completed, color: '#22c55e' },
    { name: 'General', value: creditStats.general.completed, color: '#eab308' },
    { name: 'Remaining', value: Math.max(0, creditStats.total - creditStats.completed), color: '#d1d5db' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Statistics</h2>
          <p className="text-muted-foreground">Track your academic progress</p>
        </div>
        <Button onClick={() => setShowAddGrade(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Grade
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current GPA</p>
                <p className="text-3xl font-bold tabular-nums">{gpa.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <Progress value={(gpa / 4) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold tabular-nums">{avgScore.toFixed(1)}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Score</p>
                <p className="text-3xl font-bold tabular-nums">{highestScore}</p>
              </div>
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-3xl font-bold tabular-nums">{grades.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>GPA Trend by Semester</CardTitle>
          </CardHeader>
          <CardContent>
            {semesterStats.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No grade data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={semesterStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="semester" className="text-xs" />
                  <YAxis domain={[0, 4]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={creditPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {creditPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold tabular-nums">{creditStats.required.completed}/{creditStats.required.total}</div>
                <div className="text-muted-foreground">Required</div>
              </div>
              <div>
                <div className="font-semibold tabular-nums">{creditStats.elective.completed}/{creditStats.elective.total}</div>
                <div className="text-muted-foreground">Elective</div>
              </div>
              <div>
                <div className="font-semibold tabular-nums">{creditStats.general.completed}/{creditStats.general.total}</div>
                <div className="text-muted-foreground">General</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            {grades.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No grade data available
              </div>
            ) : (
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {grades.slice(-10).reverse().map((grade) => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                    >
                      <div>
                        <div className="font-medium">{grade.courseName}</div>
                        <div className="text-sm text-muted-foreground">
                          {grade.semester} • {grade.credits} credits
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold tabular-nums">{grade.score}</div>
                        <Badge variant="outline">{scoreToLetterGrade(grade.score)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddGrade} onOpenChange={setShowAddGrade}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Grade</DialogTitle>
            <DialogDescription>Record a course grade</DialogDescription>
          </DialogHeader>
          <GradeForm onClose={() => setShowAddGrade(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ GRADE FORM ============
function GradeForm({ onClose }: { onClose: () => void }) {
  const { addGrade } = useEduTrackStore();
  const [formData, setFormData] = useState({
    courseName: '',
    credits: 3,
    score: 85,
    semester: '',
    category: 'required' as const,
  });

  const handleSubmit = () => {
    if (!formData.courseName.trim()) return;

    const gradePoint = formData.score >= 90 ? 4.0 :
      formData.score >= 85 ? 3.7 :
      formData.score >= 82 ? 3.3 :
      formData.score >= 78 ? 3.0 :
      formData.score >= 75 ? 2.7 :
      formData.score >= 72 ? 2.3 :
      formData.score >= 68 ? 2.0 :
      formData.score >= 64 ? 1.5 :
      formData.score >= 60 ? 1.0 : 0;

    addGrade({
      courseId: '',
      courseName: formData.courseName,
      credits: formData.credits,
      score: formData.score,
      gradePoint,
      semester: formData.semester,
      category: formData.category,
    });
    onClose();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Course Name *</Label>
        <Input
          value={formData.courseName}
          onChange={(e) => setFormData((prev) => ({ ...prev, courseName: e.target.value }))}
          placeholder="e.g., Calculus I"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Credits</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={formData.credits}
            onChange={(e) => setFormData((prev) => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Score</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={formData.score}
            onChange={(e) => setFormData((prev) => ({ ...prev, score: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Semester</Label>
          <Input
            value={formData.semester}
            onChange={(e) => setFormData((prev) => ({ ...prev, semester: e.target.value }))}
            placeholder="e.g., Fall 2024"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: 'required' | 'elective' | 'general') =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="required">Required</SelectItem>
              <SelectItem value="elective">Elective</SelectItem>
              <SelectItem value="general">General Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!formData.courseName.trim()}>Add Grade</Button>
      </DialogFooter>
    </div>
  );
}

// ============ SETTINGS VIEW ============
function SettingsView() {
  const { settings, updateSettings, exportData, importData, clearAllData, courses, assignments, exams, grades } = useEduTrackStore();
  const [importError, setImportError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edutrack-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as string;
      const success = importData(data);
      if (success) {
        setImportError(null);
      } else {
        setImportError('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Configure your preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Target GPA</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                min={0}
                max={4}
                value={settings.targetGPA}
                onChange={(e) => updateSettings({ targetGPA: parseFloat(e.target.value) || 0 })}
                className="w-24"
              />
              <span className="text-muted-foreground">/ 4.00</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Total Required Credits</Label>
            <Input
              type="number"
              min={0}
              value={settings.totalRequiredCredits}
              onChange={(e) => updateSettings({ totalRequiredCredits: parseInt(e.target.value) || 0 })}
              className="w-32"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Required</Label>
              <Input
                type="number"
                min={0}
                value={settings.requiredCredits}
                onChange={(e) => updateSettings({ requiredCredits: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Elective</Label>
              <Input
                type="number"
                min={0}
                value={settings.electiveCredits}
                onChange={(e) => updateSettings({ electiveCredits: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>General</Label>
              <Input
                type="number"
                min={0}
                value={settings.generalCredits}
                onChange={(e) => updateSettings({ generalCredits: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedule Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Day Start Time</Label>
              <Select
                value={settings.startHour.toString()}
                onValueChange={(value) => updateSettings({ startHour: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 6).map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h.toString().padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Day End Time</Label>
              <Select
                value={settings.endHour.toString()}
                onValueChange={(value) => updateSettings({ endHour: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => i + 18).map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h.toString().padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Week Starts On</Label>
            <Select
              value={settings.weekStartsOn.toString()}
              onValueChange={(value) => updateSettings({ weekStartsOn: parseInt(value) as 0 | 1 })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sunday</SelectItem>
                <SelectItem value="1">Monday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">Download all your data as a JSON file</p>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Import Data</p>
              <p className="text-sm text-muted-foreground">Restore data from a backup file</p>
            </div>
            <div>
              <input
                type="file"
                accept=".json"
                id="import-file"
                className="hidden"
                onChange={handleImport}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-file')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
          {importError && (
            <p className="text-sm text-destructive">{importError}</p>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Clear All Data</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete all courses, assignments, exams, and grades
              </p>
            </div>
            <Button variant="destructive" onClick={() => setShowClearConfirm(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground">
            <p>Current data:</p>
            <ul className="mt-2 space-y-1">
              <li>• {courses.length} courses</li>
              <li>• {assignments.length} assignments</li>
              <li>• {exams.length} exams</li>
              <li>• {grades.length} grade records</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your courses, assignments, exams, and grades. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                clearAllData();
                setShowClearConfirm(false);
              }}
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============ AUTH SYNC COMPONENT ============
function AuthSyncHandler() {
  const { user, _hasHydrated } = useAuthStore();
  const { setCurrentUser } = useEduTrackStore();

  useEffect(() => {
    const handleAuthChange = (event: CustomEvent) => {
      const { userId, action } = event.detail;
      if ((action === 'login' || action === 'rehydrate') && userId) {
        setCurrentUser(userId);
      } else if (action === 'logout') {
        setCurrentUser(null);
      }
    };

    window.addEventListener('auth-change', handleAuthChange as EventListener);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange as EventListener);
    };
  }, [setCurrentUser]);

  useEffect(() => {
    if (_hasHydrated && user?.id) {
      setCurrentUser(user.id);
    }
  }, [_hasHydrated, user?.id, setCurrentUser]);

  return null;
}

// ============ MAIN APP ============
export default function EduTrackApp() {
  const { currentView } = useEduTrackStore();
  const { isAuthenticated } = useAuthStore();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'courses': return <CoursesView />;
      case 'assignments': return <AssignmentsView />;
      case 'exams': return <ExamsView />;
      case 'statistics': return <StatisticsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthSyncHandler />
        <WelcomePage
          onLoginClick={() => setLoginOpen(true)}
          onRegisterClick={() => setRegisterOpen(true)}
        />
        <LoginDialog
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onSwitchToRegister={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
        />
        <RegisterDialog
          open={registerOpen}
          onOpenChange={setRegisterOpen}
          onSwitchToLogin={() => {
            setRegisterOpen(false);
            setLoginOpen(true);
          }}
        />
      </>
    );
  }

  return (
    <>
      <AuthSyncHandler />
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Mobile Navigation Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Application navigation and settings</SheetDescription>
            </VisuallyHidden>
            <SidebarNav
              onLoginClick={() => {
                setMobileMenuOpen(false);
                setLoginOpen(true);
              }}
              onRegisterClick={() => {
                setMobileMenuOpen(false);
                setRegisterOpen(true);
              }}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 border-r bg-card flex-col">
          <SidebarNav
            onLoginClick={() => setLoginOpen(true)}
            onRegisterClick={() => setRegisterOpen(true)}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0 lg:min-h-screen">
          <ScrollArea className="flex-1">
            <div className="p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollArea>
          <footer className="border-t py-3 px-4 sm:py-4 sm:px-6 text-center text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Education Tracker. All rights reserved. Made with ❤️ by AI.
          </footer>
        </main>
      </div>
    </>
  );
}