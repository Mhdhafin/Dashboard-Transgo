import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/utils";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import dayjs from "dayjs";
import { ChevronDown, EyeIcon, Info } from "lucide-react";

interface PriceDetailProps {
  form: any;
  detail: any;
  handleOpenApprovalModal: () => void;
  handleOpenRejectModal: () => void;
  showServicePrice: boolean;
  isEdit: boolean;
  initialData: any;
}

const PriceDetail: React.FC<PriceDetailProps> = ({
  form,
  detail,
  handleOpenApprovalModal,
  handleOpenRejectModal,
  showServicePrice,
  isEdit,
  initialData,
}) => {
  console.log("detail", initialData, detail);
  return (
    <div
      className="min-[1920px]:w-[640px] w-[400px] min-h-[1753px] p-5 absolute  mt-[-140px] right-0 border-l border-neutral-400"
      id="detail-sidebar"
    >
      <div className="sticky top-0">
        <h4 className="text-center font-semibold text-xl mb-4">
          Rincian Harga{" "}
          {form.getValues("is_with_driver") ? "Lepas Kunci" : "Dengan Supir"}
        </h4>
        <div className="flex flex-col justify-between h-[800px]">
          <div>
            <div className="border border-neutral-200 rounded-md p-[10px] mb-4">
              {form.getValues("is_with_driver") && (
                <>
                  <p className="font-medium text-sm text-neutral-700">
                    Dengan Supir
                  </p>
                  <div className="flex justify-between">
                    <p className="font-medium text-sm text-neutral-700">
                      {form.getValues("is_out_of_town")
                        ? "Luar Kota"
                        : "Dalam Kota"}
                    </p>
                    <p className="font-semibold text-base">
                      {formatRupiah(detail?.total_driver_price ?? 0)}
                    </p>
                  </div>
                </>
              )}
              <p className="font-medium text-sm text-neutral-700 mb-1">
                Nama Armada
              </p>
              <div className="flex justify-between mb-1">
                <p className="font-medium text-sm text-neutral-700">
                  {detail?.fleet?.name
                    ? `${detail?.fleet?.name} (per 24 jam)`
                    : "Armada"}
                </p>
                <p className="font-semibold text-base">
                  {formatRupiah(detail?.fleet.price ?? 0)}
                </p>
              </div>
              {detail?.fleet && (
                <div className="flex justify-between mb-1">
                  <p className="font-medium text-sm text-neutral-700">
                    {form.getValues("duration")} hari
                  </p>
                  <p className="font-semibold text-base">
                    {formatRupiah(
                      detail?.fleet.price * form.getValues("duration"),
                    )}
                  </p>
                </div>
              )}
              <Separator className="mb-1" />
              {showServicePrice && (
                <>
                  <p className="font-medium text-sm text-neutral-700 mb-1">
                    Biaya Layanan
                  </p>
                  <div className="flex justify-between mb-1">
                    <p className="font-medium text-sm text-neutral-700">
                      Diantar & Dijemput
                    </p>
                    <p className="font-semibold text-base">
                      {formatRupiah(detail?.service_price ?? 0)}
                    </p>
                  </div>
                </>
              )}
              <Separator className="mb-1" />
              <p className="font-medium text-sm text-neutral-700 mb-1">
                Biaya Asuransi
              </p>
              <div className="flex justify-between mb-1">
                <p className="font-medium text-sm text-neutral-700">
                  {detail?.insurance?.name ?? "Tidak ada"}
                </p>
                <p className="font-semibold text-base">
                  {formatRupiah(detail?.insurance.price ?? 0)}
                </p>
              </div>
              {detail?.weekend_days?.length >= 1 && (
                <>
                  <p className="font-medium text-sm text-neutral-700 mb-1">
                    Harga Akhir Pekan
                  </p>
                  <div className="flex justify-between mb-1">
                    {detail?.weekend_days.length == 1 ? (
                      <p className="font-medium text-sm text-neutral-700">
                        {dayjs(detail?.weekend_days)
                          .locale("id")
                          .format("dddd, D MMMM YYYY")}
                      </p>
                    ) : (
                      <div className="flex">
                        <p className="font-medium text-sm text-neutral-700 mr-4">
                          {detail?.weekend_days.length} hari
                        </p>
                        <DropdownWeekend days={detail?.weekend_days} />
                      </div>
                    )}
                    <p className="font-semibold text-base">
                      {formatRupiah(
                        detail?.weekend_days.length * detail?.weekend_price ??
                          0,
                      )}
                    </p>
                  </div>
                </>
              )}
              <Separator className="mb-1" />
              <div className="flex justify-between mb-1">
                <p className="font-medium text-sm text-neutral-700">Subtotal</p>
                <p className="font-semibold text-base">
                  {formatRupiah(detail?.sub_total ?? 0)}
                </p>
              </div>
            </div>
            <div className="border border-neutral-200 rounded-md p-[10px]">
              <p className="text-base font-semibold mb-3 text-neutral-700 ">
                Diskon
              </p>
              <FormField
                name="discount"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative mb-1">
                        <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2 ">
                          %
                        </span>
                        <Input
                          disabled={!isEdit}
                          type="number"
                          className="pr-4"
                          value={field.value || "0"}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between mb-1">
                <p className="font-medium text-sm text-neutral-700">
                  Potongan Diskon
                </p>
                <p className="font-semibold text-base">
                  {formatRupiah(detail?.discount ?? 0)}
                </p>
              </div>
              <Separator className="mb-1" />
              <div className="flex justify-between mb-1">
                <p className="font-medium text-sm text-neutral-700">
                  Total Sebelum Pajak
                </p>
                <p className="font-semibold text-base">
                  {formatRupiah(detail?.total ?? 0)}
                </p>
              </div>
              <div className="flex justify-between mb-1">
                <p className="font-medium text-sm text-neutral-700">
                  Pajak (10%)
                </p>
                <p className="font-semibold text-base">
                  {formatRupiah(detail?.tax ?? 0)}
                </p>
              </div>
              <Separator className="mb-1" />
              <div className="flex justify-between mb-1">
                <p className="font-medium text-sm text-neutral-700">
                  Total Pembayaran
                </p>
                <p className="font-semibold text-base">
                  {formatRupiah(detail?.grand_total ?? 0)}
                </p>
              </div>
            </div>
          </div>
          {initialData?.status === "pending" && (
            <div className="flex flex-col gap-5">
              <div className="flex bg-neutral-100 p-4 gap-5 rounded-md">
                <Info className="h-10 w-10" />
                <p>
                  Invoice akan tersedia saat pesanan telah dikonfirmasi.
                  Pastikan semua data benar.
                </p>
              </div>
              <Button
                onClick={handleOpenRejectModal}
                className="w-full bg-red-50 text-red-500 hover:bg-red-50/90"
                type="button"
              >
                Tolak Pesanan
              </Button>
              <Button
                onClick={handleOpenApprovalModal}
                className="w-full  bg-main hover:bg-main/90"
                type="button"
              >
                Konfirmasi Pesanan
              </Button>
            </div>
          )}

          {!initialData && (
            <div className="flex flex-col gap-5">
              <div className="flex bg-neutral-100 p-4 gap-5 rounded-md ">
                <Info className="h-10 w-10" />
                <p>
                  Invoice akan tersedia saat pesanan telah dikonfirmasi.
                  Pastikan semua data benar.
                </p>
              </div>
              <Button
                onClick={handleOpenApprovalModal}
                className="w-full  bg-main hover:bg-main/90"
                type="button"
              >
                Konfirmasi Pesanan
              </Button>
            </div>
          )}
          {initialData?.status !== "pending" &&
            initialData?.payment_pdf_url && (
              <div className="flex items-center justify-between w-full border border-neutral-200 rounded-lg p-1">
                <div className="flex gap-4">
                  <div className="p-2 border border-slate-200 rounded-lg bg-neutral-50">
                    <Icons.pdf />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-700">
                      {initialData?.invoice_number}
                    </span>
                    <span className="text-sm font-medium text-neutral-700">
                      PDF
                    </span>
                  </div>
                </div>
                <div className="p-2 border border-slate-200 rounded-lg">
                  <a
                    href={`https://${initialData?.payment_pdf_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <EyeIcon />
                  </a>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PriceDetail;

interface DropdownWeekendProps {
  days: string[];
}

const DropdownWeekend: React.FC<DropdownWeekendProps> = ({ days }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {days?.map((day, index) => (
          <DropdownMenuItem key={index} className="justify-between w-[224px]">
            <p>{dayjs(day).locale("id").format("D MMMM YYYY")}</p>
            <span className="text-slate-500">Rp. 50.000</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
