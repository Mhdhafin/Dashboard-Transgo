"use client";
import TabLists from "@/components/TabLists";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import SearchInput from "@/components/search-input";
import Spinner from "@/components/spinner";
import {
  completedColumns,
  on_progressColumns,
  waitingColumns,
} from "@/components/tables/reimburse-tables/columns";
import { ReimburseTable } from "@/components/tables/reimburse-tables/reimburse-table";
import { TabsContent } from "@/components/ui/tabs";
import { useGetReimburses } from "@/hooks/api/useReimburse";
import { SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { DateRange } from "react-day-picker";
import { useDebounce } from "use-debounce";
import { ReimburseStatus } from "./[reimburseid]/types/reimburse";

// import { ReimburseStatus } from "./[reimburseId]/types/reimburse";

const ReimburseTableWrapper = () => {
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
  const defaultTab = searchParams.get("status") ?? "waiting";
  const q = searchParams.get("q");
  const startDate = searchParams.get("start_date") || "";
  const endDate = searchParams.get("end_date") || "";
  const reimburseColumn = searchParams.get("reimburse_column") || "";
  const reimburseBy = searchParams.get("reimburse_by") || "";
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [searchQuery, setSearchQuery] = React.useState<string>(q ?? "");
  const [searchDebounce] = useDebounce(searchQuery, 500);

  const getReimburseParams = (status: string) => ({
    limit: pageLimit,
    page: page,
    q: searchDebounce,
    status: status,
    ...(startDate ? { start_date: startDate } : {}),
    ...(endDate ? { end_date: endDate } : {}),
    ...(reimburseBy ? { reimburse_by: reimburseBy } : {}),
    ...(reimburseColumn ? { reimburse_column: reimburseColumn } : {}),
  });

  const { data: waitingData, isFetching: isFetchingWaitingData } =
    useGetReimburses(
      getReimburseParams(ReimburseStatus.WAITING),
      {
        enabled: defaultTab === ReimburseStatus.WAITING,
      },
      ReimburseStatus.WAITING,
    );

  const { data: doneData, isFetching: isFetchingDoneData } = useGetReimburses(
    getReimburseParams(ReimburseStatus.DONE),
    { enabled: defaultTab === ReimburseStatus.DONE },
    ReimburseStatus.DONE,
  );

  const { data: onProgressData, isFetching: isFetchingOnProgressData } =
    useGetReimburses(
      getReimburseParams(ReimburseStatus.ON_PROGRESS),
      { enabled: defaultTab === ReimburseStatus.ON_PROGRESS },
      ReimburseStatus.ON_PROGRESS,
    );
  // const { data: rejectedData, isFetching: isFetchingRejectedData } =
  //   useGetReimburses(
  //     getReimburseParams(ReimburseStatus.REJECTED),
  //     { enabled: defaultTab === ReimburseStatus.REJECTED },
  //     ReimburseStatus.REJECTED,
  //   );

  // const { data: completedData, isFetching: isFetchingCompletedData } =
  //   useGetReimburses(
  //     getReimburseParams(ReimburseStatus.DONE),
  //     { enabled: defaultTab === ReimburseStatus.DONE },
  //     ReimburseStatus.DONE,
  //   );

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
      value: ReimburseStatus.WAITING,
    },
    {
      name: "Sedang DiProses",
      value: ReimburseStatus.ON_PROGRESS,
    },
    {
      name: "Selesai",
      value: ReimburseStatus.DONE,
    },
  ];

  useEffect(() => {
    if (dateRange && dateRange.from && dateRange.to) {
      router.push(
        `${pathname}?${createQueryString({
          status: defaultTab,
          start_date: dayjs(dateRange?.from)
            .locale("id")
            .format("YYYY-MM-DDT00:00:00Z"),
          end_date: dayjs(dateRange?.to)
            .locale("id")
            .format("YYYY-MM-DDT23:00:00Z"),
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

  React.useEffect(() => {
    if (sorting.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          status: defaultTab,
          reimburse_by: sorting[0]?.desc ? "DESC" : "ASC",
          reimburse_column: sorting[0]?.id,
        })}`,
      );
    } else {
      router.push(
        `${pathname}?${createQueryString({
          status: defaultTab,
          reimburse_by: null,
          reimburse_column: null,
        })}`,
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        status: defaultTab,
        page: null,
        limit: null,
        reimburse_by: null,
        reimburse_column: null,
      })}`,
    );
  }, [defaultTab]);

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <TabLists lists={lists} />
        <div className="flex items-center justify-between gap-4 flex-wrap w-full lg:!w-auto">
          <CalendarDateRangePicker
            onDateRangeChange={handleDateRangeChange}
            onClearDate={handleClearDate}
            dateRange={dateRange}
          />
          <SearchInput
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            placeholder="Cari Reimburse"
          />
        </div>
      </div>
      <TabsContent value={ReimburseStatus.WAITING} className="space-y-4">
        {isFetchingWaitingData && <Spinner />}
        {!isFetchingWaitingData && waitingData && (
          <ReimburseTable
            columns={waitingColumns}
            data={waitingData.items}
            searchKey="name"
            totalUsers={waitingData.meta?.total_items}
            pageCount={Math.ceil(waitingData.meta?.total_items / pageLimit)}
            pageNo={page}
            searchQuery={searchQuery}
            sorting={sorting}
            setSorting={setSorting}
          />
        )}
      </TabsContent>

      {/* <TabsContent value={ReimburseStatus.ON_PROGRESS} className="space-y-4">
        {isFetchingOnProgressData && <Spinner />}
        {!isFetchingOnProgressData && onProgressData && (
          <ReimburseTable
            columns={onProgressColumns}
            sorting={sorting}
            setSorting={setSorting}
            data={onProgressData.items}
            searchKey="name"
            totalUsers={onProgressData.meta?.total_items}
            pageCount={Math.ceil(onProgressData.meta?.total_items / pageLimit)}
            pageNo={page}
            searchQuery={searchQuery}
          />
        )}
      </TabsContent> */}
      <TabsContent value={ReimburseStatus.ON_PROGRESS} className="space-y-4">
        {isFetchingOnProgressData && <Spinner />}
        {!isFetchingOnProgressData && onProgressData && (
          <ReimburseTable
            columns={on_progressColumns}
            sorting={sorting}
            setSorting={setSorting}
            data={onProgressData.items}
            searchKey="name"
            totalUsers={onProgressData.meta?.total_items}
            pageCount={Math.ceil(onProgressData.meta?.total_items / pageLimit)}
            pageNo={page}
            searchQuery={searchQuery}
          />
        )}
      </TabsContent>
      <TabsContent value={ReimburseStatus.DONE} className="space-y-4">
        {isFetchingDoneData && <Spinner />}
        {!isFetchingDoneData && doneData && (
          <ReimburseTable
            columns={completedColumns}
            sorting={sorting}
            setSorting={setSorting}
            data={doneData.items}
            searchKey="name"
            totalUsers={doneData.meta?.total_items}
            pageCount={Math.ceil(doneData.meta?.total_items / pageLimit)}
            pageNo={page}
            searchQuery={searchQuery}
          />
        )}
      </TabsContent>
      {/* <TabsContent value={ReimburseStatus.CONFIRMED} className="space-y-4">
        {isFetchingCompletedData && <Spinner />}
        {!isFetchingCompletedData && completedData && (
          <ReimburseTable
            sorting={sorting}
            setSorting={setSorting}
            columns={completedColumns}
            data={completedData.items}
            searchKey="name"
            totalUsers={completedData.meta?.total_items}
            pageCount={Math.ceil(completedData.meta?.total_items / pageLimit)}
            pageNo={page}
            searchQuery={searchQuery}
          />
        )}
      </TabsContent> */}
    </>
  );
};

export default ReimburseTableWrapper;
