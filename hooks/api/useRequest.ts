import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

const baseEndpoint = "/requests";
export const useGetRequests = (params: any, options = {}, type: string) => {
  const axiosAuth = useAxiosAuth();

  const getRequests = () => {
    return axiosAuth.get(baseEndpoint, { params });
  };

  return useQuery({
    queryKey: ["requests", params, type],
    queryFn: getRequests,
    ...options,
  });
};

export const useGetDetailRequest = (id: string | number) => {
  const axiosAuth = useAxiosAuth();

  const getDetailRequest = () => {
    return axiosAuth.get(`${baseEndpoint}/${id}`);
  };

  return useQuery({
    queryKey: ["requests", id],
    queryFn: getDetailRequest,
  });
};

type PayloadBody = {
  customer_id: number;
  fleet_id: number;
  driver_id: number;
  start_date: string;
  type: string;
  address: string;
  description: string;
  is_self_pickup: boolean;
};

export const usePostRequest = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const postRequest = (body: PayloadBody) => {
    return axiosAuth.post(baseEndpoint, body);
  };

  return useMutation({
    mutationFn: postRequest,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["requests"] });
    },
  });
};

export const useEditRequest = (id: string | number) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const editRequest = (body: PayloadBody) => {
    return axiosAuth.patch(`${baseEndpoint}/${id}`, body);
  };

  return useMutation({
    mutationFn: editRequest,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["requests"] });
    },
  });
};

export const useDeleteRequest = (id: string | number) => {
  const axiosAuth = useAxiosAuth();

  const queryClient = useQueryClient();

  const deleteRequest = (id: number) => {
    return axiosAuth.delete(`${baseEndpoint}/${id}`);
  };

  return useMutation({
    mutationFn: deleteRequest,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["requests"] });
    },
  });
};
