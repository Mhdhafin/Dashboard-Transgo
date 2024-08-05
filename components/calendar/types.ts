import { Dayjs } from "dayjs";

export interface IUsage {
  id: string | number;
  start: Dayjs;
  end: Dayjs;
  startDriver: string;
  endDriver: string;
  duration: string;
  paymentStatus: "pending" | "done" | "partially paid";
  orderStatus: "pending" | "done" | "on_progress" | "waiting";
  title: string;
  price: string;
}

export interface ICalendarData {
  id: string | number;
  name: string;
  location: string;
  price: string;
  image: string;
  usage: IUsage[];
}
