import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CollectionCardSkeleton = () => {
  return (
    <Card className="p-4 space-y-2 h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-2 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <div className="space-y-2 mt-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="flex justify-end items-center space-x-1 mt-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>
    </Card>
  );
};

export default CollectionCardSkeleton;
