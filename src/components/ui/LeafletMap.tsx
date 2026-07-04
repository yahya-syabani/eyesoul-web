import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import { StoreLocation } from "@/lib/cms/types";
import { buttonVariants } from "./button";
import { MapPin, Navigation, MessageCircle } from "lucide-react";
import Image from "next/image";

interface LeafletMapProps {
  stores: StoreLocation[];
  activeStoreId?: number | null;
  onStoreSelect?: (id: number | null) => void;
  className?: string;
}

// Map bounds controller to automatically pan/zoom to active store
function MapController({ activeStoreId, stores }: { activeStoreId?: number | null, stores: StoreLocation[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (activeStoreId) {
      const store = stores.find(s => s.id === activeStoreId);
      if (store && store.lat && store.lng) {
        map.setView([store.lat, store.lng], 15, { animate: true });
      }
    }
  }, [activeStoreId, map, stores]);
  
  return null;
}

export default function LeafletMap({ stores, activeStoreId, onStoreSelect, className = "" }: LeafletMapProps) {
  const defaultLat = stores.length > 0 && stores[0].lat ? stores[0].lat : -6.1950;
  const defaultLng = stores.length > 0 && stores[0].lng ? stores[0].lng : 106.8227;

  // Create custom marker icons
  const createIcon = (isActive: boolean) => {
    const iconHtml = renderToString(
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'}`}>
        <MapPin className="w-5 h-5" />
      </div>
    );
    
    return new L.DivIcon({
      html: iconHtml,
      className: "custom-leaflet-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -42],
    });
  };

  return (
    <div className={`relative w-full h-full min-h-[400px] overflow-hidden rounded-xl z-0 ${className}`}>
      <MapContainer 
        center={[defaultLat, defaultLng]} 
        zoom={12} 
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController activeStoreId={activeStoreId} stores={stores} />

        {stores.map((store) => {
          if (!store.lat || !store.lng) return null;
          const isActive = activeStoreId === store.id;
          
          return (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={createIcon(isActive)}
              eventHandlers={{
                click: () => {
                  if (onStoreSelect) onStoreSelect(store.id);
                }
              }}
            >
              <Popup
                className="custom-popup"
                eventHandlers={{
                  popupclose: () => {
                    if (onStoreSelect) onStoreSelect(null);
                  },
                }}
              >
                <div className="p-0.5 max-w-[280px] w-[260px]">
                  {store.images && store.images.length > 0 && typeof store.images[0].image === 'object' && store.images[0].image.url && (
                    <div className="relative w-full h-24 mb-3 rounded-md overflow-hidden bg-neutral-100">
                      <Image src={store.images[0].image.url} alt={store.name} fill className="object-cover" />
                    </div>
                  )}
                  <h4 className="font-display font-medium text-base leading-tight mb-1 m-0">{store.name}</h4>
                  <p className="text-xs text-neutral-500 mb-3 line-clamp-2 m-0 mt-1">{store.address}</p>
                  
                  {/* Services Offered */}
                  {store.servicesOffered && store.servicesOffered.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {store.servicesOffered.map((svc: { id: number; name: string } | number, i: number) => {
                        const name = typeof svc === 'object' && svc !== null ? svc.name : null;
                        return name ? (
                          <span key={i} className="text-[10px] bg-black/5 text-black px-1.5 py-0.5 rounded-full font-medium">{name}</span>
                        ) : null;
                      })}
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={buttonVariants({ size: "xs", variant: "default", className: "flex-1 text-[10px]" })}
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Directions
                    </a>
                    {store.whatsapp && (
                      <a 
                        href={`https://wa.me/${store.whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={buttonVariants({ size: "icon-xs", variant: "outline" })}
                      >
                        <MessageCircle className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
