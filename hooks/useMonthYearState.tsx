import { create } from "zustand";

interface MonthYearStore {
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handlePrevYear: () => void;
  handleNextYear: () => void;
}

export const useMonthYearState = create<MonthYearStore>((set) => ({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  setMonth: (month) => set({ month }),
  setYear: (year) => set({ year }),
  handlePrevMonth: () =>
    set((state) => ({ month: state.month === 1 ? 12 : state.month - 1 })),
  handleNextMonth: () =>
    set((state) => ({ month: state.month === 12 ? 1 : state.month + 1 })),
  handlePrevYear: () => set((state) => ({ year: state.year - 1 })),
  handleNextYear: () => set((state) => ({ year: state.year + 1 })),
}));
