import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext.tsx"
import ErrorBoundary from "./components/ErrorBoundary.tsx"
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx"
import Layout from "./components/Layout.tsx"
import DashboardPage from "./pages/DashboardPage.tsx"
import LoginPage from "./pages/LoginPage.tsx"
import RegisterPage from "./pages/RegisterPage.tsx"
import TemplatesPage from "./pages/TemplatesPage.tsx"
import EmailEditor from "./components/email/EmailEditor.tsx"
import TemplateDetailPage from "./pages/TemplateDetailPage.tsx"
import SettingsPage from "./pages/SettingsPage.tsx"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster position="top-right" />
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/templates" element={<TemplatesPage />} />
                  <Route path="/templates/new" element={<EmailEditor />} />
                  <Route path="/templates/:id" element={<TemplateDetailPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
