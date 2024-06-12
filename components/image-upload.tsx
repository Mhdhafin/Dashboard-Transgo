"use client";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { PreviewImage } from "./modal/preview-image";
import CustomImage from "./custom-image";

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
  const inputFile = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);
  const onDeleteFile = () => {
    onChange(null);
  };

  const onUpdateFile = async (file: ImageUploadResponse) => {
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
      <div className="flex flex-wrap gap-4 mt-2">
        {!!value && (
          <div
            key={value.data?.name ?? value.url}
            className="relative rounded-md cursor-pointer w-full h-[300px] sm:w-1/3 lg:w-1/4 xl:w-1/5"
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
            <CustomImage
              className="object-contain w-full h-full"
              onClick={() => {
                setOpen(true);
                onHandlePreview(value);
              }}
              alt="Deskripsi gambar"
              srcSet={`${
                !value?.data ? value : URL.createObjectURL(value.data)
              } 500w,${
                !value?.data ? value : URL.createObjectURL(value.data)
              } 1000w`}
              sizes="(max-width: 600px) 480px, 800px"
              src={!value?.data ? value : URL.createObjectURL(value.data)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
