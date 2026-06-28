"use client";

import { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useUserFriendStore from "@/store/userFriendStore";

// Hiển thị danh sách bạn bè chung
export default function MutualFriends() {
  const { mutualFriends, fetchMutualFriends } = useUserFriendStore();

  useEffect(() => {
    fetchMutualFriends();
  }, [fetchMutualFriends]);

  return (
    <div className="mt-4">
      <h3 className="mb-4 font-semibold text-lg">Bạn bè</h3>

      {mutualFriends.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {mutualFriends.map((friend) => {
            const initials = (friend.username || "U")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-lg"
                key={friend._id}
              >
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="size-16">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg dark:bg-blue-900 dark:text-blue-300">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-center font-semibold text-sm">
                    {friend.username}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="py-8 text-center text-muted-foreground">
          Chưa có bạn bè.
        </p>
      )}
    </div>
  );
}
