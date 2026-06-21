import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import AppInitializer from '@/app/AppInitializer';
import Router from '@/app/routes/Router';
import { Toaster } from '@/shadcn/ui/sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInitializer>
          <Router />
          <Toaster position="top-center" />
        </AppInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
