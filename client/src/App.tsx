import React, { memo } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import Router from './Router';
import PageTemplate from './pages/PageTemplate';
import ClientProvider from './providers/ClientProvider';
import ThemeProvider from './providers/ThemeProvider';

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ClientProvider>
        <ReactQueryDevtools position="bottom-left" initialIsOpen={false} />

        <ThemeProvider>
          <PageTemplate>
            <Router />
          </PageTemplate>
        </ThemeProvider>
      </ClientProvider>
    </QueryClientProvider>
  );
};

export default memo(App);
