import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { TopLinks } from "@/components/routing/TopLinks";
import { UserContext } from "@/contexts/User/UserContext";
import { Toaster } from "sonner";
import { Clock } from "@/components/employees/Clock";
import Texto from "@/components/media/Texto";

export const WorkerLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext<any>(UserContext);

  return (
    <>
      <Toaster position="bottom-center" expand={false} richColors />
      <div className="flex flex-col font-signika text-white">
        <nav className="bg-[#2f3e46] flex flex-row text-white w-[100dvw] shadow-2xl items-center justify-between p-3 lg:p-6 h-[4rem] fixed top-0 z-10">
          <NavLink to={`/`} className="w-[33%]">
            <div className="w-[4.5rem]">
              <Texto className={`w-[6rem] md:w-[7rem] bg-transparent`} />
            </div>
          </NavLink>
          {user.position === "Chef" ? (
            <Clock className="text-2xl md:hidden text-center" />
          ) : (
            <span className="text-xl md:text-2xl text-center w-[33%]">
              ¡Hola, {user.name}!
            </span>
          )}
          <TopLinks
            admin={user.admin}
            className="flex flex-row items-center justify-end w-[33%] text-sm md:text-lg lg:text-lg gap-2"
          />
        </nav>
        <div className="flex flex-row z-0">
          <main
            className={`pt-[5rem] text-black md:block lg:block transition-all duration-300 w-full z-0`}
          >
            {children}
          </main>
        </div>
      </div>
      <footer className="bottom-0 w-full fixed">
        <Button
          variant={`destructive`}
          size={`lg`}
          className="flex md:hidden lg:hidden flex-col items-center justify-center rounded-t-lg rounded-b-none w-full"
        >
          <NavLink to={`/logout`}>
            <LogOut size={20} />
          </NavLink>
        </Button>
      </footer>
    </>
  );
};
