"use client";
import TabLists from "@/components/TabLists";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import SearchInput from "@/components/search-input";
import Spinner from "@/components/spinner";
import {
  completedColumns,
  onProgressColumns,
  pendingColumns,
} from "@/components/tables/order-tables/columns";
import { OrderTable } from "@/components/tables/order-tables/order-table";
import { TabsContent } from "@/components/ui/tabs";
import { useGetOrders } from "@/hooks/api/useOrder";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { DateRange } from "react-day-picker";
import { useDebounce } from "use-debounce";

const OrderTableWrapper = () => {
  // THIS MORNING I WOULD LIKE TO FIX THIS !!!!!!
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const defaultTab = searchParams.get("status") ?? "pending";
  const q = searchParams.get("q");
  const startDate = searchParams.get("start_date") || "";
  const endDate = searchParams.get("end_date") || "";

  const [searchQuery, setSearchQuery] = React.useState<string>(q ?? "");
  const [searchDebounce] = useDebounce(searchQuery, 500);

  const { data: pendingData, isFetching: isFetchingPendingData } = useGetOrders(
    {
      limit: pageLimit,
      page: page,
      q: searchDebounce,
      status: "pending",
      start_date: startDate,
      end_date: endDate,
    },
    {
      enabled: defaultTab === "pending",
    },
    "pending",
  );

  const { data: onProgressData, isFetching: isFetchingOnProgressData } =
    useGetOrders(
      {
        limit: pageLimit,
        page: page,
        q: searchDebounce,
        status: "on_progress",
        start_date: startDate,
        end_date: endDate,
      },
      { enabled: defaultTab === "on_progress" },
      "on_progress",
    );

  const { data: completedData, isFetching: isFetchingCompletedData } =
    useGetOrders(
      {
        limit: pageLimit,
        page: page,
        q: searchDebounce,
        status: "done",
        start_date: startDate,
        end_date: endDate,
      },
      { enabled: defaultTab === "done" },
      "done",
    );

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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleClearDate = () => {
    setDateRange({ from: undefined, to: undefined });
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

  useEffect(() => {
    if (dateRange && dateRange.from && dateRange.to) {
      router.push(
        `${pathname}?${createQueryString({
          status: defaultTab,
          start_date: dayjs(dateRange?.from).format("YYYY-MM-DD"),
          end_date: dayjs(dateRange?.to).format("YYYY-MM-DD"),
        })}`,
      );
    } else {
      router.push(
        `${pathname}?${createQueryString({
          status: defaultTab,
          start_date: null,
          end_date: null,
        })}`,
      );
    }
  }, [dateRange]);

  useEffect(() => {
    if (
      searchDebounce !== undefined ||
      searchDebounce !== "" ||
      searchDebounce
    ) {
      router.push(
        `${pathname}?${createQueryString({
          status: defaultTab,
          q: searchDebounce,
          page: null,
          limit: pageLimit,
        })}`,
      );
    } else {
      router.push(
        `${pathname}?${createQueryString({
          status: defaultTab,
          q: null,
          page: null,
          limit: null,
        })}`,
      );
    }
  }, [searchDebounce]);

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
            placeholder="Cari pesanan berdasarkan Pelanggan / Armada / Penanggung Jawab"
          />
        </div>
      </div>
      <TabsContent value="pending" className="space-y-4">
        {isFetchingPendingData && <Spinner />}
        {!isFetchingPendingData && pendingData && (
          <OrderTable
            columns={pendingColumns}
            data={pendingData.items}
            searchKey="name"
            totalUsers={pendingData.meta?.total_items}
            pageCount={Math.ceil(pendingData.meta?.total_items / pageLimit)}
            pageNo={page}
            searchQuery={searchQuery}
          />
        )}
      </TabsContent>
      <TabsContent value="on_progress" className="space-y-4">
        {isFetchingOnProgressData && <Spinner />}
        {!isFetchingOnProgressData && onProgressData && (
          <OrderTable
            columns={onProgressColumns}
            data={onProgressData.items}
            searchKey="name"
            totalUsers={onProgressData.meta?.total_items}
            pageCount={Math.ceil(onProgressData.meta?.total_items / pageLimit)}
            pageNo={page}
            searchQuery={searchQuery}
          />
        )}
      </TabsContent>
      <TabsContent value="done" className="space-y-4">
        {isFetchingCompletedData && <Spinner />}
        {!isFetchingCompletedData && completedData && (
          <OrderTable
            columns={completedColumns}
            data={completedData.items}
            searchKey="name"
            totalUsers={completedData.meta?.total_items}
            pageCount={Math.ceil(completedData.meta?.total_items / pageLimit)}
            pageNo={page}
            searchQuery={searchQuery}
          />
        )}
      </TabsContent>
    </>
  );
};

export default OrderTableWrapper;
