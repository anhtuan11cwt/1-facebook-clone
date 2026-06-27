"use client";

import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function FriendSuggestion({ suggestion }) {
  const initials = suggestion.name
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
    >
      <div className="flex flex-col items-center gap-3">
        <Avatar className="size-20">
          <AvatarFallback className="bg-green-100 text-green-600 text-lg dark:bg-green-900 dark:text-green-300">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="font-semibold">{suggestion.name}</p>
          <p className="text-muted-foreground text-sm">
            {suggestion.followers} người theo dõi
          </p>
        </div>
        <Button className="w-full">
          <UserPlus className="mr-2 size-4" />
          Thêm bạn bè
        </Button>
      </div>
    </motion.div>
  );
}
