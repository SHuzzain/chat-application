"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import React from "react";

import toast from "react-hot-toast";
import { X } from "lucide-react";

import { Button } from "./button";

type Props = {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
};

const FileUpload = React.forwardRef<HTMLDivElement, Props>(
  ({ endpoint, onChange, value }, ref) => {
    const fileType = value?.split(".").pop();
    if (fileType && fileType !== "pdf") {
      return (
        <div className="relative w-20 h-20">
          <Image
            fill
            src={value}
            alt="upload"
            className="rounded-full object-cover"
          />
          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={() => onChange("")}
            className="top-0 right-0 z-10 absolute shadow-sm p-1 rounded-full w-6 h-6"
            type="button"
          >
            <X size={14} />
          </Button>
        </div>
      );
    }
    return (
      <div ref={ref}>
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
          }}
          onUploadError={(error: Error) => {
            toast.error(`ERROR! ${error.message}`);
          }}
        />
      </div>
    );
  }
);

export default FileUpload;
