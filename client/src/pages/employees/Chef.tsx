import { Clock } from "@/components/employees/Clock";
import { OrderCard } from "@/components/orders/OrderCard";
import { useWebSocket } from "@/contexts/WebSocket/WebSockeProvider";
import { Order } from "@/interfaces/Order";
import { WorkerLayout } from "@/layouts/WorkerLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Chef = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const io = useWebSocket();

  useEffect(() => {
    fetchOrders();
  }, []);

  io.on("pick_up_order", (data: any) => {
    setOrders(orders.filter((o) => o.id !== data.id));
  });

  io.on("cancel_order", (data: any) => {
    setOrders((prev) => prev.filter((o) => o.id !== data.id));
  });

  io.on("new_order", (_data: any) => {
    fetchOrders();
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_ENDPOINT_SERVER
        }/api/v1/orders?state=En proceso&completed=false`
      );
      const data = await response.json();
      setOrders(
        data.sort(
          (a: Order, b: Order) =>
            new Date(a.receipt_date).getTime() -
            new Date(b.receipt_date).getTime()
        )
      );
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
        className="px-5 flex flex-col justify-start items-center h-full w-full gap-5 min-h-[85dvh] mb-10 md:mb-5"
      >
        <Clock className="md:self-end text-5xl font-bold text-right p-[1rem] w-fit hidden md:block" />
        {!loading &&
          (orders.length === 0 ? (
            <h1 className="text-3xl font-bold">No hay pedidos en proceso</h1>
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
              <div className="flex flex-col md:flex-row gap-11 flex-wrap md:p-0 mx-auto md:mx-0 mb-2 md:mb-0">
                {orders.map((order) => {
                  return <OrderCard key={order.id} order={order} chef />;
                })}
              </div>
            </div>
          ))}
      </motion.div>
    </WorkerLayout>
  );
};
