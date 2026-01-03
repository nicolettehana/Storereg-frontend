import { createContext, useContext, useEffect, useState } from "react";
import { useFetchUsersProfile } from "../../hooks/userQueries";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const profileQuery = useFetchUsersProfile({
    enabled: !!localStorage.getItem("access_token"),
  });

  useEffect(() => {
    if (profileQuery.isSuccess) {
      setUser(profileQuery.data.data);
    }

    if (profileQuery.isError) {
      setUser(null);
      localStorage.clear();
    }
  }, [profileQuery.status]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        isAuthenticated: !!user,
        isLoading: profileQuery.isPending,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
