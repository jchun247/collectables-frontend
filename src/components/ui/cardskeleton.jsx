import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-0">
        <div className="relative rounded-lg overflow-hidden bg-muted/10">
          <div className="aspect-[2.5/3.5]">
            <Skeleton className="absolute inset-0 w-full h-full" />
          </div>
        </div>
        <div className="p-4 h-[140px]">
          <div className="h-full flex flex-col justify-between">
            <div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between mt-auto">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { CardSkeleton } ;
