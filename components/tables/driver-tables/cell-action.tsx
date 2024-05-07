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
import { Drivers } from "@/constants/data";
import { useDeleteDriver } from "@/hooks/api/useDriver";
import useAxiosAuth from "@/hooks/axios/use-axios-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  data: Drivers;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = data?.id;
  console.log("data?.id", data?.id);
  const { mutateAsync: deleteDriver } = useDeleteDriver(id);
  const axiosAuth = useAxiosAuth();
  // const {mutate: deleteDriver} = useDeleteDriver(id)
  // console.log("cek", data);
  // const deleteDriver = () => {
  //   return axiosAuth.delete(`drivers/${id}`);
  // };
  // const onConfirm = async () => {
  //   try {
  //     await deleteDriverMutation.mutateAsync(id);
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "gagal menghapus driver",
  //     });
  //   }
  // };

  // const deleteDriverMutation = useMutation({
  //   mutationFn: deleteDriver,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["drivers"] });
  //     toast({
  //       variant: "success",
  //       title: "Driver berhasil dihapus",
  //     });
  //   },
  // });

  const onConfirm = async () => {
    deleteDriver(id, {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "berhasill",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "ada error cuyy",
          description: `something went wrong: ${error.message}`,
        });
        queryClient.invalidateQueries({ queryKey: ["drivers"] });
      },
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/driver/${data?.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
