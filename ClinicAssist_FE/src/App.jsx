import './App.css';
import Login from './Auth/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';
import { AuthProvider } from './Auth/AuthContext';
import ProtectedRoute from './Auth/ProtectedRoute';
import ClinicManagement from './components/Clinic/ClinicManagement';
import DashboardLayout from './components/layout/DashboardLayout';
import { Toaster } from 'react-hot-toast';
import DoctorProfile from './components/Profile/DoctorProfile';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import ClinicSettings from './components/Clinic/ClinicSettings';
import PatientDirectory from './components/Patient/PatientDirectory';
import PatientInfromation from './components/Patient/PatientInfromation';
import { ClinicProvider } from './context/ClinicContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
      onError: (error) => {
        console.log(error);
      },
    },
    mutations: {
      onError: (error) => {
        console.log(error);
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DoctorDashboard />
          },
          {
            path: '/clinic',
            children: [
              { index: true, element: <ClinicManagement /> },
              { path: ':clinicId/settings', element: <ClinicSettings /> },
              
            ],
          },
          {
            path: '/profile',
            element: <DoctorProfile />
          },
          {
            path: 'patient',
            children: [
              { index: true, element: <PatientDirectory /> },
              { path: ':patientId', element: <PatientInfromation /> },
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClinicProvider>
          <Toaster position="top-right" />
          <RouterProvider router={router} />
        </ClinicProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;