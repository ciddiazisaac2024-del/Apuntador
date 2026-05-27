import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import SupervisorDashboard from './components/SupervisorDashboard';
import ExecutorDashboard from './components/ExecutorDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/supervisor" 
            element={
              <ProtectedRoute allowedRole="supervisor">
                <SupervisorDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/ejecutivo" 
            element={
              <ProtectedRoute allowedRole="ejecutivo">
                <ExecutorDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect based on lack of knowledge of user state here, ProtectedRoute handles it if we navigate to / */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                {/* A dummy component, ProtectedRoute will redirect to correct dashboard */}
                <Navigate to="/login" replace />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
