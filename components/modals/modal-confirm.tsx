"use client";
import React, { ReactNode, useState } from "react";

import axios, { Axios, AxiosResponse } from "axios";

import { useModal } from "@/store/server-slice";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  title: string | ReactNode;
  description?: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  axiosFunction: () => Promise<AxiosResponse>;
};

function ConfirmModal({
  title,
  description,
  isOpen,
  onClose,
  axiosFunction,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axiosFunction();
      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      componentStyle={{
        content: {
          className: "bg-slate-100 text-black p-0 overflow-hidden",
        },
        header: {
          className: "pt-8 px-6",
        },
        title: {
          className: "text-2xl text-center font-bold",
        },
        description: {
          className: "text-center  text-zinc-500",
        },
      }}
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <DialogFooter className="bg-gray-200 px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <Button variant={"ghost"} onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={"primary"} onClick={onConfirm} disabled={loading}>
            Confirm
          </Button>
        </div>
      </DialogFooter>
    </Modal>
  );
}

export default ConfirmModal;
