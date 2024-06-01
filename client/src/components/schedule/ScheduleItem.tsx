import { useEffect, useState } from "react";
import TextInput from "../form/TextInput";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export const ScheduleItem = ({
  label,
  name,
  control,
}: {
  label: string;
  name: string;
  control: any;
}) => {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    control._formValues[name] === "" ? setClosed(true) : setClosed(false);
  };
  return (
    <div className={`flex flex-col items-start border-b-2 p-2`}>
      <h3 className="text-lg font-medium">{label}</h3>
      <TextInput
        className={`mt-2 w-full`}
        placeholder="Ingresa el horario"
        type="text"
        disabled={closed}
        name={name}
        control={control}
      />
      <div className="flex flex-row items-center justify-center gap-2 mt-2">
        <Label>Cerrado</Label>
        <Switch
          checked={closed}
          onCheckedChange={() => {
            setClosed(!closed);
          }}
        />
      </div>
    </div>
  );
};
