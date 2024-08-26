import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { cn, formatRupiah } from "@/lib/utils";
import { CellAction } from "./cell-action";

import "dayjs/locale/id";
import { getLedgerStatusLabel, getStatusVariant } from "../recap-tables/utils";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

interface IFleet {
  color: string | null;
  id: number | string;
  name: string;
  commission?: {
    owner?: number;
    partner?: number;
    transgo?: number;
  };
}

export interface ILedgersFleet {
  id: number | string;
  status: string;
  update_at: string;
  category: { name: string };
  created_at: string;
  date: string;
  duration: number;
  credit_amount: number | null;
  debit_amount: number | null;
  description: string | null;
  owner_commission?: number;
  fleet: IFleet;
  user: { name: string };
}

export const columns: ColumnDef<ILedgersFleet>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.date
          ? dayjs(row.original.date).locale("id").format("dddd, D MMMM YYYY")
          : ""}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) =>
      row.original.category?.name ? (
        <span className="text-green-500 font-medium text-[12px] leading-5 px-2.5 py-1 rounded-full bg-green-50">
          {row.original.category.name}
        </span>
      ) : null,
  },
  {
    accessorKey: "description",
    header: "Keterangan",
    cell: ({ row }) => (
      <span className="text-sm font-medium truncate">
        {row.original.description || ""}
      </span>
    ),
  },
  {
    accessorKey: "amount_min",
    header: "Kredit (-)",
    meta: {
      centerHeader: true,
    },
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.credit_amount
          ? "- " + formatRupiah(row.original.credit_amount)
          : ""}
      </span>
    ),
  },
  {
    accessorKey: "amount_plus",
    header: "Debit (+)",
    meta: {
      centerHeader: true,
    },
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.debit_amount
          ? "+ " + formatRupiah(row.original.debit_amount)
          : ""}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      centerHeader: true,
    },
    cell: ({ row }) =>
      row.original.status ? (
        <span
          className={cn(
            getStatusVariant(row.original.status),
            "font-medium text-[12px] leading-5 px-2.5 py-1 rounded-full capitalize",
          )}
        >
          {getLedgerStatusLabel(row.original.status)}
        </span>
      ) : null,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
