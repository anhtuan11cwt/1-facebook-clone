"use client";

import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import {
  Link2,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PostComments from "@/components/PostComments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikesCount((c) => c + (isLiked ? -1 : 1));
  };

  const generateLink = () => `${window.location.origin}/posts/${post.id}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(generateLink());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsShareOpen(false);
    }, 1500);
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generateLink())}`,
      "_blank",
      "noopener,noreferrer",
    );
    setIsShareOpen(false);
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(generateLink())}&text=${encodeURIComponent(post.caption || "")}`,
      "_blank",
      "noopener,noreferrer",
    );
    setIsShareOpen(false);
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(generateLink())}`,
      "_blank",
      "noopener,noreferrer",
    );
    setIsShareOpen(false);
  };

  const userInitials = post.user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35 }}
      >
        <div className="rounded-2xl border bg-card shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-0">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm dark:bg-blue-900 dark:text-blue-300">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{post.user.name}</p>
                <p className="text-muted-foreground text-xs">
                  {post.createdAt}
                </p>
              </div>
            </div>
            <Button size="icon-sm" variant="ghost">
              <MoreHorizontal className="size-5" />
            </Button>
          </div>

          {/* Caption */}
          {post.caption && (
            <p className="px-4 pt-3 text-sm leading-relaxed">{post.caption}</p>
          )}

          {/* Media */}
          {post.mediaSrc && (
            <div className="mt-3">
              {post.mediaType === "video" ? (
                <video
                  className="w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  src={post.mediaSrc}
                  style={{ maxHeight: 500 }}
                >
                  <track kind="captions" />
                </video>
              ) : (
                <div className="relative w-full" style={{ maxHeight: 500 }}>
                  <Image
                    alt="Post media"
                    className="h-auto w-full object-cover"
                    height={0}
                    sizes="(max-width: 768px) 100vw, 600px"
                    src={post.mediaSrc}
                    style={{ maxHeight: 500 }}
                    width={0}
                  />
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              {likesCount > 0 && (
                <>
                  <span className="flex size-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                    <ThumbsUp className="size-3 fill-white" />
                  </span>
                  <span>{likesCount}</span>
                </>
              )}
            </div>
            <div className="flex gap-3 text-muted-foreground text-sm">
              {post.comments.length > 0 && (
                <span>{post.comments.length} bình luận</span>
              )}
              {post.shares > 0 && <span>{post.shares} lượt chia sẻ</span>}
            </div>
          </div>

          <Separator />

          {/* Action buttons */}
          <div className="grid grid-cols-3 px-2 py-1">
            <Button
              className="flex items-center gap-2"
              onClick={handleLike}
              variant="ghost"
            >
              <ThumbsUp
                className={`size-5 ${
                  isLiked ? "fill-blue-500 text-blue-500" : ""
                }`}
              />
              <span
                className={isLiked ? "text-blue-500" : "text-muted-foreground"}
              >
                Thích
              </span>
            </Button>

            <Button
              className="flex items-center gap-2 text-muted-foreground"
              onClick={() => {
                const el = document.getElementById(`comments-${post.id}`);
                el?.click();
              }}
              variant="ghost"
            >
              <MessageCircle className="size-5" />
              <span>Bình luận</span>
            </Button>

            <Button
              className="flex items-center gap-2 text-muted-foreground"
              onClick={() => setIsShareOpen(true)}
              variant="ghost"
            >
              <Share2 className="size-5" />
              <span>Chia sẻ</span>
            </Button>
          </div>

          <Separator />

          {/* Comments */}
          <div className="px-4 pt-2 pb-4" id={`comments-${post.id}`}>
            <PostComments comments={post.comments} />
          </div>
        </div>
      </motion.div>

      {/* Share dialog */}
      <Dialog onOpenChange={setIsShareOpen} open={isShareOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Chia sẻ bài viết</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="flex items-center gap-2"
              onClick={shareFacebook}
              variant="outline"
            >
              <IconBrandFacebook className="size-5 text-blue-600" />
              Facebook
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={shareTwitter}
              variant="outline"
            >
              <IconBrandTwitter className="size-5 text-sky-500" />
              Twitter
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={shareLinkedIn}
              variant="outline"
            >
              <IconBrandLinkedin className="size-5 text-blue-700" />
              LinkedIn
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={copyLink}
              variant="outline"
            >
              <Link2 className="size-5 text-gray-500" />
              {copied ? "Đã sao chép!" : "Sao chép liên kết"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
