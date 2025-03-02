"use client";
import React, { useEffect, useState } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { DialogFooter } from "../ui/dialog";
import FileUpload from "../ui/file-upload";

import { useModal } from "@/store/server-slice";

import axios from "axios";
import { useRouter } from "next/navigation";
import { serverSchema } from "@/lib/zod-schema/schema";

function ServerModal() {
  const { isOpen, onOpen, type, data, onClose } = useModal();
  const server = data?.server;
  const router = useRouter();
  const [loadind, setLoading] = useState(false);
  const form = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const serverModalIsOpen = isOpen && type === "createServer";

  const serverInfo = {
    message: server
      ? "Server updated successfully"
      : "Server created successfully",
    button: server ? "Save" : "Create",
  };

  useEffect(() => {
    if (server) {
      const { name, imageUrl } = server;
      form.setValue("name", name);
      form.setValue("imageUrl", imageUrl);
    }
    return () => form.reset();
  }, [server, form]);

  const onSumbit = async (data: z.infer<typeof serverSchema>) => {
    try {
      setLoading(true);
      if (server) {
        await axios.patch(`/api/servers/${server.id}`, data);
      } else {
        await axios.post("/api/servers", data);
      }
      toast.success(serverInfo.message);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    } finally {
      form.reset();
      onClose();
      setLoading(false);
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
      title="Customize your server"
      description="Give your server a personality with a name and an image. You can always change it later."
      isOpen={serverModalIsOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSumbit)} className="space-y-8">
          <div>
            <div className="flex justify-center items-center text-center">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload endpoint="serverImage" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>
          </div>
          <FormField
            control={form.control}
            name="name"
            disabled={loadind}
            render={({ field }) => (
              <FormItem className="px-6">
                <FormLabel className="font-bold text-xs text-zinc-500 dark:text-secondary/70 uppercase">
                  Server Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a text"
                    className="border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="bg-gray-200 px-6 py-4">
            <Button type="submit" disabled={loadind} variant={"primary"}>
              {serverInfo.button}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
}

export default ServerModal;
