"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { usePostDriver } from "@/hooks/api/useDriver";
import { useQueryClient } from "@tanstack/react-query";
import { useEditFleet, usePostFleet } from "@/hooks/api/useFleet";
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
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, { message: "Name must be at least 3 characters" }),
  // imgUrl: z.array(ImgSchema),
  color: z.string({
    required_error: "Color is required",
    invalid_type_error: "Color must be a string",
  }),
  plate_number: z.string({
    required_error: "Color is required",
    invalid_type_error: "Color must be a string",
  }),
  type: z.string({ required_error: "type is required" }),
});

const formEditSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, { message: "Name must be at least 3 characters" }),
  // imgUrl: z.array(ImgSchema),
  color: z.string({
    required_error: "Color is required",
    invalid_type_error: "Color must be a string",
  }),
  plate_number: z.string({
    required_error: "Color is required",
    invalid_type_error: "Color must be a string",
  }),
  type: z.string({ required_error: "type is required" }),
});

type FleetFormValues = z.infer<typeof formSchema>;
type FleetType = {
  id: string;
  name: string;
};
interface FleetFormProps {
  initialData: any | null;
  type: FleetType[];
}

export const FleetForm: React.FC<FleetFormProps> = ({ initialData, type }) => {
  const { fleetId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = initialData ? "Edit Fleet" : "Create Fleet";
  const description = initialData ? "Edit a fleet" : "Add a new fleet";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";
  const queryClient = useQueryClient();

  const { mutate: createFleet } = usePostFleet();
  const { mutate: editFleet } = useEditFleet(fleetId as string);

  const defaultValues = initialData
    ? initialData
    : {
        name: "",
        color: "",
        type: "car",
        plate_number: "",
        photos: [],
      };
  console.log(initialData);
  console.log("defautl", defaultValues);

  const form = useForm<FleetFormValues>({
    resolver: zodResolver(!initialData ? formSchema : formEditSchema),
    defaultValues,
  });

  const onSubmit = async (data: FleetFormValues) => {
    console.log(data);
    // setLoading(true);
    if (initialData) {
      editFleet(
        { ...data, photos: [] },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleets"] });
            toast({
              variant: "success",
              title: "Fleet berhasil diubah!",
            });
            // router.refresh();
            router.push(`/dashboard/fleets`);
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
      createFleet(
        { ...data, photos: [] },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleets"] });
            toast({
              variant: "success",
              title: "Fleet berhasil dibuat!",
            });
            // router.refresh();
            router.push(`/dashboard/fleets`);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nama Fleet"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plate_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plate Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Plate Number"
                      {...field}
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
                      {type.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
