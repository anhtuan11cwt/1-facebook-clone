"use client";

import { Loader2, MoreHorizontal, Send, Trash2, X } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import usePostStore from "@/store/postStore";
import useUserStore from "@/store/userStore";

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  if (Number.isNaN(Date.parse(dateStr))) return dateStr;

  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
};

function CommentMenu({ comment, postId, postUserId }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { handleDeleteComment } = usePostStore();
  const { user: currentUser } = useUserStore();

  const canDelete =
    currentUser &&
    (comment.userId === currentUser._id || postUserId === currentUser._id);

  const handleDelete = async () => {
    setIsDeleting(true);
    setOpen(false);
    toast.success("Đã xóa bình luận");

    try {
      await handleDeleteComment(postId, comment.id);
    } catch {
      toast.error("Xóa bình luận thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!canDelete) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-opacity hover:bg-muted"
            type="button"
          >
            <MoreHorizontal className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            className="gap-2 text-red-500 focus:text-red-500"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="size-4" />
            <span>Xóa bình luận</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        onOpenChange={(open) => {
          if (!isDeleting) setOpen(open);
        }}
        open={open}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Xóa bình luận?</AlertDialogTitle>
            <AlertDialogDescription>
              Bình luận sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
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

export default function VideoComments({
  comments: rawComments,
  postId,
  postUserId,
}) {
  const { handleCommentPost } = usePostStore();
  const { user: currentUser } = useUserStore();
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSending, setIsSending] = useState(false);

  const normalizeComment = (c) => ({
    content: c.text || c.content || "",
    createdAt: c.createdAt || "",
    id: c._id || c.id,
    user: {
      avatar: c.user?.profilePicture || c.user?.avatar || null,
      name: c.user?.name || "Người dùng",
    },
    userId: c.user?.userId || c.user?._id,
  });

  const comments = (rawComments || []).map(normalizeComment);
  const displayed = showAll ? comments : comments.slice(0, 2);

  const handleSend = async () => {
    if (!newComment.trim() || isSending) return;

    setIsSending(true);
    try {
      await handleCommentPost(postId, newComment.trim());
      setNewComment("");
      toast.success("Đã bình luận");
    } catch {
      toast.error("Bình luận thất bại");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {comments.length > 0 && (
        <div className="mt-3 space-y-3">
          {displayed.map((comment) => (
            <div className="flex gap-2" key={comment.id}>
              <Avatar className="mt-0.5 size-8 shrink-0">
                {comment.user.avatar ? (
                  <Image
                    alt={comment.user.name}
                    className="rounded-full"
                    fill
                    src={comment.user.avatar}
                  />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs dark:bg-blue-900 dark:text-blue-300">
                    {comment.user.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <div className="min-w-0 flex-1 rounded-2xl bg-muted px-3 py-2">
                    <button
                      className="font-semibold text-xs hover:underline"
                      onClick={() => {
                        const userId = comment.userId;
                        if (currentUser?._id === userId) {
                          router.push("/user-profile");
                        } else {
                          router.push(`/user-profile/${userId}`);
                        }
                      }}
                      type="button"
                    >
                      {comment.user.name}
                    </button>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <CommentMenu
                    comment={comment}
                    postId={postId}
                    postUserId={postUserId}
                  />
                </div>
                <div className="mt-1 flex items-center gap-4 px-3">
                  <span className="text-muted-foreground text-xs">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {comments.length > 2 && (
            <button
              className="text-muted-foreground text-sm hover:text-blue-500"
              onClick={() => setShowAll(!showAll)}
              type="button"
            >
              {showAll ? "Ẩn bớt" : `Xem thêm ${comments.length - 2} bình luận`}
            </button>
          )}
        </div>
      )}

      {/* New comment input */}
      <div className="mt-3 flex items-center gap-2 pb-2">
        <Avatar className="size-8 shrink-0">
          {currentUser?.profilePicture ? (
            <Image
              alt={currentUser.username}
              className="rounded-full"
              fill
              src={currentUser.profilePicture}
            />
          ) : (
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs dark:bg-blue-900 dark:text-blue-300">
              {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="relative flex-1">
          <Input
            className="h-9 rounded-full pr-12 text-sm"
            disabled={isSending}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Viết bình luận..."
            value={newComment}
          />
          <Button
            className="absolute top-1/2 right-0.5 -translate-y-1/2 rounded-full text-blue-500"
            disabled={!newComment.trim() || isSending}
            onClick={handleSend}
            size="icon-sm"
            variant="ghost"
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
