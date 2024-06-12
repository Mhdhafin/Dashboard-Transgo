import React from "react";
interface CustomImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  layout?: "responsive" | "fixed";
  className?: string;
  srcSet?: string;
  sizes?: string;
  [key: string]: any;
}
const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  width,
  height,
  layout = "responsive",
  className = "",
  srcSet,
  sizes,
  ...props
}) => {
  // const style: React.CSSProperties = {
  //   objectFit: "contain",
  //   width: layout === "responsive" ? "100%" : width,
  //   height: layout === "responsive" ? "100%" : height,
  // };

  return (
    <img
      src={src}
      alt={alt}
      // style={style}
      className={className}
      loading="lazy"
      srcSet={srcSet}
      sizes={sizes}
      {...props}
    />
  );
};

export default CustomImage;
