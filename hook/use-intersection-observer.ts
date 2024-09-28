"use client";

import { ElementRef, useEffect, useRef, useState } from "react";

interface IntersectionObserverHookProps {
  root?: Element | null; // The element that is used as the viewport for checking visibility
  rootMargin?: string; // Margin around the root element
  threshold?: number | number[]; // Number(s) between 0 and 1 indicating at what percentage of the target's visibility the observer's callback should be executed
  onIntersect?: () => void; // Callback function when element enters the view
}

export const useIntersectionObserver = <T extends keyof JSX.IntrinsicElements>(
  options: IntersectionObserverHookProps
): [React.RefObject<ElementRef<T>>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<ElementRef<T>>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsIntersecting(entry.isIntersecting);

        // Trigger the callback function when the element is in view
        if (entry.isIntersecting && options.onIntersect) {
          options.onIntersect();
        }
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || "0px",
        threshold: options.threshold || 0,
      }
    );

    if (targetRef.current instanceof HTMLElement) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current instanceof HTMLElement) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [options.root, options.rootMargin, options.threshold]);

  return [targetRef, isIntersecting];
};
