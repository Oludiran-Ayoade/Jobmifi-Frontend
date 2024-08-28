import { createContext, useContext, useState, useEffect } from 'react';
import { Props, User, AuthContextType } from '../dto/dto';

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component
export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auth, setAuth] = useState<{ user: User | null; token: string }>(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : { user: null, token: '' };
  });

  // Function to handle user login
  const login = (userData: User, token: string) => {
    setIsAuthenticated(true);
    const { _id, firstName, lastName, email, role } = userData;
    const modifiedUserData = { _id, firstName, lastName, email, role };
    setAuth({ user: modifiedUserData , token }); // Update the authentication state
  };

  // Function to handle user logout
  const logout = () => {
    setIsAuthenticated(false);
    setAuth({ user: null, token: '' }); // Clear the authentication state
  };

  // Effect to update localStorage when auth state changes
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify({ user: auth.user, token: auth.token }));
  }, [auth]);

  const authContextValue: AuthContextType = {
    isAuthenticated,
    auth,
    login,
    logout,
  };

  // Provide the authentication context value to its children
  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
