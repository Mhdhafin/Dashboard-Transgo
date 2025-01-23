"use client";
import * as z from "zod";
import { Heading } from "@/components/ui/heading";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { Separator } from "@radix-ui/react-dropdown-menu";
import dayjs, { Dayjs } from "dayjs";
import { useEditDiscount, useGetDiscount, usePostDiscount } from "@/hooks/api/useDiscount";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormLabel, FormMessage } from "../ui/form";
import locale from "antd/locale/id_ID";
import { Select as AntdSelect, ConfigProvider, DatePicker, Space, Input } from "antd";
import "dayjs/locale/id";
import { Button } from "../ui/button";
import { Percent } from "lucide-react";
import { useGetInfinityLocation } from "@/hooks/api/useLocation";
import { useDebounce } from "use-debounce";
import { useGetInfinityFleets } from "@/hooks/api/useFleet";
import { isEmpty, isNull, isString } from "lodash";
import { cn, convertTime, makeUrlsClickable } from "@/lib/utils";

const { RangePicker } = DatePicker;

const formSchema = z.object({
    discount: z.coerce.number().min(1, { message: "Discount minimal is from 1" }).max(100, { message: "Discount must be between 0 and 100" }),
    range_date: z.tuple([z.any(), z.any()]),
    location_id: z.string().min(0).optional(),
    fleet_id: z.string().min(0).optional(),
})

type DiscountFormValues = z.infer<typeof formSchema>;

interface DiscountFormProps {
    initialData: any | null;
    isEdit?: boolean;
}

