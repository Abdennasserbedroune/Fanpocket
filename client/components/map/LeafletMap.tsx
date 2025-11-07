'use client';

import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import {
  Circle,
  LayerGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import type { AmenityCategory, AmenityFeature, MapStadium, UserLocation } from './types';

interface LeafletMapProps {
  stadiums: MapStadium[];
  selectedStadiumId: string | null;
  onSelectStadium: (stadiumId: string) => void;
  tileLayer: 'default' | 'satellite';
  center: [number, number];
  zoom: number;
  userLocation: UserLocation | null;
  showAmenities: boolean;
  amenities: AmenityFeature[];
  isRTL: boolean;
}

const TILE_LAYERS = {
  default: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  },
} as const;

const stadiumIconCache = new Map<string, L.DivIcon>();
const amenityIconCache = new Map<string, L.DivIcon>();
let userLocationIcon: L.DivIcon | null = null;

const createStadiumIcon = (stadium: MapStadium, selected: boolean) => {
  const cacheKey = `${stadium.id}-${selected ? 'selected' : 'default'}`;
  if (stadiumIconCache.has(cacheKey)) {
    return stadiumIconCache.get(cacheKey)!;
  }

  const colors = stadium.upcomingMatches?.length
    ? '#C1272D, #006233'
    : '#1f2937, #334155';

  const html = `
    <div
      style="
        width: 44px;
        height: 44px;
        border-radius: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        line-height: 1;
        color: #fff;
        font-weight: 700;
        background: linear-gradient(135deg, ${colors});
        border: 3px solid ${selected ? '#facc15' : '#ffffff'};
        box-shadow: 0 12px 24px rgba(0,0,0,0.25);
      "
      aria-hidden="true"
    >
      🏟️
    </div>
  `;

  const icon = L.divIcon({
    html,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -38],
    className: 'stadium-marker-icon',
  });

  stadiumIconCache.set(cacheKey, icon);
  return icon;
};

const AMENITY_STYLES: Record<AmenityCategory, { color: string; emoji: string }> = {
  restaurant: { color: '#ef4444', emoji: '🍽️' },
  hotel: { color: '#6366f1', emoji: '🛎️' },
  atm: { color: '#f97316', emoji: '🏧' },
  hospital: { color: '#22c55e', emoji: '🏥' },
};

const createAmenityIcon = (category: AmenityCategory) => {
  const cached = amenityIconCache.get(category);
  if (cached) {
    return cached;
  }

  const { color, emoji } = AMENITY_STYLES[category];
  const icon = L.divIcon({
    html: `
      <div
        style="
          width: 32px;
          height: 32px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${color};
          color: #fff;
          font-size: 18px;
          border: 2px solid rgba(255,255,255,0.95);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        "
        aria-hidden="true"
      >
        ${emoji}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -24],
    className: 'amenity-marker-icon',
  });

  amenityIconCache.set(category, icon);
  return icon;
};

const getUserLocationIcon = () => {
  if (userLocationIcon) {
    return userLocationIcon;
  }

  userLocationIcon = L.divIcon({
    html: `
      <div
        style="
          width: 18px;
          height: 18px;
          border-radius: 9px;
          background: #2563eb;
          border: 4px solid rgba(96,165,250,0.6);
          box-shadow: 0 0 0 10px rgba(96,165,250,0.35);
        "
        aria-hidden="true"
      ></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    className: 'user-location-icon',
  });

  return userLocationIcon;
};

const formatDateTime = (value: string) => {
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  return formatter.format(new Date(value));
};

