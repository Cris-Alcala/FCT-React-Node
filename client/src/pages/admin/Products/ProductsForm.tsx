import SelectInput from "@/components/form/SelectInput";
import TextInput from "@/components/form/TextInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/layouts/AdminLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import { Product } from "@/interfaces/Product";
import TextAreaInput from "@/components/form/TextAreaInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebSocket } from "@/contexts/WebSocket/WebSockeProvider";

const productsSchema = z.object({
  name: z.string().min(3).max(255),
  ingredients: z.string().max(255).optional(),
  price: z.coerce.number().positive().min(0),
  image: z.coerce.string(),
  description: z.string().max(200).optional(),
  section: z.string(),
  available: z.boolean(),
  size: z.string().optional(),
});

type ProductsFormProps = z.infer<typeof productsSchema>;

export const ProductsForm = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<{ name: string; id: string }[]>([]);
  const [isDrink, setIsDrink] = useState<boolean>(false);
  const navigate = useNavigate();
  const io = useWebSocket();
  const [initialValues, setInitialValues] = useState<Product>({
    name: "",
    ingredients: "",
    price: 0,
    image: "",
    description: "",
    section: "",
    available: false,
    size: "",
  });
  const form = useForm<ProductsFormProps>({
    resolver: zodResolver(productsSchema),
    defaultValues: {
      name: "",
      ingredients: "",
      price: 0,
      image: "",
      description: "",
      section: "",
      available: false,
      size: "",
    },
  });

  useEffect(() => {
    if (id) {
      getData();
    } else {
      getSections();
    }
  }, [id]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/foodServices/${id}`
      );
      const data: any = await response.json();
      const preparedData = {
        ...data,
        ingredients: Array.isArray(data.ingredients)
          ? data.ingredients?.join(", ")
          : data.ingredients,
      };
      await getSections();
      form.reset(preparedData);
      setInitialValues(preparedData);
      toast.success("Datos del producto cargados correctamente");
    } catch (error) {
      toast.error("Error al cargar los datos del producto");
    } finally {
      setLoading(false);
    }
  };

  const getSections = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/categories`
      );
      const data = await response.json();
      setSections(data);
    } catch (error) {
      toast.error("Error al cargar las secciones");
    }
  };

  const checkDrink = (id: string) => {
    return sections.filter((s: any) => s.id == id)[0]?.name == "Bebidas";
  };

  const onSubmit = form.handleSubmit(async (formData) => {
    if (isDrink) {
      const drinkID = sections.filter((s: any) => s.name == "Bebidas");
      formData = { ...formData, section: drinkID[0]?.id };
    }
    setLoading(true);
    try {
      if (id) {
        await fetch(
          `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/foodServices/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        toast.success("Producto actualizado correctamente");
        getData();
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/foodServices`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              image: "LogoTextoBlack.svg",
            }),
          }
        );
        const data = await response.json();

        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Producto creado correctamente");
          navigate(`/admin/products/${data.id}`);
        }
      }
      io.emit("update_menu", {});
    } catch (error) {
      toast.error("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  });

  return (
    <AdminLayout>
      {!loading && (
        <Form {...form}>
          <form className="px-2">
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center gap-1">
                <Link to={`/admin/products`}>
                  <Button type="button" variant={"ghost"} className="px-2">
                    <ChevronLeft size={18} />
                  </Button>
                </Link>
                <h1 className="font-cal text-2xl font-bold dark:text-white">
                  {id ? `Editar producto` : `Nuevo producto`}
                </h1>
              </div>
            </div>
            {!id ? (
              <Tabs
                defaultValue="food"
                className="w-full flex flex-col p-3 gap-3"
              >
                <TabsList className="mx-auto">
                  <TabsTrigger value="food" onClick={() => setIsDrink(false)}>
                    Comida
                  </TabsTrigger>
                  <TabsTrigger value="drink" onClick={() => setIsDrink(true)}>
                    Bebida
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="food">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`w-full`}
                  >
                    <div className="p-3 flex flex-col gap-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Especificaciones principales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col w-full justify-around p-1 gap-3">
                            <div className="flex flex-col gap-10">
                              <div className="flex flex-col md:flex-row gap-3">
                                <TextInput
                                  name="name"
                                  label={`Nombre`}
                                  control={form.control}
                                  className="w-full"
                                />
                                <TextInput
                                  name="price"
                                  label={`Precio`}
                                  control={form.control}
                                  type="number"
                                  min={0}
                                  className="w-full"
                                />
                                {!loading && (
                                  <SelectInput
                                    className="w-full"
                                    name="section"
                                    label={`Sección`}
                                    control={form.control}
                                    options={[
                                      { label: "Seleccionar", value: null },
                                      ...sections
                                        .filter(
                                          (x: any) => x.name !== "Bebidas"
                                        )
                                        .map((x) => ({
                                          label: x.name,
                                          value: x.id,
                                        })),
                                    ]}
                                  />
                                )}
                              </div>
                              <TextAreaInput
                                name="ingredients"
                                label={`Ingredientes (separar por comas)`}
                                control={form.control}
                                className="w-full"
                              />
                              <TextAreaInput
                                name="description"
                                label={`Descripción (Max 200)`}
                                control={form.control}
                                className="w-full"
                                maxLength={200}
                              />
                              <FormField
                                control={form.control}
                                name="available"
                                render={({ field }) => (
                                  <div className="flex flex-row items-center gap-2">
                                    <label className="ml-2">Disponible</label>
                                    <Switch
                                      name="available"
                                      onCheckedChange={() => {
                                        field.onChange(
                                          !form.getValues("available")
                                        );
                                      }}
                                      checked={form.getValues("available")}
                                    />
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                </TabsContent>
                <TabsContent value="drink">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`w-full`}
                  >
                    <div className="p-3 flex flex-col gap-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Especificaciones principales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col w-full justify-around p-1 gap-3">
                            <div className="flex flex-col gap-10">
                              <div className="flex flex-col md:flex-row gap-3">
                                <TextInput
                                  name="name"
                                  label={`Nombre`}
                                  control={form.control}
                                  className="w-full"
                                />
                                <TextInput
                                  name="price"
                                  label={`Precio`}
                                  control={form.control}
                                  type="number"
                                  min={0}
                                  className="w-full"
                                />
                              </div>

                              <TextInput
                                name="size"
                                label={`Tamaño`}
                                control={form.control}
                                className="w-full"
                              />
                              <FormField
                                control={form.control}
                                name="available"
                                render={({ field }) => (
                                  <div className="flex flex-row items-center gap-2">
                                    <label className="ml-2">Disponible</label>
                                    <Switch
                                      name="admin"
                                      onCheckedChange={() => {
                                        field.onChange(
                                          !form.getValues("available")
                                        );
                                      }}
                                      checked={form.getValues("available")}
                                    />
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`w-full`}
              >
                <div className="p-3 flex flex-col gap-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Especificaciones principales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col w-full justify-around p-1 gap-3">
                        <div className="flex flex-col gap-10">
                          <div className="flex flex-col md:flex-row gap-3">
                            <TextInput
                              name="name"
                              label={`Nombre`}
                              control={form.control}
                              className="w-full"
                            />
                            <TextInput
                              name="price"
                              label={`Precio`}
                              control={form.control}
                              type="number"
                              min={0}
                              className="w-full"
                            />
                            {!loading && (
                              <SelectInput
                                className="w-full"
                                name="section"
                                label={`Sección`}
                                control={form.control}
                                options={[
                                  { label: "Seleccionar", value: null },
                                  ...sections.map((x) => ({
                                    label: x.name,
                                    value: x.id,
                                  })),
                                ]}
                              />
                            )}
                          </div>
                          {!checkDrink(form.getValues("section")) ? (
                            <>
                              <TextAreaInput
                                name="ingredients"
                                label={`Ingredientes (separar por comas)`}
                                control={form.control}
                                className="w-full"
                              />
                              <TextAreaInput
                                name="description"
                                label={`Descripción (Max 200)`}
                                control={form.control}
                                className="w-full"
                                maxLength={200}
                              />
                            </>
                          ) : (
                            <TextInput
                              name="size"
                              label={`Tamaño`}
                              control={form.control}
                              className="w-full"
                            />
                          )}
                          <FormField
                            control={form.control}
                            name="available"
                            render={({ field }) => (
                              <div className="flex flex-row items-center gap-2">
                                <label className="ml-2">Disponible</label>
                                <Switch
                                  name="admin"
                                  onCheckedChange={() => {
                                    field.onChange(
                                      !form.getValues("available")
                                    );
                                  }}
                                  checked={form.getValues("available")}
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-full flex flex-row items-center justify-end px-5 gap-2 mb-16`}
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
    </AdminLayout>
  );
};
