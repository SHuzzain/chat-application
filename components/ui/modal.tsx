"use client";

import { FC, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DialogContentProps,
  DialogDescriptionProps,
  DialogProps,
  DialogTitleProps,
} from "@radix-ui/react-dialog";

interface ModalProps {
  title: string | React.ReactNode;
  componentStyle?: {
    main?: DialogProps;
    header?: React.HTMLAttributes<HTMLDivElement>;
    content?: DialogContentProps;
    title?: DialogTitleProps;
    description?: DialogDescriptionProps;
  };
  description: string | React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({
  children,
  description,
  isOpen,
  onClose,
  title,
  componentStyle,
}) => {
  const handleChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog {...componentStyle?.main} open={isOpen} onOpenChange={handleChange}>
      <DialogContent {...componentStyle?.content}>
        <DialogHeader {...componentStyle?.header}>
          <DialogTitle {...componentStyle?.title}>{title}</DialogTitle>
          <DialogDescription {...componentStyle?.description}>
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
