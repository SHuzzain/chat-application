import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalData = {
  server?: Server;
};

export type ModalType = "createServer" | "invite" | "member" | "createChannel";

interface ServerModalProps {
  type: ModalType | null;
  isOpen: boolean;
  data?: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ServerModalProps>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, data, type }),
  onClose: () => set({ isOpen: false }),
}));
