import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Power, User, ReceiptEuro } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenuShortcut } from "../ui/dropdown-menu";
import { useContext } from "react";
import { UserContext } from "@/contexts/User/UserContext";

export const DropDownAvatar = ({ className }: { className?: string }) => {
  const { user, logued } = useContext<any>(UserContext);
  return (
    <div className={`md:flex lex col items-center justify-end ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="border-2 overflow-hidden">
            <AvatarImage src="/Z.png" alt="@shadcn" />
            <AvatarFallback>Z</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-20 -mt-11 border-none flex flex-col gap-1">
          {logued ? (
            <>
              <DropdownMenuLabel className="text-center">
                {user.name === "" ? "¡Hola!" : `¡Hola, ${user.name}!`}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-300" />
              <DropdownMenuItem>
                <Link
                  to="/settings"
                  className="flex flex-row items-center gap-2 p-1.5 rounded-md transition-all ease-in-out duration-300 w-full font-semibold"
                >
                  Perfil
                  <DropdownMenuShortcut>
                    <User size={18} />
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to="/orders"
                  className="flex flex-row items-center gap-2 p-1.5 rounded-md transition-all ease-in-out duration-300 w-full font-semibold"
                >
                  Mis pedidos
                  <DropdownMenuShortcut>
                    <ReceiptEuro size={18} />
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <a
                  href="/logout"
                  className="flex flex-row items-center gap-2 p-3 rounded-md transition-all text-white ease-in-out duration-300 w-full bg-red-400 hover:bg-red-500 font-semibold"
                >
                  Cerrar Sesión
                  <DropdownMenuShortcut>
                    <Power
                      size={18}
                      strokeWidth={3}
                      color="white"
                      opacity={1}
                    />
                  </DropdownMenuShortcut>
                </a>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem>
              <Link
                to="/login"
                className="flex flex-row items-center gap-2 p-1.5 rounded-m transition-all ease-in-out duration-300 w-full font-semibold"
              >
                Iniciar Sesión / Registrarse
                <DropdownMenuShortcut>
                  <User size={18} />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
