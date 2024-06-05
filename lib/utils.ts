import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "@/components/kanban/board-column";
import { TaskDragData } from "@/components/kanban/task-card";
import { isObject, transform } from "lodash";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Task") {
    return true;
  }

  return false;
}

export const convertEmptyStringsToNull = (obj: any) => {
  return transform(obj, (result: any, value: any, key: any) => {
    if (isObject(value)) {
      result[key] = convertEmptyStringsToNull(value);
    } else {
      result[key] = value === "" ? null : value;
    }
  });
};

export const convertTime = (time: number | null) => {
  if (time === null) return "-";

  const duration = dayjs.duration(time, "seconds");
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let displayString = "";
  if (days !== 0) {
    displayString += ` ${days} hari`;
  }

  if (hours !== 0) {
    displayString += ` ${hours} jam`;
  }

  if (minutes !== 0) {
    displayString += ` ${minutes} menit`;
  }

  if (seconds !== 0) {
    displayString += ` ${seconds} detik`;
  }

  return displayString;
};
