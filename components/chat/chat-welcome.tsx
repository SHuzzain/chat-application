import { Hash } from "lucide-react";
import React from "react";

type Props = {
  name: string;
  type: "channel" | "conversation";
};

const ChatWelcome = ({ name, type }: Props) => {
  return (
    <div className="space-y-2 mb-4 px-4">
      {type === "channel" && (
        <div className="flex justify-center items-center bg-zinc-500 dark:bg-zinc-700 rounded-full size-20">
          <Hash className="text-white size-12" />
        </div>
      )}
      <p className="font-bold text-xl md:text-3xl">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === "channel"
          ? `This is start of the #${name} channel.`
          : `This is start of the your conversation with ${name}`}
      </p>
    </div>
  );
};

export default ChatWelcome;
