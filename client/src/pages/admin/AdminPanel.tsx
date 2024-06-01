import { ScheduleItem } from "@/components/schedule/ScheduleItem";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AdminLayout } from "@/layouts/AdminLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const scheduleSchema = z.object({
  monday: z.string(),
  tuesday: z.string(),
  wednesday: z.string(),
  thursday: z.string(),
  friday: z.string(),
  saturday: z.string(),
  sunday: z.string(),
});

type ScheduleFormProps = z.infer<typeof scheduleSchema>;

export const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any>({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });
  const form = useForm<ScheduleFormProps>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/schedule`
      );
      const data = await response.json();
      form.reset({
        monday: data.monday,
        tuesday: data.tuesday,
        wednesday: data.wednesday,
        thursday: data.thursday,
        friday: data.friday,
        saturday: data.saturday,
        sunday: data.sunday,
      });

      setInitialValues({
        monday: data.monday,
        tuesday: data.tuesday,
        wednesday: data.wednesday,
        thursday: data.thursday,
        friday: data.friday,
        saturday: data.saturday,
        sunday: data.sunday,
      });
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const onSubmit = form.handleSubmit(async (formData) => {
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/schedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monday: formData.monday,
          tuesday: formData.tuesday,
          wednesday: formData.wednesday,
          thursday: formData.thursday,
          friday: formData.friday,
          saturday: formData.saturday,
          sunday: formData.sunday,
        }),
      });
      getData();
      toast.success("Horarios actualizados");
    } catch (error) {
      toast.error("Error al actualizar los horarios");
      console.error(error);
    }
    getData();
    setLoading(false);
  });
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {!loading && (
          <>
            <div className="px-5">
              <h2 className="text-2xl font-semibold">Horarios de apertura</h2>
              <p>(Dejar vacío para mantener cerrado)</p>
            </div>
            <Form {...form}>
              <div className="bg-white dark:bg-gray-950 m-5">
                <div className="grid grid-cols-2 gap-4">
                  <ScheduleItem
                    label="Lunes"
                    name="monday"
                    control={form.control}
                  />
                  <ScheduleItem
                    label="Martes"
                    name="tuesday"
                    control={form.control}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ScheduleItem
                    label="Miércoles"
                    name="wednesday"
                    control={form.control}
                  />
                  <ScheduleItem
                    label="Jueves"
                    name="thursday"
                    control={form.control}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ScheduleItem
                    label="Viernes"
                    name="friday"
                    control={form.control}
                  />
                  <ScheduleItem
                    label="Sábado"
                    name="saturday"
                    control={form.control}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <ScheduleItem
                    label="Domingo"
                    name="sunday"
                    control={form.control}
                  />
                </div>
              </div>
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
            </Form>
          </>
        )}
      </motion.div>
    </AdminLayout>
  );
};
