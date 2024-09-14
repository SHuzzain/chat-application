"use client";
import React from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadSchema } from "@/lib/zod-schema/schema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import { DialogFooter } from "@/components/ui/dialog";

import toast from "react-hot-toast";
import axios from "axios";
import qs from "query-string";

import { useModal } from "@/store/server-slice";

function ChatFileUploadModal() {
  const { isOpen, type, data, onClose } = useModal();

  const router = useRouter();

  const form = useForm<z.infer<typeof UploadSchema>>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const ModalIsOpen = isOpen && type === "messageModal";

  const isloading = form.formState.isSubmitting;

  const uploadInfo = {
    button: "Create",
  };

  const onSumbit = async (values: z.infer<typeof UploadSchema>) => {
    try {
      if (data?.chat) {
        const { apiUrl, query } = data.chat;
        const url = qs.stringifyUrl({
          url: apiUrl,
          query,
        });
        await axios.post(url, { ...values, content: values.fileUrl });
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    } finally {
      form.reset();
      onClose();
    }
  };
  return (
    <Modal
      componentStyle={{
        content: {
          className: "bg-slate-100 text-black px-0 overflow-hidden",
        },
        header: {
          className: "pt-8 px-6",
        },
        title: {
          className: "text-2xl text-center font-bold",
        },
        description: {
          className: "text-center font-bold text-zinc-500",
        },
      }}
      title="Add a attachment"
      description="send a file a as message"
      isOpen={ModalIsOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSumbit)} className="space-y-8">
          <div>
            <div className="flex justify-center items-center text-center">
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload endpoint="messageFile" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>
          </div>
          <DialogFooter className="bg-gray-200 px-6 py-4">
            <Button type="submit" disabled={isloading} variant={"primary"}>
              {uploadInfo.button}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
}

export default ChatFileUploadModal;
