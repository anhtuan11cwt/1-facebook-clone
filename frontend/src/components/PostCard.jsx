"use client";

import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Image as ImageIcon,
  Link2,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useId, useRef, useState } from "react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

import toast from "react-hot-toast";
import PostComments from "@/components/PostComments";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import usePostStore from "@/store/postStore";
import useUserStore from "@/store/userStore";

// Định dạng thời gian relative
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  // Nếu là chuỗi tĩnh như "2 giờ trước" thì trả về luôn
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

// Chuẩn hoá post từ backend hoặc mock data
const normalizePost = (post) => ({
  _id: post._id || post.id,
  commentCount: post.commentCount ?? (post.comments?.length || 0),
  comments: (post.comments || []).map((c) => ({
    _id: c._id || c.id,
    createdAt: c.createdAt || "",
    mediaType: c.mediaType || null,
    mediaUrl: c.mediaUrl || null,
    text: c.text || c.content || "",
    user: {
      _id: c.user?._id,
      profilePicture: c.user?.profilePicture || c.user?.avatar || null,
      username: c.user?.username || c.user?.name || "Người dùng",
    },
    userId: c.user?._id,
  })),
  content: post.content || post.caption || "",
  createdAt: post.createdAt || "",
  likeCount:
    post.likeCount ??
    (typeof post.likes === "number" ? post.likes : post.likes?.length || 0),
  mediaType: post.mediaType || null,
  mediaUrl: post.mediaUrl || post.mediaSrc || null,
  shareCount:
    post.shareCount ??
    (typeof post.shares === "number" ? post.shares : post.shares?.length || 0),
  user: {
    _id: post.user?._id,
    profilePicture: post.user?.profilePicture || post.user?.avatar || null,
    username: post.user?.username || post.user?.name || "Người dùng",
  },
});

const LIKED_STORAGE_KEY = "likedPosts";

