import { formatRupiah } from "@/lib/utils";
import React from "react";
import { HoverCardContent } from "../ui/hover-card";
import { Separator } from "../ui/separator";

const TooltipDate = () => {
  return (
    <HoverCardContent className="w-full h-full p-[12px] flex flex-col gap-[10px]">
      <div className="pl-[16px] pt-[6px] flex flex-col gap-[6px]">
        <div className="flex flex-row items-center justify-between">
          <p className="leading-5 font-semibold text-[18px]">
            {formatRupiah(400000)}
          </p>
          <div className="bg-green-50 font-medium leading-5 text-[14px] text-green-900 py-[6px] px-2 rounded-lg">
            Lunas
          </div>
        </div>

        <div className="flex flex-col gap-[2px]">
          <p className="text-[14px] leading-5 font-medium">
            Daud Dimas Prasetyo
          </p>
          <div className="flex flex-row items-center gap-[4px]">
            <div className="size-[12px] bg-blue-500 rounded-full" />
            <p className="text-[14px] leading-5 font-normal">Sedang Berjalan</p>
          </div>
        </div>
      </div>

      <div className="border border-neutral-200 rounded-lg py-[16px] px-[12px] w-full h-full flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <p className="text-[12px] leading-4 font-normal text-[#64748B]">
            PIC & Tanggal Pengambilan
          </p>
          <p className="text-[14px] leading-5 font-medium mb-[2px]">
            Johny Doe
          </p>
          <div className="flex flex-row gap-[8px]">
            <p className="text-[12px] leading-4 font-[500]">
              Minggu, 07 Agt 2024
            </p>
            <Separator orientation="vertical" />
            <p className="text-[12px] leading-4 font-[500]">Jam 08.00 WIB</p>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-[6px]">
          <p className="text-[12px] leading-4 font-normal text-[#64748B]">
            PIC & Tanggal Pengambalian
          </p>
          <p className="text-[14px] leading-5 font-medium mb-[2px]">
            Johny Doe
          </p>
          <div className="flex flex-row gap-[8px]">
            <p className="text-[12px] leading-4 font-[500]">
              Minggu, 08 Agt 2024
            </p>
            <Separator orientation="vertical" />
            <p className="text-[12px] leading-4 font-[500]">Jam 12.00 WIB</p>
          </div>
        </div>
      </div>
    </HoverCardContent>
  );
};

export default TooltipDate;
