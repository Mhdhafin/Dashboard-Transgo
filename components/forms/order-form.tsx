"use client";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "../ui/use-toast";
import { cn, makeUrlsClickable } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  useEditFleet,
  useGetDetailFleet,
  useGetInfinityFleets,
} from "@/hooks/api/useFleet";
import { isEmpty, isString } from "lodash";
import { useDebounce } from "use-debounce";
import { Select as AntdSelect, ConfigProvider, DatePicker, Space } from "antd";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  useGetDetailCustomer,
  useGetInfinityCustomers,
} from "@/hooks/api/useCustomer";
import {
  useGetDetailDriver,
  useGetInfinityDrivers,
} from "@/hooks/api/useDriver";
import { Textarea } from "../ui/textarea";
import { useSidebar } from "@/hooks/useSidebar";
import dayjs, { Dayjs } from "dayjs";
import locale from "antd/locale/id_ID";
import { Switch } from "@/components/ui/switch";
import { Label } from "../ui/label";
import { useGetInsurances } from "@/hooks/api/useInsurance";
import {
  useEditOrder,
  useOrderCalculate,
  usePostOrder,
} from "@/hooks/api/useOrder";
import { ApprovalModal } from "../modal/approval-modal";
import { NumericFormat } from "react-number-format";
import "dayjs/locale/id";
import FleetDetail from "./section/fleet-detail";
import CustomerDetail from "./section/customer-detail";
import DriverDetail from "./section/driver-detail";
import PriceDetail from "./section/price-detail";
import Spinner from "../spinner";

export const IMG_MAX_LIMIT = 3;
const formSchema = z.object({
  start_request: z.object({
    is_self_pickup: z.boolean(),
    address: z.string().min(1, { message: "Tolong masukkan alamat" }),
    distance: z.coerce.number().gte(0, "Jarak minimal 0 KM"),
    driver_id: z.string().min(1, { message: "Tolong pilih Penanggung Jawab" }),
  }),
  end_request: z.object({
    is_self_pickup: z.boolean(),
    address: z.string().min(1, { message: "Tolong masukkan alamat" }),
    distance: z.coerce.number().gte(0, "Jarak minimal 0 KM"),
    driver_id: z.string().min(1, { message: "Tolong pilih Penanggung Jawab" }),
  }),
  customer: z.string().min(1, { message: "Tolong pilih pelanggan" }),
  fleet: z.string().min(1, { message: "Tolong pilih armada" }),
  description: z.string().optional().nullable(),
  is_with_driver: z.boolean(),
  is_out_of_town: z.boolean(),
  // imgUrl: z.array(ImgSchema),
  date: z.coerce.date({ required_error: "Tolong masukkan Waktu" }),
  duration: z.string().min(1, { message: "tolong masukkan durasi" }),
  discount: z.string().min(1, { message: "tolong masukkan diskon" }),
  insurance_id: z.string().min(1, { message: "tolong pilih asuransi" }),
});

const generateSchema = (watchServicePrice: boolean) => {
  return watchServicePrice
    ? formSchema.extend({
        service_price: z
          .string()
          .min(1, { message: "tolong masukkan harga layanan" }),
      })
    : formSchema;
};

const editFormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, { message: "Name must be at least 3 characters" }),
  color: z
    .string({
      required_error: "Color is required",
      invalid_type_error: "Color must be a string",
    })
    .optional()
    .nullable(),
  plate_number: z
    .string({
      required_error: "plate number is required",
      invalid_type_error: "plate number must be a string",
    })
    .min(1, { message: "plate number is required" }),
  type: z.string({ required_error: "type is required" }).min(1, {
    message: "type is required",
  }),
  price: z.string({ required_error: "price is required" }).min(1, {
    message: "price is required",
  }),
  location_id: z.string().min(1, { message: "Tolong pilih lokasi" }),
});

type OrderFormValues = z.infer<typeof formSchema> & {
  service_price?: string;
};

interface FleetFormProps {
  initialData: any | null;
  isEdit?: boolean | null;
}

interface DetailFleet {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  type: string;
  color: string | null;
  plate_number: string;
  price: number;
}

interface DetailInsurance {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  price: number;
}
interface DetailPrice {
  discount: number;
  driver_price: number;
  fleet: DetailFleet;
  grand_total: number;
  insurance: DetailInsurance;
  insurance_price: number;
  rent_price: number;
  service_price: number;
  sub_total: number;
  tax: number;
  total: number;
  total_driver_price: number;
  total_rent_price: number;
  total_weekend_price: number;
  weekend_days: any[];
  weekend_price: number;
}

