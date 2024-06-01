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
import { Check, Contact, Edit, TrashIcon, UserPlus, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import AlertModal from "@/components/ui/alert-modal";

export const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any>([]);
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
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/employees/`
      );
      const data = await response.json();
      data.sort((a: any, b: any) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setEmployees(data);
      setFilteredEmployees(data);
      toast.success("Empleados cargados correctamente");
    } catch (error) {
      toast.error("Error al cargar los empleados");
    }
    setLoading(false);
  };

  const filterEmployees = (s: string) => {
    let filtered = employees.filter((e: any) =>
      e.name.toLowerCase().includes(s.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const orderEmployees = (key: string, sort: string) => {
    let sorted = filteredEmployees.sort((a: any, b: any) => {
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
    setFilteredEmployees((_prev: any) => [...sorted]);
  };

  const toggleAdmin = async (id: string) => {
    const employee: any = filteredEmployees.find((e: any) => e.id === id);
    if (!employee) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/employees/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin: !employee.admin,
          }),
        }
      );
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setFilteredEmployees((filteredEmployees: any[]) =>
          filteredEmployees.map((e: any) =>
            e.id === id ? { ...e, admin: !e.admin } : e
          )
        );
        toast.success("Privilegios actualizados correctamente");
      }
    } catch (error) {
      toast.error("Error al actualizar los privilegios");
    }
  };

  const deleteEmployee = async (id: string) => {
    setFilteredEmployees(filteredEmployees.filter((e: any) => e.id !== id));
    const response = await fetch(
      `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/employees/${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data.error) {
      toast.error("Error al eliminar el empleado");
    } else {
      toast.warning("Empleado eliminado correctamente");
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
          name={`Empleados (${filteredEmployees.length})`}
          data={filteredEmployees.slice((page - 1) * 10, page * 10)}
          pages={Math.ceil(filteredEmployees.length / 10)}
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPreviousPage={() => setPage(page - 1)}
          loading={loading}
          emptyLogo={<Contact size={24} />}
          extraButtons={
            user.admin ? (
              <Link to={`/admin/employees/new`}>
                <Button>{<UserPlus size={18} />}</Button>
              </Link>
            ) : null
          }
          onSearch={(s) => {
            filterEmployees(s);
            setPage(1);
          }}
          searchable
          emptyMessage={`No hay empleados para mostrar`}
          columns={[
            {
              header: "Nombre",
              accessor: "name",
              onSort: (x: any) => orderEmployees("name", x),
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Apellidos",
              accessor: "surname",
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "DNI",
              accessor: "dni",
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
              header: "Teléfono",
              accessor: "phone",
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Alias",
              accessor: "userName",
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Email",
              accessor: "email",
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Puesto",
              accessor: "position",
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Admin",
              accessor: "admin",
              cell: (x: any) => (
                <Button
                  size={`icon`}
                  variant={`${x.admin ? "default" : "ghost"}`}
                  onClick={() => toggleAdmin(x.id)}
                >
                  {x.admin ? <Check size={16} /> : <X size={16} />}
                </Button>
              ),
              cellProps: {
                className: "w-1/10",
              },
            },
            {
              header: "Última actualización",
              accessor: "updated_at",
              cell: (x: any) =>
                format(new Date(x.updated_at), "dd/MM/yyyy HH:mm"),
              onSort: (x: any) => orderEmployees("updated_at", x),
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
              cell: (x: any) => (
                <div className="flex flex-row justify-end items-center">
                  <Link to={`/admin/employees/${x.id}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant={"ghost"}>
                          <Edit size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{`Editar empleado`}</p>
                      </TooltipContent>
                    </Tooltip>
                  </Link>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertModal
                        loading={loading}
                        onClick={() => deleteEmployee(x.id)}
                        title={"¿Estás seguro de eliminar este empleado?"}
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
                      <p>{`Eliminar empleado`}</p>
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
