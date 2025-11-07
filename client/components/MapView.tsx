'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  LocateFixed,
  Loader2,
  MapPin,
  Navigation,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type {
  AmenityCategory,
  AmenityFeature,
  MapMatch,
  MapStadium,
  MapTeam,
  UserLocation,
} from '@/components/map/types';

const LeafletMap = dynamic(
  () => import('@/components/map/LeafletMap').then(mod => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-white/60 text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading map…
      </div>
    ),
  }
);

const MAP_DEFAULT_CENTER: [number, number] = [31.7917, -7.0926];
const MAP_DEFAULT_ZOOM = 6;

interface GeocodeSuggestion {
  displayName: string;
  latitude: number;
  longitude: number;
  type?: string;
  importance?: number;
}

const TILE_LABELS: Record<'default' | 'satellite', string> = {
  default: 'OpenStreetMap',
  satellite: 'Satellite',
};

const AMENITY_TEMPLATES: Array<{
  category: AmenityCategory;
  label: string;
  latOffset: number;
  lngOffset: number;
}> = [
  { category: 'restaurant', label: 'Fan Bistro', latOffset: 0.004, lngOffset: 0.0025 },
  { category: 'hotel', label: 'Arena Hotel', latOffset: -0.0032, lngOffset: 0.0016 },
  { category: 'atm', label: 'Matchday ATM', latOffset: 0.0015, lngOffset: -0.0022 },
  { category: 'hospital', label: 'Supporters Clinic', latOffset: -0.0025, lngOffset: -0.0012 },
];

const toMapTeam = (team: any): MapTeam | null => {
  if (!team) {
    return null;
  }

  return {
    _id: team._id ?? team.id ?? '',
    id: team.id ?? team._id,
    name: team.name ?? 'TBD',
    shortCode: team.shortCode,
    flagUrl: team.flagUrl,
    group: team.group,
    colors: team.colors,
  };
};

const toMapMatch = (match: any): MapMatch => ({
  _id: match._id ?? match.id ?? `match-${Math.random().toString(16).slice(2)}`,
  id: match.id ?? match._id,
  matchNumber: match.matchNumber,
  stage: match.stage,
  group: match.group,
  status: match.status,
  dateTime: match.dateTime,
  stadium: match.stadium,
  homeTeam: toMapTeam(match.homeTeam),
  awayTeam: toMapTeam(match.awayTeam),
});

const toMapStadium = (stadium: any): MapStadium => ({
  _id: stadium._id ?? stadium.id,
  id: stadium.id ?? stadium._id,
  name: stadium.name,
  nameAr: stadium.nameAr,
  nameFr: stadium.nameFr,
  shortName: stadium.shortName,
  slug: stadium.slug,
  city: stadium.city,
  cityAr: stadium.cityAr,
  cityFr: stadium.cityFr,
  address: stadium.address,
  capacity: Number(stadium.capacity) || 0,
  images: stadium.images ?? [],
  facilities: stadium.facilities ?? [],
  transport: stadium.transport ?? [],
  nearbyAttractions: stadium.nearbyAttractions ?? [],
  location: stadium.location,
  upcomingMatches: Array.isArray(stadium.upcomingMatches)
    ? stadium.upcomingMatches.map(toMapMatch)
    : [],
  recentMatches: Array.isArray(stadium.recentMatches)
    ? stadium.recentMatches.map(toMapMatch)
    : [],
  distance: stadium.distance,
  distanceInKm: stadium.distanceInKm,
});

