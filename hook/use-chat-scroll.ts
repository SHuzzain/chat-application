import { useEffect, useState } from "react";

type UseChatScrollProps = {
  bottomRef: React.RefObject<HTMLDivElement> | null;
  topRef: React.RefObject<HTMLDivElement> | null;
  count: number;
};

export const useChatSCroll = ({
  bottomRef,
  topRef,
  count,
}: UseChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = topRef?.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) return false;

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, topRef, hasInitialized, count]);
};
