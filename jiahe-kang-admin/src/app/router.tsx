import { createBrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import CaregiverLogs from '../pages/CaregiverLogs';
import DashboardOverview from '../pages/DashboardOverview';
import DataAnalytics from '../pages/DataAnalytics';
import PatientManagement from '../pages/PatientManagement';
import Settings from '../pages/Settings';
import PatientDetail from '../pages/PatientDetail';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <DashboardOverview /> },
      { path: '/patients', element: <PatientManagement /> },
      { path: '/patients/:elderId', element: <PatientDetail /> },
      { path: '/care-logs', element: <CaregiverLogs /> },
      { path: '/analytics', element: <DataAnalytics /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
]);

