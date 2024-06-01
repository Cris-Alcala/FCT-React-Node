import * as React from "react";

import { cn } from "@/lib/utils";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SecureInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const Icon = visible ? EyeClosedIcon : EyeOpenIcon;

    return (
      <div className={"relative"}>
        <style>{`
          input::-ms-reveal,
          input::-webkit-reveal {
            display: none;
          }

          input::-ms-clear,
          input::-webkit-clear-button {
            display: none;
          }
        `}</style>
        <input
          type={type === "password" && visible ? "text" : type}
          className={cn(
            "z-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            type === "password" && "pr-9",
            className
          )}
          ref={ref}
          {...props}
        />

        {type === "password" && (
          <div
            onClick={() => setVisible(!visible)}
            className={cn(
              "h-full cursor-pointer absolute right-0 bottom-0 flex px-3 items-center justify-center z-10",
              visible ? "opacity-30" : ""
            )}
          >
            <Icon />
          </div>
        )}
      </div>
    );
  }
);
SecureInput.displayName = "SecureInput";

export { SecureInput };
