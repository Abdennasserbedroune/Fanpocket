'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useMatch } from '@/lib/matches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, Clock, Users } from 'lucide-react';
import Image from 'next/image';

export default function MatchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: match, isLoading, error } = useMatch(params.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'finished':
        return 'bg-gray-500 text-white';
      case 'scheduled':
        return 'bg-blue-500 text-white';
      case 'postponed':
        return 'bg-yellow-500 text-black';
      case 'cancelled':
        return 'bg-black text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return 'LIVE';
      case 'finished':
        return 'Finished';
      case 'scheduled':
        return 'Scheduled';
      case 'postponed':
        return 'Postponed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStageDisplay = (stage: string) => {
    switch (stage) {
      case 'group':
        return 'Group Stage';
      case 'round_of_16':
        return 'Round of 16';
      case 'quarter_final':
        return 'Quarter-Finals';
      case 'semi_final':
        return 'Semi-Finals';
      case 'third_place':
        return '3rd Place Play-off';
      case 'final':
        return 'Final';
      default:
        return stage;
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(new Date(date));
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-2">
            Error Loading Match
          </h1>
          <p className="text-red-600 mb-4">
            {error instanceof Error
              ? error.message
              : 'Failed to load match details. Please try again.'}
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-gray-200 rounded"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="w-16 h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Match Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The match you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const homeTeam = match.homeTeamData;
  const awayTeam = match.awayTeamData;
  const stadium = match.stadiumData;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Matches
      </Button>

      {/* Match Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Badge className={getStatusColor(match.status)}>
            {getStatusText(match.status)}
          </Badge>
          {match.group && <Badge variant="outline">Group {match.group}</Badge>}
          <Badge variant="secondary">{getStageDisplay(match.stage)}</Badge>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {homeTeam?.name || 'TBD'} vs {awayTeam?.name || 'TBD'}
        </h1>

        <div className="flex items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDateTime(match.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatTime(match.dateTime)} (Local Time)</span>
          </div>
        </div>
      </div>

      {/* Match Score */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex items-center gap-4 flex-1">
              {homeTeam ? (
                <>
                  {homeTeam.flagUrl ? (
                    <div className="relative w-20 h-16">
                      <Image
                        src={homeTeam.flagUrl}
                        alt={homeTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-16 flag-placeholder rounded">
                      {homeTeam.shortCode}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{homeTeam.name}</h3>
                    <p className="text-gray-600">{homeTeam.shortCode}</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">TBD</span>
                  </div>
                  <p className="text-gray-500 mt-2">To Be Determined</p>
                </div>
              )}
            </div>

            {/* Score */}
            <div className="text-center px-8">
              <div className="text-4xl font-bold mb-2">
                {match.score ? (
                  <span>
                    {match.score.home} - {match.score.away}
                  </span>
                ) : (
                  <span className="text-gray-500">VS</span>
                )}
              </div>
              {match.score?.halfTime && (
                <p className="text-sm text-gray-600">
                  Half-time: {match.score.halfTime.home} -{' '}
                  {match.score.halfTime.away}
                </p>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              {awayTeam ? (
                <>
                  <div className="text-right">
                    <h3 className="text-xl font-semibold">{awayTeam.name}</h3>
                    <p className="text-gray-600">{awayTeam.shortCode}</p>
                  </div>
                  {awayTeam.flagUrl ? (
                    <div className="relative w-20 h-16">
                      <Image
                        src={awayTeam.flagUrl}
                        alt={awayTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-16 flag-placeholder rounded">
                      {awayTeam.shortCode}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 mb-2">To Be Determined</p>
                  <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">TBD</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Stadium Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Stadium Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{stadium.name}</h3>
              <p className="text-gray-600">{stadium.city}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">
                  {stadium.capacity.toLocaleString()}
                </span>
              </div>
              {stadium.location && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Coordinates:</span>
                  <span className="font-medium text-sm">
                    {stadium.location.coordinates[1].toFixed(4)}°N,{' '}
                    {stadium.location.coordinates[0].toFixed(4)}°W
                  </span>
                </div>
              )}
            </div>

            {stadium.facilities && stadium.facilities.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Facilities:</h4>
                <div className="flex flex-wrap gap-2">
                  {stadium.facilities.map((facility, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {stadium.transport && stadium.transport.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Transport Options:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {stadium.transport.map((option, index) => (
                    <li key={index}>• {option}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Match Information */}
        <Card>
          <CardHeader>
            <CardTitle>Match Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Match Number:</span>
                <span className="font-medium">#{match.matchNumber}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Stage:</span>
                <span className="font-medium">
                  {getStageDisplay(match.stage)}
                </span>
              </div>

              {match.group && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Group:</span>
                  <span className="font-medium">Group {match.group}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className={getStatusColor(match.status)}>
                  {getStatusText(match.status)}
                </Badge>
              </div>
            </div>

            {match.attendance && (
              <div>
                <h4 className="font-medium mb-2">Attendance:</h4>
                <p className="text-lg font-semibold">
                  {match.attendance.toLocaleString()}
                </p>
              </div>
            )}

            {match.ticketInfo && (
              <div>
                <h4 className="font-medium mb-2">Ticket Information:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span
                      className={
                        match.ticketInfo.available
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {match.ticketInfo.available ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {match.ticketInfo.priceRange && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Range:</span>
                      <span className="font-medium">
                        {match.ticketInfo.priceRange.currency}{' '}
                        {match.ticketInfo.priceRange.min} -{' '}
                        {match.ticketInfo.priceRange.max}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {match.broadcast && (
              <div>
                <h4 className="font-medium mb-2">Broadcast:</h4>
                <div className="space-y-1 text-sm">
                  {match.broadcast.tv && match.broadcast.tv.length > 0 && (
                    <div>
                      <span className="text-gray-600">TV: </span>
                      <span>{match.broadcast.tv.join(', ')}</span>
                    </div>
                  )}
                  {match.broadcast.streaming &&
                    match.broadcast.streaming.length > 0 && (
                      <div>
                        <span className="text-gray-600">Streaming: </span>
                        <span>{match.broadcast.streaming.join(', ')}</span>
                      </div>
                    )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for additional sections */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Lineups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              Lineups will be available 1 hour before kickoff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Match Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              Match events will appear here during the game
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
