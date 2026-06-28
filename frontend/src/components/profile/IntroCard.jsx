"use client";

import {
  Briefcase,
  Cake,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";
import { useState } from "react";
import EditBio from "@/components/profile/EditBio";
import { Button } from "@/components/ui/button";

const RELATIONSHIP_LABELS = {
  divorced: "Đã ly hôn",
  engaged: "Đã đính hôn",
  "in a relationship": "Đang hẹn hò",
  married: "Đã kết hôn",
  single: "Độc thân",
  widowed: "Góa",
};

// Card "Giới thiệu" hiển thị thông tin cá nhân
export default function IntroCard({ isOwner, profile }) {
  const [isEditBioOpen, setIsEditBioOpen] = useState(false);

  const bio = profile?.bio || {};
  const infoItems = [
    { icon: MapPin, label: "Sống tại", value: bio.liveIn },
    {
      icon: Heart,
      label: "Mối quan hệ",
      value: RELATIONSHIP_LABELS[bio.relationship] || bio.relationship,
    },
    { icon: Briefcase, label: "Làm việc tại", value: bio.workPlace },
    { icon: GraduationCap, label: "Học tại", value: bio.education },
    { icon: Phone, label: "Số điện thoại", value: bio.phone },
    { icon: Mail, label: "Email", value: profile?.email },
    {
      icon: Cake,
      label: "Ngày sinh",
      value: profile?.dateOfBirth
        ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN")
        : "",
    },
  ];

  return (
    <div className="mt-4 rounded-2xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-lg">Giới thiệu</h3>

      {bio.bioText && (
        <p className="mb-4 text-center text-muted-foreground text-sm italic">
          {bio.bioText}
        </p>
      )}

      <div className="space-y-5">
        {infoItems.map(
          (item) =>
            item.value && (
              <div className="flex items-center gap-3" key={item.label}>
                <item.icon className="size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                  <p className="font-medium text-sm">{item.value}</p>
                </div>
              </div>
            ),
        )}
      </div>

      {isOwner && (
        <>
          <Button
            className="mt-5 w-full gap-2"
            onClick={() => setIsEditBioOpen(true)}
            variant="outline"
          >
            <Pencil className="size-4" />
            Chỉnh sửa chi tiết
          </Button>
          <EditBio
            isOpen={isEditBioOpen}
            onClose={() => setIsEditBioOpen(false)}
          />
        </>
      )}
    </div>
  );
}
