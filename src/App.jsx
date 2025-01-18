import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth-provider';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HowItWorks from './pages/HowItWorks';
import ComposeEmail from './pages/ComposeEmail';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="future-email-theme">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/compose" element={<ComposeEmail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </ThemeProvider>
  );
}