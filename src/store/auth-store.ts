// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   avatar?: string;
//   createdAt: number;
// }

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   users: User[];
  
//   // Actions
//   login: (email: string, password: string) => { success: boolean; error?: string };
//   register: (email: string, password: string, name: string) => { success: boolean; error?: string };
//   logout: () => void;
//   updateProfile: (updates: Partial<User>) => void;
// }

// // Simple hash function for demo purposes (in production, use bcrypt or similar)
// function simpleHash(str: string): string {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     const char = str.charCodeAt(i);
//     hash = ((hash << 5) - hash) + char;
//     hash = hash & hash;
//   }
//   return hash.toString(36);
// }

// // Storage for passwords (separate from user data)
// interface PasswordStore {
//   [email: string]: string;
// }

// const PASSWORDS_KEY = 'edutrack-passwords';

// function getPasswordStore(): PasswordStore {
//   if (typeof window === 'undefined') return {};
//   try {
//     return JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}');
//   } catch {
//     return {};
//   }
// }

// function setPasswordStore(store: PasswordStore) {
//   if (typeof window === 'undefined') return;
//   localStorage.setItem(PASSWORDS_KEY, JSON.stringify(store));
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       isAuthenticated: false,
//       users: [],

//       login: (email: string, password: string) => {
//         const state = get();
//         const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
//         if (!user) {
//           return { success: false, error: 'User not found' };
//         }

//         const passwords = getPasswordStore();
//         const storedHash = passwords[email.toLowerCase()];
        
//         if (!storedHash || simpleHash(password + 'edutrack-salt') !== storedHash) {
//           return { success: false, error: 'Invalid password' };
//         }

//         set({ user, isAuthenticated: true });
        
//         // Dispatch custom event for EduTrack store to pick up
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new CustomEvent('auth-change', { 
//             detail: { userId: user.id, action: 'login' } 
//           }));
//         }
        
//         return { success: true };
//       },

//       register: (email: string, password: string, name: string) => {
//         const state = get();
//         const existingUser = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
//         if (existingUser) {
//           return { success: false, error: 'Email already registered' };
//         }

//         if (password.length < 6) {
//           return { success: false, error: 'Password must be at least 6 characters' };
//         }

//         const newUser: User = {
//           id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//           email: email.toLowerCase(),
//           name,
//           createdAt: Date.now(),
//         };

//         // Store password hash
//         const passwords = getPasswordStore();
//         passwords[email.toLowerCase()] = simpleHash(password + 'edutrack-salt');
//         setPasswordStore(passwords);

//         set(state => ({
//           users: [...state.users, newUser],
//           user: newUser,
//           isAuthenticated: true,
//         }));

//         // Dispatch custom event for EduTrack store to pick up
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new CustomEvent('auth-change', { 
//             detail: { userId: newUser.id, action: 'login' } 
//           }));
//         }

//         return { success: true };
//       },

//       logout: () => {
//         const currentUser = get().user;
        
//         set({ user: null, isAuthenticated: false });
        
//         // Dispatch custom event for EduTrack store to pick up
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new CustomEvent('auth-change', { 
//             detail: { userId: null, action: 'logout' } 
//           }));
//         }
//       },

//       updateProfile: (updates: Partial<User>) => {
//         const state = get();
//         if (!state.user) return;

//         const updatedUser = { ...state.user, ...updates };
        
//         set(state => ({
//           user: updatedUser,
//           users: state.users.map(u => u.id === state.user?.id ? updatedUser : u),
//         }));
//       },
//     }),
//     {
//       name: 'edutrack-auth',
//       partialize: (state) => ({
//         user: state.user,
//         isAuthenticated: state.isAuthenticated,
//         users: state.users,
//       }),
//     }
//   )
// );

// // Hook to check if user is authenticated
// export const useAuth = () => {
//   const { user, isAuthenticated, login, register, logout, updateProfile } = useAuthStore();
//   return { user, isAuthenticated, login, register, logout, updateProfile };
// };

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  _hasHydrated: boolean;
  
  // Actions
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (email: string, password: string, name: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setHasHydrated: (state: boolean) => void;
}

// Simple hash function for demo purposes (in production, use bcrypt or similar)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Storage for passwords (separate from user data)
interface PasswordStore {
  [email: string]: string;
}

const PASSWORDS_KEY = 'edutrack-passwords-v2';
const USERS_BACKUP_KEY = 'edutrack-users-backup-v2';

function getPasswordStore(): PasswordStore {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(PASSWORDS_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    console.warn('Failed to parse password store, attempting recovery');
    return {};
  }
}

function setPasswordStore(store: PasswordStore) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save password store:', e);
  }
}

// Backup users to separate storage for recovery
function backupUsers(users: User[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_BACKUP_KEY, JSON.stringify({
      users,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Failed to backup users:', e);
  }
}

// Recover users from backup
function recoverUsers(): User[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const backup = localStorage.getItem(USERS_BACKUP_KEY);
    if (!backup) return null;
    const data = JSON.parse(backup);
    return data.users || null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [],
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      login: (email: string, password: string) => {
        const state = get();
        
        // Try to get users from state, or recover from backup
        let users = state.users;
        if (!users || users.length === 0) {
          const recovered = recoverUsers();
          if (recovered && recovered.length > 0) {
            users = recovered;
            set({ users });
          }
        }
        
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          return { success: false, error: 'User not found. Please check your email or register a new account.' };
        }

        const passwords = getPasswordStore();
        const storedHash = passwords[email.toLowerCase()];
        
        if (!storedHash || simpleHash(password + 'edutrack-salt') !== storedHash) {
          return { success: false, error: 'Invalid password' };
        }

        set({ user, isAuthenticated: true });
        
        // Backup users after successful login
        backupUsers(users);
        
        // Dispatch custom event for EduTrack store to pick up
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth-change', { 
            detail: { userId: user.id, action: 'login' } 
          }));
        }
        
        return { success: true };
      },

      register: (email: string, password: string, name: string) => {
        const state = get();
        const existingUser = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          return { success: false, error: 'Email already registered' };
        }

        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters' };
        }

        const newUser: User = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          email: email.toLowerCase(),
          name,
          createdAt: Date.now(),
        };

        // Store password hash
        const passwords = getPasswordStore();
        passwords[email.toLowerCase()] = simpleHash(password + 'edutrack-salt');
        setPasswordStore(passwords);

        const updatedUsers = [...state.users, newUser];
        
        set({
          users: updatedUsers,
          user: newUser,
          isAuthenticated: true,
        });
        
        // Backup users after registration
        backupUsers(updatedUsers);

        // Dispatch custom event for EduTrack store to pick up
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth-change', { 
            detail: { userId: newUser.id, action: 'login' } 
          }));
        }

        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        
        // Dispatch custom event for EduTrack store to pick up
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth-change', { 
            detail: { userId: null, action: 'logout' } 
          }));
        }
      },

      updateProfile: (updates: Partial<User>) => {
        const state = get();
        if (!state.user) return;

        const updatedUser = { ...state.user, ...updates };
        const updatedUsers = state.users.map(u => u.id === state.user?.id ? updatedUser : u);
        
        set({
          user: updatedUser,
          users: updatedUsers,
        });
        
        // Backup users after profile update
        backupUsers(updatedUsers);
      },
    }),
    {
      name: 'edutrack-auth-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
      }),
      onRehydrateStorage: () => (state) => {
        // This is called when state is rehydrated from storage
        if (state) {
          state.setHasHydrated(true);
          
          // If we have users in state, backup them
          if (state.users && state.users.length > 0) {
            backupUsers(state.users);
          }
          
          // If we have a logged-in user, trigger auth-change event
          if (state.user && state.isAuthenticated) {
            // Use setTimeout to ensure the store is fully hydrated
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('auth-change', { 
                detail: { userId: state.user!.id, action: 'rehydrate' } 
              }));
            }, 0);
          }
        }
      },
      // Migrate from old storage keys if needed
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<AuthState>;
        
        // Try to recover users from backup if not in state
        if (!state.users || state.users.length === 0) {
          const recovered = recoverUsers();
          if (recovered) {
            state.users = recovered;
          }
        }
        
        return state;
      },
      version: 2,
    }
  )
);

// Hook to check if user is authenticated
export const useAuth = () => {
  const { user, isAuthenticated, login, register, logout, updateProfile, _hasHydrated } = useAuthStore();
  return { user, isAuthenticated, login, register, logout, updateProfile, hasHydrated: _hasHydrated };
};
