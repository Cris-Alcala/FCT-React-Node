import TextInput from "@/components/form/TextInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { User } from "@/interfaces/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import { UserLayout } from "@/layouts/UserLayout";
import { UserContext } from "@/contexts/User/UserContext";

export const Settings = () => {
  const { user, setUser } = useContext<any>(UserContext);
  const [loading, setLoading] = useState(false);
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
    name: z.string().min(1),
    surname: z.string().optional(),
    address: z.string().min(1),
    phone: z.string().min(9),
    userName: z.string().optional(),
    email: z.string().email(),
    password: z
      .string()
      .refine((password) => password === "" || password.length >= 8, {
        message: "String must contain at least 8 character(s)",
      }),
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
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/users/${user.id}`
      );
      const data: User = await response.json();
      const { password, ...data_ } = data;
      form.reset({ password: "", ...data_ });
      setInitialValues({ password: "", ...data_ });
    } catch (error) {
      toast.error("Error al cargar los datos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = form.handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/users/${user.id}`,
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
        setUser({
          id: data.id,
          name: data.name,
          surname: data.surname,
          address: data.address,
          phone: data.phone,
          userName: data.userName,
          email: data.email,
        });
      }
    } catch (error) {
      toast.error("Error al guardar el usuario");
    } finally {
      setLoading(false);
    }
  });

  return (
    <UserLayout>
      {!loading && (
        <Form {...form}>
          <form className="px-2 mt-[7rem] md:mt-[5rem]">
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center gap-1">
                <Link to={`/`}>
                  <Button type="button" variant={"ghost"} className="px-2">
                    <ChevronLeft size={18} />
                  </Button>
                </Link>
                <h1 className="font-cal text-2xl font-bold dark:text-white">
                  Ajustes
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
                        className="w-[20%]"
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
                      label={`Contraseña (Dejar en blanco para mantenerla)`}
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
            className={`w-full flex flex-row items-center justify-end px-5 gap-2 mb-5 md:mb-0`}
          >
            <div>
              {form.formState.isDirty && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-row items-center justify-end px-5 gap-2"
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
    </UserLayout>
  );
};
