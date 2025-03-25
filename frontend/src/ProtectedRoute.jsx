import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};  

export default ProtectedRoute;
