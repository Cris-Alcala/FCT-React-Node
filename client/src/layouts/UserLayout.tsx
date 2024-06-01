import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Texto from "@/components/media/Texto";
import { CustomNavLink } from "@/components/routing/CustomNavLink";
import { motion } from "framer-motion";
import { DropDownAvatar } from "@/components/layout/DropDownAvatar";

export const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <>
      <Toaster position="bottom-center" expand={false} richColors />
      <div className="flex flex-col font-signika text-white">
        <nav className="bg-[#2f3e46] flex flex-col md:flex-row text-white w-[100dvw] items-center justify-start p-3 lg:p-6 h-auto md:h-[4rem] fixed top-0 z-10 gap-2 md:gap-16 lg:gap-5 shadow-xl">
          <div className="md:w-[10%] w-full flex flex-row items-center justify-between px-4 md:px-0">
            <NavLink to={`/`} className="md:w-[10%]">
              <div className="md:w-[4.5rem] w-full flex flex-col items-center justify-center md:block">
                <Texto className={`w-[6rem] md:w-[7rem] bg-transparent `} />
              </div>
            </NavLink>
            <DropDownAvatar className="md:hidden flex" />
          </div>
          <div className="flex flex-row gap-10 md:w-[100%]">
            {!pathname.includes("/products") &&
            !pathname.includes("/orders") &&
            !pathname.includes("/settings") ? (
              <a
                href="#home"
                className="text-white text-xl transition-all duration-300 ease-in-out"
              >
                Inicio
              </a>
            ) : (
              <CustomNavLink
                activeClassName=""
                to={`/`}
                className="text-white text-xl transition-all duration-300 ease-in-out"
              >
                Inicio
              </CustomNavLink>
            )}
            <CustomNavLink
              activeClassName="border-b-2"
              to={`/products`}
              className="text-white text-xl transition-all duration-300 ease-in-out"
            >
              Menú
            </CustomNavLink>
            {!pathname.includes("/products") &&
              !pathname.includes("/orders") &&
              !pathname.includes("/settings") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <a
                    href={`#about`}
                    className="text-white text-xl transition-all duration-300 ease-in-out"
                  >
                    Sobre Nosotros
                  </a>
                </motion.div>
              )}
          </div>
          <DropDownAvatar className="hidden md:flex" />
        </nav>
        <div className="flex flex-row z-0">
          <main
            className={`text-black md:block lg:block transition-all duration-300 w-full z-0`}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
};
