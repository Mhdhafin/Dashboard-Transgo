"use client";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter, usePathname } from "next/navigation";
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
import { useGetDetailFleet, useGetInfinityFleets } from "@/hooks/api/useFleet";
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
  useAcceptOrder,
  useEditOrder,
  useOrderCalculate,
  usePostOrder,
  useRejectOrder,
} from "@/hooks/api/useOrder";
import { ApprovalModal } from "../modal/approval-modal";
import { NumericFormat } from "react-number-format";
import "dayjs/locale/id";
import FleetDetail from "./section/fleet-detail";
import CustomerDetail from "./section/customer-detail";
import DriverDetail from "./section/driver-detail";
import PriceDetail from "./section/price-detail";
import Spinner from "../spinner";
import { RejectModal } from "../modal/reject-modal";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { PreviewImage } from "../modal/preview-image";

export const IMG_MAX_LIMIT = 3;
const formSchema = z.object({
  start_request: z.object({
    is_self_pickup: z.any(),
    // address: z.string().min(1, { message: "Tolong masukkan alamat" }),
    // distance: z.coerce.number().gte(0, "Jarak minimal 0 KM"),
    driver_id: z.string().min(1, { message: "Tolong pilih Penanggung Jawab" }),
  }),
  end_request: z.object({
    is_self_pickup: z.any(),
    // address: z.string().min(1, { message: "Tolong masukkan alamat" }),
    // distance: z.coerce.number().gte(0, "Jarak minimal 0 KM"),
    driver_id: z.string().min(1, { message: "Tolong pilih Penanggung Jawab" }),
  }),
  customer: z.string().min(1, { message: "Tolong pilih pelanggan" }),
  fleet: z.string().min(1, { message: "Tolong pilih armada" }),
  description: z.string().optional().nullable(),
  is_with_driver: z.any(),
  is_out_of_town: z.any(),
  // imgUrl: z.array(ImgSchema),
  date: z.coerce.date({ required_error: "Tolong masukkan Waktu" }),
  duration: z.coerce.string().min(1, { message: "tolong masukkan durasi" }),
  discount: z.coerce.string().min(1, { message: "tolong masukkan diskon" }),
  insurance_id: z.string().min(1, { message: "tolong pilih asuransi" }),
});

