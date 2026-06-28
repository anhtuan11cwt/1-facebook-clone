import { create } from "zustand";
import {
  commentPost,
  createPost,
  createStory,
  getAllPosts,
  getAllStories,
  getUserPosts,
  likePost,
  sharePost,
} from "../services/postService";

const replacePost = (list, updatedPost) =>
  list.map((post) => (post._id === updatedPost._id ? updatedPost : post));

const usePostStore = create((set) => ({
  error: null,

  fetchPosts: async () => {
    set({ error: null, loading: true });

    try {
      const response = await getAllPosts();

      set({ loading: false, posts: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchStories: async () => {
    try {
      const response = await getAllStories();

      set({ stories: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
      });
    }
  },

  fetchUserPosts: async (userId) => {
    set({ error: null, loading: true });

    try {
      const response = await getUserPosts(userId);

      set({ loading: false, userPosts: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  handleCommentPost: async (postId, text) => {
    const formData = new FormData();
    formData.append("text", text);

    const response = await commentPost(postId, formData);

    const updatedPost = response.data.data;

    set((state) => ({
      posts: replacePost(state.posts, updatedPost),
      userPosts: replacePost(state.userPosts, updatedPost),
    }));
  },

  handleCreatePost: async (formData) => {
    const response = await createPost(formData);

    set((state) => ({
      posts: [response.data.data, ...state.posts],
      userPosts: [response.data.data, ...state.userPosts],
    }));
  },

  handleCreateStory: async (formData) => {
    const response = await createStory(formData);

    set((state) => ({
      stories: [response.data.data, ...state.stories],
    }));
  },

  handleLikePost: async (postId) => {
    const response = await likePost(postId);

    const updatedPost = response.data.data;

    set((state) => ({
      posts: replacePost(state.posts, updatedPost),
      userPosts: replacePost(state.userPosts, updatedPost),
    }));
  },

  handleSharePost: async (postId) => {
    const response = await sharePost(postId);

    const updatedPost = response.data.data;

    set((state) => ({
      posts: replacePost(state.posts, updatedPost),
      userPosts: replacePost(state.userPosts, updatedPost),
    }));
  },
  loading: false,
  posts: [],
  stories: [],
  userPosts: [],
}));

export default usePostStore;
