import { BrowserRouter } from 'react-router-dom';

import Router from '@/app/routes/Router';
import { Toaster } from '@/shadcn/ui/sonner';

function App() {
  return (
    <BrowserRouter>
      <Router />
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
