import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      clearUser: () => set({ user: null }),

      setUser: (user) => set({ user }),
      user: null,
    }),
    {
      name: "facebook-user",
    },
  ),
);

export default useUserStore;
