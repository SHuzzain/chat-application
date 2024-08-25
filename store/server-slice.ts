import { Server } from "@prisma/client";
import { create } from "zustand";

interface ServerModalProps {
  isOpen: boolean;
  data?: { server?: Server };
  onOpen: (data?: { server?: Server }) => void;
  onClose: () => void;
}

interface InviteModalProps {
  isOpen: boolean;
  data?: { server?: Server };
  onOpen: (data?: { server?: Server }) => void;
  onClose: () => void;
}

export const useServerModal = create<ServerModalProps>((set) => ({
  isOpen: false,
  data: {},
  onOpen: (data = {}) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));

export const useInviteModal = create<InviteModalProps>((set) => ({
  isOpen: false,
  data: {},
  onOpen: (data = {}) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));
