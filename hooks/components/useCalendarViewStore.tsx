import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { useGetCalendar } from "@/hooks/api/useCalendar";
import { formatRupiah } from "@/lib/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

const useCalendarViewStore = (filter?: any) => {
  const { data: calendar, isFetching } = useGetCalendar({
    limit: 5,
    ...filter,
  });

  const data = calendar?.pages?.flatMap((page) => page?.data?.items) || [];

  const mappedData = data.map((item) => ({
    id: item.id,
    name: item.name,
    location: item.location.location,
    price: formatRupiah(item.price),
    image:
      "https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?q=80&w=2738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    usage: item.orders.map((order: any) => ({
      id: order.id,
      start: dayjs(order.start_date).tz("Asia/Jakarta"),
      end: dayjs(order.end_date).tz("Asia/Jakarta"),
      name: "Jonathan Doe",
      duration: order.duration + " hari",
      paymentStatus: order.payment_status,
      title: order.customer.name,
      price: formatRupiah(order.total_price),
    })),
  }));

  return {
    calendarData: mappedData,
    isFetching,
  };
};

export default useCalendarViewStore;
