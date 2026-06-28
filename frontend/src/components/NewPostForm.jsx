"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, Send, Smile, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import usePostStore from "@/store/postStore";
import useUserStore from "@/store/userStore";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function NewPostForm({ isPostFormOpen, setIsPostFormOpen }) {
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef(null);
  const _textareaId = useId();

  const { user } = useUserStore();
  const { handleCreatePost } = usePostStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiObject) => {
    setPostContent((prev) => prev + emojiObject.emoji);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = async () => {
    if (!postContent.trim() && !selectedFile) return;

    setIsPosting(true);

    try {
      const formData = new FormData();
      formData.append("content", postContent.trim());
      if (selectedFile) formData.append("media", selectedFile);

      await handleCreatePost(formData);

      setPostContent("");
      removeFile();
      setIsPostFormOpen(false);
      toast.success("Đã đăng bài viết");
    } catch (err) {
      console.error("Create post error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Đăng bài thất bại");
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    if (isPosting) return;
    setIsPostFormOpen(false);
    setPostContent("");
    removeFile();
    setShowEmojiPicker(false);
  };

  return (
    <Dialog onOpenChange={handleClose} open={isPostFormOpen}>
      <DialogContent
        className="sm:max-w-[525px]"
        onEscapeKeyDown={(e) => {
          if (isPosting) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isPosting) e.preventDefault();
        }}
        showCloseButton={!isPosting}
      >
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-base">
            Tạo bài viết
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="relative">
          {isPosting && (
            <div className="absolute inset-0 z-10 flex cursor-not-allowed items-center justify-center rounded-b-lg bg-background/70">
              <span className="text-muted-foreground text-sm">
                Đang đăng...
              </span>
            </div>
          )}

          {/* User info */}
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm dark:bg-blue-900 dark:text-blue-300">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">
                {user?.username || "Facebook User"}
              </p>
              <span className="text-muted-foreground text-xs">Công khai</span>
            </div>
          </div>

          {/* Textarea */}
          <Textarea
            className="min-h-[120px] resize-none border-none p-0 text-base shadow-none focus-visible:ring-0"
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            value={postContent}
          />

          {/* File preview */}
          <AnimatePresence>
            {filePreview && (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                className="relative overflow-hidden rounded-xl border"
                exit={{ height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
              >
                {selectedFile?.type.startsWith("video") ? (
                  <video
                    className="max-h-80 w-full object-contain"
                    controls
                    src={filePreview}
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <Image
                    alt="Preview"
                    className="max-h-80 w-full object-contain"
                    height={0}
                    src={filePreview}
                    unoptimized
                    width={0}
                  />
                )}
                <button
                  className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                  disabled={isPosting}
                  onClick={removeFile}
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toolbar */}
          <div className="flex items-center justify-between rounded-xl border px-4 py-2">
            <span className="font-medium text-sm">Thêm vào bài viết</span>
            <div className="flex items-center gap-1">
              <input
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
              />
              <button
                className="flex size-9 items-center justify-center rounded-full text-green-500 transition-colors hover:bg-muted"
                disabled={isPosting}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <ImageIcon className="size-5" />
              </button>
              <div className="relative">
                <button
                  className="flex size-9 items-center justify-center rounded-full text-yellow-500 transition-colors hover:bg-muted"
                  disabled={isPosting}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  type="button"
                >
                  <Smile className="size-5" />
                </button>
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute right-0 bottom-full mb-2"
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    >
                      <EmojiPicker
                        height={350}
                        onEmojiClick={handleEmojiClick}
                        searchDisabled
                        skinTonesDisabled
                        width={300}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Post button */}
        <Button
          className="w-full gap-2"
          disabled={(!postContent.trim() && !selectedFile) || isPosting}
          onClick={handlePost}
        >
          <Send className="size-4" />
          {isPosting ? "Đang đăng..." : "Đăng"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
