"use client";
import { Trash } from "lucide-react";
import Image from "next/image";
import { IMG_MAX_LIMIT } from "./forms/product-form";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { PreviewImage } from "./modal/preview-image";

export interface ImageUploadResponse {
  data?: File;
  url?: string;
}

interface ImageUploadProps {
  onChange?: any;
  onRemove: (value?: ImageUploadResponse) => void;
  value?: any;
  disabled?: boolean;
}

export default function ImageUpload({
  onChange,
  onRemove,
  value,
  disabled,
}: ImageUploadProps) {
  const { toast } = useToast();
  const inputFile = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);
  const onDeleteFile = () => {
    onChange(null);
  };

  const onUpdateFile = (file: ImageUploadResponse) => {
    onChange(file);
  };

  const onResetFile = () => {
    if (inputFile.current) {
      inputFile.current.value = "";
      inputFile.current.type = "text";
      inputFile.current.type = "file";
    }
  };
  const onHandlePreview = (file: any) => {
    setContent(file?.data ? URL.createObjectURL(file?.data!) : file);
    setOpen(true);
  };

  return (
    <div>
      <PreviewImage
        isOpen={open}
        onClose={() => setOpen(false)}
        content={content}
      />
      <Input
        ref={inputFile}
        type="file"
        id="file"
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        accept="image/*"
        disabled={disabled}
        onChange={(e) => {
          onUpdateFile({ data: e.target.files![0] });
        }}
      />
      <div className="flex items-center gap-4">
        {!!value && (
          <div
            key={value.data?.name ?? value.url}
            className="relative rounded-md overflow-hidden"
          >
            {!disabled && (
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  onClick={() => {
                    onDeleteFile();
                    onResetFile();
                  }}
                  variant="destructive"
                  size="sm"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="relative w-[500px] h-[300px]">
              <Image
                onClick={() => {
                  setOpen(true);
                  onHandlePreview(value);
                }}
                fill
                className="object-fit"
                alt="Image"
                src={!value?.data ? value : URL.createObjectURL(value.data)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
