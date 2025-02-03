import { create } from "zustand";

interface MessageStore {
    message: string | null;
    sendMessage: (message: string) => void
}

export const useMessageStore = create<MessageStore>((set) => ({
    message: null,
    sendMessage: (message) => set({ message: message })
}))