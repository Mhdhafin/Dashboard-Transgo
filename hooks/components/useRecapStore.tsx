import { useGetRecaps } from "../api/useRecaps";

const useRecapStore = (params?: any) => {
  const { data } = useGetRecaps({ ...params });
  console.log("🚀 ~ useRecapStore ~ data:", data);

  return {};
};

export default useRecapStore;
