import { TextRevealCard } from "@/components/ui/text-reveal-card";
import Texto from "@/components/media/Texto";
import { useState } from "react";
import { Toaster } from "sonner";
import { useParams } from "react-router-dom";
import { LoginForm } from "@/components/login/LoginForm";
import { RegisterForm } from "@/components/login/RegisterForm";

export const Login = () => {
  const { register } = useParams();
  const [isLogin, setIsLogin] = useState(() => (register ? false : true));

  return (
    <>
      <Toaster position="bottom-center" expand={false} richColors />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 flex-col gap-5 transition-all ease-in-out duration-300">
        <div className="border-b-2 border-gray-400 rounded-lg shadow-2xl shadow-gray-300 bg-transparent py-5 transition-all ease-in-out duration-300">
          <div className="mx-auto w-full bg-transparent rounded-lg dark:bg-gray-800 transition-all ease-in-out duration-300">
            <div className="text-center transition-all ease-in-out duration-300">
              <div className="flex justify-center mb-4 bg-gray-700 rounded-lg shadow-md transition-all ease-in-out duration-300">
                <Texto className="w-[8rem] p-1 animate-pulse bg-transparent" />
              </div>
              <TextRevealCard
                text="Porque nosotros tenemos el producto"
                revealText="Y tú tienes el paladar"
                className="text-center w-full bg-transparent rounded-md"
              />
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {isLogin
                  ? "Inicia sesión para acceder a tu cuenta."
                  : "Regístrate para crear una cuenta."}
              </p>
            </div>
            {isLogin ? <LoginForm /> : <RegisterForm />}
            <div className="text-center m-0">
              <button
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "¿No tienes una cuenta? Regístrate"
                  : "¿Ya tienes una cuenta? Inicia sesión"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
