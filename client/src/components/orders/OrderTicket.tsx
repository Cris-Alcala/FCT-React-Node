import { Order } from "@/interfaces/Order";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Button } from "../ui/button";

export const OrderTicket = ({ x }: { x: Order }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Ver Recibo
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col p-0 w-[90%] rounded-lg">
        <div className="bg-white dark:bg-gray-950 rounded-lg p-10 w-full mx-auto max-h-[40rem] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recibo</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(x.receipt_date), "dd/MM/yyyy HH:mm")}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Subtotal</p>
              <p className="font-medium">{`${x.subtotal.toFixed(2)} €`}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Descuento</p>
              <p className="font-medium">{`${x.discount} %`}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Total</p>
              <p className="font-medium">{`${x.total.toFixed(2)} €`}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Tipo</p>
              <p className="font-medium">{x.type}</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-gray-500 dark:text-gray-400 mb-2">Productos</h3>
            <div className="space-y-4">
              {x.products.map((product: any) => (
                <div
                  key={product[0]}
                  className="flex justify-between items-center border-b-gray-200 border-b-2 py-1"
                >
                  <div>
                    <p className="font-medium">{product[0]}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Cantidad: {product[1]}
                    </p>
                  </div>
                  <p className="font-medium">{product[2].toFixed(2)} €</p>
                </div>
              ))}
            </div>
          </div>
          {x.comments !== "" && (
            <div className="mb-6">
              <h3 className="text-gray-500 dark:text-gray-400 mb-2">
                Comentarios
              </h3>
              <p>{x.comments}</p>
            </div>
          )}
          {x.address !== "" && (
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 mb-2">
                Dirección
              </h3>
              <p>{x.address}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
