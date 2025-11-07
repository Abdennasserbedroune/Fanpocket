import Link from 'next/link';
import Image from 'next/image';
import { MatchWithDetails } from '@fanpocket/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MatchCardProps {
  match: MatchWithDetails;
  showDate?: boolean;
  showStadium?: boolean;
  compact?: boolean;
}

export function MatchCard({
  match,
  showDate = true,
  showStadium = true,
  compact = false,
}: MatchCardProps) {
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
        return 'FT';
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

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(new Date(date));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(new Date(date));
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
        return '3rd Place';
      case 'final':
        return 'Final';
      default:
        return stage;
    }
  };

  const homeTeam = match.homeTeamData;
  const awayTeam = match.awayTeamData;
  const stadium = match.stadiumData;

  return (
    <Link href={`/matches/${match.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className={`p-4 ${compact ? 'p-3' : ''}`}>
          {/* Match Status Badge */}
          <div className="flex justify-between items-start mb-3">
            <Badge className={getStatusColor(match.status)}>
              {getStatusText(match.status)}
            </Badge>
            {match.group && (
              <Badge variant="outline" className="text-xs">
                Group {match.group}
              </Badge>
            )}
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between mb-3">
            {/* Home Team */}
            <div className="flex items-center gap-3 flex-1">
              {homeTeam ? (
                <>
                  {homeTeam.flagUrl ? (
                    <div className="relative w-8 h-6">
                      <Image
                        src={homeTeam.flagUrl}
                        alt={homeTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-6 flag-placeholder rounded">
                      {homeTeam.shortCode}
                    </div>
                  )}
                  <span className={`font-medium ${compact ? 'text-sm' : ''}`}>
                    {homeTeam.name}
                  </span>
                </>
              ) : (
                <span className="text-gray-500 italic">TBD</span>
              )}
            </div>

            {/* Score or VS */}
            <div className="flex items-center gap-2 px-4">
              {match.score ? (
                <span className="font-bold text-lg">
                  {match.score.home} - {match.score.away}
                </span>
              ) : (
                <span className="text-gray-500 font-medium">VS</span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              {awayTeam ? (
                <>
                  <span
                    className={`font-medium text-right ${compact ? 'text-sm' : ''}`}
                  >
                    {awayTeam.name}
                  </span>
                  {awayTeam.flagUrl ? (
                    <div className="relative w-8 h-6">
                      <Image
                        src={awayTeam.flagUrl}
                        alt={awayTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-6 flag-placeholder rounded">
                      {awayTeam.shortCode}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-gray-500 italic">TBD</span>
              )}
            </div>
          </div>

          {/* Match Info */}
          <div
            className={`flex ${showDate && showStadium ? 'justify-between' : 'justify-center'} items-center text-sm text-gray-600`}
          >
            {showDate && (
              <div className="text-center">
                <div>{formatDate(match.dateTime)}</div>
                <div className="font-medium">{formatTime(match.dateTime)}</div>
              </div>
            )}

            {showDate && showStadium && <div className="text-gray-400">•</div>}

            {showStadium && stadium && (
              <div className="text-center">
                <div className="font-medium">{stadium.name}</div>
                <div>{stadium.city}</div>
              </div>
            )}
          </div>

          {/* Stage Info */}
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-500">
              {getStageDisplay(match.stage)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
