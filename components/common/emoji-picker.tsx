import React from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { useTheme } from "next-themes";

type Props = {
  onChange: (value: string) => void;
};

const EmojiPicker = ({ onChange }: Props) => {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 dark:text-zinc-400" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent drop-shadow-none shadow-none mb-16 border-none"
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji?.native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
