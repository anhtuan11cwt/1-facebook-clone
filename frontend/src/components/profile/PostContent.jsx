"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import NewPostForm from "@/components/NewPostForm";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function PostContent({ isOwner, profile, posts }) {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  return (
    <div className="space-y-4 py-4">
      {isOwner && (
        <>
          <button
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md"
            onClick={() => setIsPostFormOpen(true)}
            type="button"
          >
            <Avatar className="size-10 shrink-0">
              {profile?.profilePicture ? (
                <Image
                  alt={profile.username}
                  className="rounded-full"
                  fill
                  src={profile.profilePicture}
                />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm dark:bg-blue-900 dark:text-blue-300">
                  {profile?.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <Input
              className="h-10 flex-1 cursor-pointer rounded-full border-none bg-muted/50 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
              placeholder="Bạn đang nghĩ gì?"
              readOnly
            />
            <ImageIcon className="size-5" />
          </button>

          <NewPostForm
            isPostFormOpen={isPostFormOpen}
            setIsPostFormOpen={setIsPostFormOpen}
          />
        </>
      )}

      {posts && posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id || post.id} post={post} />)
      ) : (
        <p className="py-8 text-center text-muted-foreground">
          Chưa có bài viết nào.
        </p>
      )}
    </div>
  );
}
