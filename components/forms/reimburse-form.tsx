"use client";
import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { cn, convertTime, makeUrlsClickable } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty, isNull, isString, set } from "lodash";
import { useDebounce } from "use-debounce";
import { Select as AntdSelect, ConfigProvider, DatePicker, Space } from "antd";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
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
import {
  useAcceptReimburse,
  useEditReimburse,
  usePostReimburse,
  useRejectReimburse,
} from "@/hooks/api/useReimburse";
import { ApprovalModal } from "../modal/approval-modal";
import { NumericFormat } from "react-number-format";
import "dayjs/locale/id";
import DriverDetail from "./section/driver-detail";
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
import { PreviewImage } from "../modal/preview-image";
import { Trash2 } from "lucide-react";
import { generateSchema } from "./validation/orderSchema";
import {
  getPaymentStatusLabel,
  getStatusVariant,
  ReimburseStatus,
} from "@/app/(dashboard)/dashboard/reimburse/[reimburseid]/types/reimburse";
import { useUser } from "@/context/UserContext";
import { ReimburseFormProps, ReimburseFormValues } from "./types/reimburse";
import { useGetInfinityLocation } from "@/hooks/api/useLocation";

export const IMG_MAX_LIMIT = 3;

export const ReimburseForm: React.FC<ReimburseFormProps> = ({
  initialData,
  isEdit,
}) => {
  const { user } = useUser();
  const { reimburseid } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const pathname = usePathname();
  const splitPath = pathname.split("/");
  const lastPath = splitPath[splitPath.length - 1];
  const title =
    lastPath === "preview"
      ? "Tinjau Reimburse"
      : lastPath === "edit"
      ? "Edit Reimburse"
      : lastPath === "detail"
      ? "Detail Reimburse"
      : "Tambah Reimburse";
  const description =
    lastPath === "preview"
      ? "Tinjau reimburse baru dari driver"
      : lastPath === "edit"
      ? "Edit reimburse jika ada salah inputan"
      : lastPath === "detail"
      ? ""
      : "Tambah reimburse baru untuk driver";
  const toastMessage = initialData
    ? "Reimburse berhasil diubah!"
    : "Reimburse berhasil dibuat";

  const action = initialData ? "Save changes" : "Create";
  const queryClient = useQueryClient();
  const { mutate: createReimburse } = usePostReimburse();
  const { mutate: editReimburse } = useEditReimburse(reimburseid as string);
  const { mutate: acceptReimburse } = useAcceptReimburse(reimburseid as string);
  const { mutate: rejectReimburse } = useRejectReimburse();
  const [searchDriverTerm, setSearchDriverTerm] = useState("");
  const [searchLocationTerm, setSearchLocationTerm] = useState("");
  const [searchDriverDebounce] = useDebounce(searchDriverTerm, 500);
  const [searchLocationDebounce] = useDebounce(searchLocationTerm, 500);
  // const [detail, setDetail] = useState<DriverDetail | null>(null);
  const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const [openDriverDetail, setOpenDriverDetail] = useState<boolean>(false);
  // const [type, setType] = useState<string>("");
  const [schema, setSchema] = useState(() => generateSchema(true, true));
  const [messages, setMessages] = useState<any>({});
  const detailRef = React.useRef<HTMLDivElement>(null);
  const [banks, setBanks] = useState(["BNI", "BRI", "BCA", "MANDIRI"]);

  const scrollDetail = () => {
    detailRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { isMinimized } = useSidebar();
  const defaultValues = initialData
    ? {
        reimburse: {
          driver: initialData?.reimburse?.driver?.name || "", // Mengambil nama driver
          amount: initialData?.reimburse?.amount?.toString() || "0", // Nominal reimburse
          bank_name: initialData?.reimburse?.bank_name || "", // Nama bank
          location: initialData?.reimburse?.location || "", // Lokasi reimburse
          account_number: initialData?.reimburse?.account_number || "", // Nomor rekening
          date: initialData?.reimburse?.date || "", // Tanggal reimburse
          time: initialData?.reimburse?.time || "", // Waktu reimburse
          description: initialData?.reimburse?.description || "", // Keterangan tambahan
        },
      }
    : {
        reimburse: {
          driver: "", // Nama driver kosong
          amount: "0", // Nominal default 0
          bank_name: "", // Nama bank koso
          location: "", // Lokasi kosong
          account_number: "", // Nomor rekening kosong
          date: "", // Tanggal kosong
          time: "", // Waktu kosong
          description: "", // Keterangan kosong
        },
      };

  const form = useForm<ReimburseFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Reimburse Fields
  const driverNameField = form.watch("driver"); // Nama driver
  const amountField = form.watch("amount"); // Nominal/jumlah reimburse
  const bankNameField = form.watch("bank_name"); // Nama bank
  const locationField = form.watch("location"); // Lokasi reimburse
  const accountNumberField = form.watch("account_number"); // Nomor rekening
  const dateField = form.watch("date"); // Tanggal reimburse
  const timeField = form.watch("time"); // Waktu reimburse
  const descriptionField = form.watch("description"); // Keterangan tambahan (opsional)

  const { data: driver, isFetching: isFetchingDriver } = useGetDetailDriver(
    form.getValues("driver"),
  );
  const [end, setEnd] = useState("");
  const now = dayjs(form.getValues("date"));
  useEffect(() => {
    const end = now
      // .add(+form.getValues("duration"), "day")
      .locale("id")
      .format("HH:mm:ss - dddd, DD MMMM (YYYY)");
    setEnd(end);
  }, [now]);

  // , form.getValues("duration")

  const onSubmit = async (data: ReimburseFormValues) => {
    setLoading(true);

    const createPayload = (data: ReimburseFormValues) => ({
      reimburse: {
        driver: data.driver, // Menggunakan nama driver
        amount: +data.amount.replace(/,/g, ""), // Mengubah nominal ke number, menghapus koma jika ada
        bank_name: data.bank_name, // Nama bank
        location: data.location, // Lokasi reimburse
        account_number: data.account_number, // Nomor rekening
        date: data.date, // Format tanggal (YYYY-MM-DD)
        time: data.time, // Format waktu (HH:mm)
        description: data.description || "", // Keterangan opsional
      },
    });

    const handleSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["reimburse"] });
      toast({
        variant: "success",
        title: toastMessage,
      });
      router.refresh();
      router.push(`/dashboard/reimburse`);
    };

    const handleError = (error: any) => {
      setOpenApprovalModal(false);
      toast({
        variant: "destructive",
        title: `Uh oh! ${
          //@ts-ignore
          error?.response?.data?.message == "Driver must be verified."
            ? "Driver belum diverifikasi"
            : //@ts-ignore
              error?.response?.data?.message
        }`,
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
        handleResponse(payload, editReimburse);
        break;
      case "preview":
        handleResponse(payload, acceptReimburse);
        break;
      default:
        handleResponse(payload, createReimburse);
        break;
    }
  };

  const saveBankToDatabase = async (newBank) => {
    try {
      setLoading(true);
      // Kirim request ke backend untuk menyimpan bank baru
      const response = await axios.post("/reimburse", { name: newBank });
      if (response.data.success) {
        // Jika berhasil, tambahkan bank baru ke daftar opsi
        setBanks([...banks, newBank]);
      }
    } catch (error) {
      messages.error("Gagal menambahkan bank. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (values) => {
    values.forEach((value) => {
      if (!banks.includes(value)) {
        saveBankToDatabase(value);
      }
    });

    field.onChange(values);
  };

  const Option = AntdSelect;

  const {
    data: drivers,
    fetchNextPage: fetchNextDrivers,
    hasNextPage: hasNextDrivers,
    isFetchingNextPage: isFetchingNextDrivers,
  } = useGetInfinityDrivers(searchDriverDebounce);
  const {
    data: locations,
    fetchNextPage: fetchNextLocations,
    hasNextPage: hasNextLocations,
    isFetchingNextPage: isFetchingNextLocations,
  } = useGetInfinityLocation(searchLocationDebounce);

  const handleScrollDrivers = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchNextDrivers();
    }
  };

  // useEffect(() => {
  //   if (startSelfPickUpField && endSelfPickUpField) {
  //     // Jika start_request.is_self_pickup dan end_request.is_self_pickup keduanya true
  //     setSchema(generateSchema(true, true));
  //     setShowServicePrice(false);
  //   } else if (startSelfPickUpField) {
  //     // Jika hanya start_request.is_self_pickup yang true
  //     setSchema(generateSchema(true, false));
  //     setShowServicePrice(true);
  //   } else if (endSelfPickUpField) {
  //     // Jika hanya end_request.is_self_pickup yang true
  //     setSchema(generateSchema(false, true));
  //     setShowServicePrice(true);
  //   } else {
  //     // Jika keduanya false
  //     setSchema(generateSchema(false, false));
  //     setShowServicePrice(true);
  //   }
  // }, [startSelfPickUpField, endSelfPickUpField]);

  // useEffect(() => {
  //   const payload = {
  //     // customer_id: +(customerField ?? 0),
  //     // fleet_id: +(fleetField ?? 0),
  //     is_out_of_town: isOutOfTownField,
  //     is_with_driver: isWithDriverField,
  //     // insurance_id: +(insuranceField ?? 0),
  //     start_request: {
  //       is_self_pickup: startSelfPickUpField == "1" ? true : false,
  //       driver_id: +(startDriverField ?? 0),
  //       ...(!startSelfPickUpField && {
  //         distance: +(startDistanceField ?? 0),
  //         address: startAddressField,
  //       }),
  //     },
  //     end_request: {
  //       is_self_pickup: endSelfPickUpField == "1" ? true : false,
  //       driver_id: +(endDriverField ?? 0),
  //       ...(!endSelfPickUpField && {
  //         distance: +(endDistanceField ?? 0),
  //         address: endAddressField,
  //       }),
  //     },
  //     description: descriptionField,
  //     ...(!isEmpty(dateField) && {
  //       date: dateField,
  //       duration: +(durationField ?? 1),
  //     }),
  //     discount: +(discountField ?? 0),
  //     ...(watchServicePrice && {
  //       service_price: isString(serviceField)
  //         ? +serviceField.replace(/,/g, "")
  //         : serviceField,
  //     }),
  //     ...(fields.length !== 0 && {
  //       additional_services: additionalField.map((field) => {
  //         return {
  //           name: field.name,
  //           price: isString(field.price)
  //             ? +field.price.replace(/,/g, "")
  //             : field.price,
  //         };
  //       }),
  //     }),
  //   };
  // }, [
  //   additionalField,
  //   // customerField,
  //   // fleetField,
  //   dateField,
  //   durationField,
  //   isOutOfTownField,
  //   isWithDriverField,
  //   // insuranceField,
  //   startSelfPickUpField,
  //   startDriverField,
  //   startDistanceField,
  //   startAddressField,
  //   endSelfPickUpField,
  //   endDriverField,
  //   endDistanceField,
  //   endAddressField,
  //   discountField,
  //   descriptionField,
  //   showServicePrice,
  //   servicePrice,
  //   JSON.stringify(additionalField),
  // ]);

  useEffect(() => {
    const payload = {
      reimburse: {
        driver: +(driverNameField ?? 0), // Nama driver
        amount: isString(amountField) // Nominal/jumlah reimburse
          ? +amountField.replace(/,/g, "")
          : amountField,
        location: locationField, // Lokasi reimburse
        bank_name: bankNameField, // Nama bank
        account_number: accountNumberField, // Nomor rekening
        date: dateField, // Tanggal reimburse (format: YYYY-MM-DD)
        time: timeField, // Waktu reimburse (format: HH:mm)
        description: descriptionField || "", // Keterangan tambahan (opsional)
      },
      // ...(watchServicePrice && {
      //   // Jika ada service price yang aktif
      //   service_price: isString(serviceField)
      //     ? +serviceField.replace(/,/g, "")
      //     : serviceField,
      // }),
      // ...(additionalField.length !== 0 && {
      //   // Tambahan layanan jika ada
      //   additional_services: additionalField.map((field) => ({
      //     name: field.name,
      //     price: isString(field.price)
      //       ? +field.price.replace(/,/g, "")
      //       : field.price,
      //   })),
      // }),
    };

    // setPayload(payload); // Simpan payload ke state (jika dibutuhkan)
  }, [
    driverNameField,
    amountField,
    locationField,
    bankNameField,
    accountNumberField,
    dateField,
    timeField,
    descriptionField,
  ]);

  //   // disable date for past dates
  const disabledDate = (current: Dayjs | null): boolean => {
    // ada request untuk enable past date ketika update order
    if (lastPath === "edit") return false;

    return current ? current < dayjs().startOf("day") : false;
  };

  // function for handle reject
  const handleRejectReimburse = (reason: string) => {
    setRejectLoading(true);
    rejectReimburse(
      { reimburseid, reason },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["reimburse"] });
          toast({
            variant: "success",
            title: "berhasil ditolak",
          });
          setOpenRejectModal(false);
          router.refresh();
          router.push(`/dashboard/reimburse`);
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
      driver: generateMessage(driverNameField, defaultValues.driver), // Nama Driver
      amount: generateMessage(amountField, defaultValues.amount), // Nominal/Jumlah Reimburse
      location: generateMessage(locationField, defaultValues.location), // Lokasi Reimburse
      bank_name: generateMessage(bankNameField, defaultValues.bank_name), // Nama Bank
      account_number: generateMessage(
        accountNumberField,
        defaultValues.account_number,
      ), // Nomor Rekening
      date: generateMessage(dateField, defaultValues.date), // Tanggal Reimburse
      time: generateMessage(timeField, defaultValues.time), // Waktu Reimburse
      description: generateMessage(descriptionField, defaultValues.description), // Keterangan Tambahan
    };
    if (lastPath !== "create") {
      setMessages(newMessages);
    }
  }, [
    driverNameField,
    amountField,
    locationField,
    bankNameField,
    accountNumberField,
    dateField,
    timeField,
    descriptionField,
  ]);

  // useEffect(() => {
  //   const newMessages = {
  //     date: generateMessage(dateField, defaultValues.date),
  //     duration: generateMessage(durationField, defaultValues.duration),
  //     is_out_of_town: generateMessage(
  //       isOutOfTownField,
  //       defaultValues.is_out_of_town,
  //     ),
  //     is_with_driver: generateMessage(
  //       isWithDriverField,
  //       defaultValues.is_with_driver,
  //     ),

  //     start_request: {
  //       is_self_pickup: generateMessage(
  //         startSelfPickUpField,
  //         defaultValues.start_request.is_self_pickup,
  //       ),
  //       driver_id: generateMessage(
  //         startDriverField,
  //         defaultValues.start_request.driver_id,
  //       ),
  //       distance: generateMessage(
  //         startDistanceField,
  //         defaultValues.start_request.distance,
  //       ),
  //       address: generateMessage(
  //         startAddressField,
  //         defaultValues.start_request.address,
  //       ),
  //     },
  //     end_request: {
  //       is_self_pickup: generateMessage(
  //         endSelfPickUpField,
  //         defaultValues.end_request.is_self_pickup,
  //       ),
  //       driver_id: generateMessage(
  //         endDriverField,
  //         defaultValues.end_request.driver_id,
  //       ),
  //       distance: generateMessage(
  //         endDistanceField,
  //         defaultValues.end_request.distance,
  //       ),
  //       address: generateMessage(
  //         endAddressField,
  //         defaultValues.end_request.address,
  //       ),
  //     },
  //     discount: generateMessage(discountField, defaultValues.discount),
  //     description: generateMessage(descriptionField, defaultValues.description),
  //     service_price: generateMessage(serviceField, defaultValues.service_price),
  //   };

  //   if (lastPath !== "create") {
  //     setMessages(newMessages);
  //   }
  // }, [
  //   dateField,
  //   durationField,
  //   isWithDriverField,
  //   startSelfPickUpField,
  //   startDriverField,
  //   startDistanceField,
  //   startAddressField,
  //   endSelfPickUpField,
  //   endDriverField,
  //   endDistanceField,
  //   endAddressField,
  //   discountField,
  //   descriptionField,
  //   serviceField,
  // ]);
  const approvalModalTitle =
    lastPath === "edit"
      ? "Apakah Anda Yakin Ingin Mengedit Pesanan ini?"
      : "Apakah Anda Yakin Ingin Mengonfirmasi Pesanan ini?";

  return (
    <>
      {openApprovalModal && (
        <ApprovalModal
          isOpen={openApprovalModal}
          onClose={() => setOpenApprovalModal(false)}
          onConfirm={form.handleSubmit(onSubmit)}
          loading={loading}
          title={approvalModalTitle}
        />
      )}
      {openRejectModal && (
        <RejectModal
          isOpen={openRejectModal}
          onClose={() => setOpenRejectModal(false)}
          onConfirm={handleRejectReimburse}
          loading={rejectLoading}
        />
      )}
      <div
        className={cn("flex items-center justify-between py-3 gap-2 flex-wrap")}
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
                    Reset berdasarkan data Pelanggan
                  </Button>
                  <Button
                    onClick={() => setOpenApprovalModal(true)}
                    className={cn(buttonVariants({ variant: "main" }))}
                    type="button"
                  >
                    {loading ? <Spinner className="h-4 w-4" /> : "Selesai"}
                  </Button>
                </>
              )}
              {lastPath !== "edit" && (
                <Link
                  href={`/dashboard/reimburse/${reimburseid}/edit`}
                  onClick={(e) => {
                    if (user?.role !== "admin") {
                      e.preventDefault();
                    }
                  }}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-black",
                    user?.role !== "admin" &&
                      "cursor-not-allowed pointer-events-none opacity-50",
                  )}
                >
                  Edit Pesanan
                </Link>
              )}

              <div className="flex justify-between gap-3.5">
                {initialData?.reimburse_status != ReimburseStatus.PENDING && (
                  <div
                    className={cn(
                      getStatusVariant(initialData?.payment_status),
                      "text-xs font-medium flex items-center justify-center px-[10px] py-1 rounded-full text-center",
                    )}
                  >
                    {getPaymentStatusLabel(initialData?.payment_status)}
                  </div>
                )}
                <div className="bg-red-50 text-red-500 text-xs font-medium flex items-center justify-center px-[10px] py-1 rounded-full text-center">
                  Belum kembali
                </div>
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
                  Reset berdasarkan data Pelanggan
                </Button>
                <Button
                  onClick={() => setOpenApprovalModal(true)}
                  className={cn(buttonVariants({ variant: "main" }))}
                  type="button"
                >
                  Selesai
                </Button>
              </>
            )}

            {lastPath !== "edit" && (
              <Link
                href={`/dashboard/reimburse/${reimburseid}/edit`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "text-black",
                )}
              >
                Edit Pesanan
              </Link>
            )}
            <div className="flex justify-between gap-3.5">
              {initialData?.reimburse_status != ReimburseStatus.PENDING && (
                <div
                  className={cn(
                    getStatusVariant(initialData?.payment_status),
                    "text-xs font-medium flex items-center justify-center px-[10px] py-1 rounded-full text-center",
                  )}
                >
                  {getPaymentStatusLabel(initialData?.payment_status)}
                </div>
              )}
              <div className="bg-green-50 text-green-500 text-xs font-medium flex items-center justify-center px-[10px] py-1 rounded-full text-center">
                Selesai
              </div>
            </div>
          </div>
        )}
        {initialData?.status === "pending" && lastPath === "preview" && (
          <Button
            onClick={handleReset}
            disabled={!form.formState.isDirty}
            className={cn(buttonVariants({ variant: "outline" }), "text-black")}
          >
            Reset berdasarkan data Pelanggan
          </Button>
        )}
      </div>
      <div className="flex gap-4 flex-col lg:!flex-row">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full basis-2/3"
          >
            <div className="relative space-y-8" id="parent">
              <div className={cn("lg:grid grid-cols-2 gap-[10px] items-start")}>
                <div className="flex items-end">
                  {lastPath !== "preview" && isEdit ? (
                    <FormField
                      name="driver"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <div className="space-y-2 w-full">
                            <FormLabel className="relative label-required">
                              Nama Pengemudi
                            </FormLabel>
                            <div className="flex">
                              <FormControl>
                                <AntdSelect
                                  className={cn("mr-2 w-full")}
                                  showSearch
                                  placeholder="Nama Pengemudi..."
                                  style={{
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
                                >
                                  {lastPath !== "create" && isEdit && (
                                    <Option
                                      value={initialData?.driver?.id?.toString()}
                                    >
                                      {initialData?.driver?.name}
                                    </Option>
                                  )}
                                  {drivers?.pages.map(
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

                                  {isFetchingNextDrivers && (
                                    <Option disabled>
                                      <p className="px-3 text-sm">loading</p>
                                    </Option>
                                  )}
                                </AntdSelect>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </div>
                        );
                      }}
                    />
                  ) : (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          initialData?.driver?.status === "pending"
                            ? "text-destructive"
                            : "",
                        )}
                      >
                        Nama Pengemudi
                      </FormLabel>
                      <div className="flex">
                        {" "}
                        <FormControl className="disabled:opacity-100">
                          <Input
                            className={cn("mr-2")}
                            style={{
                              height: "40px",
                            }}
                            disabled
                            value={initialData?.driver?.name ?? "-"}
                          />
                        </FormControl>
                        <Button
                          className={cn(
                            buttonVariants({ variant: "main" }),
                            "w-[65px] h-[40px]",
                          )}
                          disabled={
                            !form.getFieldState("driver").isDirty &&
                            isEmpty(form.getValues("driver"))
                          }
                          type="button"
                          onClick={() => {
                            setOpenDriverDetail(true);
                            scrollDetail();
                          }}
                        >
                          {initialData?.driver?.status == "pending"
                            ? "Tinjau"
                            : "Lihat"}
                        </Button>
                      </div>
                    </FormItem>
                  )}
                </div>
                <div className="flex items-end">
                  {!isEdit ? (
                    <FormItem>
                      <FormLabel>Nominal</FormLabel>
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
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) : (
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="relative label-required">
                            Nominal
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
                                value={initialData?.amount}
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
                </div>
              </div>
              <div className={cn("lg:grid grid-cols-2 gap-[10px] items-start")}>
                <div className="flex items-end">
                  {isEdit ? (
                    <FormField
                      name="bank_name"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <div className="space-y-2 w-full">
                            <FormLabel className="relative label-required">
                              Nama Bank
                            </FormLabel>
                            <div className="flex">
                              <FormControl>
                                <AntdSelect
                                  className={cn("mr-2 w-full")}
                                  showSearch
                                  mode="tags"
                                  placeholder="Nama Bank..."
                                  onChange={handleChange}
                                  style={{
                                    height: "40px",
                                  }}
                                  // onSearch={setSearchDriverTerm}
                                  // onChange={field.onChange}
                                  // onPopupScroll={handleScrollDrivers}
                                  // filterOption={false}
                                  // notFoundContent={
                                  //   isFetchingNextDrivers ? (
                                  //     <p className="px-3 text-sm">loading</p>
                                  //   ) : null
                                  // }
                                  // append value attribute when field is not  empty
                                  {...(!isEmpty(field.value) && {
                                    value: field.value,
                                  })}
                                >
                                  {lastPath !== "create" && isEdit && (
                                    <>
                                      {banks.map((bank) => (
                                        <Option key={bank} value={bank}>
                                          {bank}
                                        </Option>
                                      ))}
                                      {/* <Option value="BCA">BCA</Option>
                                      <Option value="BNI">BNI</Option>
                                      <Option value="BRI">BRI</Option>
                                      <Option value="Mandiri">Mandiri</Option> */}
                                    </>
                                  )}

                                  {lastPath === "create" && (
                                    <>
                                      {/* <Option value="BCA">BCA</Option>
                                      <Option value="BNI">BNI</Option>
                                      <Option value="BRI">BRI</Option>
                                      <Option value="Mandiri">Mandiri</Option> */}
                                    </>
                                  )}
                                </AntdSelect>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </div>
                        );
                      }}
                    />
                  ) : (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          initialData?.bank_name?.status === "pending"
                            ? "text-destructive"
                            : "",
                        )}
                      >
                        Nama Bank
                      </FormLabel>
                      <div className="flex">
                        {" "}
                        <FormControl className="disabled:opacity-100">
                          <Input
                            className={cn("mr-2")}
                            style={{
                              height: "40px",
                            }}
                            disabled
                            value={initialData?.bank_name}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                </div>
                <div className="flex items-end">
                  {lastPath !== "preview" && isEdit ? (
                    <FormField
                      name="location"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <div className="space-y-2 w-full">
                            <FormLabel className="relative label-required">
                              Lokasi
                            </FormLabel>
                            <div className="flex">
                              <FormControl>
                                <AntdSelect
                                  className={cn("mr-2 w-full")}
                                  showSearch
                                  placeholder="Lokasi..."
                                  style={{
                                    height: "40px",
                                  }}
                                  onSearch={setSearchLocationTerm}
                                  filterOption={false}
                                  notFoundContent={
                                    isFetchingNextLocations ? (
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
                                      value={initialData?.location?.id?.toString()}
                                    >
                                      {initialData?.location?.name}
                                    </Option>
                                  )}
                                  {locations?.pages.map(
                                    (pageParam: any, pageIndex: any) =>
                                      pageParam.data.items.map(
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
                                </AntdSelect>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </div>
                        );
                      }}
                    />
                  ) : (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          initialData?.location?.status === "pending"
                            ? "text-destructive"
                            : "",
                        )}
                      >
                        Lokasi
                      </FormLabel>
                      <div className="flex">
                        {" "}
                        <FormControl className="disabled:opacity-100">
                          <Input
                            className={cn("mr-2")}
                            style={{
                              height: "40px",
                            }}
                            disabled
                            value={initialData?.location?.name ?? "-"}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                </div>
              </div>
              <div className={cn("lg:grid grid-cols-2 gap-[10px] items-start")}>
                <div className="flex items-end">
                  {isEdit ? (
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <ConfigProvider locale={locale}>
                          <Space
                            size={8}
                            direction="vertical"
                            className="w-full"
                          >
                            <FormLabel className="relative label-required">
                              Tanggal
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                disabledDate={disabledDate}
                                disabled={loading}
                                className={cn("p h-[40px] w-full")}
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
                                showNow={false}
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
                      <FormLabel>Tanggal </FormLabel>
                      <FormControl className="disabled:opacity-100">
                        <Input
                          className={cn("w-full")}
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
                </div>
                <div className="flex items-end">
                  {isEdit ? (
                    <FormField
                      name="account_number"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <div className="space-y-2 w-full">
                            <FormLabel className="relative label-required">
                              No. Rek
                            </FormLabel>
                            <div className="flex">
                              <FormControl>
                                <Input
                                  placeholder="No. Rekening anda..."
                                  className={cn("mr-2")}
                                  style={{
                                    height: "40px",
                                  }}
                                  disabled
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                            {messages.account_number && (
                              <FormMessage className="text-main">
                                {messages.account_number}
                              </FormMessage>
                            )}
                          </div>
                        );
                      }}
                    />
                  ) : (
                    <FormItem>
                      <FormLabel>No. Rek</FormLabel>
                      <div className="flex">
                        <FormControl className="disabled:opacity-100">
                          <Input
                            className={cn("mr-2")}
                            style={{
                              height: "40px",
                            }}
                            disabled
                            value={initialData?.account_number ?? "-"}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                </div>
              </div>
              <div className={cn("lg:grid grid-cols-2 gap-[10px] items-start")}>
                <div className="flex items-end">
                  {!isEdit ? (
                    <FormItem>
                      <FormLabel>Keterangan</FormLabel>
                      <p
                        className="border border-gray-200 rounded-md px-3 py-1 break-words"
                        dangerouslySetInnerHTML={{
                          __html: !isEmpty(defaultValues?.description)
                            ? makeUrlsClickable(
                                defaultValues?.description?.replace(
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
                          <FormLabel className="relative label-required">
                            Keterangan
                          </FormLabel>
                          <FormControl className="disabled:opacity-100">
                            <Textarea
                              id="keterangan"
                              placeholder="Isi keteragan anda dengan lengkap..."
                              className="col-span-4"
                              rows={6}
                              disabled={!isEdit || loading}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                e.target.value = e.target.value.trimStart();
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <Separator className={cn("mt-1")} />
            </div>
          </form>
          {/* sidebar */}
          {openDriverDetail && isFetchingDriver && (
            <div className="flex justify-center items-center h-[100px] w-full">
              <Spinner />
            </div>
          )}
          {/* {openDriverDetail &&
            !isFetchingDriver &&
            type === "create" &&
            lastPath ===
              "preview"( */}
          <DriverDetail
            innerRef={detailRef}
            data={driver?.data}
            initialData={initialData}
            handleOpenApprovalModal={() => setOpenApprovalModal(true)}
            handleOpenRejectModal={() => setOpenRejectModal(true)}
            confirmLoading={loading}
            type={lastPath}
            // onClose={() => setOpenDriverDetail(false)}
          />
        </Form>
      </div>
    </>
  );
};
