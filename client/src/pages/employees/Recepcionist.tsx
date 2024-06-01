import { Section } from "@/interfaces/Section";
import { WorkerLayout } from "@/layouts/WorkerLayout";
import { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShowProductsBySection } from "@/components/products/ShowProductsBySection";
import { CartComponent } from "@/components/cart/CartComponent";
import { motion } from "framer-motion";
import { ShoppingCart, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWebSocket } from "@/contexts/WebSocket/WebSockeProvider";
import { UserContext } from "@/contexts/User/UserContext";

export const Recepcionist = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCart, setShowCart] = useState(false);
  const [cartNews, setCartNews] = useState(false);
  const [delay, setDelay] = useState<boolean>(false);
  const [delayTime, setDelayTime] = useState(0);
  const { user } = useContext<any>(UserContext);
  
  const io = useWebSocket();

  useEffect(() => {
    getSections();
  }, []);

  io.on("cart_update", (data: any) => {            
    if (data.user === user.id) {
      setCartNews(true);
    }
  });

  const getSections = async () => {
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/categories`
    );
    const data = await response.json();
    setSections(data);
    setLoading(false);
  };

  const warnDelivery = () => {
    io.emit("delivery_warning", {});
    setDelay(true);
    setDelayTime(30);
    const interval = setInterval(() => {
      setDelayTime((prev) => prev - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setDelay(false);
    }, 30000);
    toast.success("Alerta enviada al repartidor");
  };

  return (
    <WorkerLayout>
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mb-1"
        >
          {showCart && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"
              onClick={() => setShowCart(false)}
            />
          )}
          <div className="flex flex-row max-w-[100dvw] px-5 pb-5">
            <Tabs
              defaultValue={sections[0].name}
              className=" flex w-full md:w-[50rem] lg:w-[95%] md:block md:absolute md:left-3 flex-col"
            >
              <TabsList className="flex flex-row gap-5 flex-wrap h-[9rem] p-3 md:h-auto md:min-h-[2.5rem] md:p-2 lg:w-[65%] mx-auto">
                {sections.map((s: any) => (
                  <TabsTrigger value={s.name} key={s.name}>
                    {s.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {sections.map((s: any) => (
                <TabsContent value={s.name} key={s.name} className="self-start">
                  <ShowProductsBySection section={s.id} />
                </TabsContent>
              ))}
            </Tabs>
            <CartComponent
              className={`${
                showCart
                  ? "left-[5%] lg:left-[25%] shadow-black shadow-2xl"
                  : "left-[100%]"
              } transition-all ease-in-out duration-500 fixed w-[90%] md:w-[50%] top-[8rem] overflow-y-auto max-h-[75dvh] lg:pt-2 z-50`}
              callback={() => setShowCart(!showCart)}
            />
            <Button
              variant={`${showCart ? "outline" : "default"}`}
              size={`icon`}
              className="fixed right-3 lg:right-5 lg:top-[4.7rem] md:h-11 md:w-11 z-50"
              onClick={() => {
                setShowCart(!showCart);
                setCartNews(false);
              }}
            >
              {cartNews && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="absolute bg-red-500 h-3 w-3 top-[-.3rem] right-[-.3rem] rounded-full" />
                </motion.div>
              )}
              <ShoppingCart size={18} />
            </Button>
            <Button
              variant={`outline`}
              size={`icon`}
              className="fixed right-3 lg:right-5 top-[8rem] md:h-11 md:w-11 z-50 hover:bg-orange-500 border-orange-500 transition-all ease-in-out duration-300"
              disabled={delay}
              onClick={warnDelivery}
            >
              {delay && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="absolut h-20 w-20 top-0 right-0 text-black">
                    {delayTime}
                  </span>
                </motion.div>
              )}
              {!delay && <TriangleAlert size={18} className="text-black" />}
            </Button>
          </div>
        </motion.div>
      )}
    </WorkerLayout>
  );
};
