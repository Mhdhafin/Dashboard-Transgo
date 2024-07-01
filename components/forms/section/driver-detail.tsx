import { Button, buttonVariants } from "@/components/ui/button";
import {
  Cake,
  Mail,
  PersonStanding,
  Phone,
  PhoneCall,
  User,
} from "lucide-react";
import { Carousel } from "../order-form";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

interface DriverDetailProps {
  onClose: () => void;
  data: any;
}

const DriverDetail: React.FC<DriverDetailProps> = ({ onClose, data }) => {
  return (
    <div className="w-[400px] h-[936px] p-5 " id="detail-sidebar">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-center font-semibold text-xl">
          Penangung Jawab Detail
        </h4>
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
            <div className="p-1 flex items-center  rounded-full w-[360px] bg-neutral-50">
              <div className="rounded-full h-[40px] w-[40px] flex items-center justify-center bg-neutral-100 ">
                <User />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Nama Penanggung Jawab
                </span>
                <span className="font-medium text-sm text-black">
                  {data?.name}
                </span>
              </div>
            </div>
            <div className="p-1 flex items-center  rounded-full w-[360px] bg-neutral-50">
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
            <div className="p-1 flex items-center  rounded-full w-[360px] bg-neutral-50">
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
            <div className="p-1 flex items-center  rounded-full w-[360px] bg-neutral-50">
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
            <div className="p-1 flex items-center  rounded-full w-[360px] bg-neutral-50">
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
            <div className="p-1 flex items-center  rounded-full w-[360px] bg-neutral-50">
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

export default DriverDetail;
