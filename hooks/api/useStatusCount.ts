import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

export const useStatusCount = () => {
  const axiosAuth = useAxiosAuth();
  const getStatusCountFn = () => {
    return axiosAuth.get("/requests/status/count");
  };
  return useQuery({
    queryKey: ["status"],
    queryFn: getStatusCountFn,
  });
};
