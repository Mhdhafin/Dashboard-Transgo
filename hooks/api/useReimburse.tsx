import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";
import { useUser } from "@/context/UserContext";

const baseEndpoint = "/reimburse";

interface GetReimburseParams {
  status: string;
  page: number;
  limit: number;
  q?: string;
  start_date?: string | Date | undefined;
  end_date?: string | Date | undefined;
  reimburse_by?: string | undefined;
  reimburse_column?: string | undefined;
}

export const useGetReimburses = (
  params: GetReimburseParams,
  options = {},
  type: string,
) => {
  const axiosAuth = useAxiosAuth();

  const getReimburse = async () => {
    const { data } = await axiosAuth.get(baseEndpoint, {
      params,
    });
    return data;
  };

  return useQuery({
    queryKey: ["reimburse", params, type],
    queryFn: getReimburse,
    ...options,
  });
};

export const useGetDetailReimburse = (id: number | string) => {
  const axiosAuth = useAxiosAuth();

  const getDetailReimburse = () => {
    return axiosAuth.get(`${baseEndpoint}/${id}`);
  };

  return useQuery({
    queryKey: ["reimburse", id],
    queryFn: getDetailReimburse,
  });
};

export const usePostReimburse = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const postReimburse = (body: any) => {
    return axiosAuth.post(baseEndpoint, body);
  };

  return useMutation({
    mutationFn: postReimburse,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["reimburse"] });
    },
  });
};

export const useEditReimburse = (id: string | number) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const editReimburse = (body: any) => {
    return axiosAuth.patch(`${baseEndpoint}/${id}`, body);
  };

  return useMutation({
    mutationFn: editReimburse,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["reimburse"] });
    },
  });
};

export const useReimburseCalculate = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const calculatePrice = (body: any) => {
    return axiosAuth.post(`${baseEndpoint}/calculate-price`, body);
  };

  return useMutation({
    mutationFn: calculatePrice,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["reimburse"] });
    },
  });
};

export const useReimburseStatusCount = () => {
  const { user } = useUser();
  const axiosAuth = useAxiosAuth();
  const getStatusCountFn = () => {
    return axiosAuth.get(`${baseEndpoint}/status/count`);
  };
  return useQuery({
    queryKey: ["reimburse"],
    queryFn: getStatusCountFn,
    enabled: user?.role !== "owner",
  });
};

export const useDeleteReimburse = (id: number, force: boolean) => {
  const axiosAuth = useAxiosAuth();

  const queryClient = useQueryClient();

  const deleteReimburse = (id: number) => {
    return axiosAuth.delete(`${baseEndpoint}/${id}`, {
      params: {
        force,
      },
    });
  };

  return useMutation({
    mutationFn: deleteReimburse,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["reimburse"] });
    },
  });
};

export const useAcceptReimburse = (id: string | number) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const acceptReimburse = (body: any) => {
    return axiosAuth.post(`${baseEndpoint}/${id}/accept`, body);
  };

  return useMutation({
    mutationFn: acceptReimburse,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["reimburse"] });
    },
  });
};

export const useRejectReimburse = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const rejectReimburse = ({ reimburseId, reason }: any) => {
    return axiosAuth.post(`${baseEndpoint}/${reimburseId}/reject`, { reason });
  };

  return useMutation({
    mutationFn: rejectReimburse,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["reimburse"] });
    },
  });
};
