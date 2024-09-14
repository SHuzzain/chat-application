"use client";

import React from "react";

import { chatSchema } from "@/lib/zod-schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Smile } from "lucide-react";

import qs from "query-string";
import toast from "react-hot-toast";
import axios from "axios";
import { useModal } from "@/store/server-slice";

type Props = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
};

const ChatInput = ({ apiUrl, name, query, type }: Props) => {
  const { onOpen } = useModal();
  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof chatSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, data);
    } catch (error) {
      toast.error("Failed");
    } finally {
      form.reset();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() =>
                      onOpen("messageModal", { chat: { apiUrl, query } })
                    }
                    className="top-7 left-8 absolute flex justify-center items-center bg-zinc-500 hover:bg-zinc-600 dark:hover:bg-zinc-300 dark:bg-zinc-400 p-1 rounded-full transition size-6"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    {...field}
                    className="border-0 bg-zinc-200/90 dark:bg-zinc-700/75 px-14 py-6 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#".concat(name)
                    }`}
                  />
                  <div className="top-7 right-8 absolute">
                    <Smile />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
