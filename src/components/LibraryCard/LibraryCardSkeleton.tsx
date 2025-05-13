import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LibraryCardSkeleton() {
  return (
    <Card className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-none">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-5 w-40" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-14 flex-shrink-0 rounded-full" />
                <Skeleton className="h-5 w-10 flex-shrink-0 rounded-full" />
                <Skeleton className="h-5 w-12 flex-shrink-0 rounded-full border border-gray-300" />
              </div>
            </div>
            <Skeleton className="mt-1 h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-5 pt-0 pb-3">
        <Skeleton className="mb-4 h-5 w-3/4" />
        <div className="grid min-h-[160px] w-full grid-cols-3 gap-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="aspect-[5/7] w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between border-t border-gray-50 px-5 py-3">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardFooter>
    </Card>
  );
}
