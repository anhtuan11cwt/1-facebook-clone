import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createOrUpdateBio as createOrUpdateBioService,
  fetchUserProfile as fetchUserProfileService,
  updateCoverPhoto as updateCoverPhotoService,
  updateUserProfile as updateUserProfileService,
} from "@/services/userService";

const useUserStore = create(
  persist(
    (set) => ({
      clearUser: () => set({ profileData: null, user: null }),

      fetchUserProfile: async (userId) => {
        set({ profileLoading: true });
        try {
          const response = await fetchUserProfileService(userId);
          set({ profileData: response.data.user, profileLoading: false });
        } catch (_error) {
          set({ profileLoading: false });
        }
      },
      profileData: null,
      profileLoading: false,
      setUser: (user) => set({ user }),

      updateBio: async (data) => {
        await createOrUpdateBioService(data);
        // Fetch lại profile để đồng bộ bio mới
        const { fetchUserProfile } = useUserStore.getState();
        const userId = useUserStore.getState().user?._id;
        if (userId) fetchUserProfile(userId);
      },

      updateCoverPhoto: async (formData) => {
        const response = await updateCoverPhotoService(formData);
        const updatedUser = response.data;
        set((state) => ({
          profileData: updatedUser,
          user: state.user?._id === updatedUser._id ? updatedUser : state.user,
        }));
        return updatedUser;
      },

      updateUserProfile: async (formData) => {
        const response = await updateUserProfileService(formData);
        const updatedUser = response.data;
        set((state) => ({
          profileData: updatedUser,
          user: state.user?._id === updatedUser._id ? updatedUser : state.user,
        }));
        return updatedUser;
      },
      user: null,
    }),
    {
      name: "facebook-user",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export default useUserStore;
