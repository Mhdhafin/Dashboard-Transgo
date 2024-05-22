"use client";
import * as z from "zod";
import dayjs from "dayjs";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ConfigProvider, DatePicker, Space } from "antd";
import { PencilLine } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import isEmpty from "lodash/isEmpty";
import { omitBy } from "lodash";

import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
// import FileUpload from "@/components/FileUpload";
import { useToast } from "../ui/use-toast";
import FileUpload from "../file-upload";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { useGetCustomers } from "@/hooks/api/useCustomer";
import { useQueryClient } from "@tanstack/react-query";
import { useGetFleets } from "@/hooks/api/useFleet";
import { Textarea } from "@/components/ui/textarea";
import { useGetDrivers } from "@/hooks/api/useDriver";
import { useEditRequest, usePostRequest } from "@/hooks/api/useRequest";
import locale from "antd/locale/id_ID";
import "dayjs/locale/id";
import ImageUpload from "../image-upload";
import Image from "next/image";
import { PreviewImage } from "../modal/preview-image";
const ImgSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  fileSize: z.number(),
  size: z.number(),
  fileKey: z.string(),
  key: z.string(),
  fileUrl: z.string(),
  url: z.string(),
});
dayjs.locale("id");
export const IMG_MAX_LIMIT = 3;

// perlu dipisah
const formSchema = z.object({
  fleet: z.string().min(1, { message: "Please select a fleet" }),
  // imgUrl: z.array(ImgSchema),
  customer: z.string().min(1, { message: "Please select a customer" }),
  pic: z.string().min(1, { message: "Please select a pic" }),
  time: z.any({ required_error: "Please select a time" }),
  type: z.string().min(1, { message: "Please select a type" }),
  address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  is_self_pickup: z.boolean(),
});

type RequestFormValues = z.infer<typeof formSchema>;

interface RequestFormProps {
  initialData: any | null;
  isEdit?: boolean;
}

