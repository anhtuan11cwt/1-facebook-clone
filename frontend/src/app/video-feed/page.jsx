"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCard from "@/components/video/VideoCard";
import videos from "@/data/videos";

const skeletonIds = Array.from({ length: 2 }, () => crypto.randomUUID());

export default function VideoFeedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      <LeftSidebar />

      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto flex max-w-[1600px] gap-6 px-4 lg:px-6">
          <div className="min-w-0 flex-1 md:ml-72">
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
                {loading
                  ? skeletonIds.map((id) => (
                      <div
                        className="space-y-4 rounded-2xl border p-4"
                        key={id}
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
                  : videos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
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
