"use client";
import { Trash } from "lucide-react";
import Image from "next/image";
import { IMG_MAX_LIMIT } from "./forms/product-form";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";

export interface MulitpleImageUploadResponse {
  data?: FileList | null;
  url?: string;
}

interface MulitpleImageUploadProps {
  onChange?: any;
  onRemove: (value?: MulitpleImageUploadResponse) => void;
  value?: any;
  disabled?: boolean;
}

export default function MulitpleImageUpload({
  onChange,
  onRemove,
  value,
  disabled,
}: MulitpleImageUploadProps) {
  const { toast } = useToast();

  const onDeleteFile = (file: any) => {
    // onChange(null);

    const filteredFile = value?.filter((item: any) =>
      item?.id ? item.id !== file.id : item?.name !== file?.name,
    );
    onRemove(filteredFile);
  };
  const onUpdateFile = (file: any) => {
    const filesArr = Array.from(file?.data);
    onChange(filesArr);
  };

  return (
    <div>
      <div className="mb-6">
        <Input
          type="file"
          id="file"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={(e) => onUpdateFile({ data: e.target.files })}
        />
      </div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((item: any) => (
          <div
            key={item?.name ?? value.url}
            className="relative rounded-md overflow-hidden"
          >
            {!disabled && (
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  onClick={() => onDeleteFile(item)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="relative w-[300px] h-[200px]">
              <Image
                fill
                className="object-cover"
                alt="Image"
                src={item?.photo || URL.createObjectURL(item)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
