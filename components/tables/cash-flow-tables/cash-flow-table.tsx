import React, { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Plus } from "lucide-react";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddEditCashFlowModal from "./add-edit-cash-flow-modal";
import { getColumns } from "./columns";
import { useGetLedgersFleet } from "@/hooks/api/useLedgers";
import Spinner from "@/components/spinner";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

interface ICashFlowTableProps {
  fleet: {
    id: number;
    name: string;
  };
}

const CashFlowTable = ({ fleet }: ICashFlowTableProps) => {
  const { user } = useUser();

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [showModalCashFlow, setShowModalCashFlow] = useState(false);

  const { data, isFetching } = useGetLedgersFleet(fleet.id, {
    page: pageIndex + 1,
    limit: pageSize,
  });

  const ledgersData = data?.data;

  const columns = useMemo(() => getColumns(fleet), [fleet]);
  const filteredColumns = columns.filter((item) => {
    if (user?.role === "owner" && item.id === "actions") return false;

    return true;
  });

  const table = useReactTable({
    data: ledgersData?.items ?? [],
    columns: filteredColumns,
    // @ts-ignore
    pageCount: Math.ceil((data?.data?.meta?.total_items ?? 0) / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Arus Pemasukan/Pengeluaran" />
        {user?.role !== "owner" && (
          <Button
            className={cn(
              buttonVariants({ variant: "main" }),
              "w-max h-[40px] !py-2",
            )}
            type="button"
            onClick={() => setShowModalCashFlow((prev) => !prev)}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Arus Pencatatan
          </Button>
        )}
      </div>

      <ScrollArea className="rounded-md border h-[calc(80vh-220px)]">
        {isFetching ? (
          <Spinner />
        ) : (
          <Table className="relative">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={
                          // @ts-ignore
                          header.column.columnDef.meta?.centerHeader
                            ? "text-center"
                            : ""
                        }
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
                          className={
                            // @ts-ignore
                            cell.column.columnDef.meta?.centerHeader
                              ? "text-center"
                              : ""
                          }
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
          </Table>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col gap-2 sm:flex-row items-center justify-end space-x-2 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                Data per halaman
              </p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {PAGE_SIZE_OPTIONS.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
          <div className="flex w-[120px] items-center justify-center text-sm font-medium">
            Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {showModalCashFlow && (
        <AddEditCashFlowModal
          isOpen={showModalCashFlow}
          onClose={() => setShowModalCashFlow(false)}
          initialData={ledgersData?.items || null}
          fleet={fleet}
        />
      )}
    </>
  );
};

export default CashFlowTable;
