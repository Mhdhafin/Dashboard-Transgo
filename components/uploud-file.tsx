"use client";

import { useState } from "react";
import { UploadButton } from "./uploudthing";

interface UploadFileProps {
  form: any;
  name: string;
  lastPath: string;
}

const UploadFile = ({ form, name, lastPath }: UploadFileProps) => {
  return (
    <>
      <UploadButton
        disabled={lastPath === "preview" || lastPath === "edit"}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Store the URL directly in form
          const uploadedUrl = res[0].ufsUrl;
          form.setValue(name, uploadedUrl);
          console.log("Files: ", uploadedUrl);
          console.log("Stored in form:", form.getValues(name));
          alert("Upload Completed");
        }}
      />
      {lastPath === "create" && (
        <img width={500} height={300} src={form.watch(name)} />
      )}
    </>
  );
};

export default UploadFile;