export const RequestForm: React.FC<RequestFormProps> = ({
  initialData,
  isEdit,
}) => {
  const { requestId } = useParams();
  const { data: customers } = useGetCustomers({ limit: 10, page: 1 });
  const { data: fleets } = useGetFleets({ limit: 10, page: 1 });
  const { data: drivers } = useGetDrivers({ limit: 10, page: 1 });
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = !isEdit
    ? "Detail Request"
    : initialData
    ? "Edit Request"
    : "Create Request";
  const description = !isEdit
    ? ""
    : initialData
    ? "Edit a request for driver"
    : "Add a new request for driver";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";
  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(false);
  const type = [
    { id: "delivery", name: checked ? "Pengambilan" : "Pengantaran" },
    { id: "pick_up", name: checked ? "Pengembalian" : "Penjemputan" },
  ];
  const [content, setContent] = useState(null);

  const { mutate: createRequest } = usePostRequest();
  const { mutate: updateRequest } = useEditRequest(requestId as string);

  const predefinedDesc = `Jumlah penagihan ke Customer: Rp. xxx.xxx: \n\n\n*tolong tambahkan detail lainnya jika ada...
`;
  const predefinedAddress = `Tuliskan alamat disini: \n\n\nLink Google Maps:`;
  const defaultValues = initialData
    ? {
        customer: initialData?.customer?.id?.toString(),
        pic: initialData?.driver?.id?.toString(),
        fleet: initialData?.fleet?.id?.toString(),
        time: initialData?.start_date,
        type: initialData?.type,
        address: initialData?.address,
        description: initialData?.description,
        is_self_pickup: initialData?.is_self_pickup,
      }
    : {
        customer: "",
        pic: "",
        fleet: "",
        time: "",
        type: "",
        address: predefinedAddress,
        description: predefinedDesc,
        is_self_pickup: false,
      };
  console.log("defautl", defaultValues);
  console.log("predefinedAddress", predefinedAddress, defaultValues?.address);
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  let wording = "";
  if (initialData?.type === "delivery") {
    if (initialData?.is_self_pickup) {
      wording = "Pengambilan";
    } else {
      wording = "Pengantaran";
    }
  } else if (initialData?.type === "pick_up") {
    if (initialData?.is_self_pickup) {
      wording = "Pengembalian";
    } else {
      wording = "Penjemputan";
    }
  }

  const endlogs = initialData?.logs?.filter((log: any) => log.type === "end");

  const onSubmit = async (data: RequestFormValues) => {
    setLoading(true);
    const payload = {
      customer_id: Number(data?.customer),
      fleet_id: Number(data?.fleet),
      driver_id: Number(data?.pic),
      start_date: dayjs(data?.time).toISOString(),
      type: data?.type,
      address: data?.address,
      description: data?.description,
      is_self_pickup: data?.is_self_pickup,
    };
    const newPayload = omitBy(
      payload,
      (value) => value == predefinedAddress || value == predefinedDesc,
    );

    console.log("payload", newPayload);
    if (initialData) {
      updateRequest(newPayload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["requests"] });
          toast({
            variant: "success",
            title: "Request berhasil diubah!",
          });
          // router.refresh();
          router.push(`/dashboard/requests`);
        },
        onSettled: () => {
          setLoading(false);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Uh oh! ada sesuatu yang error",
            description: `error: ${error.message}`,
          });
        },
      });
    } else {
      createRequest(newPayload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["requests"] });
          toast({
            variant: "success",
            title: "Request berhasil dibuat!",
          });
          // router.refresh();
          router.push(`/dashboard/requests`);
        },
        onSettled: () => {
          setLoading(false);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Uh oh! ada sesuatu yang error",
            description: `error: ${error.message}`,
          });
        },
      });
    }
  };
  const onHandlePreview = (file: any) => {
    setContent(file);
    setOpen(true);
  };

  // const triggerImgUrlValidation = () => form.trigger("imgUrl");
  function makeUrlsClickable(str: string) {
    const urlRegex = /(\bhttps?:\/\/[^\s]+(\.[^\s]+)*(\/[^\s]*)?\b)/g;
    return str.replace(
      urlRegex,
      (url: any) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {!isEdit && (
          <Button
            disabled={loading}
            size="default"
            variant="main"
            onClick={() => router.push(`/dashboard/requests/${requestId}/edit`)}
          >
            <PencilLine />
            Edit
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {/* <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUpload
                    onChange={field.onChange}
                    value={field.value}
                    onRemove={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => {
                console.log(field);
                return (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select
                      disabled={!isEdit || loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl className="disabled:opacity-100">
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a customer"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* @ts-ignore  */}
                        {customers?.data?.items.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="fleet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fleet</FormLabel>
                  <Select
                    disabled={!isEdit || loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl className="disabled:opacity-100">
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a fleet"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fleets?.data?.items?.map((item: any) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                      {/* @ts-ignore  */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIC</FormLabel>
                  <Select
                    disabled={!isEdit || loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl className="disabled:opacity-100">
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a gender"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {drivers?.data?.items?.map((item: any) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                      {/* @ts-ignore  */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_self_pickup"
              render={({ field }) => {
                if (field.value === true) {
                  setChecked(true);
                } else {
                  setChecked(false);
                }
                return (
                  <FormItem className="flex space-x-2 items-center space-y-0">
                    <FormControl className="disabled:opacity-100">
                      <Checkbox
                        disabled={!isEdit || loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">
                      Oleh Customer
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Task</FormLabel>
                  <Select
                    disabled={!isEdit || loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl className="disabled:opacity-100">
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      {type.map((item: Type) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEdit ? (
              <FormItem>
                <FormLabel>Waktu</FormLabel>
                <FormControl className="disabled:opacity-100">
                  <Input
                    disabled={!isEdit || loading}
                    value={dayjs(defaultValues?.time)
                      .locale("id")
                      .format("HH:mm:ss - dddd,DD MMMM (YYYY)")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) : (
              <Controller
                control={form.control}
                name="time"
                render={({ field: { onChange, onBlur, value, ref } }) => {
                  console.log(dayjs(value).locale("id"));
                  return (
                    <ConfigProvider locale={locale}>
                      <Space size={12} direction="vertical">
                        <FormLabel>Waktu</FormLabel>
                        <DatePicker
                          disabled={loading}
                          style={{ width: "100%" }}
                          height={40}
                          className="p"
                          onChange={onChange} // send value to hook form
                          onBlur={onBlur} // notify when input is touched/blur
                          value={value ? dayjs(value).locale("id") : undefined}
                          format={"HH:mm:ss - dddd,DD MMMM (YYYY)"}
                          showTime
                        />
                      </Space>
                    </ConfigProvider>
                  );
                }}
              />
            )}
          </div>
          {!isEdit && initialData?.customer.id_photo && (
            <div className="md:grid md:grid-cols-3 gap-8">
              <FormItem>
                <FormLabel>KTP Customer</FormLabel>
                <div></div>
                <Image
                  onClick={() => {
                    setOpen(true);
                    onHandlePreview(initialData?.customer.id_photo);
                  }}
                  src={initialData?.customer.id_photo}
                  width={300}
                  height={300}
                  alt="photo"
                />
              </FormItem>
            </div>
          )}
          <div className="md:grid md:grid-cols-3 gap-8">
            {!isEdit ? (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <p
                  className="border border-gray-200 rounded-md px-2 py-1 break-words"
                  dangerouslySetInnerHTML={{
                    __html: !isEmpty(defaultValues?.address)
                      ? makeUrlsClickable(
                          defaultValues?.address?.replace(/\n/g, "<br />"),
                        )
                      : "-",
                  }}
                />
              </FormItem>
            ) : (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl className="disabled:opacity-100">
                      <Textarea
                        id="address"
                        placeholder="Alamat..."
                        className="col-span-4"
                        rows={8}
                        value={field.value ?? predefinedAddress}
                        disabled={!isEdit || loading}
                        onChange={field.onChange}
                      />
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
                  className="border border-gray-200 rounded-md px-2 py-1 break-words"
                  dangerouslySetInnerHTML={{
                    __html: !isEmpty(defaultValues?.description)
                      ? makeUrlsClickable(
                          defaultValues?.description?.replace(/\n/g, "<br />"),
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
                        value={field.value ?? predefinedDesc}
                        id="description"
                        placeholder="Deskripsi..."
                        className="col-span-4"
                        rows={8}
                        disabled={!isEdit || loading}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          {!isEdit && (
            <div className="md:grid md:grid-cols-3 gap-8">
              <FormItem>
                <FormLabel>Durasi</FormLabel>
                <FormControl className="disabled:opacity-100">
                  <Input
                    disabled={!isEdit || loading}
                    value={(dayjs as any)
                      .duration(initialData?.progress_duration_second * 1000)
                      .format("HH:mm")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}

          {!isEdit && (
            <div className="">
              <FormLabel>Foto Bukti Serah terima</FormLabel>
              {(initialData?.status === "pending" ||
                initialData?.status === "on_progress") && (
                <h1 className="">{`Request ${wording} belum selesai dilakukan `}</h1>
              )}
              {initialData?.status === "done" &&
                endlogs?.map((log: any) => (
                  <>
                    <div className="md:grid md:grid-cols-3 gap-8">
                      {log?.photos?.map((photo: any) => (
                        <Image
                          onClick={() => {
                            setOpen(true);
                            onHandlePreview(photo?.photo);
                          }}
                          key={photo.id}
                          src={photo.photo}
                          width={300}
                          height={300}
                          alt="photo"
                        />
                      ))}
                    </div>

                    <div
                      className="md:grid md:grid-cols-3 gap-8  mt-6"
                      key={log.id}
                    >
                      <FormItem>
                        <FormLabel>Deskripsi Driver</FormLabel>
                        <div
                          className="border border-gray-200 rounded-md px-2 py-1 break-words"
                          dangerouslySetInnerHTML={{
                            __html: !isEmpty(log?.description)
                              ? log?.description
                              : "-",
                          }}
                        />
                      </FormItem>
                    </div>
                  </>
                ))}
            </div>
          )}

          {isEdit && (
            <Button
              disabled={loading}
              className="ml-auto bg-main hover:bg-main/90"
              type="submit"
            >
              {action}
            </Button>
          )}
        </form>
      </Form>
      <PreviewImage
        isOpen={open}
        onClose={() => setOpen(false)}
        content={content}
      />
    </>
  );
};
