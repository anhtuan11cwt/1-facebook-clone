"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function StoryCard({ isAddStory, story }) {
  const fileInputRef = useRef(null);
  const [_isStoryOpen, setIsStoryOpen] = useState(false);

  if (isAddStory) {
    return (
      <button
        className="relative flex w-28 shrink-0 flex-col overflow-hidden rounded-2xl border bg-background shadow-sm transition-transform hover:scale-[1.02] sm:w-32 lg:w-36"
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        {/* Gradient placeholder background */}
        <div className="flex h-32 items-center justify-center bg-gradient-to-b from-gray-200 to-gray-100 sm:h-36 lg:h-40 dark:from-gray-700 dark:to-gray-800" />

        {/* Bottom section */}
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
              setIsStoryOpen(true);
            }
          }}
          ref={fileInputRef}
          type="file"
        />
      </button>
    );
  }

  if (!story) return null;

  const initials = story.username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      className="group relative w-28 shrink-0 overflow-hidden rounded-2xl shadow-sm transition-transform hover:scale-[1.03] sm:w-32 lg:w-36"
      onClick={() => setIsStoryOpen(true)}
      style={{ aspectRatio: "9 / 16" }}
      type="button"
    >
      {/* Media */}
      <div className="absolute inset-0">
        {story.mediaType === "video" ? (
          <video
            className="size-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
            src={story.mediaSrc}
          />
        ) : (
          <Image
            alt={story.username}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 128px, 144px"
            src={story.mediaSrc}
          />
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Avatar */}
      <div className="absolute top-2 left-2 z-10">
        <Avatar className="size-8 ring-2 ring-blue-500 ring-offset-1 ring-offset-transparent sm:size-9 lg:size-10">
          {story.avatar ? (
            <Image
              alt={story.username}
              className="rounded-full"
              height={40}
              src={story.avatar}
              width={40}
            />
          ) : (
            <AvatarFallback className="bg-blue-600 text-white text-xs">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      {/* Username */}
      <span className="absolute right-2 bottom-2 left-2 z-10 line-clamp-2 font-semibold text-white text-xs drop-shadow-sm sm:text-sm">
        {story.username}
      </span>
    </button>
  );
}
