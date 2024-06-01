import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

type TextAreaInputProps = {
  description?: string;
  label?: string;
  control: Control<any>;
  name: string;
  className?: string;
  textareaClassName?: string;
  maxLength?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">;

const TextAreaInput = ({
  description,
  control,
  label,
  className,
  textareaClassName,
  name,
  maxLength,
}: TextAreaInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className || ""}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Textarea
              {...field}
              className={textareaClassName}
              maxLength={maxLength || Infinity}
            />
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

export default TextAreaInput;
