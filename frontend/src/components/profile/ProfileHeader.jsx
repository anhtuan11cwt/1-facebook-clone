"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, Loader2, Pencil, Save, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import useUserStore from "@/store/userStore";

export default function ProfileHeader({ isOwner, profile }) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditCoverOpen, setIsEditCoverOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formName, setFormName] = useState(profile?.username || "");
  const [formGender, setFormGender] = useState(profile?.gender || "male");
  const [formDob, setFormDob] = useState(
    profile?.dateOfBirth
      ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
      : "",
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const { updateUserProfile, updateCoverPhoto } = useUserStore();

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", formName);
      formData.append("gender", formGender);
      if (formDob) formData.append("dateOfBirth", formDob);
      if (avatarFile) formData.append("profilePicture", avatarFile);
      await updateUserProfile(formData);
      setIsEditProfileOpen(false);
      toast.success("Đã cập nhật hồ sơ");
    } catch {
      toast.error("Cập nhật hồ sơ thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCover = async () => {
    if (!coverFile) {
      setIsEditCoverOpen(false);
      return;
    }
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("coverPhoto", coverFile);
      await updateCoverPhoto(formData);
      setIsEditCoverOpen(false);
      toast.success("Đã cập nhật ảnh bìa");
    } catch {
      toast.error("Cập nhật ảnh bìa thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (profile?.username || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35 }}
    >
      {/* Cover photo */}
      <div className="relative h-52 overflow-hidden rounded-xl bg-muted sm:h-64 md:h-80">
        {coverPreview ? (
          <Image alt="Cover" className="object-cover" fill src={coverPreview} />
        ) : profile?.coverPhoto ? (
          <Image
            alt="Cover"
            className="object-cover"
            fill
            src={profile.coverPhoto}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <span className="font-bold text-4xl text-white/50">{initials}</span>
          </div>
        )}

        {isOwner && (
          <Button
            className="absolute right-3 bottom-3 gap-2 shadow-md"
            onClick={() => setIsEditCoverOpen(true)}
            size="sm"
            variant="secondary"
          >
            <Camera className="size-4" />
            <span className="hidden sm:inline">Chỉnh sửa ảnh bìa</span>
          </Button>
        )}
      </div>

      {/* Avatar + Info */}
      <div className="relative flex flex-col items-center px-4 sm:flex-row sm:items-end sm:gap-5">
        {/* Avatar */}
        <div className="-mt-16 sm:-mt-20">
          <Avatar className="size-32 border-4 border-background shadow-xl sm:size-36 lg:size-44">
            {profile?.profilePicture ? (
              <Image
                alt={profile.username}
                className="rounded-full"
                fill
                src={profile.profilePicture}
              />
            ) : (
              <AvatarFallback className="bg-blue-100 text-4xl text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Name + followers count */}
        <div className="mt-2 text-center sm:mt-0 sm:pb-3 sm:text-left">
          <h1 className="font-bold text-2xl md:text-3xl">
            {profile?.username || "Người dùng"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {profile?.followerCount || 0} người theo dõi
          </p>
        </div>

        {/* Edit profile button */}
        {isOwner && (
          <div className="mt-3 sm:mt-0 sm:ml-auto sm:pb-3">
            <Button
              className="gap-2"
              onClick={() => setIsEditProfileOpen(true)}
              variant="outline"
            >
              <Pencil className="size-4" />
              Chỉnh sửa trang cá nhân
            </Button>
          </div>
        )}
      </div>

      {/* Edit profile dialog */}
      <Dialog
        onOpenChange={(open) => {
          if (!isSaving) setIsEditProfileOpen(open);
        }}
        open={isEditProfileOpen}
      >
        <DialogContent
          className="sm:max-w-md"
          onEscapeKeyDown={(e) => {
            if (isSaving) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (isSaving) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              Chỉnh sửa trang cá nhân
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Ảnh đại diện</Label>
              <Input
                accept="image/*"
                className="mt-1"
                disabled={isSaving}
                onChange={handleAvatarChange}
                ref={avatarInputRef}
                type="file"
              />
              <AnimatePresence>
                {avatarPreview && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="relative mt-2 overflow-hidden rounded-lg"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                  >
                    <Image
                      alt="Avatar preview"
                      className="mx-auto size-32 rounded-full object-cover"
                      height={128}
                      src={avatarPreview}
                      unoptimized
                      width={128}
                    />
                    <button
                      className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 disabled:opacity-40"
                      disabled={isSaving}
                      onClick={removeAvatar}
                      type="button"
                    >
                      <X className="size-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div>
              <Label htmlFor="profile-name">Tên</Label>
              <Input
                className="mt-1"
                disabled={isSaving}
                id="profile-name"
                onChange={(e) => setFormName(e.target.value)}
                value={formName}
              />
            </div>
            <div>
              <Label htmlFor="profile-gender">Giới tính</Label>
              <NativeSelect
                className="mt-1 w-full"
                disabled={isSaving}
                id="profile-gender"
                onChange={(e) => setFormGender(e.target.value)}
                value={formGender}
              >
                <NativeSelectOption value="male">Nam</NativeSelectOption>
                <NativeSelectOption value="female">Nữ</NativeSelectOption>
              </NativeSelect>
            </div>
            <div>
              <Label htmlFor="profile-dob">Ngày sinh</Label>
              <Input
                className="mt-1"
                disabled={isSaving}
                id="profile-dob"
                max={maxDateStr}
                onChange={(e) => setFormDob(e.target.value)}
                type="date"
                value={formDob}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              className="gap-2"
              disabled={isSaving}
              onClick={() => setIsEditProfileOpen(false)}
              variant="outline"
            >
              <X className="size-4" />
              Hủy
            </Button>
            <Button
              className="gap-2"
              disabled={isSaving}
              onClick={handleSaveProfile}
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Check className="size-4" /> Lưu
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit cover dialog */}
      <Dialog
        onOpenChange={(open) => {
          if (!isSaving) setIsEditCoverOpen(open);
        }}
        open={isEditCoverOpen}
      >
        <DialogContent
          className="sm:max-w-lg"
          onEscapeKeyDown={(e) => {
            if (isSaving) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (isSaving) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center">Chỉnh sửa ảnh bìa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              accept="image/*"
              disabled={isSaving}
              onChange={handleCoverChange}
              ref={coverInputRef}
              type="file"
            />
            {coverPreview && (
              <div className="relative h-48 overflow-hidden rounded-lg">
                <Image
                  alt="Preview"
                  className="object-cover"
                  fill
                  src={coverPreview}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              className="gap-2"
              disabled={isSaving}
              onClick={() => {
                setCoverPreview(null);
                setCoverFile(null);
                setIsEditCoverOpen(false);
              }}
              variant="outline"
            >
              <X className="size-4" />
              Hủy
            </Button>
            <Button
              className="gap-2"
              disabled={isSaving}
              onClick={handleSaveCover}
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="size-4" /> Lưu
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
