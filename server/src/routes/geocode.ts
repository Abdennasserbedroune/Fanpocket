import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router();

interface GeocodeCacheEntry {
  data: GeocodeResult[];
  expiresAt: number;
}

interface GeocodeResult {
  displayName: string;
  latitude: number;
  longitude: number;
  boundingBox?: [number, number, number, number];
  type?: string;
  importance?: number;
}

const geocodeCache = new Map<string, GeocodeCacheEntry>();
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 hours

const createCacheKey = (address: string) => address.trim().toLowerCase();

const isCacheValid = (entry: GeocodeCacheEntry) => entry.expiresAt > Date.now();

const normaliseAddress = (value: string | string[] | undefined) => {
  if (!value) {
    return undefined;
  }

  const address = Array.isArray(value) ? value[0] : value;
  const trimmed = address?.trim();

  return trimmed ? trimmed : undefined;
};

const handleValidationError = (res: Response, message: string) =>
  res.status(400).json({
    success: false,
    error: message,
  });

router.get('/', async (req: Request, res, next) => {
  try {
    const address = normaliseAddress(req.query.address);

    if (!address) {
      return handleValidationError(res, 'Address query parameter is required');
    }

    const cacheKey = createCacheKey(address);
    const cached = geocodeCache.get(cacheKey);

    if (cached && isCacheValid(cached)) {
      res.set('Cache-Control', 'public, max-age=3600');
      return res.json({
        success: true,
        data: cached.data,
        cached: true,
      });
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(
      address
    )}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FanPocketMaps/1.0 (+https://fanpocket.app/maps; contact@fanpocket.app)',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: 'Failed to fetch geocoding information',
      });
    }

    const payload: any[] = await response.json();

    const results: GeocodeResult[] = payload.map(result => ({
      displayName: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      boundingBox: Array.isArray(result.boundingbox)
        ? (result.boundingbox.map((value: string) => parseFloat(value)) as [
            number,
            number,
            number,
            number
          ])
        : undefined,
      type: result.type,
      importance: typeof result.importance === 'number' ? result.importance : undefined,
    }));

    geocodeCache.set(cacheKey, {
      data: results,
      expiresAt: Date.now() + CACHE_TTL,
    });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json({
      success: true,
      data: results,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
});

export const __clearGeocodeCache = () => geocodeCache.clear();

export default router;
