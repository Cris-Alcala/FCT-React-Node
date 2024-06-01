import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { User } from "../../interfaces/User";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [logued, setLoguedState] = useState<boolean>(() => {
    const storedLogued = localStorage.getItem("logued");
    return storedLogued ? JSON.parse(storedLogued) : false;
  });
  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };
  const setLogued = (logued: boolean) => {
    setLoguedState(logued);
    if (logued) {
      localStorage.setItem("logued", JSON.stringify(logued));
    } else {
      localStorage.removeItem("logued");
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedLogued = localStorage.getItem("logued");
    if (storedUser) setUserState(JSON.parse(storedUser));
    if (storedLogued) setLoguedState(JSON.parse(storedLogued));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logued, setLogued }}>
      {children}
    </UserContext.Provider>
  );
};
