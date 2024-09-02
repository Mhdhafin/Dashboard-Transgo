import React, { useEffect, useState } from "react";
import * as z from "zod";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { ConfigProvider, DatePicker, Space, Select as AntdSelect } from "antd";

import {
  useGetInfinityCategories,
  usePatchLedgers,
  usePostLedgers,
} from "@/hooks/api/useLedgers";
import { useDebounce } from "use-debounce";

import dayjs from "dayjs";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";

dayjs.extend(utc);
dayjs.extend(timezone);

const formSchema = z
  .object({
    status: z.enum(["on_hold", "proccessed"]),
    credit_amount: z.number().nullable(),
    debit_amount: z.number().nullable(),
    description: z
      .string()
      .min(1, "Keterangan harus minimal 1 karakter")
      .max(30, "Keterangan maksimal 30 karakter"),
    date: z
      .string({
        required_error: "Tolong masukkan Tanggal",
      })
      .refine((value) => value.trim() !== "", {
        message: "Tanggal tidak boleh kosong",
      }),
    category_id: z.union([
      z.string().min(1, { message: "Kategori tidak boleh kosong" }),
      z.number().min(1, { message: "Kategori tidak boleh kosong" }),
      z.nullable(z.number()).refine((val) => val !== null, {
        message: "Kategori Tidak Boleh kosong",
      }),
    ]),
  })
  .refine(
    (data) => {
      if (data.credit_amount === null && data.debit_amount === null) {
        return false;
      }
      return true;
    },
    {
      message: "Biaya Tidak Boleh Kosong",
      path: ["credit_amount"],
    },
  );
type CashFlowSchema = z.infer<typeof formSchema>;

interface IAddEditCashFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
  fleet: {
    id: number;
    name: string;
  };
  isEdit?: boolean;
}

