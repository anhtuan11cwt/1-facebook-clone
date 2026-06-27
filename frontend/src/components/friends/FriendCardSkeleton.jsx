import { Skeleton } from "@/components/ui/skeleton";

export default function FriendCardSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border p-5">
      <div className="flex justify-center">
        <Skeleton className="size-20 rounded-full" />
      </div>
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-4 w-32" />
        <Skeleton className="mx-auto h-3 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
