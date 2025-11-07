import { Card, CardContent } from '@/components/ui/card';

interface MatchCardSkeletonProps {
  compact?: boolean;
}

export function MatchCardSkeleton({ compact = false }: MatchCardSkeletonProps) {
  return (
    <Card>
      <CardContent className={`p-4 ${compact ? 'p-3' : ''}`}>
        {/* Status badges skeleton */}
        <div className="flex justify-between items-start mb-3">
          <div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Teams skeleton */}
        <div className="flex items-center justify-between mb-3">
          {/* Home team */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Score/VS */}
          <div className="flex items-center gap-2 px-4">
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Away team */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Match info skeleton */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="text-center">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="text-gray-400">•</div>

          <div className="text-center">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stage info skeleton */}
        <div className="mt-2 text-center">
          <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
        </div>
      </CardContent>
    </Card>
  );
}
