import { OrderCard } from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/contexts/WebSocket/WebSockeProvider";
import { Order } from "@/interfaces/Order";
import { WorkerLayout } from "@/layouts/WorkerLayout";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Orders = () => {
  const [pickUpOrders, setPickUpOrders] = useState<Order[]>([]);
  const [filteredPickUpOrders, setFilteredPickUpOrders] = useState<Order[]>([]);
  const [ordersToSend, setOrdersToSend] = useState<Order[]>([]);
  const [filteredOrdersToSend, setFilteredOrdersToSend] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const io = useWebSocket();

  useEffect(() => {
    fetchOrders();
  }, []);

  io.on("cancel_order", (data: any) => {
    setFilteredPickUpOrders((prev) => prev.filter((o) => o.id !== data.id));
    setFilteredOrdersToSend((prev) => prev.filter((o) => o.id !== data.id));
  });

  io.on("complete_order", (data: any) => {
    setFilteredPickUpOrders((prev) => prev.filter((o) => o.id !== data.id));
  });

  io.on("delivery_order", (data: any) => {
    setFilteredOrdersToSend((prev) => prev.filter((o) => o.id !== data.id));
  });

  io.on("pick_up_order", (_data: any) => {
    fetchOrders();
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let response = await fetch(
        `${
          import.meta.env.VITE_ENDPOINT_SERVER
        }/api/v1/orders?state=Por recoger&completed=false`
      );
      let data = await response.json();
      setPickUpOrders(data);
      setFilteredPickUpOrders(data);
      response = await fetch(
        `${
          import.meta.env.VITE_ENDPOINT_SERVER
        }/api/v1/orders?state=Por enviar&completed=false`
      );
      data = await response.json();
      setOrdersToSend(data);
      setFilteredOrdersToSend(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (s: string) => {
    setFilteredPickUpOrders(
      pickUpOrders.filter((o: any) =>
        o.id.toLowerCase().includes(s.toLowerCase())
      )
    );
    setFilteredOrdersToSend(
      ordersToSend.filter((o: any) =>
        o.id.toLowerCase().includes(s.toLowerCase())
      )
    );
  };

  return (
    <WorkerLayout>
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="min-h-[88dvh]">
            <div className="flex flex-row items-center w-full justify-start md:justify-between">
              <Link
                to={`/employee/recepcionist`}
                className="flex flex-row items-center justify-start p-2 gap-1 w-auto md:w-[45%] mx-2"
              >
                <Button variant={"ghost"} size={"icon"} className="px-2">
                  <ChevronLeft size={20} />
                </Button>
                <span className="text-2xl fot-bold hidden md:block">
                  Pedidos
                </span>
              </Link>
              <div className="w-full md:w-[55%]">
                <input
                  type="text"
                  placeholder="Pedido #..."
                  className="px-2 w-[83%] md:w-[16%] py-1 border-2 border-black/50 rounded-md text-black"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 mb-10 mt-3">
              {filteredPickUpOrders.length > 0 ||
              filteredOrdersToSend.length > 0 ? (
                <>
                  {filteredPickUpOrders.length > 0 && (
                    <div className="w-full px-2 md:px-14 gap-2 flex flex-col">
                      <span className="text-2xl font-bold border-b-2 border-black">
                        Por recoger
                      </span>
                      <div className="w-full flex flex-row px-2 overflow-x-auto gap-3 py-1">
                        {filteredPickUpOrders.map((o: any) => (
                          <OrderCard order={o} key={o.id} />
                        ))}
                      </div>
                    </div>
                  )}
                  {filteredOrdersToSend.length > 0 && (
                    <div className="w-full px-2 md:px-14 gap-2 flex flex-col">
                      <span className="text-2xl font-bold border-b-2 border-black">
                        Por enviar
                      </span>
                      <div className="w-full flex flex-row px-2 overflow-x-auto gap-3 py-1 mb-2 md:mb-0">
                        {filteredOrdersToSend.map((o: any) => (
                          <OrderCard order={o} key={o.id} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <span className="w-full text-center text-2xl font-bold my-10">
                  No hay pedidos para mostrar
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </WorkerLayout>
  );
};
