import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LibraryCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-none">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="mb-1 h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-5 pt-0 pb-3">
        <Skeleton className="mb-4 h-5 w-3/4" />
        <div className="grid w-full grid-cols-3 gap-2">
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