const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const generateAmenities = (stadiums: MapStadium[]): AmenityFeature[] =>
  stadiums.flatMap((stadium, index) => {
    const [lng, lat] = stadium.location.coordinates;
    return AMENITY_TEMPLATES.map((template, templateIndex) => ({
      id: `${stadium.slug}-${template.category}-${templateIndex}`,
      stadiumId: stadium.id,
      stadiumSlug: stadium.slug,
      name: `${stadium.city} ${template.label}`,
      category: template.category,
      lat: lat + template.latOffset + index * 0.00025,
      lng: lng + template.lngOffset - index * 0.0002,
    }));
  });

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export function MapView() {
  const [isMounted, setIsMounted] = useState(false);
  const [stadiums, setStadiums] = useState<MapStadium[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStadiumId, setSelectedStadiumId] = useState<string | null>(null);
  const [tileLayer, setTileLayer] = useState<'default' | 'satellite'>('default');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [amenitiesVisible, setAmenitiesVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodeSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(MAP_DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(MAP_DEFAULT_ZOOM);
  const [isSheetExpanded, setIsSheetExpanded] = useState(true);
  const [isRTL, setIsRTL] = useState(false);
  const hasInitialisedView = useRef(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000',
    []
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (typeof document === 'undefined') {
      return;
    }

    const dirAttribute =
      document.documentElement.getAttribute('dir') ??
      document.body.getAttribute('dir') ??
      'ltr';
    setIsRTL(dirAttribute.toLowerCase() === 'rtl');
  }, [isMounted]);

  const loadStadiums = useCallback(
    async (signal?: AbortSignal) => {
      if (signal?.aborted) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiBase}/api/stadiums`, {
          signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stadium data');
        }

        const payload = await response.json();
        if (signal?.aborted) {
          return;
        }

        const mapped: MapStadium[] = Array.isArray(payload.data)
          ? payload.data.map(toMapStadium)
          : [];

        setStadiums(mapped);

        if (mapped.length) {
          setSelectedStadiumId(prev => prev ?? mapped[0].id);

          if (!hasInitialisedView.current) {
            hasInitialisedView.current = true;
            const [lng, lat] = mapped[0].location.coordinates;
            setMapCenter([lat, lng]);
            setMapZoom(7);
          }
        }
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') {
          return;
        }
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        toast.error('Unable to load stadiums', {
          description: message,
        });
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [apiBase]
  );

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const controller = new AbortController();
    loadStadiums(controller.signal).catch(() => {
      /* handled in loadStadiums */
    });

    return () => controller.abort();
  }, [isMounted, loadStadiums]);

  const amenities = useMemo(() => generateAmenities(stadiums), [stadiums]);

  const selectedStadium = useMemo(
    () => stadiums.find(stadium => stadium.id === selectedStadiumId) ?? null,
    [stadiums, selectedStadiumId]
  );

  useEffect(() => {
    if (!isMobile) {
      setIsSheetExpanded(true);
      return;
    }

    if (selectedStadium) {
      setIsSheetExpanded(true);
    }
  }, [isMobile, selectedStadium]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await fetch(
          `${apiBase}/api/geocode?address=${encodeURIComponent(searchQuery)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Geocoding request failed');
        }

        const payload = await response.json();
        if (controller.signal.aborted) {
          return;
        }

        const suggestions: GeocodeSuggestion[] = Array.isArray(payload.data)
          ? payload.data.map((item: any) => ({
              displayName: item.displayName ?? item.display_name ?? 'Unknown location',
              latitude: parseFloat(item.latitude ?? item.lat ?? '0'),
              longitude: parseFloat(item.longitude ?? item.lon ?? '0'),
              type: item.type,
              importance: item.importance,
            }))
          : [];

        setSearchResults(suggestions.filter(s => !Number.isNaN(s.latitude)));
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') {
          return;
        }
        console.error('Geocoding error:', err);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [apiBase, searchQuery]);

  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  const findNearestStadium = useCallback(
    (lat: number, lng: number) => {
      if (!stadiums.length) {
        return null;
      }

      let nearest: MapStadium | null = null;
      let shortestDistance = Number.POSITIVE_INFINITY;

      for (const stadium of stadiums) {
        const [stadiumLng, stadiumLat] = stadium.location.coordinates;
        const distance = calculateDistanceKm(lat, lng, stadiumLat, stadiumLng);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearest = stadium;
        }
      }

      if (!nearest) {
        return null;
      }

      return {
        stadium: nearest,
        distance: shortestDistance,
      };
    },
    [stadiums]
  );

  const handleSelectStadium = useCallback(
    (stadiumId: string) => {
      const stadium = stadiums.find(entry => entry.id === stadiumId);
      if (!stadium) {
        return;
      }

      const [lng, lat] = stadium.location.coordinates;
      setSelectedStadiumId(stadium.id);
      setMapCenter([lat, lng]);
      setMapZoom(12);
    },
    [stadiums]
  );

  const handleLocateUser = useCallback(() => {
    if (!navigator?.geolocation) {
      toast.error('Geolocation is not available in this browser');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          accuracy: accuracy ?? 150,
          timestamp: Date.now(),
        });

        setMapCenter([latitude, longitude]);
        setMapZoom(12);

        const nearest = findNearestStadium(latitude, longitude);
        if (nearest) {
          setSelectedStadiumId(nearest.stadium.id);
          toast.success(`Nearest stadium: ${nearest.stadium.name}`, {
            description: `${nearest.distance.toFixed(1)} km away`,
          });
        }

        setIsLocating(false);
      },
      error => {
        console.error('Geolocation error:', error);
        toast.error('Unable to determine your location', {
          description: error.message,
        });
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, [findNearestStadium]);

  const handleSelectSuggestion = useCallback(
    (suggestion: GeocodeSuggestion) => {
      setSearchQuery(suggestion.displayName);
      clearSearchResults();

      setMapCenter([suggestion.latitude, suggestion.longitude]);
      setMapZoom(12);

      const nearest = findNearestStadium(suggestion.latitude, suggestion.longitude);
      if (nearest) {
        setSelectedStadiumId(nearest.stadium.id);
        toast.info(`Nearest stadium: ${nearest.stadium.name}`, {
          description: `${nearest.distance.toFixed(1)} km away`,
        });
      }
    },
    [clearSearchResults, findNearestStadium]
  );

  const handleToggleTileLayer = useCallback(() => {
    setTileLayer(prev => (prev === 'default' ? 'satellite' : 'default'));
  }, []);

  const handleRetry = useCallback(() => {
    const controller = new AbortController();
    loadStadiums(controller.signal).catch(() => {
      /* handled */
    });
  }, [loadStadiums]);

  const formatMatch = useCallback((match: MapMatch) => {
    const formatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    return formatter.format(new Date(match.dateTime));
  }, []);

  const renderQuickFacts = useMemo(() => {
    if (!selectedStadium) {
      return null;
    }

    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">
            {selectedStadium.name}
          </h2>
          <p className="text-sm text-slate-600">
            {selectedStadium.city} • Capacity {selectedStadium.capacity.toLocaleString()} fans
          </p>
        </div>

        {selectedStadium.upcomingMatches?.length ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Upcoming matches
            </p>
            <ul className="space-y-2">
              {selectedStadium.upcomingMatches.slice(0, 3).map(match => (
                <li key={match._id} className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">
                    {match.homeTeam?.shortCode ?? match.homeTeam?.name ?? 'TBD'}
                  </span>{' '}
                  vs{' '}
                  <span className="font-semibold text-slate-900">
                    {match.awayTeam?.shortCode ?? match.awayTeam?.name ?? 'TBD'}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {formatMatch(match)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No upcoming matches scheduled.</p>
        )}

        {selectedStadium.recentMatches?.length ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Recent matches
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {selectedStadium.recentMatches.slice(0, 3).map(match => (
                <li key={match._id}>
                  {match.homeTeam?.shortCode ?? match.homeTeam?.name ?? 'TBD'} vs{' '}
                  {match.awayTeam?.shortCode ?? match.awayTeam?.name ?? 'TBD'} •{' '}
                  {formatMatch(match)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 text-sm text-slate-600">
          {selectedStadium.facilities?.length ? (
            <div>
              <p className="font-semibold text-slate-900">Facilities</p>
              <p>{selectedStadium.facilities.join(', ')}</p>
            </div>
          ) : null}

          {selectedStadium.transport?.length ? (
            <div>
              <p className="font-semibold text-slate-900">Transport</p>
              <p>{selectedStadium.transport.join(', ')}</p>
            </div>
          ) : null}

          {selectedStadium.nearbyAttractions?.length ? (
            <div>
              <p className="font-semibold text-slate-900">Nearby attractions</p>
              <p>{selectedStadium.nearbyAttractions.join(', ')}</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="secondary"
            className="gap-2"
            onClick={() => {
              const [lng, lat] = selectedStadium.location.coordinates;
              setMapCenter([lat, lng]);
              setMapZoom(12);
            }}
            aria-label={`Center map on ${selectedStadium.name}`}
          >
            <MapPin className="h-4 w-4" /> Focus on map
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            asChild
          >
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${
                selectedStadium.location.coordinates[1]
              },${selectedStadium.location.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="h-4 w-4" /> Get directions
            </a>
          </Button>
        </div>
      </div>
    );
  }, [formatMatch, selectedStadium]);

  if (!isMounted) {
    return (
      <div className="flex min-h-[600px] w-full items-center justify-center bg-slate-100 text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Preparing map…
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[600px] w-full flex-1">
      <div className="absolute inset-0">
        <LeafletMap
          stadiums={stadiums}
          selectedStadiumId={selectedStadiumId}
          onSelectStadium={handleSelectStadium}
          tileLayer={tileLayer}
          center={mapCenter}
          zoom={mapZoom}
          userLocation={userLocation}
          showAmenities={amenitiesVisible}
          amenities={amenities}
          isRTL={isRTL}
        />
      </div>

      <div className="pointer-events-none absolute top-4 left-4 right-4 z-50 flex flex-col gap-3 lg:left-8 lg:right-auto lg:w-[420px]">
        <div className="pointer-events-auto space-y-3 rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-slate-200 backdrop-blur">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  AFCON 2025 Stadium Explorer
                </h2>
                <p className="text-xs text-slate-500">
                  Pan, zoom, or search to explore venues across Morocco.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Input
              type="search"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Search for a city, landmark, or address"
              className="h-11 pr-10"
              aria-label="Search for a location"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            {isSearching && (
              <div className="pointer-events-none absolute inset-x-0 top-full z-10 flex items-center gap-2 rounded-b-xl bg-white/95 p-3 text-sm text-slate-500 shadow">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching…
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="absolute inset-x-0 top-[110%] z-20 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white/98 shadow-xl">
                <ul role="listbox" aria-label="Geocoding suggestions">
                  {searchResults.map(suggestion => (
                    <li key={`${suggestion.displayName}-${suggestion.latitude}`}>
                      <button
                        type="button"
                        className="flex w-full items-start gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50"
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        <MapPin className="mt-0.5 h-4 w-4 text-emerald-600" />
                        <span>{suggestion.displayName}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={handleLocateUser}
              disabled={isLocating}
              aria-label="Find my current location"
            >
              {isLocating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="h-4 w-4" />
              )}
              Find me
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleToggleTileLayer}
              aria-label="Toggle tile layer"
            >
              <Layers className="h-4 w-4" /> {TILE_LABELS[tileLayer]}
            </Button>

            <Button
              type="button"
              variant={amenitiesVisible ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setAmenitiesVisible(prev => !prev)}
              aria-pressed={amenitiesVisible}
            >
              <Navigation className="h-4 w-4" /> Nearby places
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="pointer-events-auto absolute left-1/2 top-24 z-40 w-[90%] max-w-lg -translate-x-1/2 rounded-2xl border border-red-200 bg-white/95 p-4 text-sm text-red-600 shadow-xl backdrop-blur">
          <p className="font-semibold">Failed to load stadium data</p>
          <p className="mt-1 text-red-500">{error}</p>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {loading && !stadiums.length && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-white/60">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading stadiums…
          </div>
        </div>
      )}

      {selectedStadium && !isMobile && (
        <aside
          className={cn(
            'pointer-events-auto absolute top-28 bottom-8 z-40 w-full max-w-sm overflow-y-auto rounded-2xl bg-white/95 p-6 shadow-2xl ring-1 ring-slate-200 backdrop-blur',
            isRTL ? 'left-8' : 'right-8'
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Stadium insights
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close stadium details"
              onClick={() => setSelectedStadiumId(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 space-y-6 text-sm text-slate-600" dir={isRTL ? 'rtl' : 'ltr'}>
            {renderQuickFacts}
          </div>
        </aside>
      )}

      {selectedStadium && isMobile && (
        <div
          className={cn(
            'pointer-events-auto fixed inset-x-0 bottom-0 z-40 rounded-t-3xl bg-white/95 shadow-2xl ring-1 ring-slate-200 backdrop-blur transition-transform duration-300 ease-out',
            isSheetExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-4.5rem)]'
          )}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="mx-auto mt-3 flex h-10 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            onClick={() => setIsSheetExpanded(prev => !prev)}
            aria-label={isSheetExpanded ? 'Collapse stadium details' : 'Expand stadium details'}
          >
            {isSheetExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </button>
          <div className="px-5 pb-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                Stadium insights
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close stadium details"
                onClick={() => setSelectedStadiumId(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-6 text-sm text-slate-600">{renderQuickFacts}</div>
          </div>
        </div>
      )}
    </div>
  );
}
