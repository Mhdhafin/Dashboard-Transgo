import { Button, buttonVariants } from "@/components/ui/button";
import {
  Bike,
  LayoutDashboard,
  PaintBucket,
  RectangleHorizontal,
} from "lucide-react";
import { Carousel } from "../order-form";
import { cn } from "@/lib/utils";

interface Photo {
  id: number;
  created_at: string;
  updated_at: string;
  photo: string;
}

interface Fleet {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  type: string;
  color: string;
  plate_number: string;
  price: number;
  photos: Photo[];
  location: string | null; // Bisa disesuaikan jika Anda mengetahui tipe datanya.
  type_label: string;
}

interface FleetDetailProps {
  onClose: () => void;
  data: Fleet;
}

const FleetDetail: React.FC<FleetDetailProps> = ({ onClose, data }) => {
  return (
    <div
      className="min-[1920px]:w-[640px] w-[400px] min-h-[1753px] p-5 absolute  mt-[-140px] right-0 border-l border-neutral-400"
      id="detail-sidebar"
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-center font-semibold text-xl">Armada Detail</h4>
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
                <LayoutDashboard />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Tipe
                </span>
                <span className="font-medium text-sm text-black">
                  {data?.type}
                </span>
              </div>
            </div>
            <div className="p-1 flex items-center  rounded-full w-[360px] bg-neutral-50">
              <div className="rounded-full h-[40px] w-[40px] flex items-center justify-center bg-neutral-100 ">
                <Bike />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Nama Armada
                </span>
                <span className="font-medium text-sm text-black">
                  {data?.name}
                </span>
              </div>
            </div>
            <div className="p-1 flex items-center  rounded-full w-[360px] bg-neutral-50">
              <div className="rounded-full h-[40px] w-[40px] flex items-center justify-center bg-neutral-100 ">
                <RectangleHorizontal />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Plat Motor
                </span>
                <span className="font-medium text-sm text-black">
                  {data?.plate_number}
                </span>
              </div>
            </div>
            <div className="p-1 flex items-center  rounded-full w-[360px] bg-neutral-50">
              <div className="rounded-full h-[40px] w-[40px] flex items-center justify-center bg-neutral-100 ">
                <PaintBucket />
              </div>
              <div className="flex flex-col ml-4">
                <span className="font-normal text-xs text-neutral-500">
                  Warna
                </span>
                <span className="font-medium text-sm text-black">
                  {data?.color ?? "-"}
                </span>
              </div>
            </div>
          </div>
          <Carousel images={data?.photos} />
        </div>
      </div>
    </div>
  );
};

export default FleetDetail;
