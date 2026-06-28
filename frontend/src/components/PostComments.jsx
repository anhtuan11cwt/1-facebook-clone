"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MoreHorizontal, Trash2, X } from "lucide-react";
import Image from "next/image";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import usePostStore from "@/store/postStore";
import useUserStore from "@/store/userStore";

const normalizeComment = (c) => ({
  content: c.text || c.content || "",
  createdAt: c.createdAt || "",
  id: c._id || c.id,
  mediaType: c.mediaType || null,
  mediaUrl: c.mediaUrl || null,
  user: {
    avatar: c.user?.profilePicture || c.user?.avatar || null,
    name: c.user?.username || c.user?.name || "Người dùng",
  },
  userId: c.userId || c.user?._id,
});

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

  // Cho phép xóa nếu là chủ comment hoặc chủ post
  const canDelete =
    currentUser &&
    (comment.userId === currentUser._id || postUserId === currentUser._id);

  const handleDelete = async () => {
    setIsDeleting(true);
    // Xóa UI ngay, không chờ API
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

export default function PostComments({
  comments: rawComments,
  postId,
  postUserId,
}) {
  const comments = (rawComments || []).map(normalizeComment);
  const [showComments, setShowComments] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? comments : comments.slice(0, 2);

  return (
    <>
      {comments.length > 0 && (
        <button
          className="text-muted-foreground text-sm hover:text-blue-500"
          onClick={() => setShowComments(!showComments)}
          type="button"
        >
          {showComments ? "Ẩn bình luận" : `Xem ${comments.length} bình luận`}
        </button>
      )}

      <AnimatePresence>
        {showComments && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mt-3 space-y-3">
              {displayed.map((comment) => (
                <div className="group/card flex gap-2" key={comment.id}>
                  <Avatar className="mt-0.5 size-8 shrink-0">
                    {comment.user.avatar ? (
                      <Image
                        alt={comment.user.name}
                        className="rounded-full"
                        height={32}
                        src={comment.user.avatar}
                        width={32}
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
                        <p className="font-semibold text-xs">
                          {comment.user.name}
                        </p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <CommentMenu
                        comment={comment}
                        postId={postId}
                        postUserId={postUserId}
                      />
                    </div>
                    {comment.mediaUrl && (
                      <div className="mt-1 overflow-hidden rounded-lg px-3">
                        {comment.mediaType === "video" ? (
                          <video
                            className="max-h-48 w-full object-contain"
                            controls
                            src={comment.mediaUrl}
                          >
                            <track kind="captions" />
                          </video>
                        ) : (
                          <Image
                            alt="Comment media"
                            className="max-h-48 w-full object-contain object-left"
                            height={0}
                            src={comment.mediaUrl}
                            unoptimized
                            width={0}
                          />
                        )}
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-4 px-3">
                      <button
                        className="font-semibold text-muted-foreground text-xs hover:text-blue-500"
                        type="button"
                      >
                        Like
                      </button>
                      <button
                        className="font-semibold text-muted-foreground text-xs hover:text-blue-500"
                        type="button"
                      >
                        Phản hồi
                      </button>
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
                  {showAll
                    ? "Ẩn bớt"
                    : `Xem thêm ${comments.length - 2} bình luận`}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
