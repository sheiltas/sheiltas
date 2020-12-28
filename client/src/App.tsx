import React, { memo } from 'react';
import Router from './Router';
import PageTemplate from './pages/PageTemplate';
import ClientProvider from './providers/ClientProvider';
import ThemeProvider from './providers/ThemeProvider';

const App = () => {
  return (
    <ClientProvider>
      <ThemeProvider>
        <PageTemplate>
          <Router />
        </PageTemplate>
      </ThemeProvider>
    </ClientProvider>
  );
};

export default memo(App);
