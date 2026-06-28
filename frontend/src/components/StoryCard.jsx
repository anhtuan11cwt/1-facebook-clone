"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function StoryCard({
  isAddStory,
  story,
  onClick,
  onFileSelect,
}) {
  const fileInputRef = useRef(null);

  if (isAddStory) {
    return (
      <button
        className="relative flex w-28 shrink-0 flex-col overflow-hidden rounded-2xl border bg-background shadow-sm transition-transform hover:scale-[1.02] sm:w-32 lg:w-36"
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        <div className="flex h-32 items-center justify-center bg-gradient-to-b from-gray-200 to-gray-100 sm:h-36 lg:h-40 dark:from-gray-700 dark:to-gray-800" />

        <div className="relative flex flex-col items-center pt-6 pb-3">
          <span className="absolute -top-4 flex size-10 items-center justify-center rounded-full border-4 border-background bg-blue-600 text-white shadow">
            <Plus className="size-5" />
          </span>
          <span className="mt-1 text-center font-semibold text-xs sm:text-sm">
            Tạo tin
          </span>
        </div>

        <input
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onFileSelect?.(e.target.files[0]);
              e.target.value = "";
            }
          }}
          ref={fileInputRef}
          type="file"
        />
      </button>
    );
  }

  if (!story) return null;

  const username = story.user?.username || story.username || "Người dùng";
  const profilePicture = story.user?.profilePicture || story.avatar || null;
  const mediaUrl = story.mediaUrl || story.mediaSrc;
  const mediaType = story.mediaType || "image";

  const initials = username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      className="group relative w-28 shrink-0 overflow-hidden rounded-2xl shadow-sm transition-transform hover:scale-[1.03] sm:w-32 lg:w-36"
      onClick={onClick}
      style={{ aspectRatio: "9 / 16" }}
      type="button"
    >
      <div className="absolute inset-0">
        {mediaType === "video" ? (
          <video
            className="size-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
            src={mediaUrl}
          />
        ) : (
          <Image
            alt={username}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            loading="eager"
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 128px, 144px"
            src={mediaUrl}
            unoptimized
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Avatar */}
      <div className="absolute top-2 left-2 z-10">
        <Avatar className="size-8 ring-2 ring-blue-500 ring-offset-1 ring-offset-transparent sm:size-9 lg:size-10">
          {profilePicture ? (
            <Image
              alt={username}
              className="rounded-full"
              height={40}
              src={profilePicture}
              width={40}
            />
          ) : (
            <AvatarFallback className="bg-blue-600 text-white text-xs">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      <span className="absolute right-2 bottom-2 left-2 z-10 line-clamp-2 font-semibold text-white text-xs drop-shadow-sm sm:text-sm">
        {username}
      </span>
    </button>
  );
}
