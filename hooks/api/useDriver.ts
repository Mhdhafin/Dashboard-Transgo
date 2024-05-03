import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

export const useGetDriver = (params: any) => {
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

export const usePostDriver = () => {
  const axiosAuth = useAxiosAuth();

  const postDriver = (body: any) => {
    return axiosAuth.post("/drivers", body);
  };

  return useMutation({
    mutationFn: postDriver,
  });
};
