"use client";

import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import {
  Link2,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Send,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import VideoComments from "@/components/video/VideoComments";
import usePostStore from "@/store/postStore";
import useUserStore from "@/store/userStore";

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  if (Number.isNaN(Date.parse(dateStr))) return dateStr;

  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;

  return new Date(dateStr).toLocaleDateString("vi-VN");
};

export default function VideoCard({ video }) {
  const { handleLikePost, handleDeletePost } = usePostStore();
  const { user: currentUser } = useUserStore();
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("likedPosts") || "[]");
      return Array.isArray(stored) && stored.includes(video.id);
    } catch {
      return false;
    }
  });
  const [likesCount, setLikesCount] = useState(video.likes);
  const [showComments, setShowComments] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwnPost = currentUser?._id === video.userId;

  const initials = video.user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLike = async () => {
    setIsLiked((prev) => !prev);
    setLikesCount((c) => c + (isLiked ? -1 : 1));

    try {
      await handleLikePost(video.id);

      const stored = JSON.parse(localStorage.getItem("likedPosts") || "[]");
      if (isLiked) {
        localStorage.setItem(
          "likedPosts",
          JSON.stringify(stored.filter((id) => id !== video.id)),
        );
      } else {
        localStorage.setItem(
          "likedPosts",
          JSON.stringify([...stored, video.id]),
        );
      }
    } catch {
      setIsLiked((prev) => !prev);
      setLikesCount((c) => c + (isLiked ? 1 : -1));
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setIsDeleteDialogOpen(false);
    toast.success("Đã xóa bài viết");

    try {
      await handleDeletePost(video.id);
    } catch {
      toast.error("Xóa bài viết thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  const generateLink = () => `${window.location.origin}/videos/${video.id}`;

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
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(generateLink())}`,
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

  return (
    <>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border bg-card shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              {video.user.avatar ? (
                <Image
                  alt={video.user.name}
                  className="rounded-full"
                  fill
                  src={video.user.avatar}
                />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm dark:bg-blue-900 dark:text-blue-300">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <button
                className="font-semibold text-sm hover:underline"
                onClick={() => {
                  const userId = video.userId;
                  if (currentUser?._id === userId) {
                    router.push("/user-profile");
                  } else {
                    router.push(`/user-profile/${userId}`);
                  }
                }}
                type="button"
              >
                {video.user.name}
              </button>
              <p className="text-muted-foreground text-xs">
                {formatTimeAgo(video.createdAt)}
              </p>
            </div>
          </div>
          {isOwnPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                  <MoreHorizontal className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  className="gap-2 text-red-500 focus:text-red-500"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="size-4" />
                  <span>Xóa bài viết</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Caption */}
        {video.caption && (
          <p className="px-4 pt-3 text-sm leading-relaxed">{video.caption}</p>
        )}

        {/* Video */}
        <div className="mt-3">
          <video
            className="h-[500px] w-full bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            src={video.mediaSrc}
          >
            <track kind="captions" />
          </video>
        </div>

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
            {video.comments.length > 0 && (
              <span>{video.comments.length} bình luận</span>
            )}
            {video.shares > 0 && <span>{video.shares} lượt chia sẻ</span>}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="grid grid-cols-3 px-2 py-1">
          <Button
            className="flex items-center gap-2"
            onClick={handleLike}
            variant="ghost"
          >
            <ThumbsUp
              className={`size-5 ${
                isLiked
                  ? "fill-blue-500 text-blue-500"
                  : "text-muted-foreground"
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
            onClick={() => setShowComments(!showComments)}
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
            <Send className="size-5" />
            <span>Chia sẻ</span>
          </Button>
        </div>

        <Separator />

        {/* Comments */}
        {showComments && (
          <div className="px-4 pt-2 pb-4">
            <VideoComments
              comments={video.comments}
              postId={video.id}
              postUserId={video.userId}
            />
          </div>
        )}
      </motion.div>

      {/* Share dialog */}
      <Dialog onOpenChange={setIsShareOpen} open={isShareOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Chia sẻ video</DialogTitle>
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

      {/* Delete confirmation dialog */}
      <AlertDialog
        onOpenChange={(open) => {
          if (!isDeleting) setIsDeleteDialogOpen(open);
        }}
        open={isDeleteDialogOpen}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
            <AlertDialogDescription>
              Bài viết sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} variant="outline">
              <X className="size-4" />
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDelete}
              variant="destructive"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
