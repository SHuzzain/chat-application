import React from "react";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs/server";
import { Channel, ChannelType } from "@prisma/client";

import ServerHeader from "@/components/server/server-header";
import ServerSearch from "@/components/server/server-search";
import ServerSection from "@/components/server/server-section";
import ServerChannel from "@/components/server/server.channel";
import ServerMember from "@/components/server/server-member";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Hash, Mic, Video } from "lucide-react";
import { roleIconMap } from "@/helper";
const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 size-4" />,
  [ChannelType.VOICE]: <Mic className="mr-2 size-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 size-4" />,
};

type Props = {
  serverId: string;
};

const ServerSideBar = async ({ serverId }: Props) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const server = await prismadb.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      Channel: {
        orderBy: {
          createdAt: "asc",
        },
      },
      Member: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");


  const categorizedChannels: Record<
    string,
    (Channel & { icon: React.ReactNode })[]
  > = {
    textChannels: [],
    audioChannels: [],
    videoChannels: [],
  };

  server?.Channel.forEach((channel) => {
    const addIconInChannel = { ...channel, icon: iconMap[channel.type] };
    switch (channel.type) {
      case ChannelType.TEXT:
        categorizedChannels.textChannels.push(addIconInChannel);
        break;
      case ChannelType.VOICE:
        categorizedChannels.audioChannels.push(addIconInChannel);
        break;
      case ChannelType.VIDEO:
        categorizedChannels.videoChannels.push(addIconInChannel);
        break;
      default:
        break;
    }
  });

  const textChannels = categorizedChannels.textChannels;
  const audioChannels = categorizedChannels.audioChannels;
  const videoChannels = categorizedChannels.videoChannels;

  const members = server?.Member.filter(
    (member) => member.profileId !== profile.id
  );


  const role = server.Member.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col bg-sidebar text-primary size-full">
      <ServerHeader server={server} role={role} />

      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            items={[
              {
                label: "Text Channel",
                type: "channel",
                data: textChannels,
              },
              {
                label: "Voice Channel",
                type: "channel",
                data: audioChannels,
              },
              {
                label: "Video Channel",
                type: "channel",
                data: videoChannels,
              },

              {
                label: "Members",
                type: "channel",
                data: members?.map((member) => ({
                  ...member,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-700 my-2 rounded-md" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="Text Channels"
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              server={server}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}

            {!!audioChannels?.length && (
              <div className="mb-2">
                <ServerSection
                  label="Voice Channels"
                  sectionType="channels"
                  channelType={ChannelType.VOICE}
                  role={role}
                  server={server}
                />
                {audioChannels.map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    role={role}
                    server={server}
                  />
                ))}
              </div>
            )}

            {!!videoChannels?.length && (
              <div className="mb-2">
                <ServerSection
                  label="Video Channels"
                  sectionType="channels"
                  channelType={ChannelType.VIDEO}
                  role={role}
                  server={server}
                />
                {videoChannels.map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    role={role}
                    server={server}
                  />
                ))}
              </div>
            )}

            {!!members?.length && (
              <div className="mb-2">
                <ServerSection
                  label="Member"
                  sectionType="members"
                  role={role}
                  server={server}
                />
                {members.map((member) => (
                  <ServerMember
                    key={member.id}
                    member={member}
                    server={server}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSideBar;
