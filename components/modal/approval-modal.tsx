"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  onConfirm: () => void;
}

export const ApprovalModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  loading,
  onConfirm,
}) => {
  const [checked, setChecked] = useState<boolean>(true);
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">
            Apakah Anda Yakin Ingin Mengonfirmasi Pesanan ini?
          </DialogTitle>
          <DialogDescription className="text-left">
            Konfirmasi pesanan akan otomatis membuat Invoice, mohon pastikan
            data pesanan yang diinput telah benar sepenuhnya
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={!checked}
            onCheckedChange={() => setChecked(!checked)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Data Telah Benar Sepenuhnya
          </label>
        </div>
        <div className="space-x-2 flex items-center justify-end w-full">
          <Button
            disabled={loading}
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Kembali
          </Button>
          <Button
            disabled={loading || checked}
            variant="main"
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            Konfirmasi Pesanan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
