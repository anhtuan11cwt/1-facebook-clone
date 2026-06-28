"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCard from "@/components/video/VideoCard";
import usePostStore from "@/store/postStore";

// Trang xem video, lọc bài viết có mediaType === "video"
export default function VideoPage() {
  const router = useRouter();
  const { posts, loading, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Chỉ lấy bài viết dạng video
  const videoPosts = posts.filter((post) => post.mediaType === "video");

  const mapPostToVideo = (post) => ({
    caption: post.content || "",
    comments: (post.comments || []).map((c) => ({
      content: c.text || c.content || "",
      createdAt: c.createdAt || "",
      id: c._id || c.id,
      user: {
        avatar: c.user?.profilePicture || c.user?.avatar || null,
        name: c.user?.username || c.user?.name || "Người dùng",
      },
    })),
    createdAt: post.createdAt,
    id: post._id,
    likes: post.likeCount || 0,
    mediaSrc: post.mediaUrl,
    shares: post.shareCount || 0,
    user: {
      avatar: post.user?.profilePicture || null,
      name: post.user?.username || "Người dùng",
    },
    userId: post.user?._id,
  });

  return (
    <>
      <Header />
      <LeftSidebar />

      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto flex max-w-[1600px] gap-6 px-4 lg:px-6">
          <div className="min-w-0 flex-1 lg:ml-72">
            <div className="mx-auto max-w-3xl space-y-8 py-4">
              <Button
                className="flex items-center gap-2"
                onClick={() => router.push("/")}
                variant="ghost"
              >
                <ChevronLeft className="size-5" />
                Quay lại Feed
              </Button>

              <div className="space-y-10">
                {loading ? (
                  Array.from({ length: 2 }, () => (
                    <div
                      className="space-y-4 rounded-2xl border p-4"
                      key={crypto.randomUUID()}
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-[500px] w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 flex-1" />
                      </div>
                    </div>
                  ))
                ) : videoPosts.length > 0 ? (
                  videoPosts.map((post) => (
                    <VideoCard key={post._id} video={mapPostToVideo(post)} />
                  ))
                ) : (
                  <div className="py-20 text-center text-muted-foreground">
                    <p>Chưa có video nào.</p>
                  </div>
                )}
              </div>
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
