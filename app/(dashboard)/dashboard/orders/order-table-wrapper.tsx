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
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { DateRange } from "react-day-picker";

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
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const newSearchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [],
  );
  React.useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
    // const start = searchParams.get("start_date");
    // const end = searchParams.get("end_date");
    // setDateRange({
    //   from: start ? new Date(start) : null,
    //   to: end ? new Date(end) : null,
    // });
  }, [searchParams]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    router.push(
      `${pathname}?${createQueryString({
        status: status,
        q: query,
      })}`,
    );
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range && range.from && range.to) {
      router.push(
        `${pathname}?${createQueryString({
          status: status,
          start_date: dayjs(range?.from).format("YYYY-MM-DD"),
          end_date: dayjs(range?.to).format("YYYY-MM-DD"),
        })}`,
      );
    }
  };

  const handleClearDate = () => {
    setDateRange({ from: undefined, to: undefined });
    router.push(
      `${pathname}?${createQueryString({
        status: status,
        start_date: null,
        end_date: null,
      })}`,
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
        <div className="flex items-center justify-between gap-4">
          <CalendarDateRangePicker
            onDateRangeChange={handleDateRangeChange}
            onClearDate={handleClearDate}
            dateRange={dateRange}
          />
          <SearchInput
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            placeholder="Cari pesanan berdasarkan Pelanggan"
          />
        </div>
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
        />
      </TabsContent>
    </>
  );
};

export default OrderTableWrapper;