export const OrderForm: React.FC<FleetFormProps> = ({
  initialData,
  isEdit,
}) => {
  const { orderId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const title = !isEdit
    ? "Tinjau Pesanan"
    : initialData
    ? "Edit Pesanan"
    : "Tambah Pesanan";
  const description = !isEdit
    ? ""
    : initialData
    ? "Edit Pesanan"
    : "Tambah permintaan baru untuk pengemudi";
  const toastMessage = initialData
    ? "Pesanan berhasil diubah!"
    : "Pesanan berhasil dibuat";
  const action = initialData ? "Save changes" : "Create";
  const queryClient = useQueryClient();
  const { mutate: createOrder } = usePostOrder();
  const { mutate: editOrder } = useEditOrder(orderId as string);
  const [searchCustomerTerm, setSearchCustomerTerm] = useState("");
  const [searchFleetTerm, setSearchFleetTerm] = useState("");
  const [searchCustomerDebounce] = useDebounce(searchCustomerTerm, 500);
  const [searchFleetDebounce] = useDebounce(searchFleetTerm, 500);
  const days: number[] = Array.from({ length: 30 });
  const [detail, setDetail] = useState<DetailPrice | null>(null);
  const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
  const [openCustomerDetail, setOpenCustomerDetail] = useState<boolean>(false);
  const [openFleetDetail, setOpenFleetDetail] = useState<boolean>(false);
  const [openDriverDetail, setOpenDriverDetail] = useState<boolean>(false);
  const [showServicePrice, setShowServicePrice] = useState<boolean>(true);
  const [type, setType] = useState<string>("");
  const [schema, setSchema] = useState(() => generateSchema(showServicePrice));
  const {
    data: customers,
    fetchNextPage: fetchNextCustomers,
    hasNextPage: hasNextCustomers,
    isFetchingNextPage: isFetchingNextCustomers,
  } = useGetInfinityCustomers(searchCustomerDebounce);

  const {
    data: fleets,
    isFetching: isFetchingFleets,
    fetchNextPage: fetchNextFleets,
    hasNextPage: hasNextFleets,
    isFetchingNextPage: isFetchingNextFleets,
  } = useGetInfinityFleets(searchFleetDebounce);

  const { data: insurances } = useGetInsurances();

  const { isMinimized } = useSidebar();

  const defaultValues = initialData
    ? {
        start_request: {
          is_self_pickup: initialData?.start_request?.is_self_pickup,
          address: initialData?.start_request?.address,
          distance: initialData?.start_request?.distance,
          driver_id: initialData?.start_request?.driver?.id?.toString(),
        },
        end_request: {
          is_self_pickup: initialData?.end_request?.is_self_pickup,
          address: initialData?.end_request?.address,
          distance: initialData?.end_request?.distance,
          driver_id: initialData?.end_request?.driver?.id?.toString(),
        },
        customer: initialData?.customer?.id?.toString(),
        fleet: initialData?.fleet.id?.toString(),
        description: initialData?.description,
        is_with_driver: initialData?.is_with_driver,
        is_out_of_town: initialData?.is_out_of_town,
        date: initialData?.start_date,
        duration: initialData?.duration?.toString(),
        discount: initialData?.discount?.toString(),
        insurance_id: initialData?.insurance?.id.toString(),
        service_price: initialData?.service_price.toString(),
      }
    : {
        start_request: {
          is_self_pickup: false,
          address: "",
          distance: 0,
          driver_id: "",
        },
        end_request: {
          is_self_pickup: false,
          address: "",
          distance: 0,
          driver_id: "",
        },
        customer: "",
        fleet: "",
        description: "",
        is_with_driver: false,
        is_out_of_town: false,
        date: "",
        duration: "1",
        discount: "0",
        insurance_id: "",
        service_price: "",
      };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { data: customer, isFetching: isFetchingCustomer } =
    useGetDetailCustomer(form.getValues("customer"));
  const { data: fleet, isFetching: isFetchingFleet } = useGetDetailFleet(
    form.getValues("fleet"),
  );

  const { data: driver, isFetching: isFetchingDriver } = useGetDetailDriver(
    type == "start"
      ? form.getValues("start_request.driver_id")
      : form.getValues("end_request.driver_id"),
  );

  const [end, setEnd] = useState("");
  const now = dayjs(form.getValues("date"));
  useEffect(() => {
    const end = now
      .add(+form.getValues("duration"), "day")
      .locale("id")
      .format("HH:mm:ss - dddd, DD MMMM (YYYY)");
    setEnd(end);
  }, [now, form.getValues("duration")]);

  const onSubmit = async (data: OrderFormValues) => {
    setLoading(true);
    console.log("submit", data);

    if (initialData) {
      console.log("masuk sini");
      const payload = {
        start_request: {
          is_self_pickup: data.start_request.is_self_pickup,
          address: data.start_request.address,
          distance: +data.start_request.distance,
          driver_id: +data.start_request.driver_id,
        },
        end_request: {
          is_self_pickup: data.end_request.is_self_pickup,
          address: data.end_request.address,
          distance: +data.end_request.distance,
          driver_id: +data.end_request.driver_id,
        },
        customer_id: +data.customer,
        fleet_id: +data.fleet,
        description: "",
        is_with_driver: data.is_with_driver,
        is_out_of_town: data.is_out_of_town,
        date: data.date.toISOString(),
        duration: +data.duration,
        discount: +data.discount,
        insurance_id: +data.insurance_id,
        ...(showServicePrice &&
          data?.service_price && {
            service_price: +data.service_price.replace(/,/g, ""),
          }),
      };

      setLoading(false);

      editOrder(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          toast({
            variant: "success",
            title: toastMessage,
          });
          router.refresh();
          router.push(`/dashboard/orders`);
        },
        onSettled: () => {
          setLoading(false);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Uh oh! ada sesuatu yang error",
            //@ts-ignore
            description: `error: ${error?.response?.data?.message}`,
          });
        },
      });
    } else {
      console.log("sini", data);
      const payload = {
        start_request: {
          is_self_pickup: data.start_request.is_self_pickup,
          address: data.start_request.address,
          distance: +data.start_request.distance,
          driver_id: +data.start_request.driver_id,
        },
        end_request: {
          is_self_pickup: data.end_request.is_self_pickup,
          address: data.end_request.address,
          distance: +data.end_request.distance,
          driver_id: +data.end_request.driver_id,
        },
        customer_id: +data.customer,
        fleet_id: +data.fleet,
        description: "",
        is_with_driver: data.is_with_driver,
        is_out_of_town: data.is_out_of_town,
        date: data.date.toISOString(),
        duration: +data.duration,
        discount: +data.discount,
        insurance_id: +data.insurance_id,
        ...(showServicePrice &&
          data?.service_price && {
            service_price: +data.service_price.replace(/,/g, ""),
          }),
      };
      setLoading(false);

      createOrder(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          toast({
            variant: "success",
            title: toastMessage,
          });
          router.refresh();
          router.push(`/dashboard/orders`);
        },
        onSettled: () => {
          setLoading(false);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Uh oh! ada sesuatu yang error",
            //@ts-ignore
            description: `error: ${error?.response?.message}`,
          });
        },
      });
    }
  };

  const Option = AntdSelect;
  const handleScrollCustomers = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchNextCustomers();
    }
  };

  const handleScrollFleets = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchNextFleets();
    }
  };

  const pengambilan = [
    {
      name: "Diantar Penanggung Jawab",
      value: "diantar",
    },

    {
      name: "Pelanggan Ambil Sendiri",
      value: "sendiri",
    },
  ];

  const pengembalian = [
    {
      name: "Dijemput Penanggung Jawab",
      value: "diantar",
    },

    {
      name: "Pelanggan Kembalikan Sendiri",
      value: "sendiri",
    },
  ];

  const { mutate: calculatePrice } = useOrderCalculate();

  const watchedFields = form.watch([
    "customer",
    "fleet",
    "date",
    "duration",
    "is_out_of_town",
    "is_with_driver",
    "insurance_id",
    "start_request.is_self_pickup",
    "start_request.driver_id",
    "start_request.distance",
    "start_request.address",
    "end_request.is_self_pickup",
    "end_request.driver_id",
    "end_request.distance",
    "end_request.address",
    "discount",
    "description", // description is optional,
  ]);
  const watchServicePrice = !(watchedFields[7] && watchedFields[11]);
  const servicePrice = +(form.watch("service_price") ?? 0);

  console.log("service", servicePrice);
  useEffect(() => {
    if (watchedFields[7] && watchedFields[11]) {
      setSchema(generateSchema(false));
      setShowServicePrice(false);
    } else {
      setSchema(generateSchema(true));
      setShowServicePrice(true);
    }
  }, [watchedFields[7], watchedFields[11]]);

  const allFieldsFilled = watchedFields.slice(0, 15).every((field) => {
    if (typeof field === "boolean") {
      return true; // Booleans are always considered filled
    }
    // if (typeof field === "number") {
    //   return field !== 0; // Numbers should not be zero
    // }
    return field !== undefined && field !== null && field !== ""; // For strings and other types
  });

  useEffect(() => {
    console.log("service payload", servicePrice);
    console.log("allFieldsFilled", watchedFields);

    const payload = {
      customer_id: +(watchedFields[0] ?? 0),
      fleet_id: +(watchedFields[1] ?? 0),
      date: watchedFields[2],
      duration: +(watchedFields[3] ?? 1),
      is_out_of_town: watchedFields[4],
      is_with_driver: watchedFields[5],
      insurance_id: +(watchedFields[6] ?? 1),
      start_request: {
        is_self_pickup: watchedFields[7],
        driver_id: +(watchedFields[8] ?? 0),
        distance: +(watchedFields[9] ?? 0),
        address: watchedFields[10],
      },
      end_request: {
        is_self_pickup: watchedFields[11],
        driver_id: +(watchedFields[12] ?? 0),
        distance: +(watchedFields[13] ?? 0),
        address: watchedFields[14],
      },
      description: watchedFields[16],
      discount: +(watchedFields[15] ?? 0),
      ...(watchServicePrice && {
        service_price: isEdit
          ? isString(form.watch("service_price"))
            ? parseInt((form.watch("service_price") ?? "0").replace(/,/g, ""))
            : servicePrice
          : servicePrice,
      }),
    };

    console.log("pay", payload);
    if (allFieldsFilled || !isEdit) {
      // const payload = {
      //   customer_id: +(watchedFields[0] ?? 0),
      //   fleet_id: +(watchedFields[1] ?? 0),
      //   date: watchedFields[2],
      //   duration: +(watchedFields[3] ?? 1),
      //   is_out_of_town: watchedFields[4],
      //   is_with_driver: watchedFields[5],
      //   insurance_id: +(watchedFields[6] ?? 1),
      //   start_request: {
      //     is_self_pickup: watchedFields[7],
      //     driver_id: +(watchedFields[8] ?? 0),
      //     distance: +(watchedFields[9] ?? 0),
      //     address: watchedFields[10],
      //   },
      //   end_request: {
      //     is_self_pickup: watchedFields[11],
      //     driver_id: +(watchedFields[12] ?? 0),
      //     distance: +(watchedFields[13] ?? 0),
      //     address: watchedFields[14],
      //   },
      //   description: watchedFields[16],
      //   discount: +(watchedFields[15] ?? 0),
      //   ...(watchServicePrice && { service_price: +servicePrice }),
      // };

      calculatePrice(payload, {
        onSuccess: (data) => {
          setDetail(data.data);
        },
      });
    }
  }, [...watchedFields, showServicePrice, servicePrice]);

  const disabledDate = (current: Dayjs | null): boolean => {
    return current ? current < dayjs().startOf("day") : false;
  };

  return (
    <>
      {openApprovalModal && (
        <ApprovalModal
          isOpen={openApprovalModal}
          onClose={() => setOpenApprovalModal(false)}
          onConfirm={form.handleSubmit(onSubmit)}
          loading={loading}
        />
      )}
      <div
        className={cn(
          "flex items-center justify-between space-y-8",
          isMinimized ? "w-[936px]" : "w-[700px]",
        )}
        id="header"
      >
        <Heading title={title} description={description} />
        {initialData?.request_status === "pending" && !isEdit && (
          <div className="flex gap-2">
            <Button
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-black",
              )}
            >
              Edit Pesanan
            </Button>

            <div className="bg-red-50 text-red-500 text-xs font-medium flex items-center justify-center px-[10px] py-1 rounded-full">
              belum kembali
            </div>
          </div>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="flex " id="parent">
            <div className={cn("space-y-8 pr-5 border-r border-neutral-400")}>
              <Tabs
                defaultValue={
                  defaultValues.is_with_driver ? "dengan_supir" : "lepas_kunci"
                }
                className="w-[235px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    disabled={!isEdit || loading}
                    value="lepas_kunci"
                    onClick={() => form.setValue("is_with_driver", false)}
                  >
                    Lepas Kunci
                  </TabsTrigger>
                  <TabsTrigger
                    disabled={!isEdit || loading}
                    value="dengan_supir"
                    onClick={() => form.setValue("is_with_driver", true)}
                  >
                    Dengan Supir
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div
                className={cn(
                  "grid grid-cols-2 gap-[10px]",
                  isMinimized
                    ? "min-[1920px]:w-[1176px] w-[936px]"
                    : "min-[1920px]:w-[940px] w-[700px]",
                )}
              >
                <div className="flex  items-end w-[940]">
                  {isEdit ? (
                    <FormField
                      name="customer"
                      control={form.control}
                      render={({ field }) => (
                        <Space size={12} direction="vertical">
                          <FormLabel className="relative label-required">
                            Pelanggan
                          </FormLabel>
                          <FormControl>
                            <AntdSelect
                              showSearch
                              value={field.value}
                              placeholder="Pilih Customer"
                              style={{
                                width: `${isMinimized ? "385px" : "267px"}`,
                                height: "40px",
                                marginRight: "8px",
                              }}
                              onSearch={setSearchCustomerTerm}
                              onChange={field.onChange}
                              onPopupScroll={handleScrollCustomers}
                              filterOption={false}
                              notFoundContent={
                                isFetchingNextCustomers ? (
                                  <p className="px-3 text-sm">loading</p>
                                ) : null
                              }
                            >
                              {isEdit && (
                                <Option
                                  value={initialData?.customer?.id?.toString()}
                                >
                                  {initialData?.customer?.name}
                                </Option>
                              )}
                              {customers?.pages.map(
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

                              {isFetchingNextCustomers && (
                                <Option disabled>
                                  <p className="px-3 text-sm">loading</p>
                                </Option>
                              )}
                            </AntdSelect>
                          </FormControl>
                          <FormMessage />
                        </Space>
                      )}
                    />
                  ) : (
                    <FormItem className="mr-2">
                      <FormLabel>Pelanggan</FormLabel>
                      <FormControl className="disabled:opacity-100">
                        <Input
                          style={{
                            width: `${isMinimized ? "385px" : "267px"}`,
                            height: "40px",
                          }}
                          disabled={!isEdit || loading}
                          value={initialData?.customer?.name ?? "-"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  <Button
                    className={cn(
                      buttonVariants({ variant: "main" }),
                      "w-[65px] h-[40px]",
                    )}
                    disabled={
                      !form.getFieldState("customer").isDirty &&
                      isEmpty(form.getValues("customer"))
                    }
                    type="button"
                    onClick={() => {
                      setOpenCustomerDetail(true);
                      setOpenFleetDetail(false);
                      setOpenDriverDetail(false);
                    }}
                  >
                    Lihat
                  </Button>
                </div>
                <div className="flex items-end">
                  {isEdit ? (
                    <FormField
                      name="fleet"
                      control={form.control}
                      render={({ field }) => (
                        <Space size={12} direction="vertical">
                          <FormLabel className="relative label-required">
                            Armada
                          </FormLabel>
                          <FormControl>
                            <AntdSelect
                              showSearch
                              value={field.value}
                              placeholder="Pilih Armada"
                              style={{
                                width: `${isMinimized ? "385px" : "267px"}`,
                                height: "40px",
                                marginRight: "8px",
                              }}
                              onSearch={setSearchFleetTerm}
                              onChange={field.onChange}
                              onPopupScroll={handleScrollFleets}
                              filterOption={false}
                              notFoundContent={
                                isFetchingNextFleets ? (
                                  <p className="px-3 text-sm">loading</p>
                                ) : null
                              }
                            >
                              {isEdit && (
                                <Option
                                  value={initialData?.fleet?.id?.toString()}
                                >
                                  {initialData?.fleet?.name}
                                </Option>
                              )}
                              {fleets?.pages.map((page: any, pageIndex: any) =>
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
                          <FormMessage />
                        </Space>
                      )}
                    />
                  ) : (
                    <FormItem className="mr-2">
                      <FormLabel>Armada</FormLabel>
                      <FormControl className="disabled:opacity-100">
                        <Input
                          style={{
                            width: `${isMinimized ? "385px" : "267px"}`,
                            height: "40px",
                          }}
                          disabled={!isEdit || loading}
                          value={initialData?.fleet?.name ?? "-"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  <Button
                    className={cn(
                      buttonVariants({ variant: "main" }),
                      "w-[65px] h-[40px]",
                    )}
                    disabled={
                      !form.getFieldState("fleet").isDirty &&
                      isEmpty(form.getValues("fleet"))
                    }
                    type="button"
                    onClick={() => {
                      setOpenFleetDetail(true);
                      setOpenCustomerDetail(false);
                      setOpenDriverDetail(false);
                    }}
                  >
                    Lihat
                  </Button>
                </div>
              </div>
              <div
                className={cn(
                  "gap-5",
                  isMinimized
                    ? "w-[936px] grid grid-cols-3"
                    : "w-[700px] flex flex-wrap",
                )}
              >
                {isEdit ? (
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <ConfigProvider locale={locale}>
                        <Space size={12} direction="vertical">
                          <FormLabel className="relative label-required">
                            Tanggal Sewa
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              disabledDate={disabledDate}
                              disabled={loading}
                              style={{
                                width: `${!isMinimized ? "340px" : "100%"}`,
                              }}
                              height={40}
                              id="testing"
                              className="p"
                              onChange={field.onChange} // send value to hook form
                              onBlur={field.onBlur} // notify when input is touched/blur
                              value={
                                field.value
                                  ? dayjs(field.value).locale("id")
                                  : undefined
                              }
                              format={"HH:mm:ss - dddd, DD MMMM (YYYY)"}
                              showTime
                            />
                          </FormControl>
                          <FormMessage />
                        </Space>
                      </ConfigProvider>
                    )}
                  />
                ) : (
                  <FormItem>
                    <FormLabel>Tanggal Sewa</FormLabel>
                    <FormControl className="disabled:opacity-100">
                      <Input
                        style={{
                          width: `${!isMinimized ? "340px" : "100%"}`,
                          height: "40px",
                        }}
                        disabled={!isEdit || loading}
                        value={
                          dayjs(initialData?.start_date)
                            .locale("id")
                            .format("HH:mm:ss - dddd, DD MMMM (YYYY)") ?? "-"
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="relative label-required">
                        Lama Hari
                      </FormLabel>
                      <Select
                        disabled={!isEdit || loading}
                        onValueChange={field.onChange}
                        defaultValue={defaultValues.duration}
                      >
                        <FormControl
                          className={cn(
                            "disabled:opacity-100",
                            !isMinimized ? "w-[340px]" : "w-full",
                          )}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="asdf" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="h-36">
                          {/* @ts-ignore  */}
                          {days.map((_, index) => (
                            <SelectItem
                              key={index}
                              value={(index + 1).toString()}
                            >
                              {index + 1} hari
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="flex flex-col">
                  <FormLabel>Selesai sewa (otomatis)</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(!isMinimized ? "w-[700px]" : "w-full")}
                      placeholder="Tanggal dan waktu selesai"
                      value={end == "Invalid Date" ? "" : end}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              <div
                className={cn(
                  "grid grid-cols-2 gap-5",
                  isMinimized ? "w-[936px]" : "w-[700px]",
                )}
              >
                <FormField
                  control={form.control}
                  name="is_out_of_town"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col justify-between">
                        <FormLabel className="relative label-required">
                          Pemakaian
                        </FormLabel>
                        <FormControl>
                          <Tabs
                            defaultValue={
                              field.value == false ? "dalam_kota" : "luar_kota"
                            }
                          >
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger
                                disabled={!isEdit || loading}
                                value="dalam_kota"
                                onClick={() =>
                                  form.setValue("is_out_of_town", false)
                                }
                              >
                                Dalam Kota
                              </TabsTrigger>
                              <TabsTrigger
                                disabled={!isEdit || loading}
                                value="luar_kota"
                                onClick={() =>
                                  form.setValue("is_out_of_town", true)
                                }
                              >
                                Luar Kota
                              </TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="insurance_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="relative label-required">
                        Asuransi
                      </FormLabel>
                      <Select
                        disabled={!isEdit || loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl className="disabled:opacity-100">
                          <SelectTrigger>
                            <SelectValue defaultValue="1" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* @ts-ignore  */}
                          {insurances?.data?.items.map((insurance) => (
                            <SelectItem
                              key={insurance.id}
                              value={insurance.id.toString()}
                            >
                              {insurance.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator
                className={cn("mt-1", isMinimized ? "w-[936px]" : "w-[700px]")}
              />
              <DetailSection
                title="Detail Pengambilan"
                form={form}
                initialData={initialData}
                defaultValues={defaultValues}
                loading={loading}
                isEdit={isEdit}
                lists={pengambilan}
                type="start"
                handleButton={() => {
                  setOpenCustomerDetail(false);
                  setOpenFleetDetail(false);
                  setOpenDriverDetail(true);
                  setType("start");
                }}
              />
              <DetailSection
                title="Detail Pengembilan"
                form={form}
                initialData={initialData}
                defaultValues={defaultValues}
                loading={loading}
                isEdit={isEdit}
                lists={pengembalian}
                type="end"
                handleButton={() => {
                  setOpenCustomerDetail(false);
                  setOpenFleetDetail(false);
                  setOpenDriverDetail(true);
                  setType("end");
                }}
              />
              <div
                className={cn(
                  "space-y-8",
                  isMinimized ? "w-[936px]" : "w-[700px]",
                )}
              >
                {showServicePrice && (
                  <FormField
                    name="service_price"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="relative label-required">
                          Harga Layanan
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 z-10 -translate-y-1/2 ">
                              Rp.
                            </span>
                            <NumericFormat
                              disabled={!isEdit || loading}
                              customInput={Input}
                              type="text"
                              className="pl-9 disabled:opacity-90"
                              allowLeadingZeros
                              thousandSeparator=","
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {!isEdit ? (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <p
                      className="border border-gray-200 rounded-md px-3 py-1 break-words"
                      dangerouslySetInnerHTML={{
                        __html: !isEmpty(defaultValues?.description)
                          ? makeUrlsClickable(
                              defaultValues?.description.replace(
                                /\n/g,
                                "<br />",
                              ),
                            )
                          : "-",
                      }}
                    />
                  </FormItem>
                ) : (
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl className="disabled:opacity-100">
                          <Textarea
                            id="alamat"
                            placeholder="Masukkan Deskripsi pesanan anda di sini..."
                            className="col-span-3"
                            rows={3}
                            disabled={!isEdit || loading}
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            {/* sidebar */}

            {openCustomerDetail && isFetchingCustomer && (
              <div className="flex justify-center items-center h-[100px] w-[400px]">
                <Spinner />
              </div>
            )}
            {openCustomerDetail && !isFetchingCustomer && (
              <CustomerDetail
                data={customer?.data}
                onClose={() => setOpenCustomerDetail(false)}
              />
            )}
            {openFleetDetail && isFetchingFleet && (
              <div className="flex justify-center items-center h-[100px] w-[400px]">
                <Spinner />
              </div>
            )}

            {openFleetDetail && !isFetchingFleet && (
              <FleetDetail
                data={fleet?.data}
                onClose={() => setOpenFleetDetail(false)}
              />
            )}

            {openDriverDetail && isFetchingDriver && (
              <div className="flex justify-center items-center h-[100px] w-[400px]">
                <Spinner />
              </div>
            )}

            {openDriverDetail && !isFetchingDriver && (
              <DriverDetail
                data={driver?.data}
                onClose={() => setOpenDriverDetail(false)}
              />
            )}

            {!openCustomerDetail && !openFleetDetail && !openDriverDetail && (
              <PriceDetail
                isEdit={isEdit ?? false}
                disabledButton={loading || !allFieldsFilled}
                showServicePrice={showServicePrice}
                form={form}
                detail={detail}
                handleOpenApprovalModal={() => setOpenApprovalModal(true)}
              />
            )}
          </div>
        </form>
      </Form>
    </>
  );
};

interface List {
  name: string;
  value: string;
}

interface DetailSectionProps {
  title: string;
  form: any;
  isEdit?: boolean | null;
  initialData: any;
  defaultValues: any;
  loading: boolean;
  lists: List[];
  type: "start" | "end";
  handleButton: () => void;
}

const DetailSection: React.FC<DetailSectionProps> = ({
  title,
  form,
  isEdit,
  initialData,
  defaultValues,
  loading,
  lists,
  type,
  handleButton,
}) => {
  const [searchDriverTerm, setSearchDriverTerm] = useState("");
  const [searchDriverDebounce] = useDebounce(searchDriverTerm, 500);
  const { isMinimized } = useSidebar();
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const {
    data: drivers,
    fetchNextPage: fetchNextDrivers,
    hasNextPage: hasNextDrivers,
    isFetchingNextPage: isFetchingNextDrivers,
  } = useGetInfinityDrivers(searchDriverDebounce);

  const handleScrollDrivers = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchNextDrivers();
    }
  };

  const watchedFields = form.watch([
    "start_request.is_self_pickup",
    "start_request.driver_id",
    "start_request.distance",
    "start_request.address",
    "end_request.is_self_pickup",
    "end_request.driver_id",
    "end_request.distance",
    "end_request.address",
  ]);

  const Option = AntdSelect;
  useEffect(() => {
    if (switchValue) {
      form.setValue("end_request.is_self_pickup", watchedFields[0]);
      form.setValue("end_request.driver_id", watchedFields[1]);
      form.setValue("end_request.distance", watchedFields[2]);
      form.setValue("end_request.address", watchedFields[3]);
    }
  }, [...watchedFields, switchValue]);

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between">
          <h3 className="mb-4">{title}</h3>
          {type === "end" && !initialData?.request_status && (
            <div className="flex gap-2">
              <Label htmlFor="same-field" className="font-normal text-sm">
                Samakan data seperti pengambilan
              </Label>
              <Switch
                id="same-field"
                checked={switchValue}
                onCheckedChange={() => setSwitchValue(!switchValue)}
              />
            </div>
          )}
        </div>
        <div className={cn("gap-5", isMinimized ? "w-[936px]" : "w-[700px]")}>
          <FormField
            control={form.control}
            name={`${type}_request.is_self_pickup`}
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel className="relative label-required">
                    Layanan
                  </FormLabel>
                  <FormControl>
                    <Tabs
                      defaultValue={
                        field.value == false ? "diantar" : "sendiri"
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        {lists.map((list, index) => {
                          return (
                            <TabsTrigger
                              disabled={!isEdit || loading}
                              key={index}
                              value={list.value}
                              onClick={() => {
                                form.setValue(
                                  `${type}_request.is_self_pickup`,
                                  list.value == "diantar" ? false : true,
                                );
                              }}
                            >
                              {list.name}
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div
          className={cn("flex gap-5", isMinimized ? "w-[936px]" : "w-[700px]")}
        >
          <div className="flex gap-2 items-end">
            {isEdit ? (
              <FormField
                name={`${type}_request.driver_id`}
                control={form.control}
                render={({ field }) => (
                  <Space size={12} direction="vertical">
                    <FormLabel className="relative label-required">
                      Penanggung Jawab
                    </FormLabel>
                    <FormControl>
                      <AntdSelect
                        showSearch
                        value={field.value}
                        placeholder="Pilih Penanggung Jawab"
                        style={{
                          width: `${isMinimized ? "385px" : "267px"}`,
                          height: "40px",
                        }}
                        onSearch={setSearchDriverTerm}
                        onChange={field.onChange}
                        onPopupScroll={handleScrollDrivers}
                        filterOption={false}
                        notFoundContent={
                          isFetchingNextDrivers ? (
                            <p className="px-3 text-sm">loading</p>
                          ) : null
                        }
                      >
                        {isEdit && (
                          <Option
                            value={
                              type === "start"
                                ? initialData?.start_request?.driver?.id?.toString()
                                : initialData?.end_request?.driver?.id?.toString()
                            }
                          >
                            {type === "start"
                              ? initialData?.start_request?.driver?.name
                              : initialData?.end_request?.driver?.name}
                          </Option>
                        )}
                        {drivers?.pages.map((page: any, pageIndex: any) =>
                          page.data.items.map((item: any, itemIndex: any) => {
                            return (
                              <Option key={item.id} value={item.id.toString()}>
                                {item.name}
                              </Option>
                            );
                          }),
                        )}

                        {isFetchingNextDrivers && (
                          <Option disabled>
                            <p className="px-3 text-sm">loading</p>
                          </Option>
                        )}
                      </AntdSelect>
                    </FormControl>
                    <FormMessage />
                  </Space>
                )}
              />
            ) : (
              <FormItem className="mr-2">
                <FormLabel>Penanggung Jawab</FormLabel>
                <FormControl className="disabled:opacity-100">
                  <Input
                    style={{
                      width: `${isMinimized ? "385px" : "267px"}`,
                      height: "40px",
                    }}
                    disabled={!isEdit || loading}
                    value={
                      type === "start"
                        ? initialData?.start_request?.driver?.name
                        : initialData?.end_request?.driver?.name
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            <Button
              className={cn(
                buttonVariants({ variant: "main" }),
                "max-w-[65px] h-[40px]",
              )}
              disabled={
                !form.getFieldState(`${type}_request.driver_id`).isDirty &&
                isEmpty(form.getValues(`${type}_request.driver_id`))
              }
              type="button"
              onClick={handleButton}
            >
              Lihat
            </Button>
          </div>
          <div className={cn("flex gap-2 items-end")}>
            <FormField
              name={`${type}_request.distance`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="relative label-required">
                    Jarak
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEdit || loading}
                      type="number"
                      placeholder="Tanggal dan waktu selesai"
                      className={`h-[40px] ${
                        isMinimized ? "w-[458px]" : "w-[340px]"
                      } `}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className={cn(isMinimized ? "w-[936px]" : "w-[700px]")}>
          {!isEdit ? (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <p
                className="border border-gray-200 rounded-md px-3 py-1 break-words"
                dangerouslySetInnerHTML={{
                  __html: !isEmpty(
                    type === "start"
                      ? defaultValues?.start_request?.address
                      : defaultValues?.end_request?.address,
                  )
                    ? makeUrlsClickable(
                        type === "start"
                          ? defaultValues?.start_request?.address.replace(
                              /\n/g,
                              "<br />",
                            )
                          : defaultValues?.end_request?.address.replace(
                              /\n/g,
                              "<br />",
                            ),
                      )
                    : "-",
                }}
              />
            </FormItem>
          ) : (
            <FormField
              control={form.control}
              name={`${type}_request.address`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="relative label-required">
                    Alamat
                  </FormLabel>
                  <FormControl className="disabled:opacity-100">
                    <Textarea
                      id="alamat"
                      placeholder="Masukkan Alamat..."
                      className="col-span-3"
                      rows={3}
                      disabled={!isEdit || loading}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
      <Separator
        className={cn("mt-1", isMinimized ? "w-[936px]" : "w-[700px]")}
      />
    </>
  );
};

export const Carousel = ({ images }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="relative w-full  h-[300px] overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full flex transition-transform duration-300"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.length === 0 && <p>Driver Tidak memilik foto</p>}
        {images.map((image: any, index: any) => (
          <div key={index} className="w-full h-[300px] flex-shrink-0">
            <img
              src={image.photo}
              alt={`Slide ${index}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <Button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2"
            type="button"
          >
            {"<"}
          </Button>
          <Button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2"
            type="button"
          >
            {">"}
          </Button>
        </>
      )}
    </div>
  );
};
