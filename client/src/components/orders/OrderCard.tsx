import { Separator } from "@radix-ui/react-select";
import { ClockIcon, UserIcon, CircleEllipsisIcon, Home } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Order } from "@/interfaces/Order";
import { useContext, useEffect, useState } from "react";
import { User } from "@/interfaces/User";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { UserContext } from "@/contexts/User/UserContext";
import { useWebSocket } from "@/contexts/WebSocket/WebSockeProvider";

export const OrderCard = ({
  order,
  chef = false,
}: {
  order: Order;
  chef?: boolean;
}) => {
  const { user: userInfo } = useContext<any>(UserContext);
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const io = useWebSocket();

  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    setLoading(true);
    if (order.user!.length === 0) {
      setUser(undefined);
    } else {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/users/${order.user}`
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  };
  const cancelOrder = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/orders/${order.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state:
              userInfo.position === "Delivery" ? "No entregado" : "Cancelado",
            completed: true,
          }),
        }
      );
      const data = await response.json();
      io.emit("cancel_order", data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleStatus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT_SERVER}/api/v1/orders/${order.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state:
              userInfo.position === "Recepcionist"
                ? order.type === "Para llevar"
                  ? "En reparto"
                  : "Entregado"
                : userInfo.position === "Chef"
                ? order.type === "Para llevar"
                  ? "Por enviar"
                  : "Por recoger"
                : "Entregado",
            completed:
              userInfo.position === "Recepcionist"
                ? order.type === "Para llevar"
                  ? false
                  : true
                : userInfo.position === "Chef"
                ? false
                : true,
          }),
        }
      );
      const data = await response.json();
      if (data.state === "Por recoger" || data.state === "Por enviar") {
        io.emit("pick_up_order", data);
      } else if (data.state === "En reparto") {
        io.emit("delivery_order", data);
      } else {
        io.emit("complete_order", data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    !loading && (
      <Card className="w-[24rem] flex flex-col justify-between">
        <div>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-2 justify-start flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">#{order.id}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.receipt_date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon size={16} />
                  <span>{order.state}</span>
                </div>
                {user !== undefined && !chef && (
                  <div className="flex items-center gap-2 w-[12rem] max-w-[18rem] text-sm text-gray-500 dark:text-gray-400">
                    <UserIcon size={16} />
                    <span>{`${(user as User).name} ${
                      (user as User).surname
                    }`}</span>
                  </div>
                )}
              </div>
              {!chef && (
                <div className="text-right">
                  <div className="font-medium">{`${order.total.toFixed(
                    2
                  )} €`}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total
                  </div>
                </div>
              )}
            </div>
            <Separator className="my-4" />
            <div className="grid gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    {!chef && <TableHead>Precio</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products.map((p: any) => (
                    <TableRow key={p}>
                      <TableCell className="text-xs">{p[0]}</TableCell>
                      <TableCell className="text-xs">{p[1]}</TableCell>
                      {!chef && (
                        <TableCell className="text-xs">{`${p[2]} €`}</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {order.comments!.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CircleEllipsisIcon className="h-4 w-4" />
                  <span>{order.comments}</span>
                </div>
              )}
              {order.address!.length > 0 && !chef && (
                <div className="flex flex-row items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Home size={18} />
                  <span>{order.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </div>
        <CardFooter className="flex justify-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                {userInfo.position === "Delivery"
                  ? "No entregado"
                  : "Cancelar pedido"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90dvw] rounded-md md:w-[40%]">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás seguro de cancelar este pedido?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se podrá revertir posteriormente
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Conservar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={cancelOrder}
                  className="bg-red-500 hover:bg-red-400"
                >
                  {userInfo.position === "Delivery"
                    ? "No entregado"
                    : "Cancelar pedido"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleStatus}>
            {userInfo.position === "Recepcionist"
              ? order.type === "Para llevar"
                ? "Marcar en reparto"
                : "Marcar como recogido"
              : userInfo.position === "Chef"
              ? "Marcar como preparado"
              : "Marcar como entregado"}
          </Button>
        </CardFooter>
      </Card>
    )
  );
};
