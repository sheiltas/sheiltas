import React, { memo } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';

import Router from './Router';
import ClientProvider from './providers/ClientProvider';
import ThemeProvider from './providers/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClientProvider>
      <ReactQueryDevtools position="bottom-left" initialIsOpen={false} />

      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </ClientProvider>
  </QueryClientProvider>
);

export default memo(App);
