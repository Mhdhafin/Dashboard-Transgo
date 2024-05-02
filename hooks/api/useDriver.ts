import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

export const useGetDriver = (params) => {
  const axiosAuth = useAxiosAuth();

  const getDrivers = () => {
    return axiosAuth.get("/drivers", {
      params,
    });
  };

  return useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });
};