const AddEditCashFlowModal = ({
  isOpen,
  onClose,
  initialData,
  fleet,
  isEdit = false,
}: IAddEditCashFlowModalProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [localOptions, setLocalOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const handleAddAndSelectCategory = () => {
    const newOption = { id: searchText, name: searchText };
    setLocalOptions((prevOptions) => [...prevOptions, newOption]);
    form.setValue("category_id", newOption.id);
  };

  const defaultValues =
    !isEmpty(initialData) && isEdit
      ? {
          status: initialData.status,
          credit_amount: initialData.credit_amount,
          debit_amount: initialData.debit_amount,
          description: initialData.description,
          date: initialData.date,
          category_id: initialData.category.id,
        }
      : {
          status: "on_hold",
          credit_amount: null,
          debit_amount: null,
          description: "",
          date: "",
          category_id: null,
        };

  const form = useForm<CashFlowSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const Option = AntdSelect;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const [currentCategory, setCurrentCategory] = useState<
    "credit_amount" | "debit_amount" | string
  >(
    initialData
      ? initialData?.credit_amount !== null
        ? "credit_amount"
        : "debit_amount"
      : "credit_amount",
  );

  useEffect(() => {
    if (currentCategory === "credit_amount") {
      const debitAmount = form.getValues("debit_amount");
      if (debitAmount) {
        form.setValue("credit_amount", debitAmount);
        form.setValue("debit_amount", null);
      }
    } else if (currentCategory === "debit_amount") {
      const creditAmount = form.getValues("credit_amount");
      if (creditAmount) {
        form.setValue("debit_amount", creditAmount);
        form.setValue("credit_amount", null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

  const handleCategoryChange = (
    value: "credit_amount" | "debit_amount" | string,
  ) => {
    setCurrentCategory(value);
  };

  const { mutate: createLedger } = usePostLedgers();
  const { mutate: patchLedger } = usePatchLedgers(initialData?.id);

  const [searchCategory, setSearchCategory] = useState("");
  const [searchCategoryDebounce] = useDebounce(searchCategory, 500);

  const { data, isFetchingNextPage, fetchNextPage } = useGetInfinityCategories(
    searchCategoryDebounce,
  );
  const queryClient = useQueryClient();

  const onSubmit = (data: CashFlowSchema) => {
    const { category_id, ...restData } = data;
    const formattedDate = dayjs(data.date)
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    const newPayload = {
      ...restData,
      fleet_id: fleet.id,
      date: formattedDate,
      ...(typeof category_id === "string"
        ? { category: category_id }
        : { category_id }),
    };

    if (isEdit) {
      patchLedger(newPayload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["ledgers", "fleet"] });
          toast({
            variant: "success",
            title: "ledger successfully created!",
          });
          onClose();
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Uh oh! ada sesuatu yang error",
            description: `error: ${
              // @ts-ignore
              error?.response?.data?.message || error?.message
            }`,
          });
        },
      });

      return;
    }

    createLedger(newPayload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ledgers", "fleet"] });
        toast({
          variant: "success",
          title: "ledger successfully created!",
        });
        onClose();
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! ada sesuatu yang error",
          description: `error: ${
            // @ts-ignore
            error?.response?.data?.message || error?.message
          }`,
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>
            {isEdit ? "Edit Arus Pencatatan" : "Tambah Arus Pencatatan"}
          </DialogTitle>
          <DialogDescription>
            Tindakan ini akan menambahkan arus pemasukan / pengeluaran untuk
            armada{" "}
            <span className="text-sm font-bold text-[#64748B]">
              {fleet.name}
            </span>
            , mohon pastikan data yang diinput telah benar sepenuhnya.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="category_id"
              control={form.control}
              render={({ field }) => {
                return (
                  <Space size={12} direction="vertical" className="w-full">
                    <FormLabel className="relative label-required">
                      Kategori
                    </FormLabel>
                    <FormControl>
                      <AntdSelect
                        getPopupContainer={(trigger) => trigger.parentElement}
                        showSearch
                        value={field.value}
                        placeholder="Pilih Kategori"
                        style={{ width: "100%", height: "36px" }}
                        onSearch={(value) => {
                          setSearchCategory(value);
                          setSearchText(value);
                        }}
                        onChange={field.onChange}
                        onPopupScroll={(event) => {
                          const target = event.target as HTMLDivElement;
                          if (
                            target.scrollTop + target.offsetHeight ===
                            target.scrollHeight
                          ) {
                            fetchNextPage();
                          }
                        }}
                        filterOption={false}
                        notFoundContent={
                          isFetchingNextPage ? (
                            <p className="px-3 text-sm">loading</p>
                          ) : (
                            <p
                              onClick={handleAddAndSelectCategory}
                              className="text-[rgba(0,0,0,0.88)]"
                            >
                              + Tambah Kategori &quot;{searchText}&quot;
                            </p>
                          )
                        }
                      >
                        {isEdit && (
                          <Option value={initialData?.owner?.id}>
                            {initialData?.owner?.name}
                          </Option>
                        )}
                        {data?.pages.map((page: any) =>
                          page.data.items.map((item: any) => {
                            return (
                              <Option key={item.id} value={item.id}>
                                {item.name}
                              </Option>
                            );
                          }),
                        )}

                        {localOptions.map((item: any) => {
                          return (
                            <Option key={item.id} value={item.id}>
                              {item.name}
                            </Option>
                          );
                        })}

                        {isFetchingNextPage && (
                          <Option disabled>
                            <p className="px-3 text-sm">loading</p>
                          </Option>
                        )}
                      </AntdSelect>
                    </FormControl>
                    <FormMessage />
                  </Space>
                );
              }}
            />
            <FormField
              control={form.control}
              name="description"
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
                      className="!placeholder-black !placeholder-opacity-25"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="relative label-required">
                    Tanggal
                  </FormLabel>
                  <FormControl>
                    <ConfigProvider>
                      <Space size={12} direction="vertical" className="w-full">
                        <DatePicker
                          className="w-full"
                          size="large"
                          onChange={(_, dateString) =>
                            field.onChange(dateString)
                          }
                          onBlur={field.onBlur}
                          value={
                            field.value
                              ? dayjs(field.value, "YYYY-MM-DD")
                              : undefined
                          }
                          format="YYYY-MM-DD"
                          showNow
                        />
                      </Space>
                    </ConfigProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={
                currentCategory === "credit_amount"
                  ? "credit_amount"
                  : "debit_amount"
              }
              control={form.control}
              render={({ field, fieldState }) => {
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
                          thousandSeparator=","
                          allowNegative={false}
                          value={field.value || ""}
                          onValueChange={(values) =>
                            field.onChange(Number(values.value))
                          }
                          onBlur={field.onBlur}
                        />
                      </div>
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                );
              }}
            />

            <FormItem>
              <FormLabel className="relative label-required">Arus</FormLabel>
              <FormControl>
                <Tabs
                  onValueChange={handleCategoryChange}
                  value={currentCategory}
                >
                  <TabsList className="grid w-full grid-cols-2 !h-10">
                    <TabsTrigger value="credit_amount" className="!h-8">
                      Kredit (-)
                    </TabsTrigger>
                    <TabsTrigger value="debit_amount" className="!h-8">
                      Debit (+)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="relative label-required">
                      Status
                    </FormLabel>
                    <FormControl>
                      <Tabs
                        onValueChange={field.onChange}
                        defaultValue="proccessed"
                        value={
                          field.value == "on_hold" ? "on_hold" : "proccessed"
                        }
                      >
                        <TabsList className="grid w-full grid-cols-2 !h-10">
                          <TabsTrigger value="on_hold" className="!h-8">
                            Belum Diproses
                          </TabsTrigger>
                          <TabsTrigger value="proccessed" className="!h-8">
                            Sudah Diproses
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={isChecked}
                onCheckedChange={() => setIsChecked(!isChecked)}
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
                disabled={!isChecked}
                variant="main"
                type="submit"
              >
                {isEdit ? "Edit Pencatatan" : "Konfirmasi Pencatatan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCashFlowModal;
