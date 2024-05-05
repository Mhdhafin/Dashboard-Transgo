import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

const baseEndpoint = "/drivers";
export const useGetDriver = (params: any) => {
  const axiosAuth = useAxiosAuth();

  const getDrivers = () => {
    return axiosAuth.get(baseEndpoint, {
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
  const queryClient = useQueryClient();

  const postDriver = (body: any) => {
    return axiosAuth.post(baseEndpoint, body);
  };

  return useMutation({
    mutationFn: postDriver,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["drivers"] });
    },
  });
};

export const useDeleteDriver = (id: number) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const deleteUserFn = async (id: number) => {
    return axiosAuth.delete(`${"driver"}/${id}`);
  };

  return useMutation({
    mutationFn: deleteUserFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["drivers"] });
    },
  });
};
