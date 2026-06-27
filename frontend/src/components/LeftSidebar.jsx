"use client";

import { Bell, Home, MessageCircle, User, Users, Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useSidebarStore from "@/store/sidebarStore";

const menuItems = [
  { href: "/", icon: Home, title: "Trang chủ" },
  { href: "/friends-list", icon: Users, title: "Bạn bè" },
  { href: "/video-feed", icon: Video, title: "Video" },
  { href: "/messages", icon: MessageCircle, title: "Tin nhắn" },
  { href: "/profile", icon: User, title: "Hồ sơ" },
  { href: "/notifications", icon: Bell, title: "Thông báo" },
];

export default function LeftSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useSidebarStore();

  return (
    <>
      {/* Overlay on mobile */}
      {isSidebarOpen && (
        <button
          aria-label="Đóng thanh bên"
          className="fixed inset-0 z-30 cursor-default bg-black/50 lg:hidden"
          onClick={closeSidebar}
          type="button"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 border-r bg-background transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-5">
          <Avatar className="size-12">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg dark:bg-blue-900 dark:text-blue-300">
              U
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-base">Người dùng Facebook</span>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.title}>
                  <Link href={item.href} onClick={closeSidebar}>
                    <Button
                      className={`w-full justify-start gap-3 ${
                        isActive ? "bg-muted text-blue-500" : "text-foreground"
                      }`}
                      variant="ghost"
                    >
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Separator />

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs dark:bg-blue-900 dark:text-blue-300">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">Người dùng Facebook</span>
              <span className="text-muted-foreground text-xs">
                user@facebook.com
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
