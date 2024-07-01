import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

const baseEndpoint = "/insurances";
export const useGetInsurances = () => {
  const axiosAuth = useAxiosAuth();

  const getInsurances = () => {
    return axiosAuth.get(baseEndpoint);
  };

  return useQuery({
    queryKey: ["insurances"],
    queryFn: getInsurances,
  });
};

export const useGetDetailInsurance = (id: number) => {
  const axiosAuth = useAxiosAuth();

  const getDetailInsurance = () => {
    return axiosAuth.get(`${baseEndpoint}/${id}`);
  };

  return useQuery({
    queryKey: ["insurances", id],
    queryFn: getDetailInsurance,
  });
};
