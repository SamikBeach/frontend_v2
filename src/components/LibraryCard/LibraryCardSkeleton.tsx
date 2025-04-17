import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LibraryCardSkeleton() {
  return (
    <Card className="h-full rounded-xl border-none bg-[#F9FAFB] shadow-none">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div>
            <Skeleton className="mb-1 h-4 w-40" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pt-0 pb-3">
        <Skeleton className="mb-4 h-10 w-full" />
        <div className="grid w-full grid-cols-3 gap-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="aspect-[5/7] w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-10" />
        </div>
      </CardFooter>
    </Card>
  );
}
