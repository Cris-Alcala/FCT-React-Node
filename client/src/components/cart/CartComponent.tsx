import { HeartCrack, MinusIcon, PlusIcon, ShoppingCart, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/contexts/Cart/CartContext";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Order } from "@/interfaces/Order";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { UserContext } from "@/contexts/User/UserContext";
import { useWebSocket } from "@/contexts/WebSocket/WebSockeProvider";

export const CartComponent = ({
  className,
  callback,
  user,
}: {
  className: string;
  callback?: () => void;
  user?: boolean;
}) => {
  const { user: userData } = useContext<any>(UserContext);
  const { products, setProducts } = useContext<any>(CartContext);
  const [comments, setComments] = useState<any>("");
  const [coupons, setCoupons] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState<any>("");
  const [discount, setDiscount] = useState(0);
  const [delivery, setDelivery] = useState(false);
  const [address, setAddress] = useState(
    !userData?.position ? userData?.address : ""
  );
  const io = useWebSocket();

  useEffect(() => {
    fetchCoupons();
  }, []);
  const fetchCoupons = async () => {
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/coupons`
    );
    const data = await response.json();
    setCoupons(data);
    setLoading(false);
  };
  const handleCart = (action: "More" | "Less", id: string) => {
    if (action === "More") {
      setProducts(
        products.map((p: any) =>
          p.product.id === id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      if (products.find((p: any) => p.product.id === id).quantity === 1) {
        setProducts(products.filter((p: any) => p.product.id !== id));
      } else {
        setProducts(
          products.map((p: any) =>
            p.product.id === id ? { ...p, quantity: p.quantity - 1 } : p
          )
        );
      }
    }
  };
  const makeOrder = async () => {
    if (products.length === 0) return;
    const order: Order = {
      products: products.map((p: any) => [
        `${p.product.name}`,
        p.quantity,
        parseFloat(p.product.price.toFixed(2)),
      ]),
      comments,
      address,
      subtotal: parseFloat(
        products
          .reduce((acc: any, p: any) => acc + p.product.price * p.quantity, 0)
          .toFixed(2)
      ),
      total:
        parseFloat(
          (
            products.reduce(
              (acc: any, p: any) => acc + p.product.price * p.quantity,
              0
            ) -
            products.reduce(
              (acc: any, p: any) => acc + p.product.price * p.quantity,
              0
            ) *
              (discount / 100)
          ).toFixed(2)
        ) + (delivery ? 1 : 0),
      type: delivery ? "Para llevar" : "Para recoger",
      completed: false,
      state: "En proceso",
      receipt_date: new Date().toISOString(),
      user: user ? userData.id : "",
      discount,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        }
      );
      if (response.status === 201) {
        toast.success("Pedido realizado con éxito");
        io.emit("new_order", order);
      } else {
        toast.error("Error al realizar el pedido");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al realizar el pedido");
    } finally {
      callback && callback();
      setProducts([]);
      setDelivery(false);
      setComments("");
      setAddress("");
      setCoupon("");
      setDiscount(0);
    }
  };
  const handleCoupon = () => {
    if (!coupon) setDiscount(0);
    const coupon_ = coupons.find(
      (c: any) => c.name.toLowerCase() === coupon.toLowerCase()
    );
    if (coupon_) {
      setDiscount(coupon_.discount);
    }
  };
  return (
    !loading && (
      <Card className={className}>
        <CardContent>
          <CardTitle className="text-xl flex flex-row gap-2 items-center font-bold mb-2 border-b border-b-black pb-1 pt-2 md:pt-0">
            Carrito <ShoppingCart strokeWidth={3} size={18} />
          </CardTitle>
          <div className="flex flex-col gap-2 justify-center p-5">
            {products.length === 0 ? (
              <p className="text-center flex flex-row items-center justify-center gap-2 mt-3">
                No hay productos en el carrito <HeartCrack size={18} />
              </p>
            ) : (
              <>
                {products.map((p: any) => (
                  <div
                    key={p.product.name}
                    className="flex flex-row items-center justify-between gap-5"
                  >
                    <p className="text-xs md:text-sm w-[9rem] md:w-[13rem]">
                      {p.product.name}
                    </p>
                    <p className="text-xs md:text-sm">{`${p.product.price.toFixed(
                      2
                    )} €`}</p>
                    <div className="flex items-center md:gap-2 justify-between">
                      <Button
                        size="icon"
                        variant={`${
                          p.quantity === 1 ? "destructive" : "default"
                        }`}
                        onClick={() => handleCart("Less", p.product.id)}
                        className="flex items-center justify-center h-5 w-5 md:h-7 md:w-7"
                      >
                        {p.quantity === 1 ? (
                          <X size={18} />
                        ) : (
                          <MinusIcon size={18} />
                        )}
                      </Button>
                      <span className="text-md md:text-xl w-[2rem] text-center">
                        {p.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="default"
                        onClick={() => handleCart("More", p.product.id)}
                        className="flex items-center justify-center h-5 w-5 md:h-7 md:w-7"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex flex-col gap-1 my-3">
                  <Label>Comentarios</Label>
                  <Input
                    type="text"
                    placeholder="Añade un comentario"
                    onChange={(e) => {
                      setComments(e.target.value);
                    }}
                    value={comments}
                  />
                </div>
                <div>
                  <Label>Cupón</Label>
                  <div className="flex flex-row gap-2 items-center">
                    <Input
                      type="text"
                      placeholder="Añade un cupón de descuento"
                      onChange={(e) => {
                        setCoupon(e.target.value);
                        setDiscount(0);
                      }}
                      value={coupon}
                    />
                    <Button variant="default" size="sm" onClick={handleCoupon}>
                      Aplicar
                    </Button>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 mt-3">
                  <Switch
                    onCheckedChange={() => setDelivery(!delivery)}
                    checked={delivery}
                  />
                  <Label>A domicilio</Label>
                </div>
                {delivery && (
                  <div className="flex flex-col gap-1 my-3">
                    <Label>Domicilio</Label>
                    <Input
                      type="text"
                      placeholder="Añade la dirección"
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      value={address}
                    />
                  </div>
                )}
                <div className="flex flex-row gap-2 items-center my-2">
                  <Label
                    className={`${
                      discount === 0 ? "text-xl" : "text-md"
                    } font-bold`}
                  >
                    {discount === 0 ? "Total" : "Subtotal"}
                  </Label>
                  <span
                    className={`font-bold ${
                      discount !== 0
                        ? "text-red-500 text-md line-through"
                        : "text-xl"
                    }`}
                  >
                    {products
                      .reduce(
                        (acc: any, p: any) =>
                          acc + p.product.price * p.quantity,
                        delivery && discount === 0 ? 1 : 0
                      )
                      .toFixed(2)}
                    €
                  </span>
                  {delivery && discount === 0 && (
                    <span className="text-red-500 text-xs">+ 1€ domicilio</span>
                  )}
                  {discount !== 0 && (
                    <span className="text-red-500 text-xs">{`(-${discount}%)`}</span>
                  )}
                </div>
                <div
                  className={`${
                    discount === 0 && "hidden"
                  } flex flex-row gap-2 items-center mb-2`}
                >
                  <Label className="text-xl font-bold">Total</Label>
                  <span className={` text-xl font-bold`}>
                    {(
                      products.reduce(
                        (acc: any, p: any) =>
                          acc + p.product.price * p.quantity,
                        delivery ? 1 : 0
                      ) -
                      products.reduce(
                        (acc: any, p: any) =>
                          acc + p.product.price * p.quantity,
                        0
                      ) *
                        (discount / 100)
                    ).toFixed(2)}
                    €
                    {delivery && (
                      <span className="text-red-500 text-xs ml-2">
                        + 1€ domicilio
                      </span>
                    )}
                  </span>
                </div>
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={makeOrder}
                >
                  Finalizar compra
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    )
  );
};
