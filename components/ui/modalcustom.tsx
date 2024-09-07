"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface ModalCustomProps {
  title: React.ReactNode;
  description: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const ModalCustom: React.FC<ModalCustomProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-start justify-center">{title}</DialogTitle>
          <DialogDescription className="text-start justify-center">{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
