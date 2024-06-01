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
import { Check, CirclePlus, Edit, TrashIcon, Utensils, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import AlertModal from "@/components/ui/alert-modal";
import MediaViewer from "@/components/media/MediaViewer";
import { useWebSocket } from "@/contexts/WebSocket/WebSockeProvider";

export const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<any>([]);
  const { user } = useContext<any>(UserContext);
  const io = useWebSocket();

  useEffect(() => {
    fetchData();
    fetchSections();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/foodServices`
      );
      const data = await response.json();
      data.sort((a: any, b: any) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setProducts(data);
      setFilteredProducts(data);
      toast.success("Productos cargados correctamente");
    } catch (error) {
      toast.error("Error al cargar los productos");
    }
    setLoading(false);
  };

  const filterProducts = (s: string) => {
    let filtered = products.filter((e: any) =>
      e.name.toLowerCase().includes(s.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const fetchSections = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/categories/`
    );
    const data = await response.json();
    setSections(data);
  };

  const orderProducts = (key: string, sort: string) => {
    let sorted = filteredProducts.sort((a: any, b: any) => {
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
    setFilteredProducts((_prev: any) => [...sorted]);
  };

  const toggleVisibility = async (id: string) => {
    const product: any = filteredProducts.find((e: any) => e.id === id);
    if (!product) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/foodServices/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            available: !product.available,
          }),
        }
      );
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setFilteredProducts((filteredProducts: any[]) =>
          filteredProducts.map((e: any) =>
            e.id === id ? { ...e, available: !e.available } : e
          )
        );
        toast.success("Visibilidad actualizada correctamente");
        io.emit("update_menu", {});
      }
    } catch (error) {
      toast.error("Error al actualizar la visibilidad");
    }
  };

  const deleteProduct = async (id: string) => {
    setFilteredProducts(filteredProducts.filter((e: any) => e.id !== id));
    const response = await fetch(
      `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/foodServices/${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data.error) {
      toast.error("Error al eliminar el producto");
    } else {
      toast.warning("Producto eliminado correctamente");
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
          name={`Productos (${filteredProducts.length})`}
          data={filteredProducts.slice((page - 1) * 10, page * 10)}
          pages={Math.ceil(filteredProducts.length / 10)}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPreviousPage={() => setPage(page - 1)}
          loading={loading}
          emptyLogo={<Utensils size={24} />}
          extraButtons={
            user.admin ? (
              <Link to={`/admin/products/new`}>
                <Button>{<CirclePlus size={18} />}</Button>
              </Link>
            ) : null
          }
          onSearch={(s) => {
            filterProducts(s);
            setPage(1);
          }}
          searchable
          emptyMessage={`No hay productos para mostrar`}
          columns={[
            {
              header: "Imagen",
              accessor: "image",
              cell: (x: any) => (
                <div className="w-[2.5rem] flex items-center justify-center">
                  {!x.image || x.image === "" ? (
                    <Utensils size={18} />
                  ) : (
                    <MediaViewer
                      id={x.image}
                      imageFill={`object-cover`}
                      showLoader
                    />
                  )}
                </div>
              ),
            },
            {
              header: "Nombre",
              accessor: "name",
              onSort: (x: any) => orderProducts("name", x),
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Ingredientes",
              accessor: "ingredients",
              cell: (x: any) =>
                Array.isArray(x.ingredients)
                  ? x.ingredients?.join(", ")
                  : x.ingredients,
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Descripción",
              accessor: "description",
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Sección",
              accessor: "section",
              onSort: (x: any) => orderProducts("section", x),
              cell: (x: any) =>
                sections.map((s: any) => (s.id === x.section ? s.name : null)),
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Tamaño",
              accessor: "size",
              cellProps: {
                className: "w-1/9",
              },
            },
            {
              header: "Precio",
              accessor: "price",
              cellProps: {
                className: "w-1/9",
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
                className: "w-1/9",
              },
            },
            {
              header: "Última actualización",
              accessor: "updated_at",
              cell: (x: any) =>
                format(new Date(x.updated_at), "dd/MM/yyyy HH:mm"),
              onSort: (x: any) => orderProducts("updated_at", x),
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
                  <Link to={`/admin/products/${x.id}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant={"ghost"}>
                          <Edit size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{`Editar producto`}</p>
                      </TooltipContent>
                    </Tooltip>
                  </Link>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertModal
                        loading={loading}
                        onClick={() => deleteProduct(x.id)}
                        title={"¿Estás seguro de eliminar este producto?"}
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
                      <p>{`Eliminar producto`}</p>
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
