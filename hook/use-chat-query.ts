import { useSocket } from "@/components/provider/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  apiUrl,
  paramKey,
  paramValue,
  queryKey,
}: ChatQueryProps) => {
  try {
    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam }: { pageParam: any }) => {
      const url = qs.stringifyUrl(
        {
          url: apiUrl,
          query: {
            cursor: pageParam,
            [paramKey]: paramValue,
          },
        },
        { skipNull: true }
      );

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      return await res.json();
    };

    const {
      data,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      status,
    } = useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

    return {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      status,
      error,
    };
  } catch (error) {
    console.log(`[CHAT_QUERY_HOOK]`, error);
    return { message: "Faild to fetch", success: false, error };
  }
};
