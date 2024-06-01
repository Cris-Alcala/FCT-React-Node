import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "@/contexts/User/UserContext";

export const RedirectMiddleware = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, logued } = useContext<any>(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (logued) {
      const { pathname } = location;
      if (user.admin) {
        if (!pathname.startsWith("/admin")) {
          navigate("/admin");
        }
      } else if (user.position) {
        switch (user.position) {
          case "Chef":
            if (
              !pathname.startsWith("/employee/chef") &&
              !pathname.endsWith("/employee/settings")
            ) {
              navigate("/employee/chef");
            }
            break;
          case "Delivery":
            if (
              !pathname.startsWith("/employee/delivery") &&
              !pathname.endsWith("/employee/settings")
            ) {
              navigate("/employee/delivery");
            }
            break;
          case "Recepcionist":
            if (
              !pathname.startsWith("/employee/recepcionist") &&
              !pathname.endsWith("/employee/settings")
            ) {
              navigate("/employee/recepcionist");
            }
            break;
          default:
            pathname.includes("/employee") && navigate("/");
            pathname.includes("/admin") && navigate("/");
        }
      } else {
        pathname.includes("/employee") && navigate("/");
        pathname.includes("/admin") && navigate("/");
      }
    }
  }, [user, logued, location.pathname]);

  return <>{children}</>;
};
