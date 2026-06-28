import api from "./urlService";

export const getFriendRequests = async () => {
  const response = await api.get("/users/friend-requests");
  return response.data;
};

export const getFriendSuggestions = async () => {
  const response = await api.get("/users/suggestions");
  return response.data;
};

export const followUser = async (userIdToFollow) => {
  const response = await api.post("/users/follow", { userIdToFollow });
  return response.data;
};

export const unfollowUser = async (userIdToUnfollow) => {
  const response = await api.post("/users/unfollow", { userIdToUnfollow });
  return response.data;
};

export const deleteFriendRequest = async (senderId) => {
  const response = await api.post("/users/delete-request", { senderId });
  return response.data;
};

export const getMutualFriends = async () => {
  const response = await api.get("/users/mutual-friends");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const fetchUserProfile = async (userId) => {
  const response = await api.get(`/users/profile/${userId}`);
  return response.data;
};

export const updateUserProfile = async (formData) => {
  const response = await api.put("/users/profile", formData);
  return response.data;
};

export const updateCoverPhoto = async (formData) => {
  const response = await api.put("/users/cover-photo", formData);
  return response.data;
};

export const createOrUpdateBio = async (data) => {
  const response = await api.post("/users/bio", data);
  return response.data;
};
