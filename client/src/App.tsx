import React, { memo } from 'react';
import Router from './Router';
import PageTemplate from './pages/PageTemplate';
import ClientProvider from './providers/ClientProvider';
import ThemeProvider from './providers/ThemeProvider';
import { ReactQueryDevtools } from 'react-query-devtools';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ClientProvider>
        <ReactQueryDevtools initialIsOpen={false} />

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
