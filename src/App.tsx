import React from 'react';
import { LanguageProvider } from './i18n';
import { AuthProvider, SyncProvider } from './context';
import { AppRouter } from './app/router';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SyncProvider>
          <AppRouter />
        </SyncProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;

