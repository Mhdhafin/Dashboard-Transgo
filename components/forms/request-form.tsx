"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
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
import {
  usePostCustomer,
  usePatchCustomer,
  useGetCustomers,
} from "@/hooks/api/useCustomer";
import { useQueryClient } from "@tanstack/react-query";
import { useGetFleets } from "@/hooks/api/useFleet";
import { Textarea } from "@/components/ui/textarea";
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

// perlu dipisah
const formSchema = z.object({
  fleet: z.string().min(1, { message: "Please select a fleet" }),
  // imgUrl: z.array(ImgSchema),
  customer: z.string().min(1, { message: "Please select a customer" }),
  pic: z.string().min(1, { message: "Please select a pic" }),
  time: z.string({ required_error: "time is required" }),
  type: z.string().min(1, { message: "Please select a type" }),
  address: z.string({ required_error: "address is required" }),
  description: z.string({ required_error: "description is required" }),
  is_self_pickup: z.string({ required_error: "self pickup is required" }),
});

type RequestFormValues = z.infer<typeof formSchema>;

interface RequestFormProps {
  initialData: any | null;
}

export const RequestForm: React.FC<RequestFormProps> = ({ initialData }) => {
  const { customerId } = useParams();
  const { data: customers } = useGetCustomers({ limit: 10, page: 1 });
  const { data: fleet } = useGetFleets({ limit: 10, page: 1 });
  console.log("cus", customers, fleet);
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = initialData ? "Edit Customer" : "Create Customer";
  const description = initialData ? "Edit a customer" : "Add a new customer";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";
  const queryClient = useQueryClient();

  const { mutate: createCustomer } = usePostCustomer();
  const { mutate: updateCustomer } = usePatchCustomer(customerId as string);

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

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: RequestFormValues) => {
    setLoading(true);
    if (initialData) {
      console.log("data", data);
      // updateCustomer(data, {
      //   onSuccess: () => {
      //     queryClient.invalidateQueries({ queryKey: ["customers"] });
      //     toast({
      //       variant: "success",
      //       title: "Customer berhasil diedit!",
      //     });
      //     router.push(`/dashboard/customers`);
      //   },
      //   onSettled: () => {
      //     setLoading(false);
      //   },
      //   onError: (error) => {
      //     toast({
      //       variant: "destructive",
      //       title: "Uh oh! ada sesuatu yang error",
      //       description: `error: ${error.message}`,
      //     });
      //   },
      // });
    } else {
      createCustomer(data, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["customers"] });
          toast({
            variant: "success",
            title: "Customer berhasil dibuat!",
          });
          // router.refresh();
          router.push(`/dashboard/customers`);
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
      // const res = await axios.post(`/api/products/create-product`, data);
      // console.log("product", res);
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a gender"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      <SelectItem>category.name</SelectItem>
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
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a gender"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      <SelectItem>category.name</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fleet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fleet</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a gender"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      <SelectItem>category.name</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Description..."
                      className="col-span-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      <SelectItem>category.name</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Waktu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fleet</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Description..."
                      className="col-span-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_self_pickup"
              render={({ field }) => (
                <FormItem className="space-x-2">
                  <FormControl>
                    <Checkbox {...field} />
                  </FormControl>
                  <FormLabel>self pick</FormLabel>
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
