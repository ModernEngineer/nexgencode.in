import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './auth';
import { ConfirmProvider, ToastProvider } from './ui';
import AdminLayout from './AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import Reviews from './pages/Reviews';
import Team from './pages/Team';
import Projects from './pages/Projects';
import Settings from './pages/Settings';

/** Admin panel at /admin/* — lazy-loaded from App.tsx so the public site never downloads it. */
export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="team" element={<Team />} />
              <Route path="portfolio" element={<Projects />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
