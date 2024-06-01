import { UserProvider } from "../contexts/User/UserProvider";
import { Router } from "../Router";
import { CartProvider } from "../contexts/Cart/CartProvider";
import { TooltipProvider } from "./ui/tooltip";
import { SocketProvider } from "@/contexts/WebSocket/WebSockeProvider";

export const App = () => {
  return (
    <>
      <TooltipProvider>
        <SocketProvider>
          <UserProvider>
            <CartProvider>
              <Router />
            </CartProvider>
          </UserProvider>
        </SocketProvider>
      </TooltipProvider>
    </>
  );
};
