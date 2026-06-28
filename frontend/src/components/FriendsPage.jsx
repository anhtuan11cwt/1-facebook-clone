"use client";

import { Users } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import FriendCardSkeleton from "@/components/friends/FriendCardSkeleton";
import FriendRequest from "@/components/friends/FriendRequest";
import FriendSuggestion from "@/components/friends/FriendSuggestion";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import useUserFriendStore from "@/store/userFriendStore";

// Trang quản lý bạn bè: lời mời + gợi ý kết bạn
export default function FriendsPage() {
  const {
    friendRequests,
    friendSuggestions,
    fetchFriendRequests,
    fetchFriendSuggestions,
    fetchMutualFriends,
    followUser,
    deleteUserFromRequest,
    isLoading,
  } = useUserFriendStore();

  useEffect(() => {
    fetchFriendRequests();
    fetchFriendSuggestions();
    fetchMutualFriends();
  }, [fetchFriendRequests, fetchFriendSuggestions, fetchMutualFriends]);

  // Xử lý confirm / delete lời mời kết bạn
  const handleAction = async (action, userId) => {
    try {
      if (action === "confirm") {
        await followUser(userId);
        toast.success("Đã chấp nhận lời mời kết bạn");
      }
      if (action === "delete") {
        await deleteUserFromRequest(userId);
        toast.success("Đã xóa lời mời");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Gửi lời mời kết bạn từ gợi ý
  const handleFollowSuggestion = async (userId) => {
    try {
      await followUser(userId);
      toast.success("Đã gửi lời mời kết bạn");
    } catch (err) {
      toast.error(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  return (
    <>
      <Header />
      <LeftSidebar />

      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto flex max-w-[1600px] gap-6 px-4 lg:px-6">
          <div className="min-w-0 flex-1 lg:ml-72">
            <div className="mx-auto max-w-7xl space-y-10 py-4">
              <div>
                <h1 className="font-bold text-3xl">Bạn bè</h1>
                <p className="mt-1 text-muted-foreground">
                  Quản lý lời mời kết bạn và khám phá những người mới.
                </p>
              </div>

              <section>
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="font-semibold text-xl">Lời mời kết bạn</h2>
                  <span className="rounded-full bg-blue-600 px-2.5 py-0.5 font-semibold text-white text-xs">
                    {friendRequests.length} lời mời
                  </span>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }, () => (
                      <FriendCardSkeleton key={crypto.randomUUID()} />
                    ))}
                  </div>
                ) : friendRequests.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {friendRequests.map((user) => (
                      <FriendRequest
                        key={user._id}
                        onConfirm={() => handleAction("confirm", user._id)}
                        onDelete={() => handleAction("delete", user._id)}
                        user={user}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                    <Users className="size-12" />
                    <p>Không có lời mời kết bạn nào.</p>
                  </div>
                )}
              </section>

              <section>
                <h2 className="mb-6 font-semibold text-xl">Gợi ý kết bạn</h2>

                {isLoading ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }, () => (
                      <FriendCardSkeleton key={crypto.randomUUID()} />
                    ))}
                  </div>
                ) : friendSuggestions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {friendSuggestions.map((user) => (
                      <FriendSuggestion
                        key={user._id}
                        onFollow={() => handleFollowSuggestion(user._id)}
                        user={user}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                    <Users className="size-12" />
                    <p>Không có gợi ý nào.</p>
                  </div>
                )}
              </section>
            </div>
          </div>

          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </main>
    </>
  );
}
