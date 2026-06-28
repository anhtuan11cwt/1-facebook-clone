import { create } from "zustand";
import {
  commentPost,
  createPost,
  createStory,
  deleteComment,
  deletePost,
  getAllPosts,
  getAllStories,
  getUserPosts,
  likePost,
  sharePost,
} from "../services/postService";

const replacePost = (list, updatedPost) =>
  list.map((post) => (post._id === updatedPost._id ? updatedPost : post));

const usePostStore = create((set, get) => ({
  error: null,

  fetchPosts: async () => {
    set({ error: null, loading: true });

    try {
      const response = await getAllPosts();

      set({ loading: false, posts: response.data });
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

      set({ stories: response.data });
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

      set({ loading: false, userPosts: response.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  handleCommentPost: async (postId, text, file) => {
    const formData = new FormData();
    formData.append("text", text);
    if (file) formData.append("media", file);

    const response = await commentPost(postId, formData);

    const updatedPost = response.data;

    set((state) => ({
      posts: replacePost(state.posts, updatedPost),
      userPosts: replacePost(state.userPosts, updatedPost),
    }));
  },

  handleCreatePost: async (formData) => {
    const response = await createPost(formData);

    set((state) => ({
      posts: [response.data, ...state.posts],
      userPosts: [response.data, ...state.userPosts],
    }));
  },

  handleCreateStory: async (formData) => {
    const response = await createStory(formData);

    set((state) => ({
      stories: [response.data, ...state.stories],
    }));
  },

  handleDeleteComment: async (postId, commentId) => {
    // Lưu state gốc để rollback nếu API lỗi
    const prevPosts = get().posts;
    const prevUserPosts = get().userPosts;

    // Optimistic: xóa comment khỏi UI ngay
    set((state) => ({
      posts: state.posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              comments: p.comments.filter((c) => String(c._id) !== commentId),
            }
          : p,
      ),
      userPosts: state.userPosts.map((p) =>
        p._id === postId
          ? {
              ...p,
              comments: p.comments.filter((c) => String(c._id) !== commentId),
            }
          : p,
      ),
    }));

    try {
      const response = await deleteComment(postId, commentId);
      // Thay bằng response thật từ server
      const updatedPost = response.data;
      set((state) => ({
        posts: replacePost(state.posts, updatedPost),
        userPosts: replacePost(state.userPosts, updatedPost),
      }));
    } catch (error) {
      // Rollback nếu API thất bại
      set({ posts: prevPosts, userPosts: prevUserPosts });
      throw error;
    }
  },

  handleDeletePost: async (postId) => {
    await deletePost(postId);
  },

  handleLikePost: async (postId) => {
    const response = await likePost(postId);

    const updatedPost = response.data;

    set((state) => ({
      posts: replacePost(state.posts, updatedPost),
      userPosts: replacePost(state.userPosts, updatedPost),
    }));
  },

  handleSharePost: async (postId) => {
    const response = await sharePost(postId);

    const updatedPost = response.data;

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
