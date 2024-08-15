"use client";
import { useEffect, useState } from "react";

interface PreviewImageProps {
  isOpen: boolean;
  onClose: () => void;
  content?: any;
}

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import CustomImage from "../custom-image";
import Image from "next/image";

const Dialog = DialogPrimitive.Root;

const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[700px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-8 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const PreviewImage: React.FC<PreviewImageProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [dimension, setDimension] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 },
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const fetchImageDimension = async () => {
        try {
          const imageDimension = await getDimensionImage(content);
          setDimension(imageDimension);
        } catch (error) {
          // console.log("error to fetch dimension image:", error);
        }
      };

      fetchImageDimension();
    }
  }, [isOpen, content]);

  if (!isMounted) {
    return null;
  }
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        {/* <div
          className="relative w-full h-[500px]"
          style={
            {
              // paddingTop: `${(dimension.height / dimension.width) * 100}%`,
            }
          }
        >
          <Image
            // width={565}
            // height={266}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            src={content}
            alt="photo"
            style={{
              objectFit: "contain",
              top: 0,
              left: 0,
            }}
          />
        </div> */}
        <div className="relative w-full md:h-[700px] h-[500px]">
          <CustomImage
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            src={content}
            alt="photo"
            className=" object-contain w-full h-full"
            srcSet={`${content} 500w,${content} 1000w`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export const getDimensionImage = (
  src: any,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = reject;
    img.src = src;
  });
};
