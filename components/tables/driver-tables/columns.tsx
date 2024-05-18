"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Drivers } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Link from "next/link";

export const columns: ColumnDef<Drivers>[] = [
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
    cell: ({ row }) => (
      <Link href={`/dashboard/drivers/${row.original.id}/detail`}>
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "phone_number",
    header: "Nomor Telepon",
    cell: ({ row }) => <span>{row.original.phone_number ?? "-"}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: ({ row }) => <span>{row.original.gender}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
