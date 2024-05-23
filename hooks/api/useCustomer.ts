import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

const baseEndpoint = "/customers";

export const useGetCustomers = (params: any) => {
  const axiosAuth = useAxiosAuth();

  const getCustomers = () => {
    return axiosAuth.get(baseEndpoint, { params });
  };
  return useQuery({
    queryKey: ["customers", params],
    queryFn: getCustomers,
  });
};

export const useGetInfinityCustomers = () => {
  const axiosAuth = useAxiosAuth();
  const getCustomers = ({ pageParam = 1 }) => {
    return axiosAuth.get(baseEndpoint, {
      params: {
        limit: 10,
        page: pageParam,
      },
    });
  };

  return useInfiniteQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.data.pagination?.next_page,
  });
};

export const useGetDetailCustomer = (id: string | number) => {
  const axiosAuth = useAxiosAuth();

  const getDetailCustomer = () => {
    return axiosAuth.get(`${baseEndpoint}/${id}`);
  };

  return useQuery({
    queryKey: ["customers", id],
    queryFn: getDetailCustomer,
  });
};

export const usePostCustomer = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const postCustomer = (body: any) => {
    return axiosAuth.post(baseEndpoint, body);
  };

  return useMutation({
    mutationFn: postCustomer,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["customers"] });
    },
  });
};

export const usePatchCustomer = (id: string | number) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const patchCustomer = (body: any) => {
    return axiosAuth.patch(`${baseEndpoint}/${id}`, body);
  };

  return useMutation({
    mutationFn: patchCustomer,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["customers"] });
    },
  });
};

export const useDeleteCustomer = (id: number) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const deleteCustomer = (id: number) => {
    return axiosAuth.delete(`${baseEndpoint}/${id}`);
  };

  return useMutation({
    mutationFn: deleteCustomer,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["customers"] });
    },
  });
};
