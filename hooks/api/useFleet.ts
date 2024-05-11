import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";

const baseEndpoint = "/fleets";
export const useGetFleets = (params: any) => {
  const axiosAuth = useAxiosAuth();

  const getFleets = () => {
    return axiosAuth.get(baseEndpoint, { params });
  };

  return useQuery({
    queryKey: ["fleets"],
    queryFn: getFleets,
  });
};

export const useGetDetailFleet = (id: number) => {
  const axiosAuth = useAxiosAuth();

  const getDetailFleet = () => {
    return axiosAuth.get(`${baseEndpoint}/${id}`);
  };

  return useQuery({
    queryKey: ["fleets", id],
    queryFn: getDetailFleet,
  });
};

type PayloadBody = {
  name: string;
  type: string;
  color: string;
  plate_number: string;
  photos: string[];
};

export const usePostFleet = () => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const postFleet = (body: PayloadBody) => {
    return axiosAuth.post(baseEndpoint, body);
  };

  return useMutation({
    mutationFn: postFleet,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["fleets"] });
    },
  });
};

export const useEditFleet = (id: string | number) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const editFleet = (body: PayloadBody) => {
    return axiosAuth.patch(`${baseEndpoint}/${id}`);
  };

  return useMutation({
    mutationFn: editFleet,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["fleets"] });
    },
  });
};

export const useDeleteFleet = (id: number) => {
  const axiosAuth = useAxiosAuth();

  const queryClient = useQueryClient();

  const deleteFleet = (id: number) => {
    return axiosAuth.delete(`${baseEndpoint}/${id}`);
  };

  return useMutation({
    mutationFn: deleteFleet,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["fleets"] });
    },
  });
};