export default function PostCard({ post: rawPost }) {
  const post = normalizePost(rawPost);
  const {
    handleLikePost,
    handleCommentPost,
    handleSharePost,
    handleDeletePost,
  } = usePostStore();
  const { user: currentUser } = useUserStore();

  const [isLiked, setIsLiked] = useState(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(LIKED_STORAGE_KEY) || "[]",
      );
      return Array.isArray(stored) && stored.includes(post._id);
    } catch {
      return false;
    }
  });
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedCommentFile, setSelectedCommentFile] = useState(null);
  const [commentFilePreview, setCommentFilePreview] = useState(null);
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const commentInputRef = useRef(null);
  const commentFileInputRef = useRef(null);
  const _commentInputId = useId();

  const handleLike = async () => {
    // Optimistic update
    setIsLiked((prev) => !prev);
    setLikeCount((c) => c + (isLiked ? -1 : 1));

    try {
      await handleLikePost(post._id);

      // Persist trạng thái like
      const stored = JSON.parse(
        localStorage.getItem(LIKED_STORAGE_KEY) || "[]",
      );
      if (isLiked) {
        localStorage.setItem(
          LIKED_STORAGE_KEY,
          JSON.stringify(stored.filter((id) => id !== post._id)),
        );
      } else {
        localStorage.setItem(
          LIKED_STORAGE_KEY,
          JSON.stringify([...stored, post._id]),
        );
      }
    } catch {
      // Rollback nếu API lỗi
      setIsLiked((prev) => !prev);
      setLikeCount((c) => c + (isLiked ? 1 : -1));
    }
  };

  const handleComment = async () => {
    if ((!commentText.trim() && !selectedCommentFile) || isCommenting) return;

    setIsCommenting(true);

    try {
      await handleCommentPost(
        post._id,
        commentText.trim(),
        selectedCommentFile,
      );
      setCommentText("");
      removeCommentFile();
      toast.success("Đã bình luận");
    } catch {
      toast.error("Bình luận thất bại");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleCommentKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  const handleCommentFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedCommentFile(file);
    setCommentFilePreview(URL.createObjectURL(file));
    setShowCommentEmojiPicker(false);
  };

  const removeCommentFile = () => {
    setSelectedCommentFile(null);
    setCommentFilePreview(null);
    if (commentFileInputRef.current) commentFileInputRef.current.value = "";
  };

  const handleCommentEmojiClick = (emojiObject) => {
    setCommentText((prev) => prev + emojiObject.emoji);
  };

  const handleCommentClick = () => {
    setTimeout(() => commentInputRef.current?.focus(), 100);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // Xóa UI ngay, lưu rollback nếu API lỗi
    setIsDeleteDialogOpen(false);

    const rollbackPosts = usePostStore.getState().posts;
    const rollbackUserPosts = usePostStore.getState().userPosts;

    usePostStore.setState((state) => ({
      posts: state.posts.filter((p) => p._id !== post._id),
      userPosts: state.userPosts.filter((p) => p._id !== post._id),
    }));
    toast.success("Đã xóa bài viết");

    try {
      await handleDeletePost(post._id);
    } catch {
      usePostStore.setState({
        posts: rollbackPosts,
        userPosts: rollbackUserPosts,
      });
      toast.error("Xóa bài viết thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwnPost = currentUser?._id === post.user._id;

  const handleShare = async () => {
    try {
      await handleSharePost(post._id);
    } catch {
      // ignore
    }
    setIsShareOpen(true);
  };

  const generateLink = () => `${window.location.origin}/posts/${post._id}`;

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

  const userInitials = post.user.username
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
                {post.user.profilePicture ? (
                  <Image
                    alt={post.user.username}
                    className="rounded-full"
                    height={40}
                    src={post.user.profilePicture}
                    width={40}
                  />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm dark:bg-blue-900 dark:text-blue-300">
                    {userInitials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{post.user.username}</p>
                <p className="text-muted-foreground text-xs">
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                  <MoreHorizontal className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {isOwnPost && (
                  <DropdownMenuItem
                    className="gap-2 text-red-500 focus:text-red-500"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="size-4" />
                    <span>Xóa bài viết</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content */}
          {post.content && (
            <p className="px-4 pt-3 text-sm leading-relaxed">{post.content}</p>
          )}

          {/* Media */}
          {post.mediaUrl && (
            <div className="mt-3">
              {post.mediaType === "video" ? (
                <video
                  className="w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  src={post.mediaUrl}
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
                    src={post.mediaUrl}
                    style={{ maxHeight: 500 }}
                    unoptimized
                    width={0}
                  />
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              {likeCount > 0 && (
                <>
                  <span className="flex size-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                    <ThumbsUp className="size-3 fill-white" />
                  </span>
                  <span>{likeCount}</span>
                </>
              )}
            </div>
            <div className="flex gap-3 text-muted-foreground text-sm">
              {post.commentCount > 0 && (
                <span>{post.commentCount} bình luận</span>
              )}
              {post.shareCount > 0 && (
                <span>{post.shareCount} lượt chia sẻ</span>
              )}
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
              onClick={handleCommentClick}
              variant="ghost"
            >
              <MessageCircle className="size-5" />
              <span>Bình luận</span>
            </Button>

            <Button
              className="flex items-center gap-2 text-muted-foreground"
              onClick={handleShare}
              variant="ghost"
            >
              <Send className="size-5" />
              <span>Chia sẻ</span>
            </Button>
          </div>

          <Separator />

          {/* Comments */}
          <div className="px-4 pt-2 pb-4">
            <PostComments
              comments={post.comments}
              postId={post._id}
              postUserId={post.user._id}
            />

            {/* Comment input */}
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs dark:bg-blue-900 dark:text-blue-300">
                    {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="relative flex-1">
                  <Input
                    className="h-9 rounded-full pr-20 text-sm"
                    disabled={isCommenting}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={handleCommentKeyDown}
                    placeholder="Viết bình luận..."
                    ref={commentInputRef}
                    value={commentText}
                  />
                  <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-0.5">
                    <input
                      accept="image/*,video/*"
                      className="hidden"
                      id={_commentInputId}
                      onChange={handleCommentFileChange}
                      ref={commentFileInputRef}
                      type="file"
                    />
                    <button
                      className="flex size-7 items-center justify-center rounded-full text-green-500 transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                      disabled={isCommenting}
                      onClick={() => commentFileInputRef.current?.click()}
                      type="button"
                    >
                      <ImageIcon className="size-4" />
                    </button>
                    <button
                      className="flex size-7 items-center justify-center rounded-full text-yellow-500 transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                      disabled={isCommenting}
                      onClick={() =>
                        setShowCommentEmojiPicker(!showCommentEmojiPicker)
                      }
                      type="button"
                    >
                      <Smile className="size-4" />
                    </button>
                    <button
                      className="flex size-7 items-center justify-center rounded-full text-blue-500 transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                      disabled={
                        (!commentText.trim() && !selectedCommentFile) ||
                        isCommenting
                      }
                      onClick={handleComment}
                      type="button"
                    >
                      {isCommenting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* File preview & Emoji picker */}
              <div className="relative pl-10">
                <AnimatePresence>
                  {commentFilePreview && (
                    <motion.div
                      animate={{ height: "auto", opacity: 1 }}
                      className="relative mt-2 overflow-hidden rounded-xl border"
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                    >
                      {selectedCommentFile?.type.startsWith("video") ? (
                        <video
                          className="max-h-48 w-full object-contain"
                          controls
                          src={commentFilePreview}
                        >
                          <track kind="captions" />
                        </video>
                      ) : (
                        <Image
                          alt="Preview"
                          className="max-h-48 w-full object-contain"
                          height={0}
                          src={commentFilePreview}
                          unoptimized
                          width={0}
                        />
                      )}
                      <button
                        className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 disabled:opacity-40 disabled:hover:bg-black/60"
                        disabled={isCommenting}
                        onClick={removeCommentFile}
                        type="button"
                      >
                        <X className="size-3" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showCommentEmojiPicker && (
                    <motion.div
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute bottom-full left-0 z-10 mb-2"
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    >
                      <EmojiPicker
                        height={300}
                        onEmojiClick={handleCommentEmojiClick}
                        searchDisabled
                        skinTonesDisabled
                        width={260}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
