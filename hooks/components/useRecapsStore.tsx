import { useGetRecaps } from "../api/useRecaps";

const useRecapsStore = (params?: any) => {
  const { data } = useGetRecaps({ ...params });

  return {};
};

export default useRecapsStore;
