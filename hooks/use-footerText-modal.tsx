import { create } from "zustand";

interface useFooterText {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    document: string;
};

export const useFooterTextModal = create<useFooterText>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false}),
    document: ""
}));