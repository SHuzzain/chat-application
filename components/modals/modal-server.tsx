"use client";
import React, { useState } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

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
import { useServerModal } from "@/store/server-slice";

const formSchema = z.object({
  name: z.string().min(1),
});

function ServerModal() {
  const serverModal = useServerModal();

  const [loadind, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSumbit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await axios.post("api/stores", data);
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      serverModal.onClose();
      form.reset();
      toast.error("Something went wrong.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title="Customize your server"
      description="Give your server a personality with a name and an image. You
can always change it later."
      isOpen={true}
      onClose={serverModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSumbit)}>
              <FormField
                control={form.control}
                name="name"
                disabled={loadind}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Server Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-x-4 pt-5 text-end">
                <Button type="submit" disabled={loadind}>
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}

export default ServerModal;
