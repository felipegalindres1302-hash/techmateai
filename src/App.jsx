import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import router from './router';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#1E293B',
              borderRadius: '1.25rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              padding: '12px 20px',
              border: '2px solid #BFDBFE',
            },
          }}
        />
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
