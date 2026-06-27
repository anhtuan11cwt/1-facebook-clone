"use client";

import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import StorySection from "@/components/StorySection";

export default function HomePage() {
  return (
    <>
      <Header />
      <LeftSidebar />

      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto flex max-w-[1600px] gap-6 px-4 lg:px-6">
          {/* Feed */}
          <div className="min-w-0 flex-1 md:ml-72">
            <div className="mx-auto max-w-2xl py-4 lg:max-w-3xl">
              <StorySection />
              Trang chủ
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </main>
    </>
  );
}
