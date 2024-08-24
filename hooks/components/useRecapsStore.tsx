import { useGetRecaps } from "../api/useRecaps";

interface IFleet {
  color: string | null;
  id: number;
  name: string;
}

export interface IItems {
  id: number | string;
  status: string;
  update_at: string;
  category: { name: string };
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

  if (!isFetching && items.length < 5) {
    const emptyDataCount = 5;
    for (let i = 0; i < emptyDataCount; i++) {
      items.push({
        id: "",
        status: "",
        update_at: "",
        created_at: "",
        category: { name: "" },
        date: "",
        duration: 0,
        credit_amount: 0,
        debit_amount: 0,
        commission: 0,
        description: "",
        fleet: {
          color: "",
          id: 0,
          name: "",
        },
      });
    }
  }

  return {
    items,
    total,
    isFetching,
  };
};

export default useRecapsStore;
