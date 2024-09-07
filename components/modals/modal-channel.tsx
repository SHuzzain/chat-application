"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { channelSchema } from "@/lib/zod-schema/schema";
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
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useModal } from "@/store/server-slice";
import { ChannelType } from "@prisma/client";

import axios from "axios";
import toast from "react-hot-toast";
import qs from "query-string";

function ChannelModal() {
  const { isOpen, type, onClose } = useModal();

  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof channelSchema>>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  const ModalIsOpen = isOpen && type === "createChannel";

  const onSumbit = async (data: z.infer<typeof channelSchema>) => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: params.serverId,
        },
      });
      await axios.post(url, data);
      form.reset();
      router.refresh();
      onClose();
      toast.success("Channel created");
    } catch (error) {
      toast.error("Fail to created channel");
    } finally {
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
      }}
      title="Create Channel"
      isOpen={ModalIsOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSumbit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            disabled={loading}
            render={({ field }) => (
              <FormItem className="px-6">
                <FormLabel className="font-bold text-xs text-zinc-500 dark:text-secondary/70 uppercase">
                  Channel Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter channel name"
                    className="border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            disabled={loading}
            render={({ field }) => (
              <FormItem ref={field.ref} className="px-6">
                <FormLabel className="font-bold text-xs text-zinc-500 dark:text-secondary/70 uppercase">
                  Channel Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={field.disabled}
                >
                  <FormControl>
                    <SelectTrigger className="border-0 bg-zinc-300/50 focus:ring-0 ring-offset-0 focus:ring-offset-0 text-black capitalize outline-none">
                      <SelectValue placeholder="Select a Channel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ChannelType).map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="capitalize"
                      >
                        {type.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <DialogFooter className="bg-gray-200 px-6 py-4">
            <Button type="submit" disabled={loading} variant={"primary"}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
}

export default ChannelModal;
