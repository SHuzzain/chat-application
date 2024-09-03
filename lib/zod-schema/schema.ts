import { ChannelType } from "@prisma/client";
import * as z from "zod";

// server form
export const serverSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
});
//end

// channel form
export const channelSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required",
  }).refine(name => name !== "general", {
    message: "Channel name can't be 'general'"
  }),
  type: z.nativeEnum(ChannelType)
});
//end

