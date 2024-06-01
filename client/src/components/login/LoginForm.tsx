import { UserContext } from "@/contexts/User/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "../ui/form";
import TextInput from "../form/TextInput";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export const LoginForm = () => {
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "El nombre de usuario no puede estar vacío" })
      .email({ message: "Este email no es correcto" }),
    password: z
      .string()
      .min(1, { message: "La contraseña no puede estar vacía" }),
  });

  type LoginProps = z.infer<typeof loginSchema>;

  const loginForm = useForm<LoginProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setUser, setLogued } = useContext<any>(UserContext);

  const onLoginSubmit = loginForm.handleSubmit(async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const data_ = await response.json();
      if (response.ok) {
        setUser(data_);
        setLogued(true);
        toast.success("Inicio de sesión correcto");
      } else {
        toast.error(
          response.status === 400 || response.status === 401
            ? "Email o contraseña incorrectos"
            : "Error al iniciar sesión"
        );
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Form {...loginForm}>
        <form
          className="space-y-6 p-6 transition-all ease-in-out duration-300"
          onSubmit={onLoginSubmit}
        >
          <div>
            <div className="mt-1">
              <TextInput
                label="Email"
                name="email"
                control={loginForm.control}
                onlyInputClassName={`appearance-none block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:border-black focus:border transition-all duration-300 ease-in-out bg-white`}
              />
            </div>
          </div>
          <div>
            <div className="mt-1">
              <TextInput
                label="Contraseña"
                name="password"
                control={loginForm.control}
                onlyInputClassName={`appearance-none block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:border-black focus:border transition-all duration-300 ease-in-out bg-white`}
                secure
              />
            </div>
          </div>
          <div>
            <Button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-0 transition-all duration-300 ease-in-out"
              type="submit"
            >
              Iniciar sesión
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};
