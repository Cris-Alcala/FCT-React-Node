import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import TextInput from "./TextInput";
import { Form, FormField } from "../ui/form";
import { Section } from "@/interfaces/Section";
import { Switch } from "../ui/switch";

const formSchema = z.object({
  updated_at: z.string(),
  name: z.string().min(1),
  available: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;
type DialogItemProps = {
  id?: string;
  children: React.ReactNode;
  updateCallBack?: () => void;
};

export default function SectionsDialogItem({
  id,
  children,
  updateCallBack,
}: DialogItemProps) {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState<Section>({
    name: "",
    updated_at: "",
    available: false,
  });
  const [loading, setLoading] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues ? initialValues.name : "",
      updated_at: initialValues ? initialValues.updated_at : "",
      available: initialValues ? initialValues.available : false,
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
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/categories/${id}`
      );
      const data: any = await response.json();
      form.reset(data);
      setInitialValues(data);
      toast.success("Datos de la sección cargados correctamente");
    } catch (error) {
      toast.error("Error al cargar los datos de la sección");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = form.handleSubmit(async (formData) => {
    setLoading(true);
    try {
      if (id) {
        await fetch(
          `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/categories/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        setOpen(false);
        updateCallBack && updateCallBack();
        toast.success("Sección actualizada correctamente");
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/categories`,
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
          toast.success("Producto creado correctamente");
          setOpen(false);
          updateCallBack && updateCallBack();
        }
      }
    } catch (error) {
      toast.error("Error al guardar la sección");
    } finally {
      setLoading(false);
    }
  });

  return (
    !loading && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="flex flex-col p-0 w-full max-w-lg">
          <DialogHeader className="px-4 py-3 bg-stone-50">
            {id ? (
              <span className="font-bold">{"Editar sección"}</span>
            ) : (
              <span className="font-bold">{"Nueva sección"}</span>
            )}
          </DialogHeader>
          <Form {...form}>
            <div className="flex flex-col gap-4 p-4 px-8">
              <TextInput label={"Nombre"} name="name" control={form.control} />
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <div className="flex flex-row items-center gap-2">
                    <label className="ml-2">Disponible</label>
                    <Switch
                      name="available"
                      onCheckedChange={() => {
                        field.onChange(!form.getValues("available"));
                      }}
                      checked={form.getValues("available")}
                    />
                  </div>
                )}
              />
            </div>
            <DialogFooter className="bg-stone-50 p-4 rounded-b-xl flex flex-row lg:flex-row items-center w-full justify-end gap-3">
              <Button onClick={onSubmit}>{"Guardar"}</Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>
                {"Cancelar"}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    )
  );
}
