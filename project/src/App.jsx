import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ScreenTest from './pages/ScreenTest';
import NotFound from './pages/NotFound';
import ProtectedRoute from './auth/ProtectedRoute';
import { ScreenShareProvider } from './contexts/ScreenShareContext';
import './styles.css';

function App() {
  return (
    <ScreenShareProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/screen-test"
            element={
              <ProtectedRoute>
                <ScreenTest />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ScreenShareProvider>
  );
}

export default App;
