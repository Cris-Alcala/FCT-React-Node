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
import { Apple, Check, CirclePlus, Edit, TrashIcon, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import AlertModal from "@/components/ui/alert-modal";
import SectionsDialogItem from "@/components/form/SectionsDialog";

export const SectionsList = () => {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState<any>([]);
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
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/categories`
      );
      const data = await response.json();
      data.sort((a: any, b: any) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setSections(data);
      setFilteredSections(data);
      toast.success("Secciones cargadas correctamente");
    } catch (error) {
      toast.error("Error al cargar las secciones");
    }
    setLoading(false);
  };

  const filterSections = (s: string) => {
    let filtered = sections.filter((e: any) =>
      e.name.toLowerCase().includes(s.toLowerCase())
    );
    setFilteredSections(filtered);
  };

  const orderSections = (key: string, sort: string) => {
    let sorted = filteredSections.sort((a: any, b: any) => {
      if (key === "updated_at") {
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
    setFilteredSections((_prev: any) => [...sorted]);
  };

  const toggleVisibility = async (id: string) => {
    const section: any = filteredSections.find((e: any) => e.id === id);
    if (!section) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/categories/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            available: !section.available,
          }),
        }
      );
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setFilteredSections((filteredSections: any[]) =>
          filteredSections.map((e: any) =>
            e.id === id ? { ...e, available: !e.available } : e
          )
        );
        toast.success("Visibilidad actualizada correctamente");
      }
    } catch (error) {
      toast.error("Error al actualizar la visibilidad");
    }
  };

  const deleteSection = async (id: string) => {
    setFilteredSections(filteredSections.filter((e: any) => e.id !== id));
    const response = await fetch(
      `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/categories/${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data.error) {
      toast.error("Error al eliminar la sección");
    } else {
      toast.warning("Sección eliminada correctamente");
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
          name={`Secciones (${filteredSections.length})`}
          data={filteredSections.slice((page - 1) * 10, page * 10)}
          pages={Math.ceil(filteredSections.length / 10)}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPreviousPage={() => setPage(page - 1)}
          loading={loading}
          emptyLogo={<Apple size={24} />}
          extraButtons={
            user.admin ? (
              <SectionsDialogItem updateCallBack={fetchData}>
                <Button size="default" variant={"default"}>
                  <CirclePlus size={18} />
                </Button>
              </SectionsDialogItem>
            ) : null
          }
          onSearch={(s) => {
            filterSections(s);
            setPage(1);
          }}
          searchable
          emptyMessage={`No hay secciones para mostrar`}
          columns={[
            {
              header: "Nombre",
              accessor: "name",
              onSort: (x: any) => orderSections("name", x),
              cellProps: {
                className: "w-1/3",
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
                className: "w-1/3",
              },
            },
            {
              header: "Última actualización",
              accessor: "updated_at",
              cell: (x: any) =>
                format(new Date(x.updated_at), "dd/MM/yyyy HH:mm"),
              onSort: (x: any) => orderSections("updated_at", x),
              cellProps: {
                className: "w-1/3",
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
                  <SectionsDialogItem id={x.id} updateCallBack={fetchData}>
                    <Button size="icon" variant={"ghost"}>
                      <Edit size={16} />
                    </Button>
                  </SectionsDialogItem>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertModal
                        loading={loading}
                        onClick={() => deleteSection(x.id)}
                        title={"¿Estás seguro de eliminar esta sección?"}
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
