import { ITotal } from "@/hooks/components/useRecapsStore";
import { formatRupiah } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

export default function RecapTableV2<TData, TValue>({
  columns,
  data,
  total,
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: ITotal;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative border max-h-[300px] border-solid rounded-lg overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-slate-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-slate-200 top-0 sticky z-50">
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className={`h-[48px] bg-slate-200 py-[14px] ${
                      // @ts-ignore
                      header.column.columnDef.meta?.centerHeader
                        ? "text-center last:pr-[10px]"
                        : "text-left first:pl-[10px]"
                    }`}
                    style={{
                      ...(header.column.getSize() && {
                        minWidth: header.column.getSize(),
                        maxWidth: "max-content",
                      }),
                      // @ts-ignore
                      ...(header.column.columnDef.meta?.stickyColumn && {
                        right:
                          // @ts-ignore
                          header.column.columnDef.meta?.index *
                          header.column.getSize(),
                        zIndex: 40,
                        position: "sticky",
                      }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr
              className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out"
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className={`h-[48px] ${
                      // @ts-ignore
                      cell.column.columnDef.meta?.centerHeader
                        ? "text-center last:pr-[10px]"
                        : "text-left first:pl-[10px]"
                    } ${
                      // @ts-ignore
                      cell.column.columnDef.meta?.stickyColumn || ""
                    }`}
                    style={{
                      ...(cell.column.getSize() && {
                        minWidth: cell.column.getSize(),
                        maxWidth: "max-content",
                      }),
                      // @ts-ignore
                      ...(cell.column.columnDef.meta?.stickyColumn && {
                        right:
                          // @ts-ignore
                          cell.column.columnDef.meta?.index *
                          cell.column.getSize(),
                        zIndex: 40,
                        position: "sticky",
                      }),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 sticky bottom-0 z-50 border-t border-solid">
          <tr>
            <td
              className="text-center h-[64px] bg-white text-neutral-700 text-sm font-semibold"
              colSpan={6}
            >
              Jumlah
            </td>
            <td className="text-center h-[64px] bg-white text-neutral-700 text-sm font-bold sticky right-[462px]">
              {formatRupiah(total.debit)}
            </td>
            <td className="text-center h-[64px] bg-white text-neutral-700 text-sm font-bold sticky right-[308px]">
              {formatRupiah(total.credit)}
            </td>
            <td className="text-center h-[64px] bg-white text-neutral-700 text-sm font-bold sticky right-[154px]">
              {formatRupiah(total.credit)}
            </td>
            <td className="text-center h-[64px] bg-white text-neutral-700 text-sm font-bold sticky right-[0px]">
              {formatRupiah(total.commission)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
