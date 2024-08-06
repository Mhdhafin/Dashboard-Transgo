import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

const baseEndpoint = "/customers";

export const useGetCustomers = (params: any, options = {}, type: string) => {
  const axiosAuth = useAxiosAuth();

  const getCustomers = async () => {
    const { data } = await axiosAuth.get(baseEndpoint, { params });
    return data;
  };

  return useQuery({
    queryKey: ["customers", params, type],
    queryFn: getCustomers,
    ...options,
  });
};

export const useGetInfinityCustomers = (query?: string, status?: string) => {
  const axiosAuth = useAxiosAuth();

  const getCustomers = ({
    pageParam = 1,
    query,
    status,
  }: {
    pageParam?: number;
    query?: string;
    status?: string;
  }) => {
    return axiosAuth.get(baseEndpoint, {
      params: {
        limit: 10,
        page: pageParam,
        q: query,
        status: status,
      },
    });
  };

  return useInfiniteQuery({
    queryKey: ["customers", query, status],
    queryFn: ({ pageParam }) => getCustomers({ pageParam, query, status }),
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

export const usePatchCustomer = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const patchCustomer = ({ id, body }: { body: any; id: string | number }) => {
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

export const useApproveCustomer = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const putCustomer = (id: number | string) => {
    return axiosAuth.put(`${baseEndpoint}/${id}/verify`);
  };

  return useMutation({
    mutationFn: putCustomer,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["customers"] });
    },
  });
};

export const useRejectCustomer = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const putCustomer = ({ id, reason }: { id: string; reason: string }) => {
    return axiosAuth.put(`${baseEndpoint}/${id}/reject`, { reason });
  };

  return useMutation({
    mutationFn: putCustomer,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["customers"] });
    },
  });
};

export const useCustomersStatusCount = () => {
  const axiosAuth = useAxiosAuth();
  const getStatusCountFn = () => {
    return axiosAuth.get(`${baseEndpoint}/status/count`);
  };
  return useQuery({
    queryKey: ["customers"],
    queryFn: getStatusCountFn,
  });
};