export const DiscountForm: React.FC<DiscountFormProps> = ({
    initialData,
    isEdit,
}) => {
    const { discountId } = useParams();
    const { toast } = useToast();

    const router = useRouter();
    const pathname = usePathname();
    const splitPath = pathname.split("/");
    const lastPath = splitPath[splitPath.length - 1];

    const [loading, setLoading] = useState(false);
    const [searchLocation, setSearchLocation] = useState("");
    const [searchLocationDebounce] = useDebounce(searchLocation, 500);

    const {
        data: locations,
        fetchNextPage: fetchNextLocations,
        isFetchingNextPage: isFetchingNextLocations,
    } = useGetInfinityLocation(searchLocationDebounce);

    const [searchFleetTerm, setSearchFleetTerm] = useState("");
    const [searchFleetDebounce] = useDebounce(searchFleetTerm, 500);
    const {
        data: fleets,
        isFetching: isFetchingFleets,
        fetchNextPage: fetchNextFleets,
        hasNextPage: hasNextFleets,
        isFetchingNextPage: isFetchingNextFleets,
    } = useGetInfinityFleets(searchFleetDebounce);

    const title = !isEdit ? "Edit Discount" : "Create Discount";
    const description = !isEdit
        ? "Create a new discount for your fleet"
        : "Edit an existing discount for your fleet";
    const toastMessage = initialData
        ? `Discount percentage set to ${initialData}%`
        : "Discount saved";
    const action = initialData ? "Edit" : "Create";
    const queryClient = useQueryClient();

    const { mutate: createDiscount } = usePostDiscount();
    const { mutate: updateDiscount } = useEditDiscount(discountId as string)

    const defaultValues = initialData
        ? {
            discount: initialData?.discount,
            start_date: new Date(initialData?.start_date),
            end_date: new Date(initialData?.end_date),
            location_id: initialData?.location?.id?.toString(),
            fleet: initialData?.fleet?.id?.toString(),
        }
        : {
            discount: 0,
            start_date: "",
            end_date: "",
            location_id: "",
            fleet: "",
        }

    const form = useForm<DiscountFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const Option = AntdSelect;
    const handleScrollLocation = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            fetchNextLocations();
        }
    };

    const handleScrollFleets = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            fetchNextFleets();
        }
    };

    const disabledDate = (current: Dayjs | null): boolean => {
        if (lastPath === "edit") return false;
        return current ? current < dayjs().startOf("day") : false;;
    };

    const onSubmit = async (data: DiscountFormValues) => {
        setLoading(true);
        const payload = {
            discount: data?.discount,
            start_date: new Date(data?.range_date[0]).toISOString(),
            end_date: new Date(data?.range_date[1]).toISOString(),
            location_id: parseInt(data?.location_id as string),
            fleet_id: parseInt(data?.fleet_id as string),
        }

        if (initialData) {
            updateDiscount(payload, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["discount"] });
                    toast({
                        title: "Discount updated",
                        description: toastMessage,
                    });
                    router.refresh();
                    router.push("/dashboard/discount");
                },
                onError: (error) => {
                    toast({
                        title: "Uh oh! ada sesuatu yang error",
                        description: `error: ${error.message}`,
                        variant: "destructive",
                    });
                },
                onSettled: () => {
                    setLoading(false);
                },
            })
        } else {
            createDiscount(payload, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["discount"] });
                    toast({
                        title: "Discount created",
                        description: toastMessage,
                    });
                    router.refresh();
                    router.push("/dashboard/discount");
                },
                onError: (error) => {
                    toast({
                        title: "Uh oh! ada sesuatu yang error",
                        description: `error: ${error.message}`,
                        variant: "destructive",
                    });
                },
                onSettled: () => {
                    setLoading(false);
                },
            })
        }
    };



    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <div className="flex flex-wrap flex-col justify-between lg:!flex-row gap-4 md:!space-y-0">
                        <FormField
                            control={form.control}
                            name="range_date"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <ConfigProvider locale={locale}>
                                    <Space direction="vertical" size={12} className="basis-2/5">
                                        <FormLabel className="relative label-required">
                                            Tanggal Diskon
                                        </FormLabel>
                                        <FormControl className="w-full">
                                            <RangePicker
                                                disabled={loading}
                                                onChange={(date) => onChange(date)}
                                                onBlur={onBlur}
                                                value={value as [Dayjs | null | undefined, Dayjs | null | undefined]}
                                                ref={ref}
                                                disabledDate={disabledDate}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </Space>
                                </ConfigProvider>
                            )}
                        />

                        <FormField
                            name="location_id"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <Space size={12} direction="vertical" className="basis-1/6">
                                        <FormLabel className="relative">
                                            Lokasi
                                        </FormLabel>
                                        <FormControl className="w-full">
                                            <AntdSelect
                                                showSearch
                                                value={field.value}
                                                placeholder="Pilih Lokasi"
                                                onSearch={setSearchLocation}
                                                onChange={field.onChange}
                                                onPopupScroll={(event) =>
                                                    handleScrollLocation(event)
                                                }
                                                filterOption={false}
                                                notFoundContent={
                                                    isFetchingNextLocations ? (
                                                        <p className="px-3 text-sm">loading</p>
                                                    ) : null
                                                }
                                            >
                                                {isEdit && (
                                                    <Option
                                                        value={initialData?.location?.id?.toString()}
                                                    >
                                                        {initialData?.location?.name}
                                                    </Option>
                                                )}
                                                {locations?.pages.map((page: any, pageIndex: any) =>
                                                    page.data.items.map((item: any, itemIndex: any) => {
                                                        return (
                                                            <Option
                                                                key={item.id}
                                                                value={item.id.toString()}
                                                            >
                                                                {item.name}
                                                            </Option>
                                                        );
                                                    }),
                                                )}

                                                {isFetchingNextLocations && (
                                                    <Option disabled>
                                                        <p className="px-3 text-sm">loading</p>
                                                    </Option>
                                                )}
                                            </AntdSelect>
                                        </FormControl>
                                    </Space>
                                );
                            }}
                        />

                        <FormField
                            name="fleet_id"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <Space size={12} direction="vertical" className="basis-1/6">
                                        <FormLabel className="relative">
                                            Armada
                                        </FormLabel>
                                        <FormControl className="w-full">
                                            <AntdSelect
                                                showSearch
                                                placeholder="Pilih Armada"
                                                onSearch={setSearchFleetTerm}
                                                onChange={field.onChange}
                                                onPopupScroll={handleScrollFleets}
                                                filterOption={false}
                                                notFoundContent={
                                                    isFetchingNextFleets ? (
                                                        <p className="px-3 text-sm">loading</p>
                                                    ) : null
                                                }
                                                {...(!isEmpty(field.value) && {
                                                    value: field.value,
                                                })}
                                            >
                                                {lastPath !== "create" && isEdit && (
                                                    <Option
                                                        value={initialData?.fleet?.id?.toString()}
                                                    >
                                                        {initialData?.fleet?.name}
                                                    </Option>
                                                )}
                                                {fleets?.pages.map(
                                                    (page: any, pageIndex: any) =>
                                                        page.data.items.map(
                                                            (item: any, itemIndex: any) => {
                                                                return (
                                                                    <Option
                                                                        key={item.id}
                                                                        value={item.id.toString()}
                                                                    >
                                                                        {item.name}
                                                                    </Option>
                                                                );
                                                            },
                                                        ),
                                                )}

                                                {isFetchingNextFleets && (
                                                    <Option disabled>
                                                        <p className="px-3 text-sm">loading</p>
                                                    </Option>
                                                )}
                                            </AntdSelect>
                                        </FormControl>
                                    </Space>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <ConfigProvider locale={locale}>
                                    <Space direction="vertical" size={12} className="basis-1/6">
                                        <FormLabel className="relative label-required">
                                            Diskon
                                        </FormLabel>
                                        <FormControl className="w-full">
                                            <Input
                                                disabled={loading}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                type="number"
                                                placeholder="Masukkan diskon"
                                                addonAfter={<Percent />}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </Space>
                                </ConfigProvider>
                            )}
                        />
                    </div>

                    <Button
                        disabled={loading}
                        className="ml-auto bg-main hover:bg-main/90"
                        type="submit"
                    >
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
};