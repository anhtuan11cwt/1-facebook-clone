"use client";

import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
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
import { Textarea } from "@/components/ui/textarea";
import useUserStore from "@/store/userStore";

const getInitialFormData = (profileData) => {
  const bio = profileData?.bio || {};
  return {
    bioText: bio.bioText || "",
    education: bio.education || "",
    homeTown: bio.homeTown || "",
    liveIn: bio.liveIn || "",
    phone: bio.phone || "",
    relationship: bio.relationship || "",
    workPlace: bio.workPlace || "",
  };
};

// Dialog chỉnh sửa thông tin cá nhân (bio, work, education...)
export default function EditBio({ isOpen, onClose }) {
  const { updateBio, profileData } = useUserStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(() =>
    getInitialFormData(profileData),
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateBio(formData);
      toast.success("Đã cập nhật thông tin");
      onClose();
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      key={isOpen ? "open" : "closed"}
      onOpenChange={(_open) => {
        if (!isSaving) onClose();
      }}
      open={isOpen}
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
          <DialogTitle className="text-center">Chỉnh sửa thông tin</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="bio">Giới thiệu</Label>
            <Textarea
              className="mt-1"
              disabled={isSaving}
              id="bio"
              maxLength={200}
              onChange={(e) => handleChange("bioText", e.target.value)}
              placeholder="Viết đôi điều về bản thân..."
              value={formData.bioText}
            />
          </div>
          <div>
            <Label htmlFor="liveIn">Sống tại</Label>
            <Input
              className="mt-1"
              disabled={isSaving}
              id="liveIn"
              onChange={(e) => handleChange("liveIn", e.target.value)}
              value={formData.liveIn}
            />
          </div>
          <div>
            <Label htmlFor="relationship">Mối quan hệ</Label>
            <NativeSelect
              className="mt-1 w-full"
              disabled={isSaving}
              id="relationship"
              onChange={(e) => handleChange("relationship", e.target.value)}
              value={formData.relationship}
            >
              <NativeSelectOption value="">Chọn...</NativeSelectOption>
              <NativeSelectOption value="single">Độc thân</NativeSelectOption>
              <NativeSelectOption value="married">
                Đã kết hôn
              </NativeSelectOption>
              <NativeSelectOption value="in a relationship">
                Đang hẹn hò
              </NativeSelectOption>
              <NativeSelectOption value="engaged">
                Đã đính hôn
              </NativeSelectOption>
              <NativeSelectOption value="divorced">
                Đã ly hôn
              </NativeSelectOption>
              <NativeSelectOption value="widowed">Góa</NativeSelectOption>
            </NativeSelect>
          </div>
          <div>
            <Label htmlFor="workPlace">Nơi làm việc</Label>
            <Input
              className="mt-1"
              disabled={isSaving}
              id="workPlace"
              onChange={(e) => handleChange("workPlace", e.target.value)}
              value={formData.workPlace}
            />
          </div>
          <div>
            <Label htmlFor="education">Học vấn</Label>
            <Input
              className="mt-1"
              disabled={isSaving}
              id="education"
              onChange={(e) => handleChange("education", e.target.value)}
              value={formData.education}
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              className="mt-1"
              disabled={isSaving}
              id="phone"
              maxLength={10}
              onChange={(e) =>
                handleChange("phone", e.target.value.replace(/\D/g, ""))
              }
              placeholder="0xxxxxxxxx"
              value={formData.phone}
            />
          </div>
          <div>
            <Label htmlFor="hometown">Quê quán</Label>
            <Input
              className="mt-1"
              disabled={isSaving}
              id="hometown"
              onChange={(e) => handleChange("homeTown", e.target.value)}
              value={formData.homeTown}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              className="gap-2"
              disabled={isSaving}
              onClick={onClose}
              type="button"
              variant="outline"
            >
              <X className="size-4" />
              Hủy
            </Button>
            <Button className="gap-2" disabled={isSaving} type="submit">
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
