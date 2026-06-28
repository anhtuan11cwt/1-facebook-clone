"use client";

import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

export default function StoryPreview({
  filePreview,
  fileType,
  isUpload,
  isPosting,
  isViewOpen,
  onClose,
  onPost,
}) {
  return (
    <Dialog
      onOpenChange={(_open) => {
        if (!isPosting) onClose();
      }}
      open={isViewOpen}
    >
      <DialogContent
        className="flex max-h-[90vh] w-full max-w-lg flex-col items-center justify-center border-none bg-black/90 p-0 sm:rounded-2xl"
        onEscapeKeyDown={(e) => {
          if (isPosting) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isPosting) e.preventDefault();
        }}
      >
        <DialogHeader className="absolute top-2 right-2 z-10">
          <Button
            className="flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-40"
            disabled={isPosting}
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <X className="size-5" />
          </Button>
        </DialogHeader>

        {filePreview && fileType === "video" ? (
          <video
            autoPlay
            className="max-h-[80vh] w-full object-contain"
            controls
            playsInline
            src={filePreview}
          >
            <track kind="captions" />
          </video>
        ) : filePreview ? (
          <Image
            alt="Story preview"
            className="max-h-[80vh] w-full object-contain"
            height={0}
            sizes="(max-width: 640px) 100vw, 500px"
            src={filePreview}
            unoptimized
            width={0}
          />
        ) : null}

        {isUpload && (
          <div className="absolute bottom-6 w-full px-6">
            <Button
              className="w-full gap-2"
              disabled={isPosting}
              onClick={onPost}
              size="lg"
            >
              {isPosting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Đang đăng...
                </>
              ) : (
                "Đăng tin"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
