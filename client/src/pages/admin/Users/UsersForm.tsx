import TextInput from "@/components/form/TextInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { User } from "@/interfaces/User";
import { AdminLayout } from "@/layouts/AdminLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import AlertModal from "@/components/ui/alert-modal";

export const UsersForm = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<User>({
    name: "",
    surname: "",
    address: "",
    phone: "",
    userName: "",
    email: "",
    password: "",
  });

  const usersSchema = z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    userName: z.string().optional(),
    email: z.string().email(),
    password: id
      ? z
          .string()
          .refine((password) => password === "" || password.length >= 8, {
            message: "String must contain at least 8 character(s)",
          })
      : z.string().min(8),
  });

  type UsersFormProps = z.infer<typeof usersSchema>;

  const form = useForm<UsersFormProps>({
    resolver: zodResolver(usersSchema),
    defaultValues: {
      name: "",
      surname: "",
      address: "",
      phone: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/users/${id}`
      );
      const data: User = await response.json();
      const { password, ...data_ } = data;
      form.reset({ password: "", ...data_ });
      setInitialValues({ password: "", ...data_ });
      toast.success("Datos del usuario cargados correctamente");
    } catch (error) {
      toast.error("Error al cargar los datos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const userTransfer = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/users/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      const newUser = {
        id: await data[0].id,
        name: await data[0].name,
        surname: await data[0].surname,
        address: await data[0].address,
        phone: await data[0].phone,
        userName: await data[0].userName,
        email: await data[0].email,
        password: await data[0].password,
        position: "",
        dni: "",
        admin: false,
      };

      await fetch(`${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      toast.success("Usuario transferido correctamente");

      navigate("/admin/users");
    } catch (error) {
      toast.error("Error al transferir el usuario");
    }
  };

  const onSubmit = form.handleSubmit(async (formData) => {
    setLoading(true);
    try {
      if (id) {
        const response = await fetch(
          `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/users/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        if (data.error) {
          toast.error(data.error);
        } else {
          getData();
        }
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Usuario creado correctamente");
          navigate(`/admin/users/${data.id}`);
        }
      }
    } catch (error) {
      toast.error("Error al guardar el usuario");
    } finally {
      setLoading(false);
    }
  });

  return (
    <AdminLayout>
      {!loading && (
        <Form {...form}>
          <form className={`px-2`}>
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center gap-1">
                <Link to={`/admin/users`}>
                  <Button type="button" variant={"ghost"} className="px-2">
                    <ChevronLeft size={18} />
                  </Button>
                </Link>
                <h1 className="font-cal text-2xl font-bold dark:text-white">
                  {id ? `Editar usuario` : `Nuevo usuario`}
                </h1>
              </div>
            </div>
            <div className="p-3 flex flex-col gap-2">
              <Card>
                <CardHeader>
                  <CardTitle>Datos personales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col w-full justify-around p-2 gap-3">
                    <div className="flex flex-col md:flex-row gap-10">
                      <TextInput
                        name="name"
                        label={`Nombre`}
                        control={form.control}
                        className="w-full"
                      />
                      <TextInput
                        name="surname"
                        label={`Apellidos`}
                        control={form.control}
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-10">
                      <TextInput
                        name="phone"
                        label={`Teléfono`}
                        control={form.control}
                        className="w-full md:w-[20%]"
                      />
                      <TextInput
                        name="address"
                        label={`Dirección Postal`}
                        control={form.control}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Datos de acceso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-3 p-2">
                    <TextInput
                      name="userName"
                      label={`Usuario`}
                      control={form.control}
                      className="w-full"
                    />
                    <TextInput
                      name="email"
                      label={`Correo electrónico`}
                      control={form.control}
                      className="w-full"
                    />
                    <TextInput
                      name="password"
                      label={`Contraseña ${
                        id ? "(Dejar en blanco para mantenerla)" : ""
                      }`}
                      control={form.control}
                      className="w-full"
                      secure
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-full flex flex-col md:flex-row items-center mb-20 ${
              id ? "justify-between" : "justify-end"
            } px-5 gap-2`}
          >
            {id && (
              <AlertModal
                loading={loading}
                onClick={userTransfer}
                title={"¿Estás seguro de transferir este usuario a empleados?"}
                body={"Esta acción podrás revertirla posteriormente."}
                cancelText={`Cancelar`}
                actionText={`Transferir`}
              >
                <Button
                  disabled={loading}
                  onClick={() => {}}
                  variant={`outline`}
                  className="flex flex-row gap-1"
                >
                  Transferir a empleados
                  <ChevronsRight size={20} />
                </Button>
              </AlertModal>
            )}
            <div>
              {form.formState.isDirty && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-row items-center justify-end px-4 gap-2"
                >
                  <Button
                    disabled={loading}
                    onClick={onSubmit}
                    variant={`default`}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant={`destructive`}
                    disabled={loading}
                    onClick={() => form.reset(initialValues)}
                  >
                    Cancelar
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </Form>
      )}
    </AdminLayout>
  );
};
