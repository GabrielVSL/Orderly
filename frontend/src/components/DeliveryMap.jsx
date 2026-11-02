import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ============================================================================
// 1. TILE LAYERS REAIS: ESRI ARCGIS CANVAS (DARK MATTE & LIGHT CLEAN)
// 100% GRATUITO, SEM CHAVE DE API, SEM MARCA D'ÁGUA E COM NOMES DE RUAS NÍTIDOS
// ============================================================================
const TILE_CONFIG = {
  dark: {
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    reference: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    bg: '#181A1F',
    routeColor: '#3B82F6',
    routeGlow: '#2F66FF',
    traveledColor: '#64748B',
  },
  light: {
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    reference: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    bg: '#ECEEF0',
    routeColor: '#2F66FF',
    routeGlow: '#60A5FA',
    traveledColor: '#94A3B8',
  },
};

// Velocidade urbana real de entrega: 10.5 m/s = 37.8 km/h (~38 km/h)
const URBAN_SPEED_MPS = 10.5;

// ============================================================================
// 2. UNIDADES REAIS PATTIES COM COORDENADAS VERIFICADAS
// ============================================================================
export const PATTIES_STORES = [
  {
    id: 'sp_brooklin',
    name: 'Patties Brooklin',
    badge: 'MATRIZ BROOKLIN',
    address: 'R. Flórida, 1420 - Brooklin, São Paulo - SP',
    lat: -23.6121,
    lng: -46.6894,
    city: 'São Paulo',
    state: 'SP',
  },
  {
    id: 'sp_pinheiros',
    name: 'Patties Pinheiros',
    badge: 'LOJA PINHEIROS',
    address: 'R. dos Pinheiros, 875 - Pinheiros, São Paulo - SP',
    lat: -23.5672,
    lng: -46.6939,
    city: 'São Paulo',
    state: 'SP',
  },
  {
    id: 'bh_pampulha',
    name: 'Patties Pampulha',
    badge: 'LOJA PAMPULHA (BH)',
    address: 'Av. Fleming, 800 - Pampulha, Belo Horizonte - MG',
    lat: -19.8642,
    lng: -43.9830,
    city: 'Belo Horizonte',
    state: 'MG',
  },
  {
    id: 'bh_savassi',
    name: 'Patties Savassi',
    badge: 'LOJA SAVASSI (BH)',
    address: 'Av. Cristóvão Colombo, 480 - Savassi, Belo Horizonte - MG',
    lat: -19.9369,
    lng: -43.9366,
    city: 'Belo Horizonte',
    state: 'MG',
  },
  {
    id: 'rj_leblon',
    name: 'Patties Leblon',
    badge: 'LOJA LEBLON (RJ)',
    address: 'Av. Ataulfo de Paiva, 560 - Leblon, Rio de Janeiro - RJ',
    lat: -22.9841,
    lng: -43.2231,
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
  {
    id: 'pr_batel',
    name: 'Patties Batel',
    badge: 'LOJA BATEL (PR)',
    address: 'R. Bispo Dom José, 2100 - Batel, Curitiba - PR',
    lat: -25.4411,
    lng: -49.2896,
    city: 'Curitiba',
    state: 'PR',
  },
];

const FALLBACK_DESTINATION = {
  lat: -23.5855,
  lng: -46.6782,
  formattedAddress: 'São Paulo - SP',
  city: 'São Paulo',
  state: 'SP',
};

// ============================================================================
// 3. UTILITÁRIOS GEOGRÁFICOS E PARSER DE ENDEREÇO
// ============================================================================
export function haversineDistanceMeters(c1, c2) {
  const R = 6371000;
  const dLat = ((c2[0] - c1[0]) * Math.PI) / 180;
  const dLng = ((c2[1] - c1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1[0] * Math.PI) / 180) *
      Math.cos((c2[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function parseDeliveryAddress(raw = '') {
  if (!raw) {
    return { street: '', number: '', neighborhood: '', city: 'São Paulo', state: 'SP', cep: '' };
  }

  const cepMatch = raw.match(/(\d{5})-?(\d{3})/);
  const cep = cepMatch ? `${cepMatch[1]}${cepMatch[2]}` : '';

  let clean = raw.replace(/\s*\(?CEP:?\s*\d{5}-?\d{3}\)?/gi, '').trim();

  let city = '';
  let state = '';
  const cityStateMatch = clean.match(/,\s*([^,-]+?)\s*-\s*([A-Za-z]{2})\s*$/i);
  if (cityStateMatch) {
    city = cityStateMatch[1].trim();
    state = cityStateMatch[2].trim().toUpperCase();
    clean = clean.substring(0, cityStateMatch.index).trim();
  }

  let street = '';
  let number = '';
  const streetNumMatch = clean.match(/^([^,]+),\s*(\d+[A-Za-z]?)/);
  if (streetNumMatch) {
    street = streetNumMatch[1].trim();
    number = streetNumMatch[2].trim();
    clean = clean.substring(streetNumMatch[0].length).trim();
  } else {
    const firstComma = clean.indexOf(',');
    if (firstComma !== -1) {
      street = clean.substring(0, firstComma).trim();
      clean = clean.substring(firstComma + 1).trim();
    } else {
      street = clean;
      clean = '';
    }
  }

  const neighborhood = clean.replace(/^[,\s-]+/, '').trim();

  return {
    street,
    number,
    neighborhood,
    city: city || 'São Paulo',
    state: state || 'SP',
    cep,
  };
}

async function geocodeAddress(parsed, rawAddress) {
  const userAgent = { headers: { 'User-Agent': 'PattiesOrderlyApp/2.0 (delivery@patties.local)' } };

  // 1. Busca estruturada com Número + Rua + Cidade + UF
  if (parsed.street && parsed.city) {
    try {
      const streetQuery = parsed.number ? `${parsed.number} ${parsed.street}` : parsed.street;
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&street=${encodeURIComponent(
        streetQuery
      )}&city=${encodeURIComponent(parsed.city)}&state=${encodeURIComponent(
        parsed.state
      )}&country=Brazil&addressdetails=1&limit=1`;
      const res = await fetch(url, userAgent);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name,
            road: data[0].address?.road || parsed.street,
            neighborhood: data[0].address?.suburb || data[0].address?.neighbourhood || parsed.neighborhood,
            city: data[0].address?.city || parsed.city,
            state: parsed.state,
          };
        }
      }
    } catch {
      // segue para fallback
    }
  }

  // 2. Busca estruturada apenas Rua + Cidade + UF
  if (parsed.street && parsed.city) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&street=${encodeURIComponent(
        parsed.street
      )}&city=${encodeURIComponent(parsed.city)}&state=${encodeURIComponent(
        parsed.state
      )}&country=Brazil&addressdetails=1&limit=1`;
      const res = await fetch(url, userAgent);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name,
            road: data[0].address?.road || parsed.street,
            neighborhood: data[0].address?.suburb || parsed.neighborhood,
            city: data[0].address?.city || parsed.city,
            state: parsed.state,
          };
        }
      }
    } catch {
      // segue para fallback
    }
  }

  // 3. Fallback livre
  try {
    const cleanQuery = `${parsed.street || ''}, ${parsed.neighborhood || ''}, ${parsed.city || ''}, Brasil`
      .replace(/^[,\s]+|[,\s]+$/g, '')
      .replace(/,\s*,/g, ',');
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      cleanQuery
    )}&limit=1`;
    const res = await fetch(url, userAgent);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name,
          road: parsed.street,
          neighborhood: parsed.neighborhood,
          city: parsed.city,
          state: parsed.state,
        };
      }
    }
  } catch {
    // segue para fallback
  }

  return {
    ...FALLBACK_DESTINATION,
    displayName: rawAddress || 'Endereço de Entrega',
  };
}

async function resolveStore(destCoords, parsedAddress) {
  let closestStore = null;
  let minDistanceMeters = Infinity;

  for (const store of PATTIES_STORES) {
    const dist = haversineDistanceMeters([destCoords.lat, destCoords.lng], [store.lat, store.lng]);
    if (dist < minDistanceMeters) {
      minDistanceMeters = dist;
      closestStore = store;
    }
  }

  if (closestStore && minDistanceMeters <= 22000) {
    return closestStore;
  }

  const targetLat = destCoords.lat + 0.018;
  const targetLng = destCoords.lng + 0.018;

  try {
    const revUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${targetLat}&lon=${targetLng}`;
    const res = await fetch(revUrl, {
      headers: { 'User-Agent': 'PattiesOrderlyApp/2.0' },
    });
    if (res.ok) {
      const data = await res.json();
      const road = data.address?.road || 'Av. Principal';
      const neighborhood = data.address?.suburb || data.address?.neighbourhood || 'Centro';
      const city = data.address?.city || data.address?.town || parsedAddress.city || 'Hub Local';

      return {
        id: 'dynamic_hub',
        name: `Patties Express (${city})`,
        badge: 'HUB LOCAL EXPRESS',
        address: `${road} - ${neighborhood}, ${city}`,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
        city,
        state: parsedAddress.state,
      };
    }
  } catch {
    // fallback
  }

  return {
    id: 'dynamic_hub_fallback',
    name: `Patties Express (${parsedAddress.city})`,
    badge: 'HUB LOCAL',
    address: `Unidade Delivery Central - ${parsedAddress.city} - ${parsedAddress.state}`,
    lat: targetLat,
    lng: targetLng,
    city: parsedAddress.city,
    state: parsedAddress.state,
  };
}

