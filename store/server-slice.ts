import { create } from "zustand";

interface ServerModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useServerModal = create<ServerModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
