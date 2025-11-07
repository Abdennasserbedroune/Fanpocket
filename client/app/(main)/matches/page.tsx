'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMatches, useTeams, useStadiums } from '@/lib/matches';
import { MatchCard } from '@/components/matches/MatchCard';
import { MatchCardSkeleton } from '@/components/matches/MatchCardSkeleton';
import { MatchFilters } from '@/components/matches/MatchFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MatchesPage() {
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'stages'>(
    'daily'
  );
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 20;

  // Fetch matches with filters
  const {
    data: matchesData,
    isLoading,
    error,
  } = useMatches({
    ...filters,
    limit,
    offset: currentPage * limit,
  });

  // Fetch teams and stadiums for filters
  const { data: teams = [] } = useTeams();
  const { data: stadiums = [] } = useStadiums();

  // Group matches by date for daily view
  const matchesByDate = useMemo(() => {
    if (!matchesData?.matches) return {};

    return matchesData.matches.reduce(
      (acc, match) => {
        const date = new Date(match.dateTime).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(match);
        return acc;
      },
      {} as Record<string, typeof matchesData.matches>
    );
  }, [matchesData]);

  // Group matches by stage for stages view
  const matchesByStage = useMemo(() => {
    if (!matchesData?.matches) return {};

    return matchesData.matches.reduce(
      (acc, match) => {
        if (!acc[match.stage]) {
          acc[match.stage] = [];
        }
        acc[match.stage].push(match);
        return acc;
      },
      {} as Record<string, typeof matchesData.matches>
    );
  }, [matchesData]);

  const totalPages = matchesData?.pagination
    ? Math.ceil(matchesData.pagination.total / limit)
    : 0;
  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined
  );

  const renderDailyView = () => {
    const sortedDates = Object.keys(matchesByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    return (
      <div className="space-y-6">
        {sortedDates.map(date => (
          <div key={date}>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {matchesByDate[date].map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStagesView = () => {
    const stageOrder = [
      'group',
      'round_of_16',
      'quarter_final',
      'semi_final',
      'final',
    ];
    const stageLabels = {
      group: 'Group Stage',
      round_of_16: 'Round of 16',
      quarter_final: 'Quarter-Finals',
      semi_final: 'Semi-Finals',
      final: 'Final',
    };

    return (
      <div className="space-y-6">
        {stageOrder.map(stage => {
          if (!matchesByStage[stage]) return null;

          return (
            <div key={stage}>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {stageLabels[stage as keyof typeof stageLabels]}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {matchesByStage[stage].map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeeklyView = () => {
    // For simplicity, we'll use the same as daily view for now
    // In a real implementation, this would group by week
    return renderDailyView();
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-2">
            Error Loading Matches
          </h1>
          <p className="text-red-600">
            {error instanceof Error
              ? error.message
              : 'Failed to load matches. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AFCON 2025 Matches
        </h1>
        <p className="text-gray-600">
          Follow live scores and upcoming fixtures
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <MatchFilters
            filters={filters}
            onFiltersChange={setFilters}
            teams={teams}
            stadiums={stadiums}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* View Mode Toggle */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('daily')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Daily
              </Button>
              <Button
                variant={viewMode === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('weekly')}
              >
                <Grid className="h-4 w-4 mr-2" />
                Weekly
              </Button>
              <Button
                variant={viewMode === 'stages' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('stages')}
              >
                <List className="h-4 w-4 mr-2" />
                Stages
              </Button>
            </div>

            {matchesData && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {matchesData.pagination.total} matches
                </span>
                {hasActiveFilters && (
                  <Badge variant="secondary">
                    {Object.values(filters).filter(Boolean).length} filters
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              {/* Skeleton for date header */}
              <div>
                <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <MatchCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Matches Content */}
          {!isLoading &&
            matchesData?.matches &&
            matchesData.matches.length > 0 && (
              <>
                {viewMode === 'daily' && renderDailyView()}
                {viewMode === 'weekly' && renderWeeklyView()}
                {viewMode === 'stages' && renderStagesView()}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <span className="text-sm text-gray-600">
                      Page {currentPage + 1} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}

          {/* Empty State */}
          {!isLoading &&
            (!matchesData?.matches || matchesData.matches.length === 0) && (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="max-w-md mx-auto">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {hasActiveFilters
                      ? 'No matches found'
                      : 'No matches available'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {hasActiveFilters
                      ? 'Try adjusting your filters to see more matches.'
                      : 'Matches will be available here once the tournament schedule is finalized.'}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={() => setFilters({})}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
