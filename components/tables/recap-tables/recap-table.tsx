"use client";

import React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatRupiah } from "@/lib/utils";
import { ITotal } from "@/hooks/components/useRecapsStore";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: ITotal;
}

export default function RecapTable<TData, TValue>({
  columns,
  data,
  total,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <ScrollArea className="rounded-md border border-solid max-h-[calc(100vh-200px)]">
        <Table className="w-full overflow-x-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-slate-200">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`${
                        // @ts-ignore
                        header.column.columnDef.meta?.centerHeader
                          ? "!text-center"
                          : ""
                      } ${
                        // @ts-ignore
                        header.column.columnDef.meta?.stickyColumn
                          ? "sticky right-0 z-50"
                          : ""
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={`h-[48px] ${
                          // @ts-ignore
                          cell.column.columnDef.meta?.centerHeader
                            ? "!text-center"
                            : ""
                        } ${
                          // @ts-ignore
                          cell.column.columnDef.meta?.stickyColumn
                            ? "sticky right-0 z-50"
                            : ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data yang dapat ditampilkan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow className="!border-b-0 border-solid border-t">
              <TableCell
                colSpan={6}
                className="text-center h-[64px] bg-white text-neutral-700 text-sm font-semibold"
              >
                Jumlah
              </TableCell>
              <TableCell
                colSpan={1}
                className="text-center h-[64px] bg-white text-neutral-700 text-sm font-bold"
              >
                {total.duration} Hari
              </TableCell>
              <TableCell
                colSpan={1}
                className="text-center h-[64px] bg-white text-neutral-700 text-sm font-bold"
              >
                {formatRupiah(total.debit)}
              </TableCell>
              <TableCell
                colSpan={1}
                className="text-center h-[64px] bg-white text-neutral-700 text-sm font-bold"
              >
                {formatRupiah(total.credit)}
              </TableCell>
              <TableCell
                colSpan={1}
                className="text-center border-solid  h-[64px] bg-white text-neutral-700 text-sm font-bold"
              >
                {formatRupiah(total.commission)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  );
}
