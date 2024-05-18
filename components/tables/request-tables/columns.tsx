"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/id";

export const pendingColumns: ColumnDef<any>[] = [
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
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => (
      <Link href={`/dashboard/requests/${row.original.id}/detail`}>
        {row.original.customer.name}
      </Link>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipe Tasks",
    cell: ({ row }) => <span>{row.original.type}</span>,
  },
  {
    accessorKey: "fleet.name",
    header: "Nama Kendaraan - Tipe",
    cell: ({ row }) => (
      <span>
        {row.original.fleet.name} - {row.original.fleet.type}
      </span>
    ),
  },
  {
    accessorKey: "time",
    header: "Waktu",
    cell: ({ row }) => (
      <span>
        {dayjs(row.original.start_date)
          .locale("id")
          .format("dddd, D MMMM YYYY HH:mm:ss")}
      </span>
    ),
  },
  {
    accessorKey: "driver.name",
    header: "PIC",
    cell: ({ row }) => <span>{row.original.driver.name}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const completedColumns: ColumnDef<any>[] = [
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
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => (
      <Link href={`/dashboard/requests/${row.original.id}/detail`}>
        {row.original.customer.name}
      </Link>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipe Tasks",
    cell: ({ row }) => <span>{row.original.type}</span>,
  },
  {
    accessorKey: "fleet.name",
    header: "Nama Kendaraan - Tipe",
    cell: ({ row }) => (
      <span>
        {row.original.fleet.name} - {row.original.fleet.type}
      </span>
    ),
  },
  {
    accessorKey: "time",
    header: "Waktu",
    cell: ({ row }) => (
      <span>
        {dayjs(row.original.start_date)
          .locale("id")
          .format("dddd, D MMMM YYYY HH:mm:ss")}
      </span>
    ),
  },
  {
    accessorKey: "driver.name",
    header: "PIC",
    cell: ({ row }) => <span>{row.original.driver.name}</span>,
  },
  {
    accessorKey: "driver.name",
    header: "PIC",
    cell: ({ row }) => <span>{row.original.driver.name}</span>,
  },
  {
    accessorKey: "driver.name",
    header: "Durasi",
    cell: ({ row }) => (
      <span>
        {dayjs(row.original.start_date)
          .locale("id")
          .format("dddd, D MMMM YYYY HH:mm:ss")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
