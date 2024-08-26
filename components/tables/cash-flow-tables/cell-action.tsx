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
import { useDeleteOwner } from "@/hooks/api/useOwner";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddEditCashFlowModal from "./add-edit-cash-flow-modal";
import { ILedgersFleet } from "./columns";

interface CellActionProps {
  data: ILedgersFleet;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showCashFlowModal, setShowCashFlowModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = data?.id;
  // const { mutateAsync: deleteOwner } = useDeleteOwner(id);

  // const onConfirm = async () => {
  //   deleteOwner(id, {
  //     onSuccess: () => {
  //       toast({
  //         variant: "success",
  //         title: "Owner berhasil dihapus!",
  //       });
  //       router.refresh();
  //     },
  //     onError: (error) => {
  //       toast({
  //         variant: "destructive",
  //         title: "Oops! Ada error.",
  //         description: `something went wrong: ${error.message}`,
  //       });
  //       queryClient.invalidateQueries({ queryKey: ["owners"] });
  //     },
  //     onSettled: () => {
  //       queryClient.invalidateQueries({ queryKey: ["owners"] });
  //       setShowAlertModal(false);
  //     },
  //   });
  // };

  return (
    <>
      {/* <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        // onConfirm={onConfirm}
        loading={false}
      /> */}
      <AddEditCashFlowModal
        isOpen={showCashFlowModal}
        onClose={() => setShowCashFlowModal(false)}
        onConfirm={() => null}
      />
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
