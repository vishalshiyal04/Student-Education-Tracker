'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  ClipboardList,
  CalendarDays,
  BarChart3,
  ImagePlus,
  Shield,
  Zap,
  LogIn,
  UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomePageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function WelcomePage({ onLoginClick, onRegisterClick }: WelcomePageProps) {
  const features = [
    {
      icon: BookOpen,
      title: 'Course Management',
      description: 'Organize your courses with weekly schedule views and track all your classes in one place.',
    },
    {
      icon: ClipboardList,
      title: 'Assignment Tracking',
      description: 'Never miss a deadline. Track assignments with status labels and reminders.',
    },
    {
      icon: CalendarDays,
      title: 'Exam Calendar',
      description: 'Schedule exams with countdown timers and never forget an important date.',
    },
    {
      icon: BarChart3,
      title: 'Academic Statistics',
      description: 'Visualize your GPA trends, credit progress, and grade distributions.',
    },
    {
      icon: ImagePlus,
      title: 'Screenshot Recognition',
      description: 'Import courses and grades instantly by uploading academic screenshots.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data stays on your device. No cloud storage, complete privacy.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight">EduTrack</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onLoginClick}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button onClick={onRegisterClick}>
                <UserPlus className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Your Personal Student Assistant
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Manage Your Academic Life{' '}
                <span className="text-primary">Effortlessly</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Track courses, assignments, exams, and grades all in one place. 
                Use AI-powered screenshot recognition to import your data instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="text-base px-8" onClick={onRegisterClick}>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Free Account
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8" onClick={onLoginClick}>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                EduTrack provides all the tools you need to stay organized and on top of your academic goals.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-border/50 bg-card">
                    <CardContent className="pt-6">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-8 pb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                  Join thousands of students who are already using EduTrack to manage their academic life more efficiently.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="text-base px-8"
                    onClick={onRegisterClick}
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Your Account
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-base px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={onLoginClick}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    I Already Have an Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-4 text-center text-sm text-muted-foreground">
        <p className="mt-1">All data stored locally on your device for maximum privacy.</p>
        <p>© 2026 EduTrack - Your Student Affairs Management Assistant, Inc. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
