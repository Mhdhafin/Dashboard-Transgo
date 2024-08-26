import React, { useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { ConfigProvider, DatePicker, Space } from "antd";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z
    .string({ required_error: "Nama diperlukan" })
    .min(3, { message: "Nama minimal harus 3 karakter" }),
  email: z
    .string({ required_error: "Email diperlukan" })
    .email({ message: "Email harus valid" }),
  gender: z.string().optional().nullable(),
  password: z
    .string({ required_error: "Password diperlukan" })
    .min(5, { message: "Password minimal harus 5" }),
  date_of_birth: z.any().optional().nullable(),
  phone_number: z
    .string({ required_error: "Nomor telepon diperlukan" })
    .min(10, { message: "Nomor Emergency minimal harus 10 digit" }),
});

const formEditSchema = z.object({
  name: z
    .string({ required_error: "Nama diperlukan" })
    .min(3, { message: "Nama minimal harus 3 karakter" }),
  email: z
    .string({ required_error: "Email diperlukan" })
    .email({ message: "Email harus valid" }),
  date_of_birth: z.any().optional(),
  phone_number: z
    .string({ required_error: "Nomor telepon diperlukan" })
    .min(10, { message: "Nomor Emergency minimal harus 10 digit" }),
  password: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val !== undefined && val !== null && val !== "") {
          return val.length >= 5;
        }

        return true;
      },
      { message: "Password minimal harus 5 karakter" },
    ),
  gender: z.string().optional().nullable(),
});

type OwnerFormValues = z.infer<typeof formSchema>;

interface IAddEditCashFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  initialData?: any | null;
  fleetName: string;
}

const AddEditCashFlowModal = ({
  isOpen,
  onClose,
  isLoading = false,
  initialData,
  fleetName,
}: IAddEditCashFlowModalProps) => {
  console.log("🚀 ~ initialData:", initialData);
  const [isChecked, setIsChecked] = useState(false);

  const defaultValues = initialData
    ? {
        name: initialData?.name,
        email: initialData?.email,
        date_of_birth: initialData?.date_of_birth,
        gender: initialData?.gender,
        photo_profile: initialData?.photo_profile,
        phone_number: initialData?.phone_number,
      }
    : {
        date_of_birth: null,
      };

  const form = useForm<OwnerFormValues>({
    resolver: zodResolver(!initialData ? formSchema : formEditSchema),
    defaultValues,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Tambah Arus Pencatatan</DialogTitle>
          <DialogDescription>
            Tindakan ini akan menambahkan arus pemasukan / pengeluaran untuk
            armada{" "}
            <span className="text-sm font-bold text-[#64748B]">
              {fleetName}
            </span>
            , mohon pastikan data yang diinput telah benar sepenuhnya.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-4 w-full">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="relative label-required">
                    Kategori
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    defaultValue={field.value ?? ""}
                  >
                    <FormControl className="disabled:opacity-100 !h-10">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        { _id: "male", name: "Pengeluaran Owner" },
                        { _id: "female", name: "Pemasukan Tambahan" },
                      ].map((category) => (
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

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="relative label-required">
                    Keterangan
                  </FormLabel>
                  <FormControl className="disabled:opacity-100 !h-10">
                    <Input
                      placeholder="Keterangan"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="date_of_birth"
              render={({ field: { onChange, onBlur, value, ref } }) => {
                return (
                  <ConfigProvider>
                    <Space size={12} direction="vertical" className="w-full">
                      <FormLabel className="relative label-required">
                        Tanggal
                      </FormLabel>
                      <DatePicker
                        className="w-full"
                        size="large"
                        onChange={onChange}
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
              name={`additionals.price`}
              // control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="relative label-required">
                      Biaya
                    </FormLabel>
                    <FormControl className="disabled:opacity-100">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 z-10 -translate-y-1/2 ">
                          Rp.
                        </span>
                        <NumericFormat
                          customInput={Input}
                          type="text"
                          className="h-[40px] pl-9 disabled:opacity-90"
                          allowLeadingZeros
                          thousandSeparator=","
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <FormField
              // control={form.control}
              name="is_out_of_town"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="relative label-required">
                      Kategori
                    </FormLabel>
                    <FormControl>
                      <Tabs
                        onValueChange={field.onChange}
                        value={
                          field.value == false ? "dalam_kota" : "luar_kota"
                        }
                      >
                        <TabsList className="grid w-full grid-cols-2 !h-10">
                          <TabsTrigger value="dalam_kota" className="!h-8">
                            Kredit (-)
                          </TabsTrigger>
                          <TabsTrigger value="luar_kota" className="!h-8">
                            Debit (+)
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <FormField
              // control={form.control}
              name="is_out_of_town"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="relative label-required">
                      Status
                    </FormLabel>
                    <FormControl>
                      <Tabs
                        onValueChange={field.onChange}
                        value={
                          field.value == false ? "dalam_kota" : "luar_kota"
                        }
                      >
                        <TabsList className="grid w-full grid-cols-2 !h-10">
                          <TabsTrigger value="dalam_kota" className="!h-8">
                            Belum Diproses
                          </TabsTrigger>
                          <TabsTrigger value="luar_kota" className="!h-8">
                            Sudah Diproses
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={isChecked}
            onCheckedChange={() => setIsChecked(!isChecked)}
            disabled={isLoading}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Data Telah Benar Sepenuhnya
          </label>
        </div>

        <DialogFooter className="space-x-2 flex items-center justify-end w-full">
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Kembali
          </Button>
          <Button
            className="min-w-[164px]"
            disabled={isLoading || isChecked}
            variant="main"
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              // onConfirm();
            }}
          >
            {isLoading ? (
              <Spinner className="h-5 w-5" />
            ) : (
              "Konfirmasi Pencatatan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCashFlowModal;
