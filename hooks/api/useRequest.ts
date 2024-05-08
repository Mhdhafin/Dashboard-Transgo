import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

const baseEndpoint = "/requests";
export const useGetRequests = (params: any) => {
  const axiosAuth = useAxiosAuth();

  const getRequests = () => {
    return axiosAuth.get(baseEndpoint, { params });
  };

  return useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  });
};
