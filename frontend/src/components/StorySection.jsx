"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import StoryCard from "@/components/StoryCard";
import StoryPreview from "@/components/StoryPreview";
import usePostStore from "@/store/postStore";

export default function StorySection() {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const { stories, handleCreateStory } = usePostStore();

  // Preview state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [filePreview, setFilePreview] = useState("");
  const [fileType, setFileType] = useState("");
  const [isUpload, setIsUpload] = useState(false);
  const [isPostingStory, setIsPostingStory] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (containerRef.current) {
        setMaxScroll(
          containerRef.current.scrollWidth - containerRef.current.offsetWidth,
        );
      }
    };

    updateMaxScroll();

    window.addEventListener("resize", updateMaxScroll);
    return () => window.removeEventListener("resize", updateMaxScroll);
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const handleScrollButton = (direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        behavior: "smooth",
        left: direction === "left" ? -300 : 300,
      });
    }
  };

  // Mở preview story có sẵn
  const handleStoryClick = (story) => {
    setFilePreview(story.mediaUrl);
    setFileType(story.mediaType || "image");
    setIsUpload(false);
    setUploadFile(null);
    setIsViewOpen(true);
  };

  // Mở preview khi chọn file cho story mới
  const handleFileSelected = (file) => {
    if (!file) return;
    setUploadFile(file);
    setFilePreview(URL.createObjectURL(file));
    setFileType(file.type.startsWith("video") ? "video" : "image");
    setIsUpload(true);
    setIsViewOpen(true);
  };

  // Đăng story mới
  const handlePostStory = async () => {
    if (!uploadFile || isPostingStory) return;

    setIsPostingStory(true);

    try {
      const formData = new FormData();
      formData.append("media", uploadFile);
      await handleCreateStory(formData);
      setIsViewOpen(false);
      setUploadFile(null);
      setFilePreview("");
      toast.success("Đã đăng tin");
    } catch {
      toast.error("Đăng tin thất bại");
    } finally {
      setIsPostingStory(false);
    }
  };

  const handleClose = () => {
    setIsViewOpen(false);
    setFilePreview("");
    setFileType("");
    setUploadFile(null);
    setIsUpload(false);
    setIsPostingStory(false);
  };

  return (
    <>
      <div className="relative mb-6">
        {scrollPosition > 0 && (
          <button
            className="absolute top-1/2 left-0 z-10 flex -translate-y-1/2 rounded-full bg-background p-2 shadow-lg transition-colors hover:bg-accent"
            onClick={() => handleScrollButton("left")}
            type="button"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        <div
          className="flex gap-2 overflow-x-auto scroll-smooth px-1 pt-1 pb-2 [&::-webkit-scrollbar]:hidden"
          onScroll={handleScroll}
          ref={containerRef}
        >
          <StoryCard isAddStory onFileSelect={handleFileSelected} />
          {stories?.map((story) => (
            <StoryCard
              key={story._id}
              onClick={() => handleStoryClick(story)}
              story={story}
            />
          ))}
        </div>

        {scrollPosition < maxScroll && (
          <button
            className="absolute top-1/2 right-0 z-10 flex -translate-y-1/2 rounded-full bg-background p-2 shadow-lg transition-colors hover:bg-accent"
            onClick={() => handleScrollButton("right")}
            type="button"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>

      <StoryPreview
        filePreview={filePreview}
        fileType={fileType}
        isPosting={isPostingStory}
        isUpload={isUpload}
        isViewOpen={isViewOpen}
        onClose={handleClose}
        onPost={handlePostStory}
      />
    </>
  );
}
