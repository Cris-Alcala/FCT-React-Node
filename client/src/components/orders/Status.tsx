import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const Status = ({ status }: { status: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        {status.toLowerCase() === "en proceso" && (
          <img
            src="/enproceso.png"
            alt="En proceso"
            className="text-black w-8"
          />
        )}
        {status.toLowerCase() === "entregado" && (
          <img
            src="/entregado.png"
            alt="Entregado"
            className="text-black w-8"
          />
        )}
        {status.toLowerCase() === "no entregado" && (
          <img
            src="/cancelado.png"
            alt="No entregado"
            className="text-black w-8"
          />
        )}
        {status.toLowerCase() === "cancelado" && (
          <img
            src="/cancelado.png"
            alt="Cancelado"
            className="text-black w-8"
          />
        )}
        {status.toLowerCase() === "por recoger" && (
          <img
            src="/porrecoger.png"
            alt="Por recoger"
            className="text-black w-8"
          />
        )}
        {status.toLowerCase() === "en reparto" && (
          <img
            src="/enreparto.png"
            alt="En reparto"
            className="text-black w-8"
          />
        )}
        {status.toLowerCase() === "por enviar" && (
          <img
            src="/porenviar.png"
            alt="Por enviar"
            className="text-black w-8"
          />
        )}
      </TooltipTrigger>
      <TooltipContent className="bg-zinc-950/90 flex flex-col p-2 rounded-md text-white">
        <span className="text-xs self-start">{status}</span>
      </TooltipContent>
    </Tooltip>
  );
};
