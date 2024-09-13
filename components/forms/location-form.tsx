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
  name: z.string().min(1, { message: "Nama Lokasi diperlukan" }),
  location: z.string().min(1, { message: "Nama Tempat diperlukan" }),
  address: z.string().min(1, { message: "Deskripsi Alamat diperlukan" }),
  map_url: z.string().min(1, { message: "Link Embed Maps diperlukan" }),
  redirect_url: z.string().min(1, { message: "Link Maps diperlukan" }),
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
        location: "",
        address: "",
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
      location: data.location,
      address: data.address,
      map_url: data.map_url,
      redirect_url: data.redirect_url,
    };

    if (initialData) {
      updateRequest(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["locations"] });
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
          queryClient.invalidateQueries({ queryKey: ["locations"] });
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
                    Nama Lokasi
                  </FormLabel>
                  <FormControl className="disabled:opacity-100">
                    <Input
                      disabled={!isEdit || loading}
                      placeholder="Nama Lokasi"
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
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="relative label-required">
                    Nama Tempat
                  </FormLabel>
                  <FormControl className="disabled:opacity-100">
                    <Input
                      disabled={!isEdit || loading}
                      placeholder="Nama Tempat"
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
          </div>
          <div className="md:grid md:grid-cols-3 gap-8">
            {!isEdit ? (
              <FormItem>
                <FormLabel>Deskripsi Alamat</FormLabel>
                <p
                  className="border border-gray-200 rounded-md px-3 py-1 break-words"
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
                    <FormLabel className="relative label-required">
                      Deskripsi Alamat
                    </FormLabel>
                    <FormControl className="disabled:opacity-100">
                      <Textarea
                        id="description"
                        placeholder="Deskripsi Alamat..."
                        className="col-span-4"
                        rows={8}
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
            {!isEdit ? (
              <FormItem>
                <FormLabel>Link Maps</FormLabel>
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
                    <FormLabel className="relative label-required">
                      Link Maps
                    </FormLabel>
                    <FormControl className="disabled:opacity-100">
                      <Textarea
                        id="description"
                        placeholder="Masukkan Link Maps..."
                        className="col-span-4"
                        rows={8}
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
            {!isEdit ? (
              <FormItem>
                <FormLabel>Link Embed Maps</FormLabel>
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
                    <FormLabel className="relative label-required">
                      Link Embed Maps
                    </FormLabel>
                    <FormControl className="disabled:opacity-100">
                      <Textarea
                        id="description"
                        placeholder="Masukkan Link Embed Maps..."
                        className="col-span-4"
                        rows={8}
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
