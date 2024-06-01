import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  Users,
  LayoutDashboard,
  Utensils,
  Contact,
  ReceiptEuro,
  TicketPercent,
  Menu,
  Apple,
} from "lucide-react";
import { TopLinks } from "@/components/routing/TopLinks";
import { UserContext } from "@/contexts/User/UserContext";
import { CustomNavLink } from "@/components/routing/CustomNavLink";
import { Toaster } from "sonner";
import Texto from "@/components/media/Texto";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const { user } = useContext<any>(UserContext);

  const tabs = [
    {
      name: "Panel principal",
      path: "/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Empleados",
      path: "/admin/employees",
      icon: <Contact size={18} />,
    },
    {
      name: "Usuarios",
      path: "/admin/users",
      icon: <Users size={18} />,
    },
    {
      name: "Productos",
      path: "/admin/products",
      icon: <Utensils size={18} />,
    },
    {
      name: "Secciones",
      path: "/admin/sections",
      icon: <Apple size={18} />,
    },
    {
      name: "Pedidos",
      path: "/admin/orders",
      icon: <ReceiptEuro size={18} />,
    },
    {
      name: "Cupones",
      path: "/admin/coupons",
      icon: <TicketPercent size={18} />,
    },
  ];

  return (
    <>
      <Toaster position="bottom-center" expand={false} richColors />
      <div className="flex flex-col font-signika text-white">
        <nav className="bg-[#2f3e46] flex flex-col md:flex-row lg:flex-row text-white w-[100dvw] shadow-2xl items-center justify-center p-3 lg:p-6 h-[4rem] fixed top-0 z-10">
          <div className="md:w-[30%] lg:w-[46%] w-[10rem] flex flex-col items-center justify-center md:block lg:block">
            <div className="md:w-[4rem] lg:w-[5rem] flex flex-row items-center justify-between p-2 md:p-0 lg:p-0 w-[90dvw]">
              <Button
                variant={`ghost`}
                size={`icon`}
                className="md:hidden lg:hidden"
                onClick={() => setShowMenu(!showMenu)}
              >
                <Menu size={18} />
              </Button>
              <TopLinks
                admin
                className="md:hidden lg:hidden flex-row items-center justify-between flex md:w-[60%] lg:w-[60%] text-sm md:text-lg lg:text-lg"
              />
              <NavLink to={`/`} className="w-[4rem]">
                <Texto className={`w-[5rem] bg-transparent`} />
              </NavLink>
            </div>
          </div>
          <TopLinks
            admin
            className="md:flex lg:flex flex-row items-center justify-between hidden w-full md:w-[60%] lg:w-[49.5%] text-sm md:text-lg lg:text-lg"
          />
        </nav>
        <div className="flex flex-row z-0">
          <div
            className={`transform ${
              showMenu ? "translate-x-0" : "-translate-x-full"
            } absolute md:fixed lg:fixed md:translate-x-0 lg:translate-x-0 w-[100dvw] md:max-w-[13rem] md:min-w-[13rem] lg:max-w-[12rem] lg:min-w-[12rem] bg-[#44545d] p-2 transition-all duration-300 min-h-[100dvh] pt-[5rem] shadow-2xl z-10`}
          >
            <div className="px-1 flex flex-col gap-3">
              <h2 className="text-center text-xl font-medium">
                ¡Hola {user.name}!
              </h2>
              {tabs.map((tab, index) => {
                return (
                  <CustomNavLink
                    to={tab.path}
                    activeClassName="bg-[#f1f5f9] text-black rounded-md"
                    className="flex flex-row items-center justify-start gap-2 w-full"
                    key={index}
                  >
                    <Button
                      variant={`ghost`}
                      size={`lg`}
                      className="flex flex-row items-center justify-start gap-2 w-full p-2"
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </Button>
                  </CustomNavLink>
                );
              })}
            </div>
          </div>
          <main
            className={`${
              showMenu ? "hidden" : "block"
            } pt-[5rem] text-black md:block lg:block transition-all duration-300 w-full md:ml-[13rem] lg:ml-[12rem] z-0`}
          >
            {children}
          </main>
          <footer className="fixed bottom-0 w-full">
            <Button
              variant={`destructive`}
              size={`lg`}
              className="flex md:hidden lg:hidden flex-col items-center justify-center rounded-t-lg rounded-b-none w-full"
            >
              <NavLink to={`/admin/logout`}>
                <LogOut size={20} />
              </NavLink>
            </Button>
          </footer>
        </div>
      </div>
    </>
  );
};
