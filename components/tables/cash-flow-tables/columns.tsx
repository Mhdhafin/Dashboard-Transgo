import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { Drivers } from "@/constants/data";

import { formatRupiah } from "@/lib/utils";
import { CellAction } from "./cell-action";

import "dayjs/locale/id";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

export const columns: ColumnDef<Drivers>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {dayjs().locale("id").format("dddd, D MMMM YYYY")}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => (
      <span className="text-green-500 font-medium text-[12px] leading-5 px-2.5 py-1 rounded-full bg-green-50">
        Pemasukan Tambahan
      </span>
    ),
  },
  {
    accessorKey: "explanation",
    header: "Keterangan",
    cell: ({ row }) => (
      <span className="text-sm font-medium truncate">Luar Kota 4 Hari</span>
    ),
  },
  {
    accessorKey: "amount_min",
    header: "Kredit (-)",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{formatRupiah(700000)}</span>
    ),
  },
  {
    accessorKey: "amount_plus",
    header: "Debit (+)",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{formatRupiah(700000)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="text-red-500 font-medium text-[12px] leading-5 px-2.5 py-1 rounded-full bg-red-50">
        Belum Diproses
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
