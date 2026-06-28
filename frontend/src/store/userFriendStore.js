import { create } from "zustand";
import {
  deleteFriendRequest,
  followUser as followUserService,
  getFriendRequests,
  getFriendSuggestions,
  getMutualFriends,
  unfollowUser as unfollowUserService,
} from "../services/userService";

const useUserFriendStore = create((set) => ({
  deleteUserFromRequest: async (senderId) => {
    await deleteFriendRequest(senderId);

    // Xóa khỏi danh sách request sau khi API thành công
    set((state) => ({
      friendRequests: state.friendRequests.filter(
        (user) => user._id !== senderId,
      ),
    }));
  },
  error: null,

  fetchFriendRequests: async () => {
    set({ error: null, isLoading: true });

    try {
      const response = await getFriendRequests();

      set({ friendRequests: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  fetchFriendSuggestions: async () => {
    try {
      const response = await getFriendSuggestions();

      set({ friendSuggestions: response.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
      });
    }
  },

  fetchMutualFriends: async () => {
    try {
      const response = await getMutualFriends();

      set({ mutualFriends: response.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
      });
    }
  },

  followUser: async (userId) => {
    await followUserService(userId);

    set((state) => ({
      friendSuggestions: state.friendSuggestions.filter(
        (user) => user._id !== userId,
      ),
    }));
  },
  friendRequests: [],
  friendSuggestions: [],
  isLoading: false,
  mutualFriends: [],

  unfollowUser: async (userId) => {
    await unfollowUserService(userId);
  },
}));

export default useUserFriendStore;
