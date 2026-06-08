import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadUser = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const userData = await getCurrentUser();

        setUser(userData);

      } catch (error) {

        localStorage.removeItem("token");
        setUser(null);

      } finally {

        setLoading(false);

      }
    };

    loadUser();

  }, []);

  const logout = () => {

    localStorage.removeItem("token");

    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}