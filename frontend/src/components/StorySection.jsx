"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import StoryCard from "@/components/StoryCard";
import stories from "@/data/stories";

export default function StorySection() {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

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

  return (
    <div className="relative mb-6">
      {/* Left button */}
      {scrollPosition > 0 && (
        <button
          className="absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 rounded-full bg-background p-2 shadow-lg transition-colors hover:bg-accent md:flex"
          onClick={() => handleScrollButton("left")}
          type="button"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}

      {/* Scroll container */}
      <div
        className="flex gap-2 overflow-x-auto scroll-smooth px-1 pt-1 pb-2 [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
        ref={containerRef}
      >
        <StoryCard isAddStory />
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {/* Right button */}
      {scrollPosition < maxScroll && (
        <button
          className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 rounded-full bg-background p-2 shadow-lg transition-colors hover:bg-accent md:flex"
          onClick={() => handleScrollButton("right")}
          type="button"
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}
