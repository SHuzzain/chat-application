"use client";
import React, { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import "@livekit/components-styles";

import toast from "react-hot-toast";

import { useUser } from "@clerk/nextjs";

import {
  AudioConference,
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  VideoConference,
} from "@livekit/components-react";

type Props = {
  chatId: string;
  video: boolean;
  audio: boolean;
  type: "video" | "audio";
};

const MedioRoom = ({ audio, chatId, video, type }: Props) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;
    const fullName = `${user.firstName} ${user.lastName}`;
    (async () => {
      try {
        const res = await fetch(
          `/api/livekit?room=${chatId}&username=${fullName}`
        );
        const data = await res.json();
        setToken(data?.token);
      } catch (error) {
        toast.error("Filed to create token");
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="my-4 text-zinc-500 animate-spin size-7" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400"></p>
      </div>
    );
  }
  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      data-lk-theme="default"
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
    >
      {type === "video" ? (
        <VideoConference />
      ) : type === "audio" ? (
        <AudioConference />
      ) : null}
    </LiveKitRoom>
  );
};

export default MedioRoom;
