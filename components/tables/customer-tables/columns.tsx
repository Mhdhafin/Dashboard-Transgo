"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<any>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "phone_number",
    header: "Nomor Telepon",
    cell: ({ row }) => <span>{row.original.phone_number ?? "-"}</span>,
  },
  {
    accessorKey: "emergency_phone_number",
    header: "Nomor Emergency",
    cell: ({ row }) => (
      <span>{row.original.emergency_phone_number ?? "-"}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.original.email ?? "-"}</span>,
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="text-sm font-semibold text-neutral-700">Status</span>
    ),
    cell: ({ row }) => (
      <span
        className={cn(
          " px-2 py-1 rounded-full",
          row?.original?.status === "pending"
            ? "bg-red-100 text-red-500"
            : "bg-green-100 text-green-500",
        )}
      >
        {row?.original?.status}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
