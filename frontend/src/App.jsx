import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // 💡 Import the decoder
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/UsersList';
import UploadFile from './pages/UploadFile';
import MainLayout from './components/MainLayout';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // 💡 Holds the decoded user data (id, email, role)

  // Automatically decode token on initial load or token changes
  useEffect(() => {
    if (token) {
      try {
        // Remove 'Bearer ' prefix if present before decoding
        const rawToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const decoded = jwtDecode(rawToken);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token format", error);
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="upload" element={<UploadFile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;