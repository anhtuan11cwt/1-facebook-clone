"use client";

import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import FriendCardSkeleton from "@/components/friends/FriendCardSkeleton";
import FriendRequest from "@/components/friends/FriendRequest";
import FriendSuggestion from "@/components/friends/FriendSuggestion";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import friendRequests from "@/data/friendRequests";
import friendSuggestions from "@/data/friendSuggestions";

const skeletonIds = Array.from({ length: 4 }, () => crypto.randomUUID());

export default function FriendsListPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      <LeftSidebar />

      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto flex max-w-[1600px] gap-6 px-4 lg:px-6">
          <div className="min-w-0 flex-1 md:ml-72">
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

                {loading ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {skeletonIds.map((id) => (
                      <FriendCardSkeleton key={id} />
                    ))}
                  </div>
                ) : friendRequests.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {friendRequests.map((req) => (
                      <FriendRequest key={req.id} request={req} />
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

                {loading ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {skeletonIds.map((id) => (
                      <FriendCardSkeleton key={id} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {friendSuggestions.map((s) => (
                      <FriendSuggestion key={s.id} suggestion={s} />
                    ))}
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
