"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import RightSidebar from "@/components/RightSidebar";
import usePostStore from "@/store/postStore";
import useUserStore from "@/store/userStore";

// Trang profile cá nhân (isOwner = true)
export default function ProfilePage() {
  const { user, profileData, profileLoading, fetchUserProfile } =
    useUserStore();
  const { userPosts, fetchUserPosts } = usePostStore();

  useEffect(() => {
    if (user?._id) {
      fetchUserProfile(user._id);
      fetchUserPosts(user._id);
    }
  }, [user?._id, fetchUserProfile, fetchUserPosts]);

  return (
    <>
      <Header />
      <LeftSidebar />

      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto flex max-w-[1600px] gap-6 px-4 lg:px-6">
          <div className="min-w-0 flex-1 lg:ml-72">
            <div className="mx-auto max-w-4xl py-4">
              {profileLoading ? (
                <div className="space-y-4">
                  <div className="h-52 animate-pulse rounded-xl bg-muted sm:h-64 md:h-80" />
                  <div className="flex items-center gap-4">
                    <div className="size-32 animate-pulse rounded-full bg-muted sm:size-36 lg:size-44" />
                    <div className="space-y-2">
                      <div className="h-6 w-48 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </div>
              ) : (
                <ProfileHeader
                  isOwner
                  profile={profileData || user}
                  userPosts={userPosts}
                />
              )}
              <ProfileTabs
                isOwner
                profile={profileData || user}
                userPosts={userPosts}
              />
            </div>
          </div>

          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </main>
    </>
  );
}
