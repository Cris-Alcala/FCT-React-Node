import { UserContext } from "@/contexts/User/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();
  const { setUser, setLogued } = useContext<any>(UserContext);
  useEffect(() => {
    setUser(null);
    setLogued(false);
    localStorage.removeItem("user");
    navigate("/");
  }, [setUser, setLogued, navigate]);
  return null;
};
