import React from 'react';
import { Outlet } from 'react-router';
import { LanguageProvider } from '../context/LanguageContext.tsx';
import { ThemeProvider } from '../context/ThemeContext.tsx';
import { ProviderJobsProvider } from '../context/ProviderJobsContext.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';
import { BookingProvider } from '../context/BookingContext.tsx';
import { NotificationProvider } from '../context/NotificationContext.tsx';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BookingProvider>
            <NotificationProvider>
              <ProviderJobsProvider>
                <Outlet />
              </ProviderJobsProvider>
            </NotificationProvider>
          </BookingProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}