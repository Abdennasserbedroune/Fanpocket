import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';

interface Filters {
  stage?: string;
  group?: string;
  team?: string;
  stadium?: string;
}

interface MatchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  teams?: Array<{ id: string; name: string; shortCode: string }>;
  stadiums?: Array<{ id: string; name: string; city: string }>;
}

const STAGES = [
  { value: 'group', label: 'Group Stage' },
  { value: 'round_of_16', label: 'Round of 16' },
  { value: 'quarter_final', label: 'Quarter-Finals' },
  { value: 'semi_final', label: 'Semi-Finals' },
  { value: 'final', label: 'Final' },
];

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function MatchFilters({
  filters,
  onFiltersChange,
  teams = [],
  stadiums = [],
}: MatchFiltersProps) {
  const [teamSearch, setTeamSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleStageChange = (stage: string) => {
    onFiltersChange({
      ...filters,
      stage: filters.stage === stage ? undefined : stage,
    });
  };

  const handleGroupChange = (group: string) => {
    onFiltersChange({
      ...filters,
      group: filters.group === group ? undefined : group,
    });
  };

  const handleTeamSelect = (teamId: string) => {
    onFiltersChange({
      ...filters,
      team: filters.team === teamId ? undefined : teamId,
    });
    setTeamSearch('');
  };

  const handleStadiumSelect = (stadiumId: string) => {
    onFiltersChange({
      ...filters,
      stadium: filters.stadium === stadiumId ? undefined : stadiumId,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    setTeamSearch('');
  };

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined
  );

  const filteredTeams = teams.filter(
    team =>
      team.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      team.shortCode.toLowerCase().includes(teamSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {Object.values(filters).filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Content */}
      <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
        {/* Stage Filters */}
        <div>
          <h3 className="font-medium mb-2">Stage</h3>
          <div className="flex flex-wrap gap-2">
            {STAGES.map(stage => (
              <Button
                key={stage.value}
                variant={filters.stage === stage.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStageChange(stage.value)}
              >
                {stage.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Group Filters (only show when group stage is selected) */}
        {(!filters.stage || filters.stage === 'group') && (
          <div>
            <h3 className="font-medium mb-2">Group</h3>
            <div className="flex flex-wrap gap-2">
              {GROUPS.map(group => (
                <Button
                  key={group}
                  variant={filters.group === group ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleGroupChange(group)}
                >
                  Group {group}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Team Search */}
        <div>
          <h3 className="font-medium mb-2">Team</h3>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search team..."
                value={teamSearch}
                onChange={e => setTeamSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {teamSearch && (
              <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
                {filteredTeams.length > 0 ? (
                  filteredTeams.map(team => (
                    <Button
                      key={team.id}
                      variant={filters.team === team.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleTeamSelect(team.id)}
                      className="w-full justify-start"
                    >
                      {team.name} ({team.shortCode})
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No teams found
                  </p>
                )}
              </div>
            )}

            {filters.team && !teamSearch && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {teams.find(t => t.id === filters.team)?.name ||
                    'Selected Team'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTeamSelect(filters.team!)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stadium Filters */}
        {stadiums.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Stadium</h3>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
              {stadiums.map(stadium => (
                <Button
                  key={stadium.id}
                  variant={filters.stadium === stadium.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleStadiumSelect(stadium.id)}
                  className="w-full justify-start"
                >
                  {stadium.name} - {stadium.city}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
