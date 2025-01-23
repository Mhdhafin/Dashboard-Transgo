import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../axios/use-axios-auth";
import { useGetDetailLocation } from "./useLocation";

const baseEndpoint = "/discount"

export const useGetDiscount = (params: any, options = {}) => {
    const axiosAuth = useAxiosAuth();
    const getDiscount = async () => {
        return await axiosAuth.get(`${baseEndpoint}/search`, { params });
    };

    return useQuery({
        queryKey: ["discount", params],
        queryFn: getDiscount,
        ...options,
    });
};

export const useGetInfinityDiscount = () => {
    const axiosAuth = useAxiosAuth();
    const getDiscount = async () => {
        const data = await axiosAuth.get(baseEndpoint, {});
        const itemsWithLocation = await Promise.all(data.data.items.map(async (item: any) => {
            if (item.fleet_type === 'all') {
                item.fleet_type = "Semua Jenis Kendaraan";
            }

            if (item.location_id === 0) {
                return { ...item, location: { name: "Semua Lokasi" } };
            }

            const location = await axiosAuth.get(`/locations/${item.location_id}`);
            return { ...item, location: location.data };
        }));

        data.data.items = itemsWithLocation;
        return data;
    }

    return useQuery({
        queryKey: ["discount"],
        queryFn: getDiscount,
    });
}

type PayloadBody = {
    discount: number;
    start_date: string;
    end_date: string;
    description: string;
}

export const usePostDiscount = () => {
    const axiosAuth = useAxiosAuth();
    const queryClient = useQueryClient();

    const createDiscount = async (data: any) => {
        return axiosAuth.post(baseEndpoint, data);
    };

    return useMutation({
        mutationFn: createDiscount,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["discount"] });
        }
    });
}

export const useEditDiscount = (id: string | number) => {
    const axiosAuth = useAxiosAuth();
    const queryClient = useQueryClient();

    const editDiscount = async (data: any) => {
        return axiosAuth.patch(`${baseEndpoint}/${id}`, data);
    };

    return useMutation({
        mutationFn: editDiscount,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["discount"] });
        }
    });
}

export const useDeleteDiscount = (id: string | number) => {
    const axiosAuth = useAxiosAuth();
    const queryClient = useQueryClient();

    const deleteDiscount = async (id: number) => {
        return axiosAuth.delete(`${baseEndpoint}/${id}`);
    };

    return useMutation({
        mutationFn: deleteDiscount,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["discount"] });
        }
    });
}
