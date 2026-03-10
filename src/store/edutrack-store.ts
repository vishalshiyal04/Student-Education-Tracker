
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import {
//   Course,
//   Assignment,
//   Exam,
//   Grade,
//   Quote,
//   Settings,
//   ViewType,
//   RecognitionResult,
// } from '@/types';
// import { v4 as uuidv4 } from 'uuid';

// // Default quotes library
// const defaultQuotes: Quote[] = [
//   { id: '1', text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela', category: 'famous', bookmarked: false },
//   { id: '2', text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King', category: 'learning', bookmarked: false },
//   { id: '3', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivational', bookmarked: false },
//   { id: '4', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', category: 'motivational', bookmarked: false },
//   { id: '5', text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci', category: 'learning', bookmarked: false },
//   { id: '6', text: 'The more that you read, the more things you will know. The more that you learn, the more places you\'ll go.', author: 'Dr. Seuss', category: 'learning', bookmarked: false },
//   { id: '7', text: 'Education is not the filling of a pail, but the lighting of a fire.', author: 'William Butler Yeats', category: 'famous', bookmarked: false },
//   { id: '8', text: 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.', author: 'Brian Herbert', category: 'motivational', bookmarked: false },
//   { id: '9', text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', author: 'Mahatma Gandhi', category: 'famous', bookmarked: false },
//   { id: '10', text: 'The expert in anything was once a beginner.', author: 'Helen Hayes', category: 'motivational', bookmarked: false },
//   { id: '11', text: 'Knowledge speaks, but wisdom listens.', author: 'Jimi Hendrix', category: 'learning', bookmarked: false },
//   { id: '12', text: 'The only limit to our realization of tomorrow will be our doubts of today.', author: 'Franklin D. Roosevelt', category: 'motivational', bookmarked: false },
//   { id: '13', text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', category: 'motivational', bookmarked: false },
//   { id: '14', text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu', category: 'famous', bookmarked: false },
//   { id: '15', text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin', category: 'famous', bookmarked: false },
// ];

// const defaultSettings: Settings = {
//   theme: 'system',
//   targetGPA: 3.5,
//   totalRequiredCredits: 140,
//   requiredCredits: 80,
//   electiveCredits: 40,
//   generalCredits: 20,
//   startHour: 8,
//   endHour: 22,
//   weekStartsOn: 1,
// };

// // User-specific data structure
// interface UserData {
//   courses: Course[];
//   assignments: Assignment[];
//   exams: Exam[];
//   grades: Grade[];
//   settings: Settings;
//   quotes: Quote[];
// }

// // Get empty user data
// const getEmptyUserData = (): UserData => ({
//   courses: [],
//   assignments: [],
//   exams: [],
//   grades: [],
//   settings: defaultSettings,
//   quotes: defaultQuotes,
// });

// // Storage for all users' data
// interface AllUsersData {
//   [userId: string]: UserData;
// }

// // Main state interface
// interface EduTrackState {
//   // All users' data storage
//   allUsersData: AllUsersData;
  
//   // Current active user ID
//   currentUserId: string | null;
  
//   // Navigation
//   currentView: ViewType;
//   setCurrentView: (view: ViewType) => void;

//   // Get current user's data
//   getCurrentUserData: () => UserData;

//   // Courses
//   courses: Course[];
//   addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
//   updateCourse: (id: string, course: Partial<Course>) => void;
//   deleteCourse: (id: string) => void;
//   importCourses: (courses: Course[]) => void;

//   // Assignments
//   assignments: Assignment[];
//   addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) => void;
//   updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
//   deleteAssignment: (id: string) => void;
//   importAssignments: (assignments: Assignment[]) => void;

//   // Exams
//   exams: Exam[];
//   addExam: (exam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>) => void;
//   updateExam: (id: string, exam: Partial<Exam>) => void;
//   deleteExam: (id: string) => void;
//   importExams: (exams: Exam[]) => void;

//   // Grades
//   grades: Grade[];
//   addGrade: (grade: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>) => void;
//   updateGrade: (id: string, grade: Partial<Grade>) => void;
//   deleteGrade: (id: string) => void;
//   importGrades: (grades: Grade[]) => void;

//   // Quotes
//   quotes: Quote[];
//   currentQuote: Quote | null;
//   setCurrentQuote: (quote: Quote) => void;
//   toggleBookmark: (quoteId: string) => void;
//   refreshQuote: () => void;

//   // Recognition
//   recognitionResults: RecognitionResult[];
//   addRecognitionResult: (result: RecognitionResult) => void;
//   clearRecognitionResult: (id: string) => void;

//   // Settings
//   settings: Settings;
//   updateSettings: (settings: Partial<Settings>) => void;

//   // User data management
//   setCurrentUser: (userId: string | null) => void;

//   // Data management
//   exportData: () => string;
//   importData: (data: string) => boolean;
//   clearAllData: () => void;
// }

// export const useEduTrackStore = create<EduTrackState>()(
//   persist(
//     (set, get) => ({
//       // All users' data
//       allUsersData: {},
      
//       // Current user
//       currentUserId: null,

//       // Navigation
//       currentView: 'dashboard',
//       setCurrentView: (view) => set({ currentView: view }),

//       // Get current user's data
//       getCurrentUserData: () => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return getEmptyUserData();
//         return state.allUsersData[userId] || getEmptyUserData();
//       },

//       // Courses
//       courses: [],
//       addCourse: (course) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const newCourse: Course = {
//           ...course,
//           id: uuidv4(),
//           createdAt: Date.now(),
//           updatedAt: Date.now(),
//         };
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
        
//         set({
//           courses: [...state.courses, newCourse],
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               courses: [...userData.courses, newCourse],
//             },
//           },
//         });
//       },
//       updateCourse: (id, course) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
//         const updatedCourses = userData.courses.map((c) =>
//           c.id === id ? { ...c, ...course, updatedAt: Date.now() } : c
//         );
        
//         set({
//           courses: updatedCourses,
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               courses: updatedCourses,
//             },
//           },
//         });
//       },
//       deleteCourse: (id) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
//         const filteredCourses = userData.courses.filter((c) => c.id !== id);
        
//         set({
//           courses: filteredCourses,
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               courses: filteredCourses,
//             },
//           },
//         });
//       },
//       importCourses: (courses) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
        
//         set({
//           courses: [...userData.courses, ...courses],
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               courses: [...userData.courses, ...courses],
//             },
//           },
//         });
//       },

//       // Assignments
//       assignments: [],
//       addAssignment: (assignment) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const newAssignment: Assignment = {
//           ...assignment,
//           id: uuidv4(),
//           createdAt: Date.now(),
//           updatedAt: Date.now(),
//         };
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
        
//         set({
//           assignments: [...state.assignments, newAssignment],
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               assignments: [...userData.assignments, newAssignment],
//             },
//           },
//         });
//       },
//       updateAssignment: (id, assignment) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
//         const updatedAssignments = userData.assignments.map((a) =>
//           a.id === id ? { ...a, ...assignment, updatedAt: Date.now() } : a
//         );
        
//         set({
//           assignments: updatedAssignments,
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               assignments: updatedAssignments,
//             },
//           },
//         });
//       },
//       deleteAssignment: (id) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
//         const filteredAssignments = userData.assignments.filter((a) => a.id !== id);
        
//         set({
//           assignments: filteredAssignments,
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               assignments: filteredAssignments,
//             },
//           },
//         });
//       },
//       importAssignments: (assignments) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
        
//         set({
//           assignments: [...userData.assignments, ...assignments],
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               assignments: [...userData.assignments, ...assignments],
//             },
//           },
//         });
//       },

//       // Exams
//       exams: [],
//       addExam: (exam) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const newExam: Exam = {
//           ...exam,
//           id: uuidv4(),
//           createdAt: Date.now(),
//           updatedAt: Date.now(),
//         };
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
        
//         set({
//           exams: [...state.exams, newExam],
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               exams: [...userData.exams, newExam],
//             },
//           },
//         });
//       },
//       updateExam: (id, exam) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
//         const updatedExams = userData.exams.map((e) =>
//           e.id === id ? { ...e, ...exam, updatedAt: Date.now() } : e
//         );
        
//         set({
//           exams: updatedExams,
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               exams: updatedExams,
//             },
//           },
//         });
//       },
//       deleteExam: (id) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
//         const filteredExams = userData.exams.filter((e) => e.id !== id);
        
//         set({
//           exams: filteredExams,
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               exams: filteredExams,
//             },
//           },
//         });
//       },
//       importExams: (exams) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
        
//         set({
//           exams: [...userData.exams, ...exams],
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               exams: [...userData.exams, ...exams],
//             },
//           },
//         });
//       },

//       // Grades
//       grades: [],
//       addGrade: (grade) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const newGrade: Grade = {
//           ...grade,
//           id: uuidv4(),
//           createdAt: Date.now(),
//           updatedAt: Date.now(),
//         };
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
        
//         set({
//           grades: [...state.grades, newGrade],
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               grades: [...userData.grades, newGrade],
//             },
//           },
//         });
//       },
//       updateGrade: (id, grade) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
//         const updatedGrades = userData.grades.map((g) =>
//           g.id === id ? { ...g, ...grade, updatedAt: Date.now() } : g
//         );
        
//         set({
//           grades: updatedGrades,
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               grades: updatedGrades,
//             },
//           },
//         });
//       },
//       deleteGrade: (id) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
//         const filteredGrades = userData.grades.filter((g) => g.id !== id);
        
//         set({
//           grades: filteredGrades,
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               grades: filteredGrades,
//             },
//           },
//         });
//       },
//       importGrades: (grades) => {
//         const state = get();
//         const userId = state.currentUserId;
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
        
//         set({
//           grades: [...userData.grades, ...grades],
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               grades: [...userData.grades, ...grades],
//             },
//           },
//         });
//       },

//       // Quotes
//       quotes: defaultQuotes,
//       currentQuote: defaultQuotes[0],
//       setCurrentQuote: (quote) => set({ currentQuote: quote }),
//       toggleBookmark: (quoteId) => {
//         const state = get();
//         const userId = state.currentUserId;
        
//         const updatedQuotes = state.quotes.map((q) =>
//           q.id === quoteId ? { ...q, bookmarked: !q.bookmarked } : q
//         );
        
//         const updatedCurrentQuote = state.currentQuote?.id === quoteId
//           ? { ...state.currentQuote, bookmarked: !state.currentQuote.bookmarked }
//           : state.currentQuote;
        
//         set({
//           quotes: updatedQuotes,
//           currentQuote: updatedCurrentQuote,
//         });
        
//         // Also update in user's data if logged in
//         if (userId) {
//           const userData = state.allUsersData[userId] || getEmptyUserData();
//           set({
//             allUsersData: {
//               ...state.allUsersData,
//               [userId]: {
//                 ...userData,
//                 quotes: updatedQuotes,
//               },
//             },
//           });
//         }
//       },
//       refreshQuote: () => {
//         const state = get();
//         const availableQuotes = state.quotes.filter((q) => q.id !== state.currentQuote?.id);
//         const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
//         set({ currentQuote: randomQuote });
//       },

//       // Recognition
//       recognitionResults: [],
//       addRecognitionResult: (result) =>
//         set((state) => ({
//           recognitionResults: [...state.recognitionResults, result],
//         })),
//       clearRecognitionResult: (id) =>
//         set((state) => ({
//           recognitionResults: state.recognitionResults.filter((r) => r.id !== id),
//         })),

//       // Settings
//       settings: defaultSettings,
//       updateSettings: (newSettings) => {
//         const state = get();
//         const userId = state.currentUserId;
//         const updatedSettings = { ...state.settings, ...newSettings };
        
//         set({ settings: updatedSettings });
        
//         if (userId) {
//           const userData = state.allUsersData[userId] || getEmptyUserData();
//           set({
//             allUsersData: {
//               ...state.allUsersData,
//               [userId]: {
//                 ...userData,
//                 settings: updatedSettings,
//               },
//             },
//           });
//         }
//       },

//       // User management
//       setCurrentUser: (userId) => {
//         const state = get();
        
//         if (!userId) {
//           // Logging out - clear current session data
//           set({
//             currentUserId: null,
//             courses: [],
//             assignments: [],
//             exams: [],
//             grades: [],
//             settings: defaultSettings,
//             quotes: defaultQuotes,
//             currentQuote: defaultQuotes[0],
//             currentView: 'dashboard',
//             recognitionResults: [],
//           });
//           return;
//         }
        
//         // Logging in - load user's data
//         const userData = state.allUsersData[userId] || getEmptyUserData();
        
//         set({
//           currentUserId: userId,
//           courses: userData.courses,
//           assignments: userData.assignments,
//           exams: userData.exams,
//           grades: userData.grades,
//           settings: userData.settings,
//           quotes: userData.quotes,
//           currentQuote: userData.quotes[0] || defaultQuotes[0],
//           currentView: 'dashboard',
//           recognitionResults: [],
//         });
//       },

//       // Data management
//       exportData: () => {
//         const state = get();
//         const userId = state.currentUserId;
//         const userData = userId ? state.allUsersData[userId] : null;
        
//         const data = {
//           courses: userData?.courses || state.courses,
//           assignments: userData?.assignments || state.assignments,
//           exams: userData?.exams || state.exams,
//           grades: userData?.grades || state.grades,
//           settings: userData?.settings || state.settings,
//           quotes: (userData?.quotes || state.quotes).filter((q) => q.bookmarked),
//           exportedAt: new Date().toISOString(),
//           exportedBy: userId,
//         };
//         return JSON.stringify(data, null, 2);
//       },
//       importData: (dataStr) => {
//         try {
//           const data = JSON.parse(dataStr);
//           const state = get();
//           const userId = state.currentUserId;
          
//           if (!userId) return false;
          
//           const userData = state.allUsersData[userId] || getEmptyUserData();
          
//           set({
//             courses: data.courses || [],
//             assignments: data.assignments || [],
//             exams: data.exams || [],
//             grades: data.grades || [],
//             settings: data.settings || defaultSettings,
//             allUsersData: {
//               ...state.allUsersData,
//               [userId]: {
//                 ...userData,
//                 courses: data.courses || [],
//                 assignments: data.assignments || [],
//                 exams: data.exams || [],
//                 grades: data.grades || [],
//                 settings: data.settings || defaultSettings,
//               },
//             },
//           });
//           return true;
//         } catch {
//           return false;
//         }
//       },
//       clearAllData: () => {
//         const state = get();
//         const userId = state.currentUserId;
        
//         if (!userId) return;
        
//         const userData = state.allUsersData[userId] || getEmptyUserData();
        
//         set({
//           courses: [],
//           assignments: [],
//           exams: [],
//           grades: [],
//           recognitionResults: [],
//           allUsersData: {
//             ...state.allUsersData,
//             [userId]: {
//               ...userData,
//               courses: [],
//               assignments: [],
//               exams: [],
//               grades: [],
//             },
//           },
//         });
//       },
//     }),
//     {
//       name: 'edutrack-storage',
//       partialize: (state) => ({
//         allUsersData: state.allUsersData,
//       }),
//     }
//   )
// );

// // Helper hooks
// export const useCourses = () => useEduTrackStore((state) => state.courses);
// export const useAssignments = () => useEduTrackStore((state) => state.assignments);
// export const useExams = () => useEduTrackStore((state) => state.exams);
// export const useGrades = () => useEduTrackStore((state) => state.grades);
// export const useSettings = () => useEduTrackStore((state) => state.settings);
// export const useCurrentView = () => useEduTrackStore((state) => state.currentView);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Course,
  Assignment,
  Exam,
  Grade,
  Quote,
  Settings,
  ViewType,
  RecognitionResult,
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Default quotes library
const defaultQuotes: Quote[] = [
  { id: '1', text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela', category: 'famous', bookmarked: false },
  { id: '2', text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King', category: 'learning', bookmarked: false },
  { id: '3', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivational', bookmarked: false },
  { id: '4', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', category: 'motivational', bookmarked: false },
  { id: '5', text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci', category: 'learning', bookmarked: false },
  { id: '6', text: 'The more that you read, the more things you will know. The more that you learn, the more places you\'ll go.', author: 'Dr. Seuss', category: 'learning', bookmarked: false },
  { id: '7', text: 'Education is not the filling of a pail, but the lighting of a fire.', author: 'William Butler Yeats', category: 'famous', bookmarked: false },
  { id: '8', text: 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.', author: 'Brian Herbert', category: 'motivational', bookmarked: false },
  { id: '9', text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', author: 'Mahatma Gandhi', category: 'famous', bookmarked: false },
  { id: '10', text: 'The expert in anything was once a beginner.', author: 'Helen Hayes', category: 'motivational', bookmarked: false },
  { id: '11', text: 'Knowledge speaks, but wisdom listens.', author: 'Jimi Hendrix', category: 'learning', bookmarked: false },
  { id: '12', text: 'The only limit to our realization of tomorrow will be our doubts of today.', author: 'Franklin D. Roosevelt', category: 'motivational', bookmarked: false },
  { id: '13', text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', category: 'motivational', bookmarked: false },
  { id: '14', text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu', category: 'famous', bookmarked: false },
  { id: '15', text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin', category: 'famous', bookmarked: false },
];

const defaultSettings: Settings = {
  theme: 'system',
  targetGPA: 3.5,
  totalRequiredCredits: 140,
  requiredCredits: 80,
  electiveCredits: 40,
  generalCredits: 20,
  startHour: 8,
  endHour: 22,
  weekStartsOn: 1,
};

// User-specific data structure
interface UserData {
  courses: Course[];
  assignments: Assignment[];
  exams: Exam[];
  grades: Grade[];
  settings: Settings;
  quotes: Quote[];
}

// Get empty user data
const getEmptyUserData = (): UserData => ({
  courses: [],
  assignments: [],
  exams: [],
  grades: [],
  settings: defaultSettings,
  quotes: defaultQuotes,
});

// Storage for all users' data
interface AllUsersData {
  [userId: string]: UserData;
}

// Backup key for user data
const USER_DATA_BACKUP_KEY = 'edutrack-userdata-backup-v2';

// Backup user data to separate storage
function backupUserData(userId: string, data: UserData) {
  if (typeof window === 'undefined') return;
  try {
    const existing = localStorage.getItem(USER_DATA_BACKUP_KEY);
    const backup: AllUsersData = existing ? JSON.parse(existing) : {};
    backup[userId] = {
      ...data,
      // Ensure we're not storing any undefined values
      courses: data.courses || [],
      assignments: data.assignments || [],
      exams: data.exams || [],
      grades: data.grades || [],
      settings: data.settings || defaultSettings,
      quotes: data.quotes || defaultQuotes,
    };
    localStorage.setItem(USER_DATA_BACKUP_KEY, JSON.stringify(backup));
  } catch (e) {
    console.error('Failed to backup user data:', e);
  }
}

// Recover user data from backup
function recoverUserData(userId: string): UserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const backup = localStorage.getItem(USER_DATA_BACKUP_KEY);
    if (!backup) return null;
    const data: AllUsersData = JSON.parse(backup);
    return data[userId] || null;
  } catch {
    return null;
  }
}

// Main state interface
interface EduTrackState {
  // All users' data storage
  allUsersData: AllUsersData;
  
  // Current active user ID
  currentUserId: string | null;
  
  // Hydration state
  _hasHydrated: boolean;
  
  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;

  // Get current user's data
  getCurrentUserData: () => UserData;

  // Courses
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  importCourses: (courses: Course[]) => void;

  // Assignments
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  importAssignments: (assignments: Assignment[]) => void;

  // Exams
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  importExams: (exams: Exam[]) => void;

  // Grades
  grades: Grade[];
  addGrade: (grade: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGrade: (id: string, grade: Partial<Grade>) => void;
  deleteGrade: (id: string) => void;
  importGrades: (grades: Grade[]) => void;

  // Quotes
  quotes: Quote[];
  currentQuote: Quote | null;
  setCurrentQuote: (quote: Quote) => void;
  toggleBookmark: (quoteId: string) => void;
  refreshQuote: () => void;

  // Recognition
  recognitionResults: RecognitionResult[];
  addRecognitionResult: (result: RecognitionResult) => void;
  clearRecognitionResult: (id: string) => void;

  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;

  // User data management
  setCurrentUser: (userId: string | null) => void;
  setHasHydrated: (state: boolean) => void;

  // Data management
  exportData: () => string;
  importData: (data: string) => boolean;
  clearAllData: () => void;
}

export const useEduTrackStore = create<EduTrackState>()(
  persist(
    (set, get) => ({
      // All users' data
      allUsersData: {},
      
      // Current user
      currentUserId: null,
      
      // Hydration state
      _hasHydrated: false,

      // Navigation
      currentView: 'dashboard',
      setCurrentView: (view) => set({ currentView: view }),
      
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      // Get current user's data
      getCurrentUserData: () => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return getEmptyUserData();
        return state.allUsersData[userId] || getEmptyUserData();
      },

      // Courses
      courses: [],
      addCourse: (course) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const newCourse: Course = {
          ...course,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedUserData = {
          ...userData,
          courses: [...userData.courses, newCourse],
        };
        
        set({
          courses: [...state.courses, newCourse],
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        // Backup user data
        backupUserData(userId, updatedUserData);
      },
      updateCourse: (id, course) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedCourses = userData.courses.map((c) =>
          c.id === id ? { ...c, ...course, updatedAt: Date.now() } : c
        );
        const updatedUserData = { ...userData, courses: updatedCourses };
        
        set({
          courses: updatedCourses,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      deleteCourse: (id) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const filteredCourses = userData.courses.filter((c) => c.id !== id);
        const updatedUserData = { ...userData, courses: filteredCourses };
        
        set({
          courses: filteredCourses,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      importCourses: (courses) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedUserData = {
          ...userData,
          courses: [...userData.courses, ...courses],
        };
        
        set({
          courses: updatedUserData.courses,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },

      // Assignments
      assignments: [],
      addAssignment: (assignment) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const newAssignment: Assignment = {
          ...assignment,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedUserData = {
          ...userData,
          assignments: [...userData.assignments, newAssignment],
        };
        
        set({
          assignments: [...state.assignments, newAssignment],
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      updateAssignment: (id, assignment) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedAssignments = userData.assignments.map((a) =>
          a.id === id ? { ...a, ...assignment, updatedAt: Date.now() } : a
        );
        const updatedUserData = { ...userData, assignments: updatedAssignments };
        
        set({
          assignments: updatedAssignments,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      deleteAssignment: (id) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const filteredAssignments = userData.assignments.filter((a) => a.id !== id);
        const updatedUserData = { ...userData, assignments: filteredAssignments };
        
        set({
          assignments: filteredAssignments,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      importAssignments: (assignments) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedUserData = {
          ...userData,
          assignments: [...userData.assignments, ...assignments],
        };
        
        set({
          assignments: updatedUserData.assignments,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },

      // Exams
      exams: [],
      addExam: (exam) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const newExam: Exam = {
          ...exam,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedUserData = {
          ...userData,
          exams: [...userData.exams, newExam],
        };
        
        set({
          exams: [...state.exams, newExam],
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      updateExam: (id, exam) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedExams = userData.exams.map((e) =>
          e.id === id ? { ...e, ...exam, updatedAt: Date.now() } : e
        );
        const updatedUserData = { ...userData, exams: updatedExams };
        
        set({
          exams: updatedExams,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      deleteExam: (id) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const filteredExams = userData.exams.filter((e) => e.id !== id);
        const updatedUserData = { ...userData, exams: filteredExams };
        
        set({
          exams: filteredExams,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      importExams: (exams) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedUserData = {
          ...userData,
          exams: [...userData.exams, ...exams],
        };
        
        set({
          exams: updatedUserData.exams,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },

      // Grades
      grades: [],
      addGrade: (grade) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const newGrade: Grade = {
          ...grade,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedUserData = {
          ...userData,
          grades: [...userData.grades, newGrade],
        };
        
        set({
          grades: [...state.grades, newGrade],
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      updateGrade: (id, grade) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedGrades = userData.grades.map((g) =>
          g.id === id ? { ...g, ...grade, updatedAt: Date.now() } : g
        );
        const updatedUserData = { ...userData, grades: updatedGrades };
        
        set({
          grades: updatedGrades,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      deleteGrade: (id) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const filteredGrades = userData.grades.filter((g) => g.id !== id);
        const updatedUserData = { ...userData, grades: filteredGrades };
        
        set({
          grades: filteredGrades,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
      importGrades: (grades) => {
        const state = get();
        const userId = state.currentUserId;
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedUserData = {
          ...userData,
          grades: [...userData.grades, ...grades],
        };
        
        set({
          grades: updatedUserData.grades,
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },

      // Quotes
      quotes: defaultQuotes,
      currentQuote: defaultQuotes[0],
      setCurrentQuote: (quote) => set({ currentQuote: quote }),
      toggleBookmark: (quoteId) => {
        const state = get();
        const userId = state.currentUserId;
        
        const updatedQuotes = state.quotes.map((q) =>
          q.id === quoteId ? { ...q, bookmarked: !q.bookmarked } : q
        );
        
        const updatedCurrentQuote = state.currentQuote?.id === quoteId
          ? { ...state.currentQuote, bookmarked: !state.currentQuote.bookmarked }
          : state.currentQuote;
        
        set({
          quotes: updatedQuotes,
          currentQuote: updatedCurrentQuote,
        });
        
        // Also update in user's data if logged in
        if (userId) {
          const userData = state.allUsersData[userId] || getEmptyUserData();
          const updatedUserData = { ...userData, quotes: updatedQuotes };
          set({
            allUsersData: {
              ...state.allUsersData,
              [userId]: updatedUserData,
            },
          });
          backupUserData(userId, updatedUserData);
        }
      },
      refreshQuote: () => {
        const state = get();
        const availableQuotes = state.quotes.filter((q) => q.id !== state.currentQuote?.id);
        const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
        set({ currentQuote: randomQuote });
      },

      // Recognition
      recognitionResults: [],
      addRecognitionResult: (result) =>
        set((state) => ({
          recognitionResults: [...state.recognitionResults, result],
        })),
      clearRecognitionResult: (id) =>
        set((state) => ({
          recognitionResults: state.recognitionResults.filter((r) => r.id !== id),
        })),

      // Settings
      settings: defaultSettings,
      updateSettings: (newSettings) => {
        const state = get();
        const userId = state.currentUserId;
        const updatedSettings = { ...state.settings, ...newSettings };
        
        set({ settings: updatedSettings });
        
        if (userId) {
          const userData = state.allUsersData[userId] || getEmptyUserData();
          const updatedUserData = { ...userData, settings: updatedSettings };
          set({
            allUsersData: {
              ...state.allUsersData,
              [userId]: updatedUserData,
            },
          });
          backupUserData(userId, updatedUserData);
        }
      },

      // User management
      setCurrentUser: (userId) => {
        const state = get();
        
        if (!userId) {
          // Logging out - clear current session data
          set({
            currentUserId: null,
            courses: [],
            assignments: [],
            exams: [],
            grades: [],
            settings: defaultSettings,
            quotes: defaultQuotes,
            currentQuote: defaultQuotes[0],
            currentView: 'dashboard',
            recognitionResults: [],
          });
          return;
        }
        
        // Logging in - load user's data
        // First try to get from allUsersData, then try backup
        let userData = state.allUsersData[userId];
        if (!userData) {
          userData = recoverUserData(userId);
          if (userData) {
            // Restore to allUsersData from backup
            set({
              allUsersData: {
                ...state.allUsersData,
                [userId]: userData,
              },
            });
          }
        }
        
        if (!userData) {
          userData = getEmptyUserData();
        }
        
        set({
          currentUserId: userId,
          courses: userData.courses,
          assignments: userData.assignments,
          exams: userData.exams,
          grades: userData.grades,
          settings: userData.settings,
          quotes: userData.quotes,
          currentQuote: userData.quotes[0] || defaultQuotes[0],
          currentView: 'dashboard',
          recognitionResults: [],
        });
      },

      // Data management
      exportData: () => {
        const state = get();
        const userId = state.currentUserId;
        const userData = userId ? state.allUsersData[userId] : null;
        
        const data = {
          courses: userData?.courses || state.courses,
          assignments: userData?.assignments || state.assignments,
          exams: userData?.exams || state.exams,
          grades: userData?.grades || state.grades,
          settings: userData?.settings || state.settings,
          quotes: (userData?.quotes || state.quotes).filter((q) => q.bookmarked),
          exportedAt: new Date().toISOString(),
          exportedBy: userId,
        };
        return JSON.stringify(data, null, 2);
      },
      importData: (dataStr) => {
        try {
          const data = JSON.parse(dataStr);
          const state = get();
          const userId = state.currentUserId;
          
          if (!userId) return false;
          
          const userData = state.allUsersData[userId] || getEmptyUserData();
          const updatedUserData = {
            ...userData,
            courses: data.courses || [],
            assignments: data.assignments || [],
            exams: data.exams || [],
            grades: data.grades || [],
            settings: data.settings || defaultSettings,
          };
          
          set({
            courses: data.courses || [],
            assignments: data.assignments || [],
            exams: data.exams || [],
            grades: data.grades || [],
            settings: data.settings || defaultSettings,
            allUsersData: {
              ...state.allUsersData,
              [userId]: updatedUserData,
            },
          });
          
          backupUserData(userId, updatedUserData);
          return true;
        } catch {
          return false;
        }
      },
      clearAllData: () => {
        const state = get();
        const userId = state.currentUserId;
        
        if (!userId) return;
        
        const userData = state.allUsersData[userId] || getEmptyUserData();
        const updatedUserData = {
          ...userData,
          courses: [],
          assignments: [],
          exams: [],
          grades: [],
        };
        
        set({
          courses: [],
          assignments: [],
          exams: [],
          grades: [],
          recognitionResults: [],
          allUsersData: {
            ...state.allUsersData,
            [userId]: updatedUserData,
          },
        });
        
        backupUserData(userId, updatedUserData);
      },
    }),
    {
      name: 'edutrack-storage-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        allUsersData: state.allUsersData,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<EduTrackState>;
        
        // Try to recover user data from backup
        if (state.allUsersData && Object.keys(state.allUsersData).length > 0) {
          // Check each user's data and try to recover from backup if needed
          Object.keys(state.allUsersData).forEach(userId => {
            if (!state.allUsersData![userId] || 
                !state.allUsersData![userId].courses) {
              const recovered = recoverUserData(userId);
              if (recovered) {
                state.allUsersData![userId] = recovered;
              }
            }
          });
        }
        
        return state;
      },
      version: 2,
    }
  )
);

// Helper hooks
export const useCourses = () => useEduTrackStore((state) => state.courses);
export const useAssignments = () => useEduTrackStore((state) => state.assignments);
export const useExams = () => useEduTrackStore((state) => state.exams);
export const useGrades = () => useEduTrackStore((state) => state.grades);
export const useSettings = () => useEduTrackStore((state) => state.settings);
export const useCurrentView = () => useEduTrackStore((state) => state.currentView);
