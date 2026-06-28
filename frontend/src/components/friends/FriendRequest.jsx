"use client";

import { motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Card hiển thị lời mời kết bạn với 2 nút: Xác nhận / Xóa
export default function FriendRequest({ user, onConfirm, onDelete }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState(null);

  const initials = (user.username || user.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleConfirm = async () => {
    setAction("confirm");
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setAction("delete");
    setIsProcessing(true);
    try {
      await onDelete();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col items-center gap-3">
        <Avatar className="size-20">
          {user.profilePicture ? (
            <Image
              alt={user.username}
              className="rounded-full"
              height={80}
              src={user.profilePicture}
              width={80}
            />
          ) : (
            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg dark:bg-blue-900 dark:text-blue-300">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="text-center">
          <p className="font-semibold">{user.username || user.name}</p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isProcessing}
            onClick={handleConfirm}
          >
            {isProcessing && action === "confirm" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            {isProcessing && action === "confirm"
              ? "Đang xử lý..."
              : "Xác nhận"}
          </Button>
          <Button
            className="w-full"
            disabled={isProcessing}
            onClick={handleDelete}
            variant="secondary"
          >
            {isProcessing && action === "delete" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
            {isProcessing && action === "delete" ? "Đang xử lý..." : "Xóa"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
