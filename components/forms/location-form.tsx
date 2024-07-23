"use client";
import * as z from "zod";
import dayjs from "dayjs";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import isEmpty from "lodash/isEmpty";
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
import { useToast } from "../ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import "dayjs/locale/id";
import { useEditLocation, usePostLocation } from "@/hooks/api/useLocation";
import { makeUrlsClickable } from "@/lib/utils";
dayjs.locale("id");

// perlu dipisah
const formSchema = z.object({
  name: z.string().min(1, { message: "Nama diperlukan" }),
  description: z.string().optional().nullable(),
  map_url: z.string().optional().nullable(),
  redirect_url: z.string().optional().nullable(),
});

type LocationFormValues = z.infer<typeof formSchema>;

interface LocationFormProps {
  initialData: any | null;
  isEdit?: boolean;
}

export const LocationForm: React.FC<LocationFormProps> = ({
  initialData,
  isEdit,
}) => {
  const { locationId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const title = !isEdit
    ? "Detail Location"
    : initialData
    ? "Edit Location"
    : "Create Location";
  const description = !isEdit
    ? ""
    : initialData
    ? "Edit location"
    : "Add new location";
  const toastMessage = initialData
    ? "Location berhasil diubah!"
    : "Location berhasil dibuat!";

  const action = initialData ? "Save changes" : "Create";
  const queryClient = useQueryClient();

  const { mutate: createLocation } = usePostLocation();
  const { mutate: updateRequest } = useEditLocation(locationId as string);

  const defaultValues = initialData
    ? initialData
    : {
        name: "",
        description: "",
        map_url: "",
        redirect_url: "",
      };

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: LocationFormValues) => {
    setLoading(true);
    const payload = {
      name: data.name,
      description: !isEmpty(data.description) ? data.description : null,
      map_url: !isEmpty(data.map_url) ? data.map_url : null,
      redirect_url: !isEmpty(data.redirect_url) ? data.redirect_url : null,
    };

    if (initialData) {
      updateRequest(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["requests"] });
          toast({
            variant: "success",
            title: toastMessage,
          });
          router.refresh();
          router.push(`/dashboard/location`);
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
      createLocation(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["location"] });
          toast({
            variant: "success",
            title: toastMessage,
          });
          router.refresh();
          router.push(`/dashboard/location`);
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
    }
  };

  // const triggerImgUrlValidation = () => form.trigger("imgUrl");

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
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="relative label-required">
                    Nama
                  </FormLabel>
                  <FormControl className="disabled:opacity-100">
                    <Input
                      disabled={!isEdit || loading}
                      placeholder="Nama Location"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEdit ? (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <p
                  className="border border-gray-200 rounded-md px-3 py-1 break-words"
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
                        id="description"
                        placeholder="Deskripsi..."
                        className="col-span-4"
                        rows={8}
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
          {/* <div className="md:grid md:grid-cols-2 gap-8"></div> */}
          <div className="md:grid md:grid-cols-2 gap-8">
            {!isEdit ? (
              <FormItem>
                <FormLabel>Link Maps</FormLabel>
                <p
                  className="border border-gray-200 rounded-md px-3 py-1 break-words"
                  dangerouslySetInnerHTML={{
                    __html: !isEmpty(defaultValues?.map_url)
                      ? makeUrlsClickable(
                          defaultValues?.map_url?.replace(/\n/g, "<br />"),
                        )
                      : "-",
                  }}
                />
              </FormItem>
            ) : (
              <FormField
                control={form.control}
                name="map_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Maps</FormLabel>
                    <FormControl className="disabled:opacity-100">
                      <Textarea
                        id="description"
                        placeholder="Masukkan Link Maps..."
                        className="col-span-4"
                        rows={8}
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
            {!isEdit ? (
              <FormItem>
                <FormLabel>Link Redirect</FormLabel>
                <p
                  className="border border-gray-200 rounded-md px-3 py-1 break-words"
                  dangerouslySetInnerHTML={{
                    __html: !isEmpty(defaultValues?.redirect_url)
                      ? makeUrlsClickable(
                          defaultValues?.redirect_url?.replace(/\n/g, "<br />"),
                        )
                      : "-",
                  }}
                />
              </FormItem>
            ) : (
              <FormField
                control={form.control}
                name="redirect_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Redirect</FormLabel>
                    <FormControl className="disabled:opacity-100">
                      <Textarea
                        id="description"
                        placeholder="Masukkan Link Redirect..."
                        className="col-span-4"
                        rows={8}
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
    </>
  );
};
