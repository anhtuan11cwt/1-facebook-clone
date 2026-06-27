"use client";

import {
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import useSidebarStore from "@/store/sidebarStore";

const navigation = [
  { icon: LayoutDashboard, name: "Trang chủ", path: "/" },
  { icon: Video, name: "Video", path: "/video-feed" },
  { icon: Users, name: "Bạn bè", path: "/friends-list" },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [_isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { toggleSidebar } = useSidebarStore();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b bg-background shadow-sm">
      <div className="mx-auto grid h-full grid-cols-3 items-center px-4">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Button
            className="lg:hidden"
            onClick={toggleSidebar}
            size="icon"
            variant="ghost"
          >
            <Menu className="size-5" />
          </Button>

          <Link className="shrink-0" href="/">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#1877F2] font-bold text-lg text-white">
              F
            </span>
          </Link>

          <div className="relative hidden md:block">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-56 rounded-full pl-10 lg:w-64"
              onBlur={() => {
                setTimeout(() => setIsSearchOpen(false), 200);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Tìm kiếm Facebook"
            />
          </div>

          <Button
            className="md:hidden"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            size="icon"
            variant="ghost"
          >
            {isMobileSearchOpen ? (
              <X className="size-5" />
            ) : (
              <Search className="size-5" />
            )}
          </Button>
        </div>

        {/* Center: Navigation */}
        <nav className="flex items-center justify-center gap-1 sm:gap-6">
          {navigation.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link href={item.path} key={item.name}>
                <Button
                  className={`relative size-10 rounded-lg sm:size-12 ${
                    isActive
                      ? "text-blue-500 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:rounded-full after:bg-blue-500"
                      : "text-muted-foreground hover:text-blue-500"
                  }`}
                  size="icon"
                  variant="ghost"
                >
                  <item.icon className="size-5 sm:size-6" />
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right: User Dropdown */}
        <div className="justify-self-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="size-10 rounded-full p-0" variant="ghost">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    U
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="size-4" />
                <span>Hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="size-4" />
                <span>Tin nhắn</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "light" ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className="size-4" />
                )}
                <span>{theme === "light" ? "Chế độ tối" : "Chế độ sáng"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut className="size-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar */}
      {isMobileSearchOpen && (
        <div className="border-t bg-background px-4 py-2 md:hidden">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              className="w-full rounded-full pl-10"
              placeholder="Tìm kiếm Facebook"
            />
          </div>
        </div>
      )}
    </header>
  );
}
