import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SecureInput } from "../ui/secure-input";

type TextInputProps = {
  description?: string;
  label?: string;
  control: Control<any>;
  name: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  secure?: boolean;
  icon?: React.ReactNode;
  onlyInputClassName?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">;

const TextInput = ({
  description,
  control,
  label,
  className,
  inputClassName,
  labelClassName,
  secure,
  name,
  icon,
  onlyInputClassName,
  ...rest
}: TextInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className || ""}>
          {label ? (
            <FormLabel className={labelClassName}>{label}</FormLabel>
          ) : null}
          <FormControl>
            <div className={cn("relative", inputClassName)}>
              {secure ? (
                <SecureInput
                  {...rest}
                  {...field}
                  type="password"
                  className={cn(
                    icon ? "pr-10" : "",
                    inputClassName,
                    onlyInputClassName
                  )}
                />
              ) : (
                <Input
                  {...rest}
                  {...field}
                  className={cn(
                    icon ? "pr-10" : "",
                    inputClassName,
                    onlyInputClassName
                  )}
                />
              )}
              {icon ? (
                <div className="absolute right-2 bottom-0.5">{icon}</div>
              ) : null}
            </div>
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextInput;
