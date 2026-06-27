"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PostComments({ comments: initialComments }) {
  const [showComments, setShowComments] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const displayed = showAll ? comments : comments.slice(0, 2);

  const handleSend = () => {
    if (!newComment.trim()) return;
    const comment = {
      content: newComment.trim(),
      createdAt: "Vừa xong",
      id: Date.now(),
      user: { avatar: null, name: "Facebook User" },
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Toggle comments button */}
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
                <div className="flex gap-2" key={comment.id}>
                  <Avatar className="mt-0.5 size-8 shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs dark:bg-blue-900 dark:text-blue-300">
                      {comment.user.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="rounded-2xl bg-muted px-3 py-2">
                      <p className="font-semibold text-xs">
                        {comment.user.name}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
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
                        {comment.createdAt}
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

            {/* New comment input */}
            <div className="mt-3 flex items-center gap-2 pb-2">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs dark:bg-blue-900 dark:text-blue-300">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="relative flex-1">
                <Input
                  className="h-9 rounded-full pr-10 text-sm"
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Viết bình luận..."
                  value={newComment}
                />
                <Button
                  className="absolute top-1/2 right-0.5 -translate-y-1/2 text-blue-500"
                  disabled={!newComment.trim()}
                  onClick={handleSend}
                  size="icon-sm"
                  variant="ghost"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
