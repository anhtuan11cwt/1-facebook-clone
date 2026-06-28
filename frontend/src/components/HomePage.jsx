"use client";

import { Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import NewPostForm from "@/components/NewPostForm";
import PostCard from "@/components/PostCard";
import RightSidebar from "@/components/RightSidebar";
import StorySection from "@/components/StorySection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import usePostStore from "@/store/postStore";
import useUserStore from "@/store/userStore";

export default function HomePage() {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const { user } = useUserStore();
  const { posts, loading, fetchPosts, fetchStories } = usePostStore();

  // Fetch posts + stories khi mount
  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, [fetchStories, fetchPosts]);

  return (
    <>
      <Header />
      <LeftSidebar />

      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto flex max-w-[1600px] gap-6 px-4 lg:px-6">
          <div className="min-w-0 flex-1 lg:ml-72">
            <div className="mx-auto max-w-2xl py-4 lg:max-w-3xl">
              <StorySection />

              {/* Trigger card */}
              <button
                className="mb-4 flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md"
                onClick={() => setIsPostFormOpen(true)}
                type="button"
              >
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm dark:bg-blue-900 dark:text-blue-300">
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
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

              {/* Loading skeleton */}
              {loading && (
                <div className="mt-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      className="space-y-3 rounded-2xl border bg-card p-4"
                      key={i}
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-60 w-full rounded-xl" />
                    </div>
                  ))}
                </div>
              )}

              {/* Post list */}
              {!loading && (
                <div className="mt-4 space-y-4">
                  {posts?.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              )}
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