const generateSchema = (startSelfPickUp?: boolean, endSelfPickup?: boolean) => {
  let schema = formSchema;

  if (!startSelfPickUp) {
    console.log("start");

    schema = schema.extend({
      service_price: z.coerce
        .string()
        .min(1, { message: "tolong masukkan harga layanan" }),

      start_request: schema.shape.start_request.extend({
        address: z.string().min(1, { message: "Tolong masukkan alamat" }),
        distance: z.coerce.number().gte(0, "Jarak minimal 0 KM"),
      }),
    });
  }

  if (!endSelfPickup) {
    console.log("end");

    schema = schema.extend({
      service_price: z.coerce
        .string()
        .min(1, { message: "tolong masukkan harga layanan" }),

      end_request: schema.shape.end_request.extend({
        address: z.string().min(1, { message: "Tolong masukkan alamat" }),
        distance: z.coerce.number().gte(0, "Jarak minimal 0 KM"),
      }),
    });
  }

  return schema;
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
  service_price: string;
  start_request: {
    distance: number;
    address: string;
  };
  end_request: {
    distance: number;
    address: string;
  };
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

type Messages = {
  [key in keyof OrderFormValues]?: string;
} & {
  start_request?: {
    [key in keyof OrderFormValues["start_request"]]?: string | undefined;
  };
  end_request?: {
    [key in keyof OrderFormValues["end_request"]]?: string | undefined;
  };
};

export const OrderForm: React.FC<FleetFormProps> = ({
  initialData,
  isEdit,
}) => {
  const { orderId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const pathname = usePathname();
  const splitPath = pathname.split("/");
  const lastPath = splitPath[splitPath.length - 1];

  const title =
    lastPath === "preview"
      ? "Tinjau Pesanan"
      : lastPath === "edit"
      ? "Edit Pesanan"
      : lastPath === "detail"
      ? "Detail Pesanan"
      : "Tambah Pesanan";
  const description =
    lastPath === "preview"
      ? "Tinjau permintaan baru untuk pengemudi"
      : lastPath === "edit"
      ? "Edit permintaan baru untuk pengemudi"
      : lastPath === "detail"
      ? ""
      : "Tambah permintaan baru untuk pengemudi";
  const toastMessage = initialData
    ? "Pesanan berhasil diubah!"
    : "Pesanan berhasil dibuat";
  const action = initialData ? "Save changes" : "Create";
  const queryClient = useQueryClient();
  const { mutate: createOrder } = usePostOrder();
  const { mutate: editOrder } = useEditOrder(orderId as string);
  const { mutate: acceptOrder } = useAcceptOrder(orderId as string);

  const { mutate: rejectOrder } = useRejectOrder();
  const [searchCustomerTerm, setSearchCustomerTerm] = useState("");
  const [searchFleetTerm, setSearchFleetTerm] = useState("");
  const [searchCustomerDebounce] = useDebounce(searchCustomerTerm, 500);
  const [searchFleetDebounce] = useDebounce(searchFleetTerm, 500);
  const days: number[] = Array.from({ length: 30 });
  const [detail, setDetail] = useState<DetailPrice | null>(null);
  const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const [openCustomerDetail, setOpenCustomerDetail] = useState<boolean>(false);
  const [openFleetDetail, setOpenFleetDetail] = useState<boolean>(false);
  const [openDriverDetail, setOpenDriverDetail] = useState<boolean>(false);
  const [showServicePrice, setShowServicePrice] = useState<boolean>(true);
  const [type, setType] = useState<string>("");
  const [schema, setSchema] = useState(() => generateSchema(true, true));
  const [messages, setMessages] = useState<any>({});

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
  console.log(initialData);
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
        fleet: initialData?.fleet?.id?.toString(),
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
          is_self_pickup: true,
          address: "",
          distance: 0,
          driver_id: "",
        },
        end_request: {
          is_self_pickup: true,
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
        insurance_id: "0",
        service_price: "",
      };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const customerField = form.watch("customer");
  const fleetField = form.watch("fleet");
  const dateField = form.watch("date");
  const durationField = form.watch("duration");
  const isOutOfTownField = form.watch("is_out_of_town");
  const isWithDriverField = form.watch("is_with_driver");
  const insuranceField = form.watch("insurance_id");
  const startSelfPickUpField = form.watch("start_request.is_self_pickup");
  const startDriverField = form.watch("start_request.driver_id");
  const startDistanceField = form.watch("start_request.distance");
  const startAddressField = form.watch("start_request.address");
  const endSelfPickUpField = form.watch("end_request.is_self_pickup");
  const endDriverField = form.watch("end_request.driver_id");
  const endDistanceField = form.watch("end_request.distance");
  const endAddressField = form.watch("end_request.address");
  const discountField = form.watch("discount");
  const descriptionField = form.watch("description");
  const serviceField = form.watch("service_price");

  const watchServicePrice = !(startSelfPickUpField && endSelfPickUpField);
  const servicePrice = serviceField ?? 0;

  const { data: customerData, isFetching: isFetchingCustomer } =
    useGetDetailCustomer(form.getValues("customer"));
  const { data: fleetData, isFetching: isFetchingFleet } = useGetDetailFleet(
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

    const createPayload = (data: OrderFormValues) => ({
      start_request: {
        is_self_pickup: data.start_request.is_self_pickup,
        driver_id: +data.start_request.driver_id,
        ...(!startSelfPickUpField && {
          address: data.start_request.address,
          distance: +data.start_request.distance,
        }),
      },
      end_request: {
        is_self_pickup: data.end_request.is_self_pickup,
        driver_id: +data.end_request.driver_id,
        ...(!endSelfPickUpField && {
          distance: +data.end_request.distance,
          address: data.end_request.address,
        }),
      },
      customer_id: +data.customer,
      fleet_id: +data.fleet,
      description: "",
      is_with_driver: data.is_with_driver,
      is_out_of_town: data.is_out_of_town,
      date: data.date.toISOString(),
      duration: +data.duration,
      discount: +data.discount,
      insurance_id: +data.insurance_id === 0 ? null : +data.insurance_id,
      ...(showServicePrice &&
        data?.service_price && {
          service_price: +data.service_price.replace(/,/g, ""),
        }),
    });

    const handleSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        variant: "success",
        title: toastMessage,
      });
      // router.refresh();
      router.push(`/dashboard/orders`);
    };

    const handleError = (error: any) => {
      setOpenApprovalModal(false);
      toast({
        variant: "destructive",
        title: "Uh oh! ada sesuatu yang error",
        //@ts-ignore
        description: `error: ${error?.response?.data?.message}`,
      });
    };

    const handleResponse = (payload: any, action: Function) => {
      setLoading(true);
      action(payload, {
        onSuccess: handleSuccess,
        onSettled: () => setLoading(false),
        onError: handleError,
      });
    };

    const payload = createPayload(data);

    switch (lastPath) {
      case "edit":
        handleResponse(payload, editOrder);
        break;
      case "preview":
        handleResponse(payload, acceptOrder);
        break;
      default:
        handleResponse(payload, createOrder);
        break;
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
      name: "Pelanggan Ambil Sendiri",
      value: "1",
    },
    {
      name: "Diantar Penanggung Jawab",
      value: "0",
    },
  ];

  const pengembalian = [
    {
      name: "Pelanggan Kembalikan Sendiri",
      value: "1",
    },
    {
      name: "Dijemput Penanggung Jawab",
      value: "0",
    },
  ];

  const { mutate: calculatePrice } = useOrderCalculate();

  useEffect(() => {
    if (startSelfPickUpField && endSelfPickUpField) {
      // Jika start_request.is_self_pickup dan end_request.is_self_pickup keduanya true
      setSchema(generateSchema(true, true));
      setShowServicePrice(false);
    } else if (startSelfPickUpField) {
      // Jika hanya start_request.is_self_pickup yang true
      setSchema(generateSchema(true, false));
      setShowServicePrice(true);
    } else if (endSelfPickUpField) {
      // Jika hanya end_request.is_self_pickup yang true
      setSchema(generateSchema(false, true));
      setShowServicePrice(true);
    } else {
      // Jika keduanya false
      setSchema(generateSchema(false, false));
      setShowServicePrice(true);
    }
  }, [startSelfPickUpField, endSelfPickUpField]);

  useEffect(() => {
    const payload = {
      customer_id: +(customerField ?? 0),
      fleet_id: +(fleetField ?? 0),
      is_out_of_town: isOutOfTownField,
      is_with_driver: isWithDriverField,
      insurance_id: +(insuranceField ?? 0),
      start_request: {
        is_self_pickup: startSelfPickUpField,
        driver_id: +(startDriverField ?? 0),
        ...(!startSelfPickUpField && {
          distance: +(startDistanceField ?? 0),
          address: startAddressField,
        }),
      },
      end_request: {
        is_self_pickup: endSelfPickUpField,
        driver_id: +(endDriverField ?? 0),
        ...(!endSelfPickUpField && {
          distance: +(endDistanceField ?? 0),
          address: endAddressField,
        }),
      },
      description: descriptionField,
      ...(!isEmpty(dateField) && {
        date: dateField,
        duration: +(durationField ?? 1),
      }),
      discount: +(discountField ?? 0),
      ...(watchServicePrice && {
        service_price: isString(serviceField)
          ? +serviceField.replace(/,/g, "")
          : serviceField,
      }),
    };

    console.log("pay", payload);
    if (fleetField) {
      calculatePrice(payload, {
        onSuccess: (data) => {
          setDetail(data.data);
        },
      });
    }
  }, [
    customerField,
    fleetField,
    dateField,
    durationField,
    isOutOfTownField,
    isWithDriverField,
    insuranceField,
    startSelfPickUpField,
    startDriverField,
    startDistanceField,
    startAddressField,
    endSelfPickUpField,
    endDriverField,
    endDistanceField,
    endAddressField,
    discountField,
    descriptionField,
    showServicePrice,
    servicePrice,
  ]);

  // disable date for past dates
  const disabledDate = (current: Dayjs | null): boolean => {
    return current ? current < dayjs().startOf("day") : false;
  };

  // function for handle reject
  const handleRejectOrder = (reason: string) => {
    setRejectLoading(true);
    rejectOrder(
      { orderId, reason },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          toast({
            variant: "success",
            title: "berhasil ditolak",
          });
          setOpenRejectModal(false);
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
      },
    );
  };

  const handleReset = () => {
    form.reset();
  };

  const errors = form.formState.errors;
  useEffect(() => {
    if (!isEmpty(errors)) {
      toast({
        variant: "destructive",
        title: "Harap isi semua field yang wajib diisi sebelum konfirmasi",
      });

      setOpenApprovalModal(false);
    }
  }, [errors]);

  const generateMessage = (currentValue: any, defaultValue: any) =>
    currentValue !== defaultValue ? "Data telah diubah" : "";

  useEffect(() => {
    const newMessages = {
      customer: generateMessage(customerField, defaultValues.customer),
      fleet: generateMessage(fleetField, defaultValues.fleet),
      date: generateMessage(dateField, defaultValues.date),
      duration: generateMessage(durationField, defaultValues.duration),
      is_out_of_town: generateMessage(
        isOutOfTownField,
        defaultValues.is_out_of_town,
      ),
      is_with_driver: generateMessage(
        isWithDriverField,
        defaultValues.is_with_driver,
      ),
      insurance_id: generateMessage(insuranceField, defaultValues.insurance_id),
      start_request: {
        is_self_pickup: generateMessage(
          startSelfPickUpField,
          defaultValues.start_request.is_self_pickup,
        ),
        driver_id: generateMessage(
          startDriverField,
          defaultValues.start_request.driver_id,
        ),
        distance: generateMessage(
          startDistanceField,
          defaultValues.start_request.distance,
        ),
        address: generateMessage(
          startAddressField,
          defaultValues.start_request.address,
        ),
      },
      end_request: {
        is_self_pickup: generateMessage(
          endSelfPickUpField,
          defaultValues.end_request.is_self_pickup,
        ),
        driver_id: generateMessage(
          endDriverField,
          defaultValues.end_request.driver_id,
        ),
        distance: generateMessage(
          endDistanceField,
          defaultValues.end_request.distance,
        ),
        address: generateMessage(
          endAddressField,
          defaultValues.end_request.address,
        ),
      },
      discount: generateMessage(discountField, defaultValues.discount),
      description: generateMessage(descriptionField, defaultValues.description),
      service_price: generateMessage(serviceField, defaultValues.service_price),
    };

    setMessages(newMessages);
  }, [
    customerField,
    fleetField,
    dateField,
    durationField,
    isOutOfTownField,
    isWithDriverField,
    insuranceField,
    startSelfPickUpField,
    startDriverField,
    startDistanceField,
    startAddressField,
    endSelfPickUpField,
    endDriverField,
    endDistanceField,
    endAddressField,
    discountField,
    descriptionField,
    serviceField,
  ]);
  console.log("message", messages);

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
      {openRejectModal && (
        <RejectModal
          isOpen={openRejectModal}
          onClose={() => setOpenRejectModal(false)}
          onConfirm={handleRejectOrder}
          loading={rejectLoading}
        />
      )}
      <div
        className={cn(
          "flex items-center justify-between space-y-8",
          isMinimized
            ? "min-[1920px]:w-[1176px] w-[936px]"
            : "min-[1920px]:w-[940px] w-[700px]",
        )}
        id="header"
      >
        <Heading title={title} description={description} />
        {initialData?.status !== "pending" &&
          initialData?.request_status === "pending" &&
          lastPath !== "pending" && (
            <div className="flex gap-2">
              {lastPath === "edit" && (
                <>
                  <Button
                    onClick={handleReset}
                    disabled={!form.formState.isDirty}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "text-black",
                    )}
                  >
                    Reset berdasarkan data pengguna
                  </Button>
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    className={cn(buttonVariants({ variant: "main" }))}
                  >
                    Selesai
                  </Button>
                </>
              )}
              {lastPath !== "edit" && (
                <Link
                  href={`/dashboard/orders/${orderId}/edit`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-black",
                  )}
                >
                  Edit Pesanan
                </Link>
              )}
              <div className="bg-red-50 text-red-500 text-xs font-medium flex items-center justify-center px-[10px] py-1 rounded-full">
                Belum kembali
              </div>
            </div>
          )}

        {initialData?.request_status === "done" && (
          <div className="flex gap-2">
            {lastPath === "edit" && (
              <>
                <Button
                  onClick={handleReset}
                  disabled={!form.formState.isDirty}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-black",
                  )}
                >
                  Reset berdasarkan data pengguna
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  className={cn(buttonVariants({ variant: "main" }))}
                >
                  Selesai
                </Button>
              </>
            )}

            {lastPath !== "edit" && (
              <Link
                href={`/dashboard/orders/${orderId}/edit`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "text-black",
                )}
              >
                Edit Pesanan
              </Link>
            )}

            <div className="bg-green-50 text-green-500 text-xs font-medium flex items-center justify-center px-[10px] py-1 rounded-full">
              Selesai
            </div>
          </div>
        )}

        {initialData?.status === "pending" && lastPath === "preview" && (
          <Button
            onClick={handleReset}
            disabled={!form.formState.isDirty}
            className={cn(buttonVariants({ variant: "outline" }), "text-black")}
          >
            Reset berdasarkan data pengguna
          </Button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="flex relative" id="parent">
            <div className={cn("space-y-8 pr-5")}>
              <FormField
                name="is_with_driver"
                control={form.control}
                render={({ field }) => {
                  console.log("field", field.value, initialData?.customer);
                  return (
                    <FormItem>
                      <FormControl>
                        <Tabs
                          defaultValue={
                            defaultValues.is_with_driver
                              ? "dengan_supir"
                              : "lepas_kunci"
                          }
                          onValueChange={field.onChange}
                          value={field.value ? "dengan_supir" : "lepas_kunci"}
                          className="w-[235px]"
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                              disabled={!isEdit || loading}
                              value="lepas_kunci"
                              onClick={() =>
                                form.setValue("is_with_driver", false)
                              }
                            >
                              Lepas Kunci
                            </TabsTrigger>
                            <TabsTrigger
                              disabled={!isEdit || loading}
                              value="dengan_supir"
                              onClick={() =>
                                form.setValue("is_with_driver", true)
                              }
                            >
                              Dengan Supir
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </FormControl>
                      <FormMessage />
                      {messages.is_with_driver && (
                        <FormMessage className="text-main">
                          {messages.is_with_driver}
                        </FormMessage>
                      )}
                    </FormItem>
                  );
                }}
              />

              {/* 
              perhitungan lebar content
              di figma dengan lebar 1440px:  
                lebar 936px ====> ketika sidebar menu minimize
                lebar 700px ====> ketika sidebar menu tidak minimize

              di ukuran laya 1920px, kita perlu expand lebar si content sebesar 240px
              apabila 1 baris form terdapat 2 input field, maka kita perlu expand sebanya 120px disetiap field
              */}
              <div
                className={cn(
                  "grid grid-cols-2 gap-[10px] items-start",
                  isMinimized
                    ? "min-[1920px]:w-[1176px] w-[936px]"
                    : "min-[1920px]:w-[940px] w-[700px]",
                )}
              >
                <div className="flex items-end">
                  {lastPath !== "preview" && isEdit ? (
                    <FormField
                      name="customer"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <Space size={12} direction="vertical">
                            <FormLabel className="relative label-required">
                              Pelanggan
                            </FormLabel>
                            <div className="flex">
                              <FormControl>
                                <AntdSelect
                                  className={cn(
                                    isMinimized
                                      ? "min-[1920px]:w-[505px] w-[385px]"
                                      : "min-[1920px]:w-[387px] w-[267px]",
                                    "mr-2",
                                  )}
                                  showSearch
                                  placeholder="Pilih Customer"
                                  style={{
                                    height: "40px",
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
                                  // append value attribute when field is not  empty
                                  {...(!isEmpty(field.value) && {
                                    value: field.value,
                                  })}
                                >
                                  {lastPath !== "create" && isEdit && (
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
                            <FormMessage />
                          </Space>
                        );
                      }}
                    />
                  ) : (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          initialData?.customer?.status === "pending"
                            ? "text-destructive"
                            : "",
                        )}
                      >
                        Pelanggan
                      </FormLabel>
                      <div className="flex">
                        <FormControl className="disabled:opacity-100">
                          <Input
                            className={cn(
                              isMinimized
                                ? "min-[1920px]:w-[505px] w-[385px]"
                                : "min-[1920px]:w-[387px] w-[267px]",
                              "mr-2",
                            )}
                            style={{
                              height: "40px",
                            }}
                            disabled
                            value={initialData?.customer?.name ?? "-"}
                          />
                        </FormControl>
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
                      {initialData?.customer?.status == "pending" && (
                        <p
                          className={cn(
                            "text-[0.8rem] font-medium text-destructive",
                          )}
                        >
                          Pelanggan belum verified
                        </p>
                      )}
                    </FormItem>
                  )}
                </div>
                <div className="flex items-end">
                  {isEdit ? (
                    <FormField
                      name="fleet"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <Space size={12} direction="vertical">
                            <FormLabel className="relative label-required">
                              Armada
                            </FormLabel>
                            <div className="flex">
                              <FormControl>
                                <AntdSelect
                                  className={cn(
                                    isMinimized
                                      ? "min-[1920px]:w-[505px] w-[385px]"
                                      : "min-[1920px]:w-[387px] w-[267px]",
                                    "mr-2",
                                  )}
                                  showSearch
                                  placeholder="Pilih Armada"
                                  style={{
                                    height: "40px",
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
                                  // append value attribute when field is not  empty
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
                            <FormMessage />
                            {messages.fleet && (
                              <FormMessage className="text-main">
                                {messages.fleet}
                              </FormMessage>
                            )}
                          </Space>
                        );
                      }}
                    />
                  ) : (
                    <FormItem>
                      <FormLabel>Armada</FormLabel>
                      <div className="flex">
                        <FormControl className="disabled:opacity-100">
                          <Input
                            className={cn(
                              isMinimized
                                ? "min-[1920px]:w-[505px] w-[385px]"
                                : "min-[1920px]:w-[387px] w-[267px]",
                              "mr-2",
                            )}
                            style={{
                              height: "40px",
                            }}
                            disabled
                            value={initialData?.fleet?.name ?? "-"}
                          />
                        </FormControl>
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
                    </FormItem>
                  )}
                </div>
              </div>
              <div
                className={cn(
                  "gap-5",
                  isMinimized
                    ? "min-[1920px]:w-[1176px] w-[936px] grid grid-cols-3"
                    : "min-[1920px]:w-[940px] w-[700px] flex flex-wrap",
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
                              className={cn(
                                isMinimized
                                  ? "w-full"
                                  : "min-[1920px]:w-[460px] w-[340px]",
                                "p",
                              )}
                              style={
                                {
                                  // width: `${!isMinimized ? "340px" : "100%"}`,
                                }
                              }
                              height={40}
                              id="testing"
                              onChange={field.onChange} // send value to hook form
                              onBlur={field.onBlur} // notify when input is touched/blur
                              value={
                                field.value
                                  ? dayjs(field.value).locale("id")
                                  : undefined
                              }
                              format={"HH:mm:ss - dddd, DD MMMM (YYYY)"}
                              showTime
                              placeholder="Pilih tanggal dan waktu mulai"
                            />
                          </FormControl>
                          <FormMessage />
                          {messages.date && (
                            <FormMessage className="text-main">
                              {messages.date}
                            </FormMessage>
                          )}
                        </Space>
                      </ConfigProvider>
                    )}
                  />
                ) : (
                  <FormItem>
                    <FormLabel>Tanggal Sewa</FormLabel>
                    <FormControl className="disabled:opacity-100">
                      <Input
                        className={cn(
                          isMinimized
                            ? "w-full"
                            : "min-[1920px]:w-[460px] w-[340px]",
                        )}
                        style={{
                          height: "40px",
                        }}
                        disabled
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
                        value={field.value}
                      >
                        <FormControl
                          className={cn(
                            "disabled:opacity-100",
                            isMinimized
                              ? "w-full"
                              : "min-[1920px]:w-[460px] w-[340px]",
                          )}
                        >
                          <SelectTrigger className="">
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
                      {messages.duration && (
                        <FormMessage className="text-main">
                          {messages.duration}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <FormItem className="flex flex-col">
                  <FormLabel>Selesai sewa (otomatis)</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        // !isMinimized ? "w-[700px]" : "w-full"
                        isMinimized
                          ? "w-full"
                          : "min-[1920px]:w-[940px] w-[700px]",
                      )}
                      placeholder="Tanggal dan waktu selesai"
                      value={end == "Invalid Date" ? "" : end}
                      readOnly
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              <div
                className={cn(
                  "grid grid-cols-2 gap-5",
                  isMinimized
                    ? "min-[1920px]:w-[1176px] w-[936px]"
                    : "min-[1920px]:w-[940px] w-[700px]",
                  // isMinimized ? "w-[936px]" : "w-[700px]",
                )}
              >
                <FormField
                  control={form.control}
                  name="is_out_of_town"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="relative label-required">
                          Pemakaian
                        </FormLabel>
                        <FormControl>
                          <Tabs
                            onValueChange={field.onChange}
                            value={
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
                        {messages.is_out_of_town && (
                          <FormMessage className="text-main">
                            {messages.is_out_of_town}
                          </FormMessage>
                        )}
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="insurance_id"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="relative label-required">
                          Asuransi
                        </FormLabel>
                        <Select
                          disabled={!isEdit || loading}
                          onValueChange={field.onChange}
                          value={field.value || "0"}
                        >
                          <FormControl className="disabled:opacity-100">
                            <SelectTrigger>
                              <SelectValue defaultValue="0" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Tidak menggunakan</SelectItem>
                            {/* @ts-ignore  */}
                            {insurances?.data?.items.map((insurance) => (
                              <SelectItem
                                key={insurance.id}
                                value={insurance.id.toString()}
                              >
                                {insurance.name} - {insurance.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        {messages.insurance_id && (
                          <FormMessage className="text-main">
                            {messages.insurance_id}
                          </FormMessage>
                        )}
                      </FormItem>
                    );
                  }}
                />
              </div>
              <Separator
                className={cn(
                  "mt-1",
                  isMinimized
                    ? "min-[1920px]:w-[1176px] w-[936px]"
                    : "min-[1920px]:w-[940px] w-[700px]",
                )}
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
                lastPath={lastPath}
                messages={messages}
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
                lastPath={lastPath}
                messages={messages}
              />
              <div
                className={cn(
                  "space-y-8",
                  isMinimized
                    ? "min-[1920px]:w-[1176px] w-[936px]"
                    : "min-[1920px]:w-[940px] w-[700px]",
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
                        {messages.service_price && (
                          <FormMessage className="text-main">
                            {messages.service_price}
                          </FormMessage>
                        )}
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
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                        {messages.description && (
                          <FormMessage className="text-main">
                            {messages.description}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            {/* sidebar */}

            {openCustomerDetail && isFetchingCustomer && (
              <div className="flex justify-center items-center h-[100px] w-full">
                <Spinner />
              </div>
            )}
            {openCustomerDetail && !isFetchingCustomer && (
              <CustomerDetail
                data={customerData?.data}
                onClose={() => setOpenCustomerDetail(false)}
              />
            )}
            {openFleetDetail && isFetchingFleet && (
              <div className="flex justify-center items-center h-[100px] w-full">
                <Spinner />
              </div>
            )}

            {openFleetDetail && !isFetchingFleet && (
              <FleetDetail
                data={fleetData?.data}
                onClose={() => setOpenFleetDetail(false)}
              />
            )}

            {openDriverDetail && isFetchingDriver && (
              <div className="flex justify-center items-center h-[100px] w-full">
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
                initialData={initialData}
                isEdit={isEdit ?? false}
                showServicePrice={showServicePrice}
                form={form}
                detail={detail}
                handleOpenApprovalModal={() => setOpenApprovalModal(true)}
                handleOpenRejectModal={() => setOpenRejectModal(true)}
                confirmLoading={loading}
                type={lastPath}
                messages={messages}
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
  lastPath: string;
  messages?: any;
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
  lastPath,
  messages,
}) => {
  const [searchDriverTerm, setSearchDriverTerm] = useState("");
  const [searchDriverDebounce] = useDebounce(searchDriverTerm, 500);
  const { isMinimized } = useSidebar();
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);

  const onHandlePreview = (file: any) => {
    setContent(file);
    setOpen(true);
  };
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
  const startRequest = initialData?.start_request;
  const startRequestLog = initialData?.start_request?.logs?.filter(
    (log: any) => log.type === "end",
  );
  const endRequest = initialData?.end_request;
  const endRequestLog = initialData?.end_request?.logs?.filter(
    (log: any) => log.type === "end",
  );

  const typeRequestLog = type === "start" ? startRequestLog : endRequestLog;
  const typeRequest = type === "start" ? startRequest : endRequest;

  const detailMessages =
    type === "start" ? messages?.start_request : messages?.end_request;

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

  console.log(
    "watch",
    watchedFields[0],
    form.getValues(`${type}_request.is_self_pickup`),
  );

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h3 className="mb-4">{title}</h3>
          {type === "end" && lastPath !== "detail" && (
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
        {/* Layanan */}
        <div
          className={cn(
            "gap-5",
            isMinimized
              ? "min-[1920px]:w-[1176px] w-[936px]"
              : "min-[1920px]:w-[940px] w-[700px]",
          )}
        >
          <FormField
            control={form.control}
            name={`${type}_request.is_self_pickup`}
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel className="relative label-required w-[56px]">
                    Layanan
                  </FormLabel>
                  <FormControl>
                    <Tabs
                      defaultValue={field.value == true ? "1" : "0"}
                      value={field.value == true ? "1" : "0"}
                      onValueChange={field.onChange}
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        {lists.map((list, index) => {
                          return (
                            <TabsTrigger
                              disabled={!isEdit || loading || switchValue}
                              key={index}
                              value={list.value}
                              onClick={() => {
                                form.setValue(
                                  `${type}_request.is_self_pickup`,
                                  list.value == "0" ? false : true,
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
                  {detailMessages?.is_self_pickup && (
                    <FormMessage className="text-main">
                      {detailMessages?.is_self_pickup}
                    </FormMessage>
                  )}
                </FormItem>
              );
            }}
          />
        </div>
        {/* Penanggung Jawab */}
        <div
          className={cn(
            "flex gap-5 items-start",
            isMinimized
              ? "min-[1920px]:w-[1176px] w-[936px]"
              : "min-[1920px]:w-[940px] w-[700px]",
          )}
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
                    <div className="flex">
                      <FormControl>
                        <AntdSelect
                          defaultValue={
                            type === "start"
                              ? initialData?.start_request?.driver?.name
                              : initialData?.end_request?.driver?.name
                          }
                          showSearch
                          placeholder="Pilih Penanggung Jawab"
                          className={cn(
                            isMinimized
                              ? "min-[1920px]:w-[505px] w-[385px]"
                              : "min-[1920px]:w-[387px] w-[267px]",
                            "mr-2",
                          )}
                          style={{
                            // width: `${isMinimized ? "385px" : "267px"}`,
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
                          // append value attribute when field is not  empty
                          {...(!isEmpty(field.value) && {
                            value: field.value,
                          })}
                          disabled={switchValue}
                        >
                          {lastPath !== "create" && isEdit && (
                            <Option
                              value={
                                type == "start"
                                  ? initialData?.start_request?.driver?.id?.toString()
                                  : initialData?.end_request?.driver?.id?.toString()
                              }
                            >
                              {type == "start"
                                ? initialData?.start_request?.driver?.name
                                : initialData?.end_request?.driver?.name}
                            </Option>
                          )}
                          {drivers?.pages.map((page: any, pageIndex: any) =>
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

                          {isFetchingNextDrivers && (
                            <Option disabled>
                              <p className="px-3 text-sm">loading</p>
                            </Option>
                          )}
                        </AntdSelect>
                      </FormControl>
                      <Button
                        className={cn(
                          buttonVariants({ variant: "main" }),
                          "max-w-[65px] h-[40px]",
                        )}
                        disabled={
                          !form.getFieldState(`${type}_request.driver_id`)
                            .isDirty &&
                          isEmpty(form.getValues(`${type}_request.driver_id`))
                        }
                        type="button"
                        onClick={handleButton}
                      >
                        Lihat
                      </Button>
                    </div>
                    <FormMessage />
                    {detailMessages?.driver_id && (
                      <FormMessage className="text-main">
                        {detailMessages?.driver_id}
                      </FormMessage>
                    )}
                  </Space>
                )}
              />
            ) : (
              <FormItem>
                <FormLabel>Penanggung Jawab</FormLabel>
                <div className="flex">
                  <FormControl className="disabled:opacity-100">
                    <Input
                      className={cn(
                        isMinimized
                          ? "min-[1920px]:w-[505px] w-[385px]"
                          : "min-[1920px]:w-[387px] w-[267px]",
                        "mr-2",
                      )}
                      style={{
                        // width: `${isMinimized ? "385px" : "267px"}`,
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
                  <Button
                    className={cn(
                      buttonVariants({ variant: "main" }),
                      "max-w-[65px] h-[40px]",
                    )}
                    disabled={
                      !form.getFieldState(`${type}_request.driver_id`)
                        .isDirty &&
                      isEmpty(form.getValues(`${type}_request.driver_id`))
                    }
                    type="button"
                    onClick={handleButton}
                  >
                    Lihat
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          </div>
          {!form.getValues(`${type}_request.is_self_pickup`) && (
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
                        min={0}
                        disabled={!isEdit || loading || switchValue}
                        type="number"
                        placeholder="Masukkan jarak (contoh 10 Km)"
                        className={cn(
                          "h-[40px]",
                          // isMinimized ? "w-[458px]" : "w-[340px]",
                          isMinimized
                            ? "min-[1920px]:w-[578px] w-[458px]"
                            : "min-[1920px]:w-[460px] w-[340px]",
                        )}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        // append value attribute when this field is not empty
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                    {detailMessages?.distance && (
                      <FormMessage className="text-main">
                        {detailMessages?.distance}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        {/* Alamat */}
        <div
          className={cn(
            isMinimized
              ? "min-[1920px]:w-[1176px] w-[936px]"
              : "min-[1920px]:w-[940px] w-[700px]",
          )}
        >
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
            !form.getValues(`${type}_request.is_self_pickup`) && (
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
                        disabled={!isEdit || loading || switchValue}
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                    {detailMessages?.address && (
                      <FormMessage className="text-main">
                        {detailMessages?.address}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            )
          )}
        </div>
        {lastPath === "detail" && (
          <>
            {/* Bukti Serah Terima */}
            <div
              className={cn(
                isMinimized
                  ? "min-[1920px]:w-[1176px] w-[936px]"
                  : "min-[1920px]:w-[940px] w-[700px]",
              )}
            >
              <FormItem>
                <FormLabel>Bukti Serah Terima</FormLabel>
                <Carousel>
                  <CarouselContent className="-ml-1">
                    {isEmpty(typeRequestLog?.[0]?.photos) && (
                      <div className="ml-1">
                        <p className="text-base font-normal">
                          Belum selesai dilakukan
                        </p>
                      </div>
                    )}
                    {typeRequestLog?.[0]?.photos?.length > 0 &&
                      typeRequestLog?.[0]?.photos?.map(
                        (photo: any, index: any) => (
                          <CarouselItem
                            key={index}
                            className="pl-1 md:basis-1/2 lg:basis-1/3"
                          >
                            <div className="p-1">
                              {/* <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6 relative  w-[300px] h-[202px]">
                                <Image
                                  className="border object-cover cursor-pointer rounded-lg"
                                  alt={"test"}
                                  src={photo?.photo}
                                  fill
                                />
                              </CardContent>
                            </Card> */}
                              <div
                                key={index}
                                className=" w-full h-[300px] flex-shrink-0 flex aspect-square items-center justify-center relative "
                              >
                                <img
                                  src={photo.photo}
                                  alt={`Slide ${index}`}
                                  className="border object-cover cursor-pointer rounded-lg w-full h-full"
                                  onClick={() => {
                                    setOpen(true);
                                    onHandlePreview(photo?.photo);
                                  }}
                                />
                              </div>
                            </div>
                          </CarouselItem>
                        ),
                      )}
                  </CarouselContent>
                  {typeRequestLog?.[0]?.photos?.length < 2 && (
                    <>
                      <CarouselPrevious
                        type="button"
                        className="-left-1 top-1/2 -translate-y-1/2 bg-accent"
                      />
                      <CarouselNext
                        type="button"
                        className="-right-1 top-1/2 -translate-y-1/2 bg-accent"
                      />
                    </>
                  )}
                </Carousel>
              </FormItem>
            </div>
            {/* Durasi */}
            <div
              className={cn(
                isMinimized
                  ? "min-[1920px]:w-[1176px] w-[936px]"
                  : "min-[1920px]:w-[940px] w-[700px]",
              )}
            >
              <FormItem>
                <FormLabel>Durasi</FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      // !isMinimized ? "w-[700px]" : "w-full"
                      isMinimized
                        ? "w-full"
                        : "min-[1920px]:w-[940px] w-[700px]",
                    )}
                    placeholder="Tanggal dan waktu selesai"
                    value={typeRequest?.progress_duration_second ?? "--"}
                    readOnly
                    disabled
                  />
                </FormControl>
              </FormItem>
            </div>
            {/* Catatan Driver */}
            <div
              className={cn(
                isMinimized
                  ? "min-[1920px]:w-[1176px] w-[936px]"
                  : "min-[1920px]:w-[940px] w-[700px]",
              )}
            >
              <FormItem>
                <FormLabel>Catatan Driver</FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      // !isMinimized ? "w-[700px]" : "w-full"
                      isMinimized
                        ? "w-full"
                        : "min-[1920px]:w-[940px] w-[700px]",
                    )}
                    placeholder="Tanggal dan waktu selesai"
                    value={typeRequest?.description ?? "-"}
                    readOnly
                    disabled
                  />
                </FormControl>
              </FormItem>
            </div>
          </>
        )}
      </div>

      <Separator
        className={cn(
          "mt-1",
          isMinimized
            ? "min-[1920px]:w-[1176px] w-[936px]"
            : "min-[1920px]:w-[940px] w-[700px]",
        )}
      />

      <PreviewImage
        isOpen={open}
        onClose={() => setOpen(false)}
        content={content}
      />
    </>
  );
};

// export const Carousel = ({ images }: any) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1,
//     );
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1,
//     );
//   };

//   return (
//     <div className="relative w-full  h-[300px] overflow-hidden">
//       <div
//         className="absolute top-0 left-0 w-full h-full flex transition-transform duration-300"
//         style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//       >
//         {!images && <p>Driver Tidak memilik foto</p>}
//         {images.map((image: any, index: any) => (
//           <div key={index} className="w-full h-[300px] flex-shrink-0">
//             <img
//               src={image.photo}
//               alt={`Slide ${index}`}
//               className="w-full h-full object-contain"
//             />
//           </div>
//         ))}
//       </div>
//       {images.length > 1 && (
//         <>
//           <Button
//             onClick={prevSlide}
//             className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2"
//             type="button"
//           >
//             {"<"}
//           </Button>
//           {images.length > 1 && currentIndex < images.length - 1 && (
//             <Button
//               onClick={nextSlide}
//               className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2"
//               type="button"
//             >
//               {">"}
//             </Button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };
