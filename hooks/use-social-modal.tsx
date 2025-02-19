import { create } from "zustand";

interface useSocialModal {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useSocialModal = create<useSocialModal>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false})
}));