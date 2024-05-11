"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useEditDriver, usePostDriver } from "@/hooks/api/useDriver";
import { useQueryClient } from "@tanstack/react-query";
import ImageUpload, { ImageUploadResponse } from "../image-upload";
import axios from "axios";
import useAxiosAuth from "@/hooks/axios/use-axios-auth";
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
  date_of_birth: z.string({ required_error: "Date of Birth is required" }),
  file: z.any(),
});

const formEditSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  // imgUrl: z.array(ImgSchema),
  nik: z.string().min(16, { message: "NIK must be at least 16 characters" }),
  email: z.string().email({ message: "email must be valid" }),
  date_of_birth: z.string(),
  file: z.any(),
});

type DriverFormValues = z.infer<typeof formSchema> & {
  file: ImageUploadResponse;
};

interface DriverFormProps {
  initialData: any | null;
  categories: any;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  initialData,
  categories,
}) => {
  console.log("categories", categories);
  const { driverId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = initialData ? "Edit Driver" : "Create Driver";
  const description = initialData ? "Edit a Driver" : "Add a new driver";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";
  const queryClient = useQueryClient();

  const axiosAuth = useAxiosAuth();
  const { mutate: createDriver } = usePostDriver();
  const { mutate: updateDriver } = useEditDriver(driverId as string);

  const defaultValues = initialData
    ? initialData
    : {
        name: "",
        nik: "",
        email: "",
        imgUrl: [],
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
    if (initialData) {
      const uploadImageResponse = await uploadImage(data?.file);

      updateDriver(
        { ...data, id_photo: uploadImageResponse.download_url },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["drivers"] });
            toast({
              variant: "success",
              title: "Driver berhasil diedit!",
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
        },
      );
    } else {
      const uploadImageResponse = await uploadImage(data?.file);

      createDriver(
        { ...data, id_photo: uploadImageResponse.download_url },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["drivers"] });
            toast({
              variant: "success",
              title: "Driver berhasil dibuat!",
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
        },
      );
    }
  };

  // const triggerImgUrlValidation = () => form.trigger("imgUrl");

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {/* {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )} */}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
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
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
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
                    <Input disabled={loading} placeholder="Email" {...field} />
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
                    <Input disabled={loading} placeholder="NIK" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="1999-20-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    disabled={loading}
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
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
