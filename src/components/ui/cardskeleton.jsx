import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
  return (
    <Card>
        <CardHeader className="space-y-2 pb-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
        {/* Image skeleton */}
        <Skeleton className="aspect-[3/4] w-full mb-4" />
        {/* Details skeleton */}
        <div className="space-y-4">
            <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
        </CardContent>
    </Card>
  );
}

export { CardSkeleton } ;