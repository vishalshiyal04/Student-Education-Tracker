'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useEduTrackStore } from '@/store/edutrack-store';

// This component handles loading user-specific data when auth state changes
export function UserDataManager({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const { clearUserData, setCurrentUser } = useEduTrackStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // User logged in - set current user and load their data
      setCurrentUser(user.id);
      
      // Force re-render of components by triggering a small delay
      // This allows the store to rehydrate from the correct localStorage key
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (!isAuthenticated) {
      // User logged out - clear current data
      clearUserData();
      setCurrentUser(null);
    }
  }, [isAuthenticated, user?.id]);

  return <>{children}</>;
}

// Hook to listen for auth changes and reload data
export function useAuthDataSync() {
  const { user, isAuthenticated } = useAuthStore();
  const { clearUserData } = useEduTrackStore();

  useEffect(() => {
    const handleLogin = (event: CustomEvent) => {
      // Reload the page to ensure fresh data load from correct storage
      // This is a simple approach - in production, you might want a more sophisticated solution
      window.location.reload();
    };

    const handleLogout = () => {
      clearUserData();
    };

    window.addEventListener('user-login', handleLogin as EventListener);
    window.addEventListener('user-logout', handleLogout);

    return () => {
      window.removeEventListener('user-login', handleLogin as EventListener);
      window.removeEventListener('user-logout', handleLogout);
    };
  }, [clearUserData]);
}