import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut, ReceiptEuro, Settings } from "lucide-react";
import { CustomNavLink } from "./CustomNavLink";
import { useContext } from "react";
import { UserContext } from "@/contexts/User/UserContext";

export const TopLinks = ({
  className,
  admin,
}: {
  className: string;
  admin: boolean;
}) => {
  const { pathname } = useLocation();
  const { user } = useContext<any>(UserContext);

  return (
    <div className={className}>
      <ul className={`flex flex-row items-center gap-2 w-full justify-end`}>
        {!admin && (
          <>
            {user.position === "Recepcionist" &&
              !pathname.includes("orders") && (
                <li>
                  <CustomNavLink
                    activeClassName="border-b-2 border-white"
                    to="/employee/recepcionist/orders"
                    className="flex flex-row items-end justify-end md:border-r md:border-zinc-500 pr-2"
                  >
                    <ReceiptEuro size={25} />
                  </CustomNavLink>
                </li>
              )}
            <li>
              <Link
                to={`/employee/settings`}
                className="flex flex-row items-center justify-center gap-1 mr-1 pr-2 md:border-r md:border-zinc-500"
              >
                <Settings size={25} />
              </Link>
            </li>
          </>
        )}
      </ul>
      <Button
        variant={`destructive`}
        size={`icon`}
        className="hidden md:flex lg:flex flex-col items-center justify-center"
      >
        <NavLink to={`/logout`}>
          <LogOut size={16} />
        </NavLink>
      </Button>
    </div>
  );
};
