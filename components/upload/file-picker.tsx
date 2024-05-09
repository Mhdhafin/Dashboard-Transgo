"use client";
import axios, { AxiosRequestConfig } from "axios";
import classNames from "classnames";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DropZone } from "./drop-zone";
import styles from "./file-picker.module.css";
import { FilesList } from "./file-list";
import { getUploadPresign } from "@/client/uploadClient";

interface FilePickerProps {
  accept?: string[];
  uploadURL: string;
}

interface FileData {
  id: string;
  file: File;
}

const FilePicker: React.FC<FilePickerProps> = ({ accept, uploadURL }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [uploadStarted, setUploadStarted] = useState<boolean>(false);

  const handleOnChange = useCallback((files: FileList) => {
    let filesArray: FileData[] = Array.from(files).map((file) => ({
      id: nanoid(),
      file,
    }));

    setFiles(filesArray);
    setProgress(0);
    setUploadStarted(false);
  }, []);

  const handleClearFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  const canShowProgress = useMemo(() => files.length > 0, [files.length]);

  const handleUpload = useCallback(async () => {
    console.log("masuuk");
    // try {
    //   const data = new FormData();

    //   files.forEach((file) => {
    //     data.append("file", file.file);
    //   });

    //   const config: AxiosRequestConfig = {
    //     url: "hello",
    //     method: "POST",
    //     data,
    //     onUploadProgress: (progressEvent) => {
    //       setUploadStarted(true);
    //       const percentCompleted = Math.round(
    //         (progressEvent.loaded * 100) / progressEvent.total,
    //       );
    //       setProgress(percentCompleted);
    //     },
    //   };

    //   const res = await axios.request(config);
    // } catch (error) {
    //   console.log(error);
    // }
  }, [files.length, uploadURL]);

  useEffect(() => {
    if (files.length < 1) {
      setProgress(0);
    }
  }, [files.length]);

  useEffect(() => {
    if (progress === 100) {
      setUploadStarted(false);
    }
  }, [progress]);

  const uploadComplete = useMemo(() => progress === 100, [progress]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvas_wrapper}>
        <DropZone onChange={handleOnChange} accept={accept} />
      </div>

      {files.length ? (
        <div className={styles.files_list_wrapper}>
          <FilesList
            files={files}
            onClear={handleClearFile}
            uploadComplete={uploadComplete}
          />
        </div>
      ) : null}

      {canShowProgress ? (
        <div className={styles.files_list_progress_wrapper}>
          <progress value={progress} max={100} style={{ width: "100%" }} />
        </div>
      ) : null}

      {/* {files.length ? (
        <button
          onClick={handleUpload}
          className={classNames(
            styles.upload_button,
            uploadComplete || uploadStarted ? styles.disabled : "",
          )}
        >
          {`Upload ${files.length} Files`}
        </button>
      ) : null} */}
    </div>
  );
};

export { FilePicker };
