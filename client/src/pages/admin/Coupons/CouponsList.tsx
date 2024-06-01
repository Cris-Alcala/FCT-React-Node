import DataTable from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserContext } from "@/contexts/User/UserContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import { motion } from "framer-motion";
import {
  Check,
  CirclePlus,
  Edit,
  TicketPercent,
  TrashIcon,
  X,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import AlertModal from "@/components/ui/alert-modal";
import CouponsDialogItem from "@/components/form/CouponsDialog";

export const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useContext<any>(UserContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/coupons`
      );
      const data = await response.json();
      data.sort((a: any, b: any) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setCoupons(data);
      setFilteredCoupons(data);
      toast.success("Cupones cargadas correctamente");
    } catch (error) {
      toast.error("Error al cargar los cupones");
    }
    setLoading(false);
  };

  const filterCoupons = (s: string) => {
    let filtered = coupons.filter((e: any) =>
      e.name.toLowerCase().includes(s.toLowerCase())
    );
    setFilteredCoupons(filtered);
  };

  const orderCoupons = (key: string, sort: string) => {
    let sorted = filteredCoupons.sort((a: any, b: any) => {
      if (key === "updated_at") {
        if (sort === "asc") {
          return new Date(a[key]).getTime() - new Date(b[key]).getTime();
        } else {
          return new Date(b[key]).getTime() - new Date(a[key]).getTime();
        }
      } else if (key === "name") {
        if (sort === "asc") {
          return a[key].toLowerCase().localeCompare(b[key].toLowerCase());
        } else {
          return b[key].toLowerCase().localeCompare(a[key].toLowerCase());
        }
      } else {
        if (sort === "asc") {
          return a[key] - b[key];
        } else {
          return b[key] - a[key];
        }
      }
    });
    setFilteredCoupons((_prev: any) => [...sorted]);
  };

  const toggleVisibility = async (id: string) => {
    const coupon: any = filteredCoupons.find((e: any) => e.id === id);
    if (!coupon) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/coupons/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            available: !coupon.available,
          }),
        }
      );
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setFilteredCoupons((filteredCoupons: any[]) =>
          filteredCoupons.map((e: any) =>
            e.id === id ? { ...e, available: !e.available } : e
          )
        );
        toast.success("Visibilidad actualizada correctamente");
      }
    } catch (error) {
      toast.error("Error al actualizar la visibilidad");
    }
  };

  const deleteCoupon = async (id: string) => {
    setFilteredCoupons(filteredCoupons.filter((e: any) => e.id !== id));
    const response = await fetch(
      `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/coupons/${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data.error) {
      toast.error("Error al eliminar el cupón");
    } else {
      toast.warning("Cupón eliminado correctamente");
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
          name={`Cupones (${filteredCoupons.length})`}
          data={filteredCoupons.slice((page - 1) * 10, page * 10)}
          pages={Math.ceil(filteredCoupons.length / 10)}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPreviousPage={() => setPage(page - 1)}
          loading={loading}
          emptyLogo={<TicketPercent size={24} />}
          extraButtons={
            user.admin ? (
              <CouponsDialogItem updateCallBack={fetchData}>
                <Button size="default" variant={"default"}>
                  <CirclePlus size={18} />
                </Button>
              </CouponsDialogItem>
            ) : null
          }
          onSearch={(s) => {
            filterCoupons(s);
            setPage(1);
          }}
          searchable
          emptyMessage={`No hay cupones para mostrar`}
          columns={[
            {
              header: "Nombre",
              accessor: "name",
              onSort: (x: any) => orderCoupons("name", x),
              cellProps: {
                className: "w-1/5",
              },
            },
            {
              header: "Descuento",
              accessor: "discount",
              onSort: (x: any) => orderCoupons("discount", x),
              cellProps: {
                className: "w-1/5",
              },
            },
            {
              header: "Descripción",
              accessor: "description",
              cellProps: {
                className: "w-1/5",
              },
            },
            {
              header: "Disponible",
              accessor: "available",
              cell: (x: any) => (
                <Button
                  size={`icon`}
                  variant={`${x.available ? "default" : "ghost"}`}
                  onClick={() => toggleVisibility(x.id)}
                >
                  {x.available ? <Check size={16} /> : <X size={16} />}
                </Button>
              ),
              cellProps: {
                className: "w-1/5",
              },
            },
            {
              header: "Última actualización",
              accessor: "updated_at",
              cell: (x: any) =>
                format(new Date(x.updated_at), "dd/MM/yyyy HH:mm"),
              onSort: (x: any) => orderCoupons("updated_at", x),
              cellProps: {
                className: "w-1/5",
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
                  <CouponsDialogItem id={x.id} updateCallBack={fetchData}>
                    <Button size="icon" variant={"ghost"}>
                      <Edit size={16} />
                    </Button>
                  </CouponsDialogItem>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertModal
                        loading={loading}
                        onClick={() => deleteCoupon(x.id)}
                        title={"¿Estás seguro de eliminar este cupón?"}
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
                      <p>{`Eliminar sección`}</p>
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
