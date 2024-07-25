import { Button, buttonVariants } from "@/components/ui/button";
import {
  Cake,
  Mail,
  PersonStanding,
  Phone,
  PhoneCall,
  User,
} from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { isEmpty } from "lodash";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { PreviewImage } from "@/components/modal/preview-image";

interface DriverDetailProps {
  onClose: () => void;
  data: any;
}

const DriverDetail: React.FC<DriverDetailProps> = ({ onClose, data }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);

  const onHandlePreview = (file: any) => {
    setContent(file);
    setOpen(true);
  };

  return (
    <div
      className="min-[1920px]:w-[640px] w-[400px] min-h-[1753px] p-5 mt-[-140px] fixed right-0 border-l border-neutral-400"
      id="detail-sidebar"
    >
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
            <div className="p-1 flex items-center  rounded-full w-full bg-neutral-50">
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
          {isEmpty(data?.id_cards) ? (
            <p>Belum ada Foto</p>
          ) : (
            <Carousel className="max-w-xs mx-auto">
              <CarouselContent>
                {data?.id_cards.map((photo: any, index: any) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="w-[310px] h-[300px] flex-shrink-0 flex aspect-square items-center justify-center relative ">
                        {/* <CardContent className="flex aspect-square items-center justify-center p-6">
                       
                      </CardContent> */}
                        <img
                          src={photo.photo}
                          alt={`Slide ${index}`}
                          className="object-cover cursor-pointer rounded-lg w-full h-full"
                          onClick={() => {
                            setOpen(true);
                            onHandlePreview(photo?.photo);
                          }}
                        />
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {data?.id_cards && data?.id_cards?.length > 1 && (
                <>
                  <CarouselPrevious
                    type="button"
                    className="-left-1 top-1/2 -translate-y-1/2 bg-accent"
                  />
                  <CarouselNext
                    type="button"
                    className="-right-1 top-1/2 -translate-y-1/2 bg-accent"
                  />
                </>
              )}
            </Carousel>
          )}
        </div>
      </div>
      <PreviewImage
        isOpen={open}
        onClose={() => setOpen(false)}
        content={content}
      />
    </div>
  );
};

export default DriverDetail;
