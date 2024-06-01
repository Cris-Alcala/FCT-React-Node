import { OrderCard } from "@/components/orders/OrderCard";
import { Order } from "@/interfaces/Order";
import { WorkerLayout } from "@/layouts/WorkerLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useWebSocket } from "@/contexts/WebSocket/WebSockeProvider";

export const Delivery = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [warn, setWarn] = useState<boolean>(false);
  const io = useWebSocket();

  useEffect(() => {
    fetchOrders();
  }, []);

  io.on("delivery_order", (_data: any) => {
    fetchOrders();
  });

  io.on("complete_order", (data: any) => {
    setOrders((prev) => prev.filter((order) => order.id !== data.id));
  });

  io.on("cancel_order", (data: any) => {
    setOrders((prev) => prev.filter((order) => order.id !== data.id));
  });

  io.on("delivery_warning", () => setWarn(true));

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_ENDPOINT_SERVER
        }/api/v1/orders?state=En reparto&completed=false`
      );
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkerLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="px-5 flex flex-col justify-start items-center h-full w-full gap-5 min-h-[85dvh] pb-20 md:pb-0 mb-10 md:mb-5"
      >
        {warn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <AlertDialog>
              <AlertDialogTrigger asChild className="hover:cursor-pointer">
                <span className="flex flex-row gap-2 w-full mx-auto">
                  <span className="w-full md:w-[50%] mx-auto flex flex-row items-center justify-center gap-2 bg-orange-500 p-2 rounded-2xl">
                    <span>
                      <TriangleAlert size={18} />
                    </span>
                    Tienes pedidos nuevos para recoger
                  </span>
                </span>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90dvw] rounded-md md:w-[40%]">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Estás seguro de eliminar la alerta?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => setWarn(false)}
                    className="bg-red-500 hover:bg-red-400"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        )}
        {!loading &&
          (orders.length === 0 ? (
            <h1 className="text-xl md:text-3xl font-bold text-center md:pt-[8%]">
              No hay pedidos para repartir
            </h1>
          ) : (
            <div className="w-[99dvw] flex flex-col md:flex-row gap-5 md:p-5">
              <div className="flex flex-row items-center h-[4rem] justify-center">
                <span className="text-2xl font-bold p-4 text-center w-[8rem]">
                  Siguiente
                </span>
                <span className="text-2xl font-bold hidden md:block">
                  {">"}
                </span>
              </div>
              <div className="flex flex-row gap-11 flex-wrap p-1 md:p-0 mx-auto md:mx-0">
                {orders.map((order) => {
                  return <OrderCard key={order.id} order={order} />;
                })}
              </div>
            </div>
          ))}
      </motion.div>
    </WorkerLayout>
  );
};
