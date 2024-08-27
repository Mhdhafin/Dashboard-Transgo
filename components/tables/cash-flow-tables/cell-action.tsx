"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddEditCashFlowModal from "./add-edit-cash-flow-modal";
import { ILedgersFleet } from "./columns";
import { useDeleteLedgers } from "@/hooks/api/useLedgers";

interface CellActionProps {
  data: ILedgersFleet;
  fleet: {
    name: string;
    id: number;
  };
}

export const CellAction: React.FC<CellActionProps> = ({ data, fleet }) => {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showCashFlowModal, setShowCashFlowModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = data?.id;
  const { mutateAsync: deleteLedgers } = useDeleteLedgers();

  const onConfirm = async () => {
    deleteLedgers(Number(id), {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Ledgers berhasil dihapus!",
        });
        router.refresh();
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Oops! Ada error.",
          description: `something went wrong: ${error.message}`,
        });
        queryClient.invalidateQueries({ queryKey: ["ledgers", "fleet"] });
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["ledgers", "fleet"] });
        setShowAlertModal(false);
      },
    });
  };

  return (
    <>
      {showAlertModal && (
        <AlertModal
          isOpen={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          onConfirm={onConfirm}
          loading={false}
        />
      )}
      {showCashFlowModal && (
        <AddEditCashFlowModal
          isOpen={showCashFlowModal}
          onClose={() => setShowCashFlowModal(false)}
          initialData={data || null}
          fleet={fleet}
          isEdit
        />
      )}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setShowCashFlowModal(true);
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              setShowAlertModal(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
