"use client";

import { motion } from "framer-motion";
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
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
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
import { logoutUser } from "@/services/authService";
import { getAllUsers } from "@/services/userService";
import useSidebarStore from "@/store/sidebarStore";
import useUserStore from "@/store/userStore";

const navigation = [
  { icon: LayoutDashboard, name: "Trang chủ", path: "/" },
  { icon: Video, name: "Video", path: "/video-feed" },
  { icon: Users, name: "Bạn bè", path: "/friends-list" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState([]);
  const searchRef = useRef(null);
  const { toggleSidebar } = useSidebarStore();
  const { user, clearUser } = useUserStore();

  useEffect(() => {
    getAllUsers()
      .then((res) => setUserList(res.data || []))
      .catch(() => {});
  }, []);

  const filteredUsers = searchQuery
    ? userList.filter((u) =>
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  useEffect(() => {
    const handleClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleNavigation = (path) => () => router.push(path);

  const handleUserClick = (id) => {
    router.push(`/user-profile/${id}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

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

          <motion.div
            className="shrink-0 cursor-pointer"
            onClick={handleNavigation("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-[#1877F2] font-bold text-lg text-white">
              F
            </span>
          </motion.div>

          <div className="relative hidden lg:block" ref={searchRef}>
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-56 rounded-full pl-10 lg:w-64"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Tìm kiếm Facebook"
              value={searchQuery}
            />
            {isSearchOpen && filteredUsers.length > 0 && (
              <div className="absolute top-full mt-1 w-full rounded-xl border bg-card p-2 shadow-lg">
                {filteredUsers.slice(0, 8).map((u) => (
                  <button
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                    key={u._id}
                    onClick={() => handleUserClick(u._id)}
                    type="button"
                  >
                    <Avatar className="size-8">
                      {u.profilePicture ? (
                        <Image
                          alt={u.username}
                          className="rounded-full"
                          fill
                          src={u.profilePicture}
                        />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          {u.username?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="font-medium text-sm">{u.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            className="lg:hidden"
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
              <Button
                className={`relative size-10 rounded-lg sm:size-12 ${
                  isActive
                    ? "text-blue-500 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:rounded-full after:bg-blue-500"
                    : "text-muted-foreground hover:text-blue-500"
                }`}
                key={item.name}
                onClick={handleNavigation(item.path)}
                size="icon"
                variant="ghost"
              >
                <item.icon className="size-5 sm:size-6" />
              </Button>
            );
          })}
        </nav>

        {/* Right: menu user (profile, settings, logout) */}
        <div className="justify-self-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="size-10 rounded-full p-0" variant="ghost">
                <Avatar>
                  {user?.profilePicture ? (
                    <Image
                      alt={user.username}
                      className="rounded-full"
                      fill
                      src={user.profilePicture}
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleNavigation("/user-profile")}>
                <User className="size-4" />
                <span>Hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigation("/messages")}>
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
              <DropdownMenuItem onClick={handleNavigation("/settings")}>
                <Settings className="size-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} variant="destructive">
                <LogOut className="size-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar */}
      {isMobileSearchOpen && (
        <div className="border-t bg-background px-4 py-2 lg:hidden">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              className="w-full rounded-full pl-10"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              placeholder="Tìm kiếm Facebook"
              value={searchQuery}
            />
            {isSearchOpen && filteredUsers.length > 0 && (
              <div className="absolute top-full mt-1 w-full rounded-xl border bg-card p-2 shadow-lg">
                {filteredUsers.slice(0, 8).map((u) => (
                  <button
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                    key={u._id}
                    onClick={() => handleUserClick(u._id)}
                    type="button"
                  >
                    <Avatar className="size-8">
                      {u.profilePicture ? (
                        <Image
                          alt={u.username}
                          className="rounded-full"
                          fill
                          src={u.profilePicture}
                        />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          {u.username?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="font-medium text-sm">{u.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
