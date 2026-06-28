"use client";

import { motion } from "framer-motion";
import { Loader2, UserPlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Card hiển thị gợi ý kết bạn với nút "Kết bạn"
export default function FriendSuggestion({ user, onFollow }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const initials = (user.username || user.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleFollow = async () => {
    setIsProcessing(true);
    try {
      await onFollow();
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
            <AvatarFallback className="bg-green-100 text-green-600 text-lg dark:bg-green-900 dark:text-green-300">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="text-center">
          <p className="font-semibold">{user.username || user.name}</p>
        </div>
        <Button
          className="w-full"
          disabled={isProcessing}
          onClick={handleFollow}
        >
          {isProcessing ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 size-4" />
          )}
          {isProcessing ? "Đang xử lý..." : "Kết bạn"}
        </Button>
      </div>
    </motion.div>
  );
}
