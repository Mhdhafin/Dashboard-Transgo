"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Apakah Anda yakin untuk menyetujui customer ini?"
      description=""
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          disabled={loading}
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          Batalkan
        </Button>
        <Button
          disabled={loading}
          variant="main"
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
        >
          Setuju
        </Button>
      </div>
    </Modal>
  );
};
