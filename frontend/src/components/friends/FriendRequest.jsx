"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function FriendRequest({ request }) {
  const initials = request.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
          <AvatarFallback className="bg-blue-100 text-blue-600 text-lg dark:bg-blue-900 dark:text-blue-300">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="font-semibold">{request.name}</p>
          <p className="text-muted-foreground text-sm">
            {request.mutualFriends} bạn chung
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Check className="size-4" />
            Xác nhận
          </Button>
          <Button className="w-full" variant="secondary">
            <X className="size-4" />
            Xóa
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
