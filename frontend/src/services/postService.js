import api from "./urlService";

export const createPost = async (formData) => {
  const response = await api.post("/posts", formData);
  return response.data;
};

export const getAllPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

export const getUserPosts = async (userId) => {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data;
};

export const createStory = async (formData) => {
  const response = await api.post("/stories", formData);
  return response.data;
};

export const getAllStories = async () => {
  const response = await api.get("/stories");
  return response.data;
};

export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/likes`);
  return response.data;
};

export const commentPost = async (postId, formData) => {
  const response = await api.post(`/posts/${postId}/comments`, formData);
  return response.data;
};

export const sharePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/share`);
  return response.data;
};
