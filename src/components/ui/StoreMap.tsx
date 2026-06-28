"use client";

import { useState, useEffect } from "react";
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { StoreLocation } from "@/lib/cms/types";
import { buttonVariants } from "./button";
import { MapPin, Navigation, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";

interface StoreMapProps {
  stores: StoreLocation[];
  activeStoreId?: number | null;
  onStoreSelect?: (id: number | null) => void;
  className?: string;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function StoreMap({ stores, activeStoreId, onStoreSelect, className = "" }: StoreMapProps) {
  const [popupInfo, setPopupInfo] = useState<StoreLocation | null>(null);

  // If external activeStoreId changes, update popup
  useEffect(() => {
    if (activeStoreId && stores) {
      const store = stores.find((s) => s.id === activeStoreId);
      if (store) setPopupInfo(store);
    } else {
      setPopupInfo(null);
    }
  }, [activeStoreId, stores]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`w-full h-full bg-neutral-100 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-neutral-300 rounded-xl ${className}`}>
        <MapPin className="h-10 w-10 text-neutral-400 mb-4" />
        <h3 className="font-display text-lg mb-2">Interactive Map Disabled</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          A valid Mapbox Access Token is required to render the map. Please add <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> to your .env file.
        </p>
        <p className="text-xs text-muted-foreground">
          The store list below remains fully functional for accessibility and fallback navigation.
        </p>
      </div>
    );
  }

  // Calculate bounds to fit all markers if needed, or default to Jakarta (center of Indonesia roughly for MVP)
  const defaultLongitude = stores.length > 0 && stores[0].lng ? stores[0].lng : 106.8227;
  const defaultLatitude = stores.length > 0 && stores[0].lat ? stores[0].lat : -6.1950;

  return (
    <div className={`relative w-full h-full min-h-[400px] overflow-hidden rounded-xl ${className}`}>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: defaultLongitude,
          latitude: defaultLatitude,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        style={{ width: "100%", height: "100%" }}
      >
        <FullscreenControl position="top-right" />
        <NavigationControl position="bottom-right" />

        {stores.map((store) => {
          if (!store.lat || !store.lng) return null;
          return (
            <Marker
              key={store.id}
              longitude={store.lng}
              latitude={store.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPopupInfo(store);
                if (onStoreSelect) onStoreSelect(store.id);
              }}
            >
              <div className="cursor-pointer group flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${popupInfo?.id === store.id ? 'bg-primary text-primary-foreground' : 'bg-white text-foreground group-hover:bg-neutral-100'}`}>
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </Marker>
          );
        })}

        {popupInfo && popupInfo.lat && popupInfo.lng && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => {
              setPopupInfo(null);
              if (onStoreSelect) onStoreSelect(null);
            }}
            closeOnClick={false}
            className="z-50"
            maxWidth="320px"
          >
            <div className="p-1 max-w-[280px]">
              {popupInfo.images && popupInfo.images.length > 0 && typeof popupInfo.images[0].image === 'object' && popupInfo.images[0].image.url && (
                <div className="relative w-full h-24 mb-3 rounded-md overflow-hidden bg-neutral-100">
                  <Image src={popupInfo.images[0].image.url} alt={popupInfo.name} fill className="object-cover" />
                </div>
              )}
              <h4 className="font-display font-medium text-base leading-tight mb-1">{popupInfo.name}</h4>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{popupInfo.address}</p>
              
              <div className="flex gap-2">
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${popupInfo.lat},${popupInfo.lng}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "xs", variant: "default", className: "flex-1 text-[10px]" })}
                >
                  <Navigation className="w-3 h-3 mr-1" />
                  Directions
                </a>
                {popupInfo.whatsapp && (
                  <a 
                    href={`https://wa.me/${popupInfo.whatsapp}`} 
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
        )}
      </Map>
    </div>
  );
}
