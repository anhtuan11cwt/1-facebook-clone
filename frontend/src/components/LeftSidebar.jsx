"use client";

import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  User,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { logoutUser } from "@/services/authService";
import useSidebarStore from "@/store/sidebarStore";
import useUserStore from "@/store/userStore";

const menuItems = [
  { href: "/", icon: Home, title: "Trang chủ" },
  { href: "/friends-list", icon: Users, title: "Bạn bè" },
  { href: "/video-feed", icon: Video, title: "Video" },
  { href: "/messages", icon: MessageCircle, title: "Tin nhắn" },
  { href: "/user-profile", icon: User, title: "Trang cá nhân" },
  { href: "/notifications", icon: Bell, title: "Thông báo" },
];

// Sidebar trái: navigation + user info + logout
export default function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen, closeSidebar } = useSidebarStore();
  const { user, clearUser } = useUserStore();

  // Xoá cookie + xoá store + đẩy về login
  const handleLogout = async () => {
    try {
      await logoutUser();

      clearUser();
      toast.success("Đã đăng xuất");
      router.replace("/user-login");
    } catch {
      toast.error("Đăng xuất thất bại");
    }
  };

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
          {user ? (
            <>
              <Avatar className="size-12">
                {user.profilePicture ? (
                  <Image
                    alt={user.username}
                    className="rounded-full"
                    fill
                    src={user.profilePicture}
                  />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg dark:bg-blue-900 dark:text-blue-300">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="font-semibold text-base">{user.username}</span>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="size-12 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
            </div>
          )}
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.title}>
                  <Button
                    className={`w-full justify-start gap-3 ${
                      isActive ? "bg-muted text-blue-500" : "text-foreground"
                    }`}
                    onClick={() => {
                      router.push(item.href);
                      closeSidebar();
                    }}
                    variant="ghost"
                  >
                    <item.icon className="size-5" />
                    <span>{item.title}</span>
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t px-2 py-1">
          <Button
            className="w-full justify-start gap-3 text-muted-foreground hover:text-red-500"
            onClick={handleLogout}
            variant="ghost"
          >
            <LogOut className="size-5" />
            <span>Đăng xuất</span>
          </Button>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Avatar className="size-8">
                  {user.profilePicture ? (
                    <Image
                      alt={user.username}
                      className="rounded-full"
                      fill
                      src={user.profilePicture}
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs dark:bg-blue-900 dark:text-blue-300">
                      {user.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user.username}</span>
                  <span className="text-muted-foreground text-xs">
                    {user.email}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="size-8 animate-pulse rounded-full bg-muted" />
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
