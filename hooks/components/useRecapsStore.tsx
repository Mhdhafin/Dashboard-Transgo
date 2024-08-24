import { useGetRecaps } from "../api/useRecaps";

interface IFleet {
  color: string | null;
  id: number;
  name: string;
}

export interface IItems {
  id: number;
  status: string;
  update_at: string;
  created_at: string;
  date: string;
  duration: number;
  credit_amount: number | null;
  debit_amount: number | null;
  commission: number;
  description: string | null;
  fleet: IFleet;
}

export interface ITotal {
  debit: 0;
  credit: 0;
  duration: 0;
  commission: 0;
}

const useRecapsStore = (params?: any) => {
  const { data: recaps, isFetching } = useGetRecaps({ ...params });

  const items: IItems[] =
    recaps?.data?.items.map((item: IItems) => ({
      ...item,
      commission: (item.debit_amount || 0) - (item.credit_amount || 0),
    })) || [];

  const total: ITotal = recaps?.data?.total
    ? {
        ...recaps?.data?.total,
        commission:
          recaps?.data?.total?.debit || 0 - recaps?.data?.total?.credit || 0,
      }
    : { debit: 0, credit: 0, duration: 0, commission: 0 };

  return {
    items,
    total,
    isFetching,
  };
};

export default useRecapsStore;
