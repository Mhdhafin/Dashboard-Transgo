import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { useGetCalendar } from "@/hooks/api/useCalendar";
import { formatRupiah } from "@/lib/utils";
import { ICalendarData } from "@/components/calendar/types";

dayjs.extend(utc);
dayjs.extend(timezone);

const useCalendarViewStore = (filter?: any) => {
  const {
    data: calendar,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetCalendar({
    limit: 5,
    ...filter,
  });

  const data = calendar?.pages?.flatMap((page) => page?.data?.items) || [];

  const mappedData: ICalendarData[] = data.map((item) => ({
    id: item.id,
    name: item.name,
    location: item?.location?.location,
    price: formatRupiah(item.price),
    image: item?.photo?.photo,
    usage: item?.orders?.map((order: any) => ({
      id: order.id,
      start: dayjs(order.start_date).tz("Asia/Jakarta"),
      end: dayjs(order.end_date).tz("Asia/Jakarta"),
      startDriver: order?.start_request?.driver?.name || "-",
      endDriver: order?.end_request?.driver?.name || "-",
      duration: order?.duration + " hari",
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      title: order.customer.name,
      price: formatRupiah(order.total_price),
    })),
  }));

  if (!isFetching && mappedData.length < 5) {
    const emptyDataCount = 5;
    for (let i = 0; i < emptyDataCount; i++) {
      mappedData.push({
        id: "",
        name: "",
        location: "",
        price: "",
        image: "",
        usage: [],
      });
    }
  }

  return {
    calendarData: mappedData,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};

export default useCalendarViewStore;
