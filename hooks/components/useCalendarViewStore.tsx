import { useGetCalendar } from "@/hooks/api/useCalendar";
import { formatRupiah } from "@/lib/utils";
import dayjs from "dayjs";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const useCalendarViewStore = (filter?: any) => {
  const { data: calendar, isFetching } = useGetCalendar({
    limit: 5,
    ...filter,
  });

  const data = calendar?.pages?.flatMap((page) => page?.data?.items) || [];

  const mappedData = data.map((item) => ({
    id: item.id,
    label: {
      name: item.name,
      location: item.location.location,
      price: formatRupiah(item.price),
    },
    data: item.orders.map((order: any) => ({
      id: order.id,
      startDate: dayjs(order.start_date).format("DD MMM YYYY"),
      endDate: dayjs(order.end_date).format("DD MMM YYYY"),
      duration: order.duration + " hari",
      title: order.customer.name,
      price: formatRupiah(order.total_price),
      bgColor: getRandomColor(),
    })),
  }));

  return {
    calendarData: mappedData,
    isFetching,
  };
};

export default useCalendarViewStore;
