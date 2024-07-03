"use client";
import TabLists from "@/components/TabLists";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import SearchInput from "@/components/search-input";
import {
  completedColumns,
  onProgressColumns,
  pendingColumns,
} from "@/components/tables/order-tables/columns";
import { OrderTable } from "@/components/tables/order-tables/order-table";
import { TabsContent } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import React from "react";

interface OrderTableWrapperProps {
  orderRes: any;
  status: string;
  pageLimit: number;
  page: number;
}

const OrderTableWrapper: React.FC<OrderTableWrapperProps> = ({
  orderRes,
  status,
  pageLimit,
  page,
}) => {
  // THIS MORNING I WOULD LIKE TO FIX THIS !!!!!!
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [dateRange, setDateRange] = React.useState<
    DateRange | undefined | null
  >({
    from: null,
    to: null,
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    setDateRange({
      from: start ? new Date(start) : null,
      to: end ? new Date(end) : null,
    });
  }, [searchParams]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    router.push(`${pathname}?status=${status}&q=${query}`);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    router.push(
      `${pathname}?status=${status}&q=${searchQuery}&startDate=${
        range?.from?.toISOString() ?? ""
      }&endDate=${range?.to?.toISOString() ?? ""}`,
    );
  };

  const lists = [
    {
      name: "Menunggu",
      value: "pending",
    },
    {
      name: "Sedang Berjalan",
      value: "on_progress",
    },
    {
      name: "Sudah Bayar",
      value: "done",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <TabLists lists={lists} />
        <CalendarDateRangePicker
          onDateRangeChange={handleDateRangeChange}
          dateRange={dateRange}
        />
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      </div>
      <TabsContent value="pending" className="space-y-4">
        <OrderTable
          columns={pendingColumns}
          data={orderRes.items}
          searchKey="name"
          totalUsers={orderRes.meta?.total_items}
          pageCount={Math.ceil(orderRes.meta?.total_items / pageLimit)}
          pageNo={page}
          searchQuery={searchQuery}
          startDate={dateRange?.from}
          endDate={dateRange?.to}
        />
      </TabsContent>
      <TabsContent value="on_progress" className="space-y-4">
        <OrderTable
          columns={onProgressColumns}
          data={orderRes.items}
          searchKey="name"
          totalUsers={orderRes.meta?.total_items}
          pageCount={Math.ceil(orderRes.meta?.total_items / pageLimit)}
          pageNo={page}
          searchQuery={searchQuery}
          startDate={dateRange?.from}
          endDate={dateRange?.to}
        />
      </TabsContent>
      <TabsContent value="done" className="space-y-4">
        <OrderTable
          columns={completedColumns}
          data={orderRes.items}
          searchKey="name"
          totalUsers={orderRes.meta?.total_items}
          pageCount={Math.ceil(orderRes.meta?.total_items / pageLimit)}
          pageNo={page}
          searchQuery={searchQuery}
          startDate={dateRange?.from}
          endDate={dateRange?.to}
        />
      </TabsContent>
    </>
  );
};

export default OrderTableWrapper;
