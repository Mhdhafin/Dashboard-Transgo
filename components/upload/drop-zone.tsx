import React from "react";
import styles from "./drop-zone.module.css";

interface BannerProps {
  onClick: () => void;
  onDrop: (files: FileList) => void;
}

const Banner: React.FC<BannerProps> = ({ onClick, onDrop }: any) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    onDrop(ev.dataTransfer.files);
  };

  return (
    <div
      className={styles.banner}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      files <span className={styles.banner_text}>Click to Add files </span>
      <span className={styles.banner_text}>Or</span>
      <span className={styles.banner_text}>Drag and Drop files here</span>
    </div>
  );
};

interface DropZoneProps {
  onChange: (files: FileList) => void;
  accept?: string[];
}
const DropZone: React.FC<DropZoneProps> = ({ onChange, accept = ["*"] }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log(ev.target.files);
    if (ev.target.files) {
      onChange(ev.target.files);
    }
  };

  const handleDrop = (files: FileList) => {
    onChange(files);
  };

  return (
    <div className={styles.wrapper}>
      <Banner onClick={handleClick} onDrop={handleDrop} />
      <input
        type="file"
        aria-label="add files"
        className={styles.input}
        ref={inputRef}
        multiple
        onChange={handleChange}
        accept={accept.join(",")}
      />
    </div>
  );
};

export { DropZone };
