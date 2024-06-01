import DataTable from "@/components/table/DataTable";
import { motion } from "framer-motion";
import { ReceiptEuro } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { UserLayout } from "@/layouts/UserLayout";
import { UserContext } from "@/contexts/User/UserContext";
import { OrderTicket } from "@/components/orders/OrderTicket";
import { WebSocketContext } from "@/contexts/WebSocket/WebSocketContext";
import { Status } from "@/components/orders/Status";

export const Orders = () => {
  const [orders, setOrders] = useState<any>([]);
  const [filteredOrders, setFilteredOrders] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useContext<any>(UserContext);
  const io = useContext<any>(WebSocketContext);

  useEffect(() => {
    fetchData();
  }, []);

  io.on("complete_order", () => fetchData());
  io.on("pick_up_order", () => fetchData());
  io.on("cancel_order", () => fetchData());
  io.on("delivery_order", () => fetchData());

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/orders?user=${user.id}`
      );
      const data = await response.json();
      data.sort(
        (a: any, b: any) =>
          new Date(b.receipt_date).getTime() -
          new Date(a.receipt_date).getTime()
      );
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      toast.error("Error al cargar los pedidos");
    }
    setLoading(false);
  };

  const filterOrders = (s: string) => {
    let filtered = orders.filter(
      (e: any) =>
        e.products.join(", ").toLowerCase().includes(s.toLowerCase()) ||
        e.user.toLowerCase().includes(s.toLowerCase()) ||
        e.state.toLowerCase().includes(s.toLowerCase()) ||
        e.receipt_date.includes(s)
    );
    setFilteredOrders(filtered);
  };

  const orderOrders = (key: string, sort: string) => {
    let sorted = filteredOrders.sort((a: any, b: any) => {
      if (key === "total" || key === "subtotal") {
        if (sort === "asc") {
          return a[key] - b[key];
        } else {
          return b[key] - a[key];
        }
      } else if (key === "receipt_date") {
        if (sort === "asc") {
          return new Date(a[key]).getTime() - new Date(b[key]).getTime();
        } else {
          return new Date(b[key]).getTime() - new Date(a[key]).getTime();
        }
      } else {
        if (sort === "asc") {
          return a[key].toLowerCase().localeCompare(b[key].toLowerCase());
        } else {
          return b[key].toLowerCase().localeCompare(a[key].toLowerCase());
        }
      }
    });
    setFilteredOrders((_prev: any) => [...sorted]);
  };

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="px-5 mt-[7rem] md:mt-[5rem]"
      >
        <DataTable
          name={`Pedidos (${filteredOrders.length})`}
          data={filteredOrders.slice((page - 1) * 10, page * 10)}
          pages={Math.ceil(filteredOrders.length / 10)}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPreviousPage={() => setPage(page - 1)}
          loading={loading}
          emptyLogo={<ReceiptEuro size={24} />}
          onSearch={(s) => {
            filterOrders(s);
            setPage(1);
          }}
          searchable
          emptyMessage={`No hay pedidos para mostrar`}
          columns={[
            {
              header: "Fecha de recibo",
              accessor: "recepit_date",
              cell: (x: any) =>
                format(new Date(x.receipt_date), "dd/MM/yyyy HH:mm"),
              onSort: (x: any) => orderOrders("receipt_date", x),
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Estado",
              accessor: "state",
              cell: (x: any) => (
                <div className="flex flex-col justify-center">
                  <Status status={x.state} />
                </div>
              ),
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Subtotal",
              accessor: "subtotal",
              onSort: (x: any) => orderOrders("subtotal", x),
              cellProps: {
                className: "w-1/10",
              },
              cell: (x: any) => `${x.subtotal.toFixed(2)} €`,
            },
            {
              header: "Total",
              accessor: "total",
              onSort: (x: any) => orderOrders("total", x),
              cellProps: {
                className: "w-1/10",
              },
              cell: (x: any) => `${x.total.toFixed(2)} €`,
            },
            {
              header: "Descuento",
              accessor: "discount",
              cellProps: {
                className: "w-1/10",
              },
              cell: (x: any) => (x.discount ? `${x.discount}%` : "0%"),
            },
            {
              header: "Productos",
              accessor: "products",
              cell: (x: any) =>
                x.products.map((product: any) => product[0]).join(", "),
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Tipo",
              accessor: "type",
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Comentarios",
              accessor: "comments",
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Dirección",
              accessor: "address",
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: `Acciones`,
              accessor: "actions",
              headerProps: {
                className: "text-right pr-4",
              },
              cellProps: {
                className: "text-right max-w-[140px]",
              },
              cell: (x: any) => <OrderTicket x={x} />,
            },
          ]}
        />
      </motion.div>
    </UserLayout>
  );
};
