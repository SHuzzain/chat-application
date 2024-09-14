"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import React from "react";

import toast from "react-hot-toast";
import { FileIcon, X } from "lucide-react";

import { Button } from "./button";

type Props = {
  onChange: (url?: string) => void;
  value: string | undefined;
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
            src={value || ""}
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

    if (value && fileType === "pdf") {
      return (
        <div
          className={`relative flex items-center p-5 mt-2 rounded-md bg-background/10 overflow-hidden`}
        >
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            title="click"
          >
            <FileIcon className="fill-indigo-200 size-10 stroke-indigo-400" />
          </a>
          <span className="top-0 left-0 absolute drop-shadow-xl text-indigo-500 dark:text-indigo-400 hover:underline -rotate-45">
            {fileType}
          </span>

          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={() => onChange("")}
            className="top-1 right-1 z-10 absolute shadow-sm p-1 rounded-full w-6 h-6"
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

FileUpload.displayName = "FileUpload";

export default FileUpload;