async function fetchRouteOSRM(origin, destination) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=true`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Falha ao calcular rota no OSRM');
  }
  const data = await res.json();
  if (!data.routes || !data.routes[0]) {
    throw new Error('Nenhuma rota encontrada');
  }

  const route = data.routes[0];
  const coordinates = route.geometry.coordinates.map((c) => [c[1], c[0]]); // [lat, lng]

  const cumulative = [0];
  for (let i = 0; i < coordinates.length - 1; i++) {
    const d = haversineDistanceMeters(coordinates[i], coordinates[i + 1]);
    cumulative.push(cumulative[cumulative.length - 1] + d);
  }
  const totalMeters = cumulative[cumulative.length - 1] || 1;

  const realisticSeconds = Math.max(120, Math.round(totalMeters / URBAN_SPEED_MPS));
  const realisticMinutes = Math.max(2, Math.ceil(realisticSeconds / 60));

  const steps = (route.legs?.[0]?.steps || []).map((step) => ({
    name: step.name || '',
    distance: step.distance || 0,
    maneuver: step.maneuver?.type || '',
  }));

  const stepDistances = [0];
  for (let i = 0; i < steps.length; i++) {
    stepDistances.push(stepDistances[stepDistances.length - 1] + steps[i].distance);
  }

  return {
    coordinates,
    cumulative,
    totalMeters,
    totalDistanceKm: totalMeters / 1000,
    totalDurationSeconds: realisticSeconds,
    totalDurationMin: realisticMinutes,
    steps,
    stepDistances,
  };
}

function interpolateRoute(routeData, fraction) {
  const { coordinates, cumulative, totalMeters, steps, stepDistances, totalDurationMin } = routeData;
  const clampedFraction = Math.max(0, Math.min(1, fraction));
  const targetMeters = clampedFraction * totalMeters;

  let idx = 0;
  while (idx < cumulative.length - 1 && cumulative[idx + 1] < targetMeters) {
    idx++;
  }

  const p1 = coordinates[idx];
  const p2 = coordinates[Math.min(idx + 1, coordinates.length - 1)];
  const segDist = cumulative[Math.min(idx + 1, coordinates.length - 1)] - cumulative[idx];
  const segRatio = segDist > 0 ? (targetMeters - cumulative[idx]) / segDist : 0;

  const lat = p1[0] + (p2[0] - p1[0]) * segRatio;
  const lng = p1[1] + (p2[1] - p1[1]) * segRatio;
  const dLng = p2[1] - p1[1];
  const facingLeft = dLng < -0.00001;

  const currentPos = [lat, lng];
  const traveledCoords = coordinates.slice(0, idx + 1).concat([currentPos]);
  const remainingCoords = [currentPos].concat(coordinates.slice(idx + 1));

  let currentStreet = 'Via Urbana Local';
  for (let s = 0; s < steps.length; s++) {
    const startM = stepDistances[s];
    const endM = stepDistances[s + 1] || totalMeters;
    if (targetMeters >= startM && targetMeters <= endM) {
      if (steps[s].name) {
        currentStreet = steps[s].name;
      } else {
        for (let next = s; next < steps.length; next++) {
          if (steps[next].name) {
            currentStreet = `Acessando ${steps[next].name}`;
            break;
          }
        }
      }
      break;
    }
  }

  const remainingMeters = Math.max(0, totalMeters - targetMeters);
  const remainingKm = remainingMeters / 1000;
  const remainingMin = Math.max(1, Math.ceil(totalDurationMin * (1 - clampedFraction)));

  return {
    lat,
    lng,
    facingLeft,
    traveledCoords,
    remainingCoords,
    currentStreet,
    remainingKm,
    remainingMin,
    fraction: clampedFraction,
  };
}

// ============================================================================
// 4. COMPONENTE PRINCIPAL DELIVERY MAP (LEAFLET + ESRI ARCGIS CANVAS TILES)
// ============================================================================
export function DeliveryMap({
  status = 'received',
  statusUpdatedAt = null,
  deliveryAddress = '',
  onDeliveryCompleted,
  onMetricsUpdate,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayersRef = useRef({ base: null, reference: null });

  const layersRef = useRef({
    storeMarker: null,
    destMarker: null,
    motoMarker: null,
    glowLine: null,
    remainingLine: null,
    traveledLine: null,
  });

  const animFrameRef = useRef(null);
  const routeDataRef = useRef(null);
  const progressRef = useRef(0);
  const followMotoRef = useRef(false);

  // Tema: 'dark' (padrão - preto fosco minimalista com ruas visíveis) ou 'light'
  const [mapTheme, setMapTheme] = useState('dark');
  const [originStore, setOriginStore] = useState(PATTIES_STORES[0]);
  const [destination, setDestination] = useState(FALLBACK_DESTINATION);
  const [routeMetrics, setRouteMetrics] = useState({
    distanceKm: 0,
    durationMin: 0,
    currentStreet: 'Aguardando confirmação na loja',
    remainingKm: 0,
    remainingMin: 0,
  });

  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const [followMoto, setFollowMoto] = useState(false);

  useEffect(() => {
    followMotoRef.current = followMoto;
  }, [followMoto]);

  // 1. Geocodificação Estruturada + Rota OSRM
  useEffect(() => {
    let isMounted = true;

    async function loadFullRoute() {
      setIsLoadingRoute(true);

      try {
        const parsed = parseDeliveryAddress(deliveryAddress);
        const dest = await geocodeAddress(parsed, deliveryAddress);
        if (!isMounted) return;
        setDestination(dest);

        const store = await resolveStore(dest, parsed);
        if (!isMounted) return;
        setOriginStore(store);

        const route = await fetchRouteOSRM(store, dest);
        if (!isMounted) return;
        routeDataRef.current = route;

        setRouteMetrics({
          distanceKm: route.totalDistanceKm,
          durationMin: route.totalDurationMin,
          currentStreet: store.address,
          remainingKm: route.totalDistanceKm,
          remainingMin: route.totalDurationMin,
        });

        if (onMetricsUpdate) {
          onMetricsUpdate({
            remainingKm: route.totalDistanceKm,
            remainingMin: route.totalDurationMin,
          });
        }
      } catch (err) {
        console.warn('Erro ao calcular rota detalhada:', err);
      } finally {
        if (isMounted) {
          setIsLoadingRoute(false);
        }
      }
    }

    loadFullRoute();

    return () => {
      isMounted = false;
    };
  }, [deliveryAddress]);

  // Helper para trocar as camadas de tiles do Esri ArcGIS (Base + Reference de nomes de ruas)
  const applyTileTheme = useCallback((map, theme) => {
    if (!map) return;

    if (tileLayersRef.current.base) map.removeLayer(tileLayersRef.current.base);
    if (tileLayersRef.current.reference) map.removeLayer(tileLayersRef.current.reference);

    const config = TILE_CONFIG[theme];

    // Camada Base (ruas, avenidas, quadras limpas)
    const baseLayer = L.tileLayer(config.base, {
      maxNativeZoom: 16,
      maxZoom: 18,
      attribution: '',
    }).addTo(map);

    // Camada Reference (nomes das ruas e bairros nítidos por cima das vias)
    const referenceLayer = L.tileLayer(config.reference, {
      maxNativeZoom: 16,
      maxZoom: 18,
      attribution: '',
    }).addTo(map);

    tileLayersRef.current = { base: baseLayer, reference: referenceLayer };

    // Atualiza cores das linhas da rota
    const layers = layersRef.current;
    if (layers.glowLine) {
      layers.glowLine.setStyle({ color: config.routeGlow });
    }
    if (layers.remainingLine) {
      layers.remainingLine.setStyle({ color: config.routeColor });
    }
    if (layers.traveledLine) {
      layers.traveledLine.setStyle({ color: config.traveledColor });
    }
  }, []);

  // 2. Inicialização do Mapa Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [originStore.lat, originStore.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      applyTileTheme(map, mapTheme);

      map.on('dragstart', () => {
        setFollowMoto(false);
      });

      mapInstanceRef.current = map;
    }

    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // Alternância entre Modo Escuro e Modo Claro
  const handleToggleTheme = () => {
    const nextTheme = mapTheme === 'dark' ? 'light' : 'dark';
    setMapTheme(nextTheme);
    if (mapInstanceRef.current) {
      applyTileTheme(mapInstanceRef.current, nextTheme);
    }
  };

  // 3. Atualização das Camadas da Rota e Marcadores (Loja, Destino e Moto Flaticon #1804540)
  const updateMapLayers = useCallback(() => {
    const map = mapInstanceRef.current;
    const route = routeDataRef.current;
    if (!map || !route) return;

    const layers = layersRef.current;
    const config = TILE_CONFIG[mapTheme];

    // Remove camadas anteriores
    if (layers.storeMarker) map.removeLayer(layers.storeMarker);
    if (layers.destMarker) map.removeLayer(layers.destMarker);
    if (layers.motoMarker) map.removeLayer(layers.motoMarker);
    if (layers.glowLine) map.removeLayer(layers.glowLine);
    if (layers.remainingLine) map.removeLayer(layers.remainingLine);
    if (layers.traveledLine) map.removeLayer(layers.traveledLine);

    const storePoint = [originStore.lat, originStore.lng];
    const destPoint = [destination.lat, destination.lng];

    // Glow suave externo da rota
    layers.glowLine = L.polyline(route.coordinates, {
      color: config.routeGlow,
      weight: 10,
      opacity: mapTheme === 'dark' ? 0.35 : 0.22,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Trecho percorrido da rota (tracejado cinza)
    layers.traveledLine = L.polyline([], {
      color: config.traveledColor,
      weight: 4,
      dashArray: '4, 8',
      opacity: 0.8,
      lineCap: 'round',
    }).addTo(map);

    // Trecho restante da rota (azul nítido de alto contraste)
    layers.remainingLine = L.polyline(route.coordinates, {
      color: config.routeColor,
      weight: 4.5,
      opacity: 0.98,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // 3.1 Marcador da Loja Patties (Mascote Oficial)
    const storeIcon = L.divIcon({
      className: 'custom-store-pin',
      html: `
        <div style="
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 3px solid #2F66FF;
          box-shadow: 0 6px 18px rgba(47, 102, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <img src="/images/patties-mascot.png" alt="Patties" style="width: 28px; height: 28px; object-fit: contain;" />
          <span style="
            position: absolute;
            bottom: -19px;
            left: 50%;
            transform: translateX(-50%);
            background: #0E132A;
            color: #FEDB00;
            font-size: 8px;
            font-family: monospace;
            font-weight: 900;
            padding: 2px 6px;
            white-space: nowrap;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            border-radius: 2px;
            border: 1px solid rgba(254, 219, 0, 0.4);
          ">${originStore.badge}</span>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
    layers.storeMarker = L.marker(storePoint, { icon: storeIcon, zIndexOffset: 500 }).addTo(map);

    // 3.2 Marcador do Destino (Cliente)
    const destIcon = L.divIcon({
      className: 'custom-dest-pin',
      html: `
        <div style="
          width: 38px;
          height: 38px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        ">
          <div style="
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #D71920;
            border: 2.5px solid #FFFFFF;
            box-shadow: 0 6px 18px rgba(215, 25, 32, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill="#FFFFFF"/>
            </svg>
          </div>
          <span style="
            position: absolute;
            bottom: -19px;
            left: 50%;
            transform: translateX(-50%);
            background: #D71920;
            color: #FFFFFF;
            font-size: 8px;
            font-family: monospace;
            font-weight: 900;
            padding: 2px 6px;
            white-space: nowrap;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            border-radius: 2px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          ">SEU ENDEREÇO</span>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });
    layers.destMarker = L.marker(destPoint, { icon: destIcon, zIndexOffset: 600 }).addTo(map);

    // 3.3 Marcador da Moto com Ícone Oficial Flaticon (#1804540)
    const isMoving = status === 'delivering';
    const isDelivered = status === 'delivered';

    const motoIcon = L.divIcon({
      className: 'custom-moto-pin',
      html: `
        <div style="
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: ${isDelivered ? '#10B981' : '#FEDB00'};
          border: 3px solid #0E132A;
          box-shadow: 0 6px 20px ${isDelivered ? 'rgba(16, 185, 129, 0.6)' : 'rgba(254, 219, 0, 0.6)'};
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          ${
            isMoving
              ? `<div style="
                  position: absolute;
                  inset: -7px;
                  border-radius: 50%;
                  border: 2px solid #FEDB00;
                  opacity: 0.8;
                  animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>`
              : ''
          }
          <img
            id="moto-icon-img"
            src="/images/delivery-motorcycle.png"
            alt="Motoboy Patties"
            style="width: 28px; height: 28px; object-fit: contain; transition: transform 0.2s ease;"
          />
          <span id="moto-tag" style="
            position: absolute;
            top: -19px;
            left: 50%;
            transform: translateX(-50%);
            background: #0E132A;
            color: ${isDelivered ? '#10B981' : '#FEDB00'};
            border: 1px solid ${isDelivered ? '#10B981' : '#FEDB00'};
            font-size: 8px;
            font-family: monospace;
            font-weight: 900;
            padding: 1px 6px;
            white-space: nowrap;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            border-radius: 2px;
          ">${isDelivered ? 'ENTREGUE' : isMoving ? '38 KM/H' : 'NA LOJA'}</span>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    const initialPoint = isDelivered ? destPoint : route.coordinates[0] || storePoint;
    layers.motoMarker = L.marker(initialPoint, { icon: motoIcon, zIndexOffset: 1000 }).addTo(map);

    try {
      const bounds = L.latLngBounds(route.coordinates);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    } catch {
      // segue normalmente
    }
  }, [originStore, destination, status, mapTheme]);

  useEffect(() => {
    if (!isLoadingRoute && routeDataRef.current) {
      updateMapLayers();
    }
  }, [isLoadingRoute, updateMapLayers]);

  // 4. Animação Contínua na Velocidade Urbana Real (~38 km/h = 10.5 m/s) + Persistência por Timestamp
  useEffect(() => {
    const route = routeDataRef.current;
    if (!route || isLoadingRoute) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const realisticDurationSec = route.totalDurationSeconds || Math.max(120, route.totalMeters / URBAN_SPEED_MPS);

    if (status === 'received' || status === 'preparing') {
      progressRef.current = 0;
    } else if (status === 'packing') {
      progressRef.current = 0.02;
    } else if (status === 'delivered') {
      progressRef.current = 1.0;
    } else if (status === 'delivering') {
      if (statusUpdatedAt) {
        const elapsedSec = Math.max(0, (Date.now() - new Date(statusUpdatedAt).getTime()) / 1000);
        const computedFraction = Math.min(0.96, elapsedSec / realisticDurationSec);
        if (computedFraction > progressRef.current) {
          progressRef.current = computedFraction;
        }
      }
      if (progressRef.current < 0.02) {
        progressRef.current = 0.02;
      }
    }

    let lastTimestamp = performance.now();

    function renderFrame(now) {
      const deltaMs = now - lastTimestamp;
      lastTimestamp = now;

      if (status === 'delivering') {
        const deltaSeconds = deltaMs / 1000;
        progressRef.current += deltaSeconds / realisticDurationSec;

        if (progressRef.current >= 1.0) {
          progressRef.current = 1.0;
          if (onDeliveryCompleted) {
            onDeliveryCompleted();
          }
        }
      }

      const fraction = Math.max(0, Math.min(1, progressRef.current));
      const interp = interpolateRoute(route, fraction);
      const layers = layersRef.current;
      const map = mapInstanceRef.current;

      if (layers.motoMarker) {
        layers.motoMarker.setLatLng([interp.lat, interp.lng]);
        const imgEl = document.getElementById('moto-icon-img');
        if (imgEl) {
          imgEl.style.transform = interp.facingLeft ? 'scaleX(-1)' : 'scaleX(1)';
        }
      }

      if (layers.traveledLine) {
        layers.traveledLine.setLatLngs(interp.traveledCoords);
      }
      if (layers.remainingLine) {
        layers.remainingLine.setLatLngs(interp.remainingCoords);
      }

      setRouteMetrics((prev) => ({
        ...prev,
        currentStreet:
          status === 'delivering' && fraction < 1.0
            ? interp.currentStreet
            : status === 'delivered' || fraction >= 1.0
            ? 'Entregue no endereço do cliente'
            : `Na unidade ${originStore.name}`,
        remainingKm: interp.remainingKm,
        remainingMin: interp.remainingMin,
      }));

      if (onMetricsUpdate) {
        onMetricsUpdate({
          remainingKm: interp.remainingKm,
          remainingMin: interp.remainingMin,
        });
      }

      if (followMotoRef.current && map && status === 'delivering' && fraction < 1.0) {
        map.panTo([interp.lat, interp.lng], { animate: true, duration: 0.25 });
      }

      if (status === 'delivering' && progressRef.current < 1.0) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
      }
    }

    animFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [status, statusUpdatedAt, isLoadingRoute, originStore.name, onDeliveryCompleted, onMetricsUpdate]);

  // Ações de Câmera
  const handleFitRoute = () => {
    setFollowMoto(false);
    const map = mapInstanceRef.current;
    const route = routeDataRef.current;
    if (map && route) {
      const bounds = L.latLngBounds(route.coordinates);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  };

  const handleFocusStore = () => {
    setFollowMoto(false);
    mapInstanceRef.current?.setView([originStore.lat, originStore.lng], 16, { animate: true });
  };

  const handleFocusDestination = () => {
    setFollowMoto(false);
    mapInstanceRef.current?.setView([destination.lat, destination.lng], 16, { animate: true });
  };

  const handleToggleFollow = () => {
    const next = !followMoto;
    setFollowMoto(next);
    if (next && layersRef.current.motoMarker && mapInstanceRef.current) {
      mapInstanceRef.current.setView(layersRef.current.motoMarker.getLatLng(), 16, { animate: true });
    }
  };

  return (
    <div className="w-full bg-[#181A1F] border-b border-[#141413]/20 shadow-inner overflow-hidden">
      {/* 1. Canvas do Mapa Leaflet com Esri ArcGIS Canvas */}
      <div className="relative w-full h-[400px] sm:h-[470px] md:h-[520px]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Loading Overlay */}
        {isLoadingRoute && (
          <div className="absolute inset-0 z-30 bg-[#181A1F]/90 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3">
            <div className="w-10 h-10 border-3 border-[#FEDB00] border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-[#FEDB00]">
              Carregando Malha Viária &amp; Rota OSRM...
            </p>
          </div>
        )}

        {/* HUD Top-Right: Distância Restante, Estimativa e Botão Dark/Light Mode */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          <div className="bg-[#0E132A]/95 text-white backdrop-blur-md border border-[#FEDB00]/40 px-3.5 py-2 shadow-xl rounded-sm flex items-center gap-3">
            <div className="text-right">
              <span className="block font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-[#FEDB00]">
                Distância
              </span>
              <span className="font-mono font-bold text-xs sm:text-sm text-white">
                {routeMetrics.remainingKm.toFixed(1)} km
              </span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-right">
              <span className="block font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-[#FEDB00]">
                Tempo Real
              </span>
              <span className="font-mono font-bold text-xs sm:text-sm text-white">
                ~{routeMetrics.remainingMin} min
              </span>
            </div>
          </div>

          {/* Botão Alternar Modo Escuro / Modo Claro */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className="px-3 py-1.5 bg-[#0E132A]/90 hover:bg-[#0E132A] text-white border border-white/20 font-mono text-[10px] font-bold uppercase tracking-wider shadow-lg cursor-pointer transition-all flex items-center gap-1.5"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                mapTheme === 'dark' ? 'bg-[#FEDB00]' : 'bg-[#2F66FF]'
              }`}
            />
            <span>{mapTheme === 'dark' ? 'Mapa: Modo Escuro' : 'Mapa: Modo Claro'}</span>
          </button>
        </div>

        {/* HUD Bottom-Right: Controles de Câmera */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 shadow-xl">
          <button
            type="button"
            onClick={handleToggleFollow}
            className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border ${
              followMoto
                ? 'bg-[#2F66FF] text-white border-[#2F66FF]'
                : 'bg-[#0E132A]/90 text-white hover:bg-[#0E132A] border-white/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{followMoto ? 'Seguindo Moto' : 'Seguir Moto'}</span>
          </button>

          <button
            type="button"
            onClick={handleFitRoute}
            className="px-3 py-1.5 bg-[#0E132A]/90 hover:bg-[#0E132A] text-white font-mono text-[10px] font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Enquadrar Rota Inteira</span>
          </button>
        </div>
      </div>

      {/* 2. Painel Informativo "De Onde / Para Onde" Preciso */}
      <div className="p-4 sm:p-5 bg-white border-t border-[#141413]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origem (Loja Patties) */}
          <div className="flex items-start gap-3 p-3 bg-[#F4F7FF] border border-[#2F66FF]/20 rounded-sm">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-[#2F66FF] flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-1">
              <img src="/images/patties-mascot.png" alt="Patties" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-[#2F66FF]">
                  Partida: {originStore.badge}
                </span>
                <button
                  type="button"
                  onClick={handleFocusStore}
                  className="font-mono text-[9px] text-[#2F66FF] hover:underline font-bold uppercase cursor-pointer"
                >
                  Focar Loja ➔
                </button>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#0E132A] truncate">
                {originStore.name}
              </h4>
              <p className="font-mono text-[10px] text-[#0E132A]/70 truncate">
                {originStore.address}
              </p>
            </div>
          </div>

          {/* Destino (Endereço do Cliente) */}
          <div className="flex items-start gap-3 p-3 bg-red-50/60 border border-red-200 rounded-sm">
            <div className="w-10 h-10 rounded-full bg-[#D71920] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" fill="currentColor" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-[#D71920]">
                  Destino da Entrega
                </span>
                <button
                  type="button"
                  onClick={handleFocusDestination}
                  className="font-mono text-[9px] text-[#D71920] hover:underline font-bold uppercase cursor-pointer"
                >
                  Focar Destino ➔
                </button>
              </div>
              <h4 className="font-sans font-bold text-sm text-[#0E132A] truncate">
                {destination.road
                  ? `${destination.road}${
                      parseDeliveryAddress(deliveryAddress).number
                        ? `, ${parseDeliveryAddress(deliveryAddress).number}`
                        : ''
                    }`
                  : deliveryAddress}
              </h4>
              <p className="font-mono text-[10px] text-[#0E132A]/70 truncate">
                {deliveryAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryMap;
