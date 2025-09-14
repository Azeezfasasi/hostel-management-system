import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// const queryClient = new QueryClient(); 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configure default staleTime for queries to avoid immediate refetches
      // A common setting is 5 minutes (5 * 60 * 1000 ms)
      staleTime: 5 * 60 * 1000, 
      // cacheTime: 10 * 60 * 1000, // Optional: how long unused data stays in cache
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
