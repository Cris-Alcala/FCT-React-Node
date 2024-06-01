import { Label } from "../ui/label";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Info, MinusIcon, PlusIcon } from "lucide-react";
import MediaViewer from "../media/MediaViewer";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/contexts/Cart/CartContext";
import { useWebSocket } from "@/contexts/WebSocket/WebSockeProvider";
import { UserContext } from "@/contexts/User/UserContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useNavigate } from "react-router-dom";

export const ProductCard = ({
  product,
  description = false,
}: {
  product: any;
  description?: boolean;
}) => {
  const [loading, setLoading] = useState(true);
  const [number, setNumber] = useState(1);
  const [section, setSection] = useState<any>({});
  const { products, setProducts } = useContext<any>(CartContext);
  const { user, logued } = useContext<any>(UserContext);  
  const navigate = useNavigate();

  const io = useWebSocket();

  useEffect(() => {
    getSection(product.section);
  }, []);
  const handleNumber = (action: "More" | "Less") => {
    if (action === "More") {
      setNumber(number + 1);
    } else {
      if (number === 1) return;
      setNumber(number - 1);
    }
  };
  const getSection = async (id: string) => {
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/categories/${id}`
    );
    const data = await response.json();
    setSection(data);
    setLoading(false);
  };
  const addToCart = () => {
    const isOnCart = products.findIndex(
      (p: any) => p.product.id === product.id
    );

    if (isOnCart > -1) {
      setProducts(
        products.map((p: any) =>
          p.product.id === product.id
            ? { ...p, quantity: p.quantity + number }
            : p
        )
      );
    } else {
      setProducts([...products, { product, quantity: number }]);
    }
    io.emit("cart_update", {user: user.id});
    setNumber(1);
  };
  return (
    !loading && (
      <Card
        className={`w-full md:w-[26%] lg:w-[24%] max-w-md h-auto`}
        key={product.name}
      >
        <div className="relative">
          {}
          <MediaViewer
            id={product.image}
            imageFill={`object-cover`}
            showLoader
            className="aspect-video rounded-t-lg"
          />
        </div>
        <CardContent
          className={`space-y-4 p-6 ${
            !description ? "h-[11rem]" : "h-[14rem]"
          }`}
        >
          <div className="space-y-2">
            <CardTitle>{product.name}</CardTitle>
            <div>
              <span className="text-xl font-bold">{`${product.price.toFixed(
                2
              )} €`}</span>
            </div>
            {section.name !== "Bebidas" && description && (
              <CardDescription className="text-xs">
                {product.description}
              </CardDescription>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex flex-row items-center justify-start gap-5">
              {section.name !== "Bebidas" ? (
                <>
                  <Label>Ingredientes:</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={18} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-950/90 flex flex-col p-2 rounded-md text-white">
                      {product.ingredients.map((i: any) => (
                        <span key={i} className="text-xs self-start">{`${
                          i.substring(0, 1).toUpperCase() + i.slice(1)
                        }`}</span>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Label>Tamaño:</Label>
                  <span>{product.size}</span>
                </>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium" htmlFor="quantity">
                Cantidad:
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleNumber("Less")}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                {number}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleNumber("More")}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-3 mt-3">
          {!logued ||
          user.name === "" ||
          user.phone === "" ||
          user.address === "" ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full">Agregar al carrito</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90dvw] rounded-md md:w-[40%]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg">
                    {!logued
                      ? "Debes iniciar sesión para realizar un pedido"
                      : "Debes completar tu perfil para realizar un pedido"}
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      !logued ? navigate("/login") : navigate("/settings")
                    }
                  >
                    {!logued ? "Iniciar sesión" : "Perfil"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button className="w-full" onClick={addToCart}>
              Agregar al carrito
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  );
};
