import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

const baseEndpoint = "/orders";

export const useGetDetailOrder = (id: number | string) => {
  const axiosAuth = useAxiosAuth();

  const getDetailOrder = () => {
    return axiosAuth.get(`${baseEndpoint}/${id}`);
  };

  return useQuery({
    queryKey: ["orders", id],
    queryFn: getDetailOrder,
  });
};

export const usePostOrder = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const postOrder = (body: any) => {
    return axiosAuth.post(baseEndpoint, body);
  };

  return useMutation({
    mutationFn: postOrder,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
    },
  });
};

export const useEditOrder = (id: string | number) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const editOrder = (body: any) => {
    return axiosAuth.patch(`${baseEndpoint}/${id}`, body);
  };

  return useMutation({
    mutationFn: editOrder,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrderCalculate = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const calculatePrice = (body: any) => {
    return axiosAuth.post(`${baseEndpoint}/calculate-price`, body);
  };

  return useMutation({
    mutationFn: calculatePrice,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrdersStatusCount = () => {
  const axiosAuth = useAxiosAuth();
  const getStatusCountFn = () => {
    return axiosAuth.get(`${baseEndpoint}/status/count`);
  };
  return useQuery({
    queryKey: ["orders"],
    queryFn: getStatusCountFn,
  });
};

export const useDeleteOrder = (id: number) => {
  const axiosAuth = useAxiosAuth();

  const queryClient = useQueryClient();

  const deleteOrder = (id: number) => {
    return axiosAuth.delete(`${baseEndpoint}/${id}`);
  };

  return useMutation({
    mutationFn: deleteOrder,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
    },
  });
};
