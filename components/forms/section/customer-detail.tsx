import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import {
  Cake,
  Mail,
  PersonStanding,
  Phone,
  PhoneCall,
  User,
} from "lucide-react";
import { Carousel } from "../order-form";

interface IDCard {
  id: number;
  created_at: string;
  updated_at: string;
  photo: string;
}

interface User {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  gender: string;
  date_of_birth: string;
  nik: string;
  photo_profile: string | null;
  emergency_phone_number: string;
  status: string;
  id_cards: IDCard[];
}

interface CustomerDetailProps {
  onClose: () => void;
  data?: User;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ onClose, data }) => {
  return (
    <div
      className="min-[1920px]:w-[640px] w-[400px] min-h-[1753px] p-5 absolute  mt-[-140px] right-0 border-l border-neutral-400"
      id="detail-sidebar"
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-center font-semibold text-xl">Pelanggan Detail</h4>
        <Button
          type="button"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "w-[65px] h-[40px]",
          )}
          onClick={onClose}
        >
          Tutup
        </Button>
      </div>
      <div className="flex flex-col justify-between ">
        <div className="mb-[300px]">
          <div className="mb-5 gap-2 grid">
            <div className="p-1 flex items-center  rounded-full w-full bg-neutral-50">
              <div className="rounded-full h-[40px] w-[40px] flex items-center justify-center bg-neutral-100">
                <User />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Nama Pelanggan
                </span>
                <span className="font-medium text-sm text-black">
                  {data?.name}
                </span>
              </div>
            </div>
            <div className="p-1 flex items-center  rounded-full w-full bg-neutral-50">
              <div className="rounded-full h-[40px] w-[40px] flex items-center justify-center bg-neutral-100 ">
                <Mail />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Email
                </span>
                <span className="font-medium text-sm text-black">
                  {data?.email}
                </span>
              </div>
            </div>
            <div className="p-1 flex items-center  rounded-full w-full bg-neutral-50">
              <div className="rounded-full h-[40px] w-[40px] flex items-center justify-center bg-neutral-100 ">
                <Phone />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Kontak
                </span>
                <span className="font-medium text-sm text-black">
                  {data?.phone_number}
                </span>
              </div>
            </div>
            <div className="p-1 flex items-center  rounded-full w-full bg-neutral-50">
              <div className="rounded-full h-[40px] w-[40px] flex items-center justify-center bg-neutral-100 ">
                <PhoneCall />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Kontak Darurat
                </span>
                <span className="font-medium text-sm text-black">
                  {data?.emergency_phone_number}
                </span>
              </div>
            </div>
            <div className="p-1 flex items-center  rounded-full w-full bg-neutral-50">
              <div className="rounded-full h-[40px] w-[40px] flex items-center justify-center bg-neutral-100 ">
                <PersonStanding />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Jenis Kelamin
                </span>
                <span className="font-medium text-sm text-black">
                  {data?.gender}
                </span>
              </div>
            </div>
            <div className="p-1 flex items-center  rounded-full w-full bg-neutral-50">
              <div className="rounded-full h-[40px] w-[40px] flex items-center justify-center bg-neutral-100 ">
                <Cake />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Tanggal Ulang tahun
                </span>
                <span className="font-medium text-sm text-black">
                  {dayjs(data?.date_of_birth).format("D MMMM YYYY")}
                </span>
              </div>
            </div>
          </div>
          <Carousel images={data?.id_cards} />
        </div>
      </div>
    </div>
  );
};
export default CustomerDetail;
