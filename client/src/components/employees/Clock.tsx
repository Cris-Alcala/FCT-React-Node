import { useState, useEffect } from "react";

export const Clock = ({ className }: { className?: string }) => {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    var temporizador = setInterval(() => {
      setHora(new Date());
    }, 1000);

    return function cleanup() {
      clearInterval(temporizador);
    };
  });

  return (
    <div className={className}>
      <p>{hora.toLocaleTimeString()}</p>
    </div>
  );
};
