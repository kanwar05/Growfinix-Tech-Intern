import { useEffect, useMemo, useState } from "react";
import { fetchMe, loginUser, logoutUser, registerUser } from "../api/authApi";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchMe();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  const signup = async (payload) => {
    const data = await registerUser(payload);
    setUser(data.user);
    return data;
  };

  const login = async (payload) => {
    const data = await loginUser(payload);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loadingUser, signup, login, logout }),
    [user, loadingUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
