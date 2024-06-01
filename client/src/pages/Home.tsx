import { CustomNavLink } from "@/components/routing/CustomNavLink";
import { Button } from "@/components/ui/button";
import { UserLayout } from "@/layouts/UserLayout";
import {
  ChevronsDown,
  Github,
  Linkedin,
  LocateIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Home = () => {
  const [scheduleData, setScheduleData] = useState<any>();
  const scheduleKey = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const [loading, setLoading] = useState<boolean>(true);

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
      setScheduleData(Object.values(data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {!loading && (
          <div className="flex flex-col max-w-[100dvw]">
            <div
              className="bg-[#2f3e46] h-[101dvh] w-full text-white flex flex-col items-center justify-center shadow-2xl"
              id="home"
            >
              <div className="flex flex-col items-center justify-center gap-5">
                <h1 className="text-6xl font-bold text-center">
                  Bienvenido al paraíso de tu paladar
                </h1>
                <p className="text-3xl text-center">
                  ¿A que esperas? ¡Date una vuelta por nuestro menú!
                </p>
                <div className="flex flex-row gap-3">
                  <CustomNavLink activeClassName="" to={`/products`}>
                    <Button
                      variant={`secondary`}
                      size={`lg`}
                      className="text-black font-bold text-2xl p-8 bg-gray-200 hover:bg-white hover:text-black transition-all ease-in-out duration-300"
                    >
                      Ver Menú
                    </Button>
                  </CustomNavLink>
                  <a href="#contact">
                    <Button
                      className="text-white font-bold text-2xl p-8 bg-transparent hover:bg-transparent shadow-lg transition-all ease-in-out duration-300 hover:text-white"
                      variant={`outline`}
                    >
                      Contacto
                    </Button>
                  </a>
                </div>
                <a
                  href="#menu"
                  className="w-full flex flex-col items-center justify-center"
                >
                  <ChevronsDown
                    className={`w-16 h-16 animate-bounce absolute md:bottom-5 bottom-10`}
                  />
                </a>
              </div>
            </div>
            <div
              className="bg-gray-100 w-full border-black flex flex-col items-center gap-5 md:gap-20 md:p-12 text-center pb-5"
              id="menu"
            >
              <span className="text-5xl font-semibold p-10">
                Explora nuestra carta de comida
              </span>
              <div className="flex flex-col md:flex-row items-center justify-evenly w-full gap-10 md:gap-0">
                <div className="flex flex-col items-center justify-center">
                  <img
                    alt="Pizza"
                    className="rounded-t-lg w-[10rem]"
                    height={300}
                    src="/pizza.svg"
                    style={{
                      objectFit: "cover",
                    }}
                    width={400}
                  />
                  <h3 className="text-5xl font-bold">Pizzas</h3>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <img
                    alt="Hamburguesa"
                    className="rounded-t-lg w-[10rem]"
                    height={300}
                    src="/hamburguer.svg"
                    style={{
                      objectFit: "cover",
                    }}
                    width={400}
                  />
                  <h3 className="text-5xl font-bold">Hamburguesas</h3>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <img
                    alt="Bocadillos"
                    className="rounded-t-lg w-[10rem]"
                    height={300}
                    src="/sandwich.svg"
                    style={{
                      objectFit: "cover",
                    }}
                    width={400}
                  />
                  <h3 className="text-5xl font-bold">Bocadillos</h3>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <img
                    alt="Postres"
                    className="rounded-t-lg w-[10rem]"
                    height={300}
                    src="/dessert.svg"
                    style={{
                      objectFit: "cover",
                    }}
                    width={400}
                  />
                  <h3 className="text-5xl font-bold">Postres</h3>
                </div>
                <div>
                  <Button
                    size={`lg`}
                    variant={`default`}
                    className="bg-[#2f3e46] w-[20rem] md:w-[10rem] h-[3rem] hover:shadow-2xl transition-all ease-in-out duration-300"
                  >
                    <Link to={`/products`} className="text-2xl font-semibold">
                      Y más ...
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full md:p-20 p-5 gap-10" id="about">
              <span className="text-5xl font-bold text-center md:text-left">
                Sobre nosotros
              </span>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
                <img
                  alt="Cocina"
                  className="rounded-lg w-[35rem] shadow-2xl"
                  src="/cocina.jpg"
                  style={{
                    objectFit: "cover",
                  }}
                />
                <span className="text-md md:text-2xl font-bold w-full md:w-[65%] text-justify p-5">
                  Fundada en el año 2000 por Cris, Zpecial nació con la misión
                  de redefinir la comida rápida. Combinando ingredientes frescos
                  y de alta calidad con un toque moderno, hemos transformado
                  platos clásicos en experiencias culinarias únicas. Desde
                  nuestros inicios, hemos crecido y ganado la lealtad de
                  nuestros clientes, siempre manteniendo el compromiso de
                  ofrecer comidas rápidas, deliciosas y especiales. En Zpecial,
                  cada bocado es una celebración de sabor y calidad.
                </span>
              </div>
            </div>
            <div className="bg-gray-100 md:p-20 p-5" id="contact">
              <section className="space-y-8" id="contact">
                <h2 className="text-5xl font-bold mb-8">Horario</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col justify-center mx-auto md:mx-0">
                    {scheduleKey.map((key, index) => (
                      <div className="flex items-center space-x-4" key={index}>
                        <p className="text-lg text-gray-600 w-[12rem]">{key}</p>
                        <p className="text-lg text-gray-600">
                          {scheduleData[index].length === 0
                            ? "Cerrado"
                            : scheduleData[index]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
            <div className="md:p-20 p-5" id="contact">
              <section className="space-y-8" id="contact">
                <h2 className="text-5xl font-bold mb-8">Contáctanos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col justify-center">
                    <p className="text-lg text-gray-600 mb-4">
                      ¿Tienes alguna pregunta o comentario? No dudes en
                      contactarnos. Estaremos encantados de ayudarte.
                    </p>
                    <div className="flex items-center space-x-4">
                      <PhoneIcon className="h-6 w-6 text-gray-700" />
                      <p className="text-lg text-gray-600">+34 697 267 666</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <MailIcon className="h-6 w-6 text-gray-700" />
                      <p className="text-lg text-gray-600">info@zpecial.com</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <LocateIcon className="h-6 w-6 text-gray-700" />
                      <p className="text-lg text-gray-600">
                        Calle Falsa, 123, 28000 Madrid
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <footer className="bg-[#2f3e46]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-5 p-5 md:p-10 w-full border">
                <span className="text-white w-full md:w-[33%] flex flex-row items-center md:justify-start justify-center">
                  &copy; 2024 Zpecial, Todos los derechos reservados
                </span>
                <div className="md:w-[33%] w-full flex flex-col items-center justify-center">
                  <img src="/LogoTexto.svg" alt="Logo" className="w-[10rem]" />
                </div>
                <div className="flex flex-row gap-3 w-full md:w-[33%] items-center md:justify-end justify-center">
                  <a href="https://github.com/Cris-Alcala" target="_blank">
                    <span>
                      <Github size={30} className="text-white" />
                    </span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/crist%C3%B3bal-alcal%C3%A1-cazorla-836a0b25b/"
                    target="_blank"
                  >
                    <span>
                      <Linkedin size={30} className="text-white" />
                    </span>
                  </a>
                </div>
              </div>
            </footer>
          </div>
        )}
      </motion.div>
    </UserLayout>
  );
};
