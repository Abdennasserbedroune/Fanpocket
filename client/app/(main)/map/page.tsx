import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { MapView } from '@/components/MapView';

export default function MapPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] w-full flex-1 flex-col bg-gradient-to-br from-green-50/80 via-white to-emerald-50/60">
      <MapView />
    </div>
  );
}
