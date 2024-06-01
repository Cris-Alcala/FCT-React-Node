import DataTable from "@/components/table/DataTable";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdminLayout } from "@/layouts/AdminLayout";
import { motion } from "framer-motion";
import { Check, ReceiptEuro, TrashIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import AlertModal from "@/components/ui/alert-modal";

export const OrdersList = () => {
  const [orders, setOrders] = useState<any>([]);
  const [filteredOrders, setFilteredOrders] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/orders/`
      );
      const data = await response.json();
      data.sort(
        (a: any, b: any) =>
          new Date(b.receipt_date).getTime() -
          new Date(a.receipt_date).getTime()
      );
      setOrders(data);
      setFilteredOrders(data);
      toast.success("Pedidos cargados correctamente");
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
        e.state.toLowerCase().includes(s.toLowerCase())
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

  const deleteOrder = async (id: string) => {
    setFilteredOrders(filteredOrders.filter((e: any) => e.id !== id));
    const response = await fetch(
      `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/orders/${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data.error) {
      toast.error("Error al eliminar el pedido");
    } else {
      toast.warning("Pedido eliminado correctamente");
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="px-5 mb-16"
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
                className: "w-1/9",
              },
            },
            {
              header: "Completado",
              accessor: "completed",
              cell: (x: any) =>
                x.completed ? <Check size={16} /> : <X size={16} />,
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Estado",
              accessor: "state",
              cell: (x: any) =>
                x.state.slice(0, 1).toUpperCase() + x.state.slice(1),
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Usuario",
              accessor: "user",
              onSort: (x: any) => orderOrders("user", x),
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Subtotal",
              accessor: "subtotal",
              onSort: (x: any) => orderOrders("subtotal", x),
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Total",
              accessor: "total",
              onSort: (x: any) => orderOrders("total", x),
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Descuento",
              accessor: "discount",
              cellProps: {
                className: "w-1/9",
              },
              cell: (x: any) => (x.discount ? `${x.discount}%` : "0%"),
            },
            {
              header: "Productos",
              accessor: "products",
              cell: (x: any) =>
                x.products.map((product: any) => product[0]).join(", "),
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Tipo",
              accessor: "type",
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Comentarios",
              accessor: "comments",
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Dirección",
              accessor: "address",
              cellProps: {
                className: "w-1/9",
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
              cell: (x: any) => (
                <div className="flex flex-row justify-end items-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertModal
                        loading={loading}
                        onClick={() => deleteOrder(x.id)}
                        title={"¿Estás seguro de eliminar este pedido?"}
                        body={"Esta acción no será reversible."}
                        cancelText={`Cancelar`}
                        actionText={`Eliminar`}
                      >
                        <div className="hover:bg-gray-100 p-2 rounded-md">
                          <TrashIcon size={18} />
                        </div>
                      </AlertModal>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{`Eliminar usuario`}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ),
            },
          ]}
        />
      </motion.div>
    </AdminLayout>
  );
};
