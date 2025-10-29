const initMap = () => {
  const mapContainer = dom.qs('#map-container');
  if (!mapContainer || typeof L === 'undefined') return;

  const marrakechCenter = [31.6295, -7.9811];

  const map = L.map('map-container').setView(marrakechCenter, 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  const createCustomIcon = color => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  const stadiumIcon = createCustomIcon('#c1272d');
  const transportIcon = createCustomIcon('#006233');
  const landmarkIcon = createCustomIcon('#d4af37');
  const hotelIcon = createCustomIcon('#4a90e2');

  const locations = [
    {
      name: 'Grand Stade de Marrakech',
      coords: [31.6514, -8.0089],
      icon: stadiumIcon,
      description: 'Main tournament venue hosting AFCON 2025 matches',
      type: 'stadium',
    },
    {
      name: 'Marrakech Train Station',
      coords: [31.6294, -8.0089],
      icon: transportIcon,
      description: 'Central railway station with connections across Morocco',
      type: 'transport',
    },
    {
      name: 'Jemaa el-Fnaa',
      coords: [31.6258, -7.989],
      icon: landmarkIcon,
      description: 'Iconic market square and UNESCO World Heritage site',
      type: 'landmark',
    },
    {
      name: 'Majorelle Garden',
      coords: [31.6416, -8.0033],
      icon: landmarkIcon,
      description: 'Beautiful botanical garden and artist landscape',
      type: 'landmark',
    },
    {
      name: 'Koutoubia Mosque',
      coords: [31.6236, -7.993],
      icon: landmarkIcon,
      description: "Marrakech's most famous landmark and largest mosque",
      type: 'landmark',
    },
    {
      name: 'Hivernage Hotel Zone',
      coords: [31.6198, -8.0103],
      icon: hotelIcon,
      description: 'Modern hotel district near Menara Gardens',
      type: 'hotel',
    },
    {
      name: 'Gueliz Hotel District',
      coords: [31.6478, -7.9956],
      icon: hotelIcon,
      description: 'Central business district with numerous hotels',
      type: 'hotel',
    },
  ];

  locations.forEach(location => {
    const marker = L.marker(location.coords, { icon: location.icon }).addTo(
      map
    );

    const popupContent = `
      <h3>${location.name}</h3>
      <p>${location.description}</p>
    `;

    marker.bindPopup(popupContent);
  });

  const routeCoordinates = [
    [31.6258, -7.989],
    [31.6275, -7.9915],
    [31.6295, -7.9925],
    [31.632, -7.995],
    [31.635, -7.9975],
    [31.638, -8.0],
    [31.642, -8.0025],
    [31.646, -8.0055],
    [31.649, -8.0075],
    [31.6514, -8.0089],
  ];

  L.polyline(routeCoordinates, {
    color: '#c1272d',
    weight: 4,
    opacity: 0.7,
    dashArray: '10, 10',
  })
    .addTo(map)
    .bindPopup('Approximate 11km route from city center to Grand Stade');

  const bounds = L.latLngBounds(locations.map(loc => loc.coords));
  map.fitBounds(bounds, { padding: [50, 50] });
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initMap };
}
