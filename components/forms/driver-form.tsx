"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
// import FileUpload from "@/components/FileUpload";
import { useToast } from "../ui/use-toast";
import { useEditDriver, usePostDriver } from "@/hooks/api/useDriver";
import { useQueryClient } from "@tanstack/react-query";
import ImageUpload, { ImageUploadResponse } from "../image-upload";
import axios from "axios";
import useAxiosAuth from "@/hooks/axios/use-axios-auth";
import { ConfigProvider, DatePicker, Space, theme } from "antd";
import { useTheme } from "next-themes";
import dayjs from "dayjs";
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
export const IMG_MAX_LIMIT = 3;
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  // imgUrl: z.array(ImgSchema),
  nik: z.string().min(16, { message: "NIK must be at least 16 characters" }),
  email: z.string().email({ message: "email must be valid" }),
  gender: z.string().min(1, { message: "Please select a gender" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  date_of_birth: z.any({ required_error: "Date of Birth is required" }),
  file: z.any(),
});

const formEditSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  // imgUrl: z.array(ImgSchema),
  nik: z.string().min(16, { message: "NIK must be at least 16 characters" }),
  email: z.string().email({ message: "email must be valid" }),
  date_of_birth: z.any({ required_error: "Date of Birth is required" }),
  file: z.any(),
});

type DriverFormValues = z.infer<typeof formSchema> & {
  file: ImageUploadResponse;
};

interface DriverFormProps {
  initialData: any | null;
  categories: any;
  isEdit?: boolean;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  initialData,
  categories,
  isEdit,
}) => {
  const { driverId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = !isEdit
    ? "Detail Driver"
    : initialData
    ? "Edit Driver"
    : "Create Driver";
  const description = !isEdit
    ? ""
    : initialData
    ? "Edit a Driver"
    : "Add a new driver";
  const toastMessage = initialData
    ? "Driver changed successfully!"
    : "Driver created successfully!";
  const action = initialData ? "Save changes" : "Create";
  const queryClient = useQueryClient();

  const axiosAuth = useAxiosAuth();
  const { mutate: createDriver } = usePostDriver();
  const { mutate: updateDriver } = useEditDriver(driverId as string);
  const { theme: themeMode } = useTheme();

  const defaultValues = initialData
    ? {
        name: initialData?.name,
        nik: initialData?.nik,
        email: initialData?.email,
        date_of_birth: initialData?.date_of_birth,
        gender: initialData?.gender,
        file: initialData?.file,
      }
    : {
        name: "",
        nik: "",
        email: "",
        password: "",
        date_of_birth: "",
        gender: "",
      };
  console.log(initialData);
  console.log("defautl", defaultValues);

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(!initialData ? formSchema : formEditSchema),
    defaultValues,
  });

  const uploadImage = async (file: ImageUploadResponse | undefined) => {
    if (!file?.data) {
      return undefined;
    }

    const presignQuery = {
      file_name: file?.data?.name,
      folder: "user",
    };

    const response = await axiosAuth.get("/storages/presign", {
      params: presignQuery,
    });
    await axios.put(response.data.upload_url, file?.data, {
      headers: {
        "Content-Type": file?.data?.type,
      },
    });

    return response.data;
  };

  const onSubmit = async (data: DriverFormValues) => {
    setLoading(true);
    const uploadImageResponse = await uploadImage(data?.file);
    const newData: any = { ...data };
    newData.file = undefined;
    newData.date_of_birth = dayjs(data?.date_of_birth).format("YYYY-MM-DD");

    if (uploadImageResponse) {
      newData.id_photo = uploadImageResponse.download_url;
    }

    if (initialData) {
      updateDriver(newData, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["drivers"] });
          toast({
            variant: "success",
            title: toastMessage,
          });
          router.push(`/dashboard/drivers`);
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
      const uploadImageResponse = await uploadImage(data?.file);
      delete data?.file;
      const payload = {
        ...data,
        id_photo: uploadImageResponse.download_url,
        date_of_birth: dayjs(data?.date_of_birth).format("YYYY-MM-DD"),
      };
      createDriver(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["drivers"] });
          toast({
            variant: "success",
            title: toastMessage,
          });
          // router.refresh();
          router.push(`/dashboard/drivers`);
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

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEdit || loading}
                      placeholder="Nama Driver"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEdit || loading}
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!initialData && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        // type="password"
                        disabled={loading}
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEdit || loading}
                      placeholder="NIK"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={form.control}
              name="date_of_birth"
              render={({ field: { onChange, onBlur, value, ref } }) => {
                console.log("dateval", value);
                return (
                  <ConfigProvider
                    theme={{
                      algorithm:
                        themeMode === "light"
                          ? theme.defaultAlgorithm
                          : theme.darkAlgorithm,
                    }}
                  >
                    <Space size={12} direction="vertical">
                      <FormLabel>Date of Birth</FormLabel>
                      <DatePicker
                        disabled={!isEdit || loading}
                        height={40}
                        className="p"
                        onChange={onChange} // send value to hook form
                        onBlur={onBlur}
                        value={value ? dayjs(value, "YYYY-MM-DD") : undefined}
                        format={"YYYY-MM-DD"}
                      />
                    </Space>
                  </ConfigProvider>
                );
              }}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    disabled={!isEdit || loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={!isEdit || loading}
                    onChange={field.onChange}
                    value={field.value}
                    onRemove={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.file && (
            <span className="text-red-500">
              {form.formState.errors.file.message?.toString()}
            </span>
          )}
          {isEdit && (
            <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};
