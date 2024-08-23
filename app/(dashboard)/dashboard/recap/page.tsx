import React from "react";

import { formatRupiah } from "@/lib/utils";

import YearAndMonthSelector from "@/components/calendar/year-and-month-selector";
import { Heading } from "@/components/ui/heading";
import RecapTable from "@/components/tables/recap-tables/recap-table";
import { columns } from "@/components/tables/recap-tables/columns";

const Page = () => {
  return (
    <div className="flex-1 space-y-5 p-4 md:p-8 pt-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-5">
          <Heading title="Recap Pencatatan" />
          <CommissionAmount amount={0} />
        </div>
        <YearAndMonthSelector withDateRange />
      </div>

      <RecapTable
        columns={columns}
        data={[
          {
            id: 1,
            name: "",
            status: "",
            email: "",
            date_of_birth: "",
            nik: "",
            role: "",
            id_photo: "",
            gender: "",
            phone_number: "",
            emergency_phone_number: "",
          },
          {
            id: 1,
            name: "",
            status: "",
            email: "",
            date_of_birth: "",
            nik: "",
            role: "",
            id_photo: "",
            gender: "",
            phone_number: "",
            emergency_phone_number: "",
          },
          {
            id: 1,
            name: "",
            status: "",
            email: "",
            date_of_birth: "",
            nik: "",
            role: "",
            id_photo: "",
            gender: "",
            phone_number: "",
            emergency_phone_number: "",
          },
          {
            id: 1,
            name: "",
            status: "",
            email: "",
            date_of_birth: "",
            nik: "",
            role: "",
            id_photo: "",
            gender: "",
            phone_number: "",
            emergency_phone_number: "",
          },
          {
            id: 1,
            name: "",
            status: "",
            email: "",
            date_of_birth: "",
            nik: "",
            role: "",
            id_photo: "",
            gender: "",
            phone_number: "",
            emergency_phone_number: "",
          },
        ]}
      />
    </div>
  );
};

const CommissionAmount = ({ amount }: { amount: number }) => (
  <div className="rounded-[8px] bg-blue-500 p-[8px_12px]">
    <h4 className="text-[20px] leading-7 font-semibold text-white">
      Komisi : {formatRupiah(amount)}
    </h4>
  </div>
);

export default Page;
