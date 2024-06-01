import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { useWebSocket } from "@/contexts/WebSocket/WebSockeProvider";

export const ShowProductsBySection = ({
  section,
  description = false,
}: {
  section: string;
  description?: boolean;
}) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const io = useWebSocket();

  useEffect(() => {
    getProducts();
  }, []);

  io.on("update_menu", (_data: any) => {
    getProducts();
  });

  const getProducts = async () => {
    setLoading(true);
    const response = await fetch(
      `${
        import.meta.env.VITE_ENDPOINT_SERVER
      }/api/v1/foodServices?categorie=${section}`
    );
    const data = await response.json();
    setProducts(data.filter((p: any) => p.available));
    setLoading(false);
  };
  return (
    <div className="flex flex-row gap-5 md:gap-4 flex-wrap items-center md:pl-[4.5%] mb-5">
      {!loading &&
        products.map((p: any) => (
          <ProductCard product={p} key={p.name} description={description} />
        ))}
    </div>
  );
};
