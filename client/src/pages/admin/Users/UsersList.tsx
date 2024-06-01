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
import { Edit, TrashIcon, UserPlus, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import AlertModal from "@/components/ui/alert-modal";

export const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState<any>([]);
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
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/users/`
      );
      const data = await response.json();
      data.sort((a: any, b: any) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setUsers(data);
      setFilteredUsers(data);
      toast.success("Usuarios cargados correctamente");
    } catch (error) {
      toast.error("Error al cargar los usuarios");
    }
    setLoading(false);
  };

  const filterUsers = (s: string) => {
    let filtered = users.filter((e: any) =>
      e.name.toLowerCase().includes(s.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const orderUsers = (key: string, sort: string) => {
    let sorted = filteredUsers.sort((a: any, b: any) => {
      if (key === "name") {
        if (sort === "asc") {
          return a[key].toLowerCase().localeCompare(b[key].toLowerCase());
        } else {
          return b[key].toLowerCase().localeCompare(a[key].toLowerCase());
        }
      } else {
        if (sort === "asc") {
          return new Date(a[key]).getTime() - new Date(b[key]).getTime();
        } else {
          return new Date(b[key]).getTime() - new Date(a[key]).getTime();
        }
      }
    });
    setFilteredUsers((_prev: any) => [...sorted]);
  };

  const deleteUser = async (id: string) => {
    setFilteredUsers(filteredUsers.filter((e: any) => e.id !== id));
    const response = await fetch(
      `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/users/${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data.error) {
      toast.error("Error al eliminar el usuario");
    } else {
      toast.warning("Usuario eliminado correctamente");
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="px-5"
      >
        <DataTable
          name={`Usuarios (${filteredUsers.length})`}
          data={filteredUsers.slice((page - 1) * 10, page * 10)}
          pages={Math.ceil(filteredUsers.length / 10)}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPreviousPage={() => setPage(page - 1)}
          loading={loading}
          emptyLogo={<Users size={24} />}
          extraButtons={
            user.admin ? (
              <Link to={`/admin/users/new`}>
                <Button>{<UserPlus size={18} />}</Button>
              </Link>
            ) : null
          }
          onSearch={(s) => {
            filterUsers(s);
            setPage(1);
          }}
          searchable
          emptyMessage={`No hay usuarios para mostrar`}
          columns={[
            {
              header: "Nombre",
              accessor: "name",
              onSort: (x: any) => orderUsers("name", x),
              cellProps: {
                className: "w-1/7",
              },
            },
            {
              header: "Apellidos",
              accessor: "surname",
              cellProps: {
                className: "w-1/7",
              },
            },
            {
              header: "Dirección",
              accessor: "address",
              cellProps: {
                className: "w-1/7",
              },
            },
            {
              header: "Teléfono",
              accessor: "phone",
              cellProps: {
                className: "w-1/7",
              },
            },
            {
              header: "Alias",
              accessor: "userName",
              cellProps: {
                className: "w-1/7",
              },
            },
            {
              header: "Email",
              accessor: "email",
              cellProps: {
                className: "w-1/7",
              },
            },
            {
              header: "Última actualización",
              accessor: "updated_at",
              cell: (x: any) =>
                format(new Date(x.updated_at), "dd/MM/yyyy HH:mm"),
              onSort: (x: any) => orderUsers("updated_at", x),
              cellProps: {
                className: "w-1/7",
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
                  <Link to={`/admin/users/${x.id}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant={"ghost"}>
                          <Edit size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{`Editar usuario`}</p>
                      </TooltipContent>
                    </Tooltip>
                  </Link>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertModal
                        loading={loading}
                        onClick={() => deleteUser(x.id)}
                        title={"¿Estás seguro de eliminar este usuario?"}
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
