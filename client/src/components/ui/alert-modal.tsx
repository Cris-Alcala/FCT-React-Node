import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button, ButtonProps } from "@/components/ui/button";

export default function AlertModal({
  loading,
  cancelText,
  actionText,
  title,
  body,
  variant = "destructive",
  onClick,
  children,
}: {
  loading?: boolean;
  cancelText?: string;
  actionText?: string;
  title?: string;
  body?: string;
  onClick?: (a: any) => void;
  children: React.ReactNode;
  variant?: ButtonProps["variant"];
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              disabled={loading}
              onClick={onClick}
              variant={variant || "destructive"}
            >
              {loading ? "Loading..." : actionText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
