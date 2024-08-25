"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button, ButtonProps } from "../ui/button";
import { Check, Copy } from "lucide-react";

type Props = {
  copyUrl: string;
  message?: string;
  isDisabled?: boolean;
};

const OnCopyButton = React.forwardRef<HTMLButtonElement, ButtonProps & Props>(
  ({ copyUrl, message, isDisabled = false, ...props }, ref) => {
    const [copy, setCopy] = useState(false);

    const OnCopy = () => {
      setCopy(true);
      navigator.clipboard.writeText(copyUrl);
      setTimeout(() => setCopy(false), 5000);
    };

    return (
      <Button
        disabled={copy && isDisabled}
        onClick={OnCopy}
        {...props}
        ref={ref}
      >
        {copy ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    );
  }
);

export default OnCopyButton;