export const LeafletMap = ({
  stadiums,
  selectedStadiumId,
  onSelectStadium,
  tileLayer,
  center,
  zoom,
  userLocation,
  showAmenities,
  amenities,
  isRTL,
}: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());
  const clusterGroupRef = useRef<any>(null);
  const previousCenterRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    return () => {
      markerRefs.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !center) {
      return;
    }

    const [lat, lng] = center;
    const prev = previousCenterRef.current;
    if (prev && prev[0] === lat && prev[1] === lng && zoom === mapRef.current.getZoom()) {
      return;
    }

    previousCenterRef.current = [lat, lng];
    mapRef.current.flyTo([lat, lng], zoom, {
      duration: 0.85,
    });
  }, [center, zoom]);

  useEffect(() => {
    if (!selectedStadiumId) {
      return;
    }

    const marker = markerRefs.current.get(selectedStadiumId);
    if (!marker) {
      return;
    }

    const cluster = clusterGroupRef.current as any;
    if (cluster?.leafletElement?.zoomToShowLayer) {
      cluster.leafletElement.zoomToShowLayer(marker, () => {
        marker.openPopup();
      });
      return;
    }

    if (cluster?.zoomToShowLayer) {
      cluster.zoomToShowLayer(marker, () => {
        marker.openPopup();
      });
      return;
    }

    marker.openPopup();
  }, [selectedStadiumId]);

  const activeTileLayer = useMemo(() => {
    return tileLayer === 'satellite' ? TILE_LAYERS.satellite : TILE_LAYERS.default;
  }, [tileLayer]);

  const userIcon = useMemo(() => getUserLocationIcon(), []);

  const amenityIcons = useMemo(() => {
    return {
      restaurant: createAmenityIcon('restaurant'),
      hotel: createAmenityIcon('hotel'),
      atm: createAmenityIcon('atm'),
      hospital: createAmenityIcon('hospital'),
    } satisfies Record<AmenityCategory, L.DivIcon>;
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={5}
      maxZoom={18}
      preferCanvas
      attributionControl
      zoomControl
      keyboard
      style={{ width: '100%', height: '100%' }}
      className="focus:outline-none"
      whenCreated={map => {
        mapRef.current = map;
        previousCenterRef.current = [map.getCenter().lat, map.getCenter().lng];
        map.keyboard.enable();
      }}
    >
      <TileLayer
        key={tileLayer}
        url={activeTileLayer.url}
        attribution={activeTileLayer.attribution}
      />

      {showAmenities && amenities.length > 0 && (
        <LayerGroup>
          {amenities.map(amenity => (
            <Marker
              key={amenity.id}
              position={[amenity.lat, amenity.lng]}
              icon={amenityIcons[amenity.category]}
              title={`${amenity.name} (${amenity.category})`}
              eventHandlers={{
                click: () => onSelectStadium(amenity.stadiumId),
                keypress: event => {
                  if ((event as any)?.originalEvent?.key === 'Enter') {
                    onSelectStadium(amenity.stadiumId);
                  }
                },
              }}
            >
              <Popup minWidth={200} className="rounded-xl" autoPan>
                <div className="space-y-1 text-sm" dir={isRTL ? 'rtl' : 'ltr'}>
                  <p className="font-semibold text-slate-900">{amenity.name}</p>
                  <p className="text-slate-600 capitalize">Category: {amenity.category}</p>
                  <p className="text-slate-500 text-xs">
                    Near {amenity.stadiumSlug.replace(/-/g, ' ')}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </LayerGroup>
      )}

      <MarkerClusterGroup
        ref={clusterGroupRef}
        chunkedLoading
        removeOutsideVisibleBounds
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        maxClusterRadius={60}
      >
        {stadiums.map(stadium => {
          const [lng, lat] = stadium.location.coordinates;
          const position: [number, number] = [lat, lng];
          const icon = createStadiumIcon(stadium, stadium.id === selectedStadiumId);

          return (
            <Marker
              key={stadium.id}
              position={position}
              icon={icon}
              title={`${stadium.name} (${stadium.city})`}
              keyboard
              riseOnHover
              eventHandlers={{
                click: () => onSelectStadium(stadium.id),
                keypress: event => {
                  if ((event as any)?.originalEvent?.key === 'Enter') {
                    onSelectStadium(stadium.id);
                  }
                },
              }}
              ref={marker => {
                if (!marker) {
                  markerRefs.current.delete(stadium.id);
                  return;
                }
                markerRefs.current.set(stadium.id, marker);
              }}
            >
              <Popup minWidth={260} className="rounded-xl" autoPan>
                <div className="space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {stadium.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {stadium.city} • Capacity {stadium.capacity.toLocaleString()}
                    </p>
                  </div>

                  {stadium.upcomingMatches?.length ? (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Upcoming matches
                      </p>
                      <ul className="space-y-1.5">
                        {stadium.upcomingMatches.slice(0, 3).map(match => (
                          <li key={match._id} className="text-xs text-slate-700">
                            <span className="font-semibold text-slate-900">
                              {match.homeTeam?.shortCode ?? match.homeTeam?.name ?? 'TBD'}
                            </span>{' '}
                            vs{' '}
                            <span className="font-semibold text-slate-900">
                              {match.awayTeam?.shortCode ?? match.awayTeam?.name ?? 'TBD'}
                            </span>{' '}
                            • {formatDateTime(match.dateTime)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No scheduled matches.</p>
                  )}

                  {stadium.facilities?.length ? (
                    <p className="text-xs text-slate-600">
                      Facilities: {stadium.facilities.slice(0, 3).join(', ')}
                    </p>
                  ) : null}

                  {stadium.transport?.length ? (
                    <p className="text-xs text-slate-600">
                      Transport: {stadium.transport.join(', ')}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={`/stadiums?stadium=${stadium.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-200"
                    >
                      View details
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Get directions →
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {userLocation && (
        <>
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
            interactive={false}
          />
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={Math.max(userLocation.accuracy ?? 120, 75)}
            pathOptions={{
              color: '#2563eb',
              fillColor: '#3b82f6',
              fillOpacity: 0.15,
              weight: 1,
            }}
          />
        </>
      )}
    </MapContainer>
  );
};
