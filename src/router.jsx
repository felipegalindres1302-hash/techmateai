import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LessonList from './pages/LessonList';
import LessonView from './pages/LessonView';
import Profile from './pages/Profile';
import ParentDashboard from './pages/ParentDashboard';
import AdminHome from './pages/AdminHome';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: '/register',
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
  },
  // Protected Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: (
          <Layout>
            <Dashboard />
          </Layout>
        ),
      },
      {
        path: '/lessons',
        element: (
          <Layout>
            <LessonList />
          </Layout>
        ),
      },
      {
        path: '/lessons/:id',
        element: (
          <Layout>
            <LessonView />
          </Layout>
        ),
      },
      {
        path: '/profile',
        element: (
          <Layout>
            <Profile />
          </Layout>
        ),
      },
      {
        path: '/parent-dashboard',
        element: (
          <Layout>
            <ParentDashboard />
          </Layout>
        ),
      },
    ],
  },
  // Admin Routes
  {
    element: <ProtectedRoute requireRole="admin" />,
    children: [
      {
        path: '/admin',
        element: (
          <Layout>
            <AdminHome />
          </Layout>
        ),
      },
    ],
  },
  // Catch all -> redirect to home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;

