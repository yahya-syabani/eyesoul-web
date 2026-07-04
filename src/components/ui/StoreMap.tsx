"use client";

import dynamic from "next/dynamic";
import { StoreLocation } from "@/lib/cms/types";
import { MapPin } from "lucide-react";

// Dynamically import the Leaflet map with SSR disabled to prevent window object errors
const DynamicLeafletMap = dynamic(() => import("./LeafletMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-neutral-100 flex flex-col items-center justify-center p-6 text-center border border-neutral-200 rounded-xl animate-pulse">
      <MapPin className="h-10 w-10 text-neutral-300 mb-4 animate-bounce" />
      <h3 className="font-display text-lg mb-2 text-neutral-400">Loading Map...</h3>
    </div>
  )
});

interface StoreMapProps {
  stores: StoreLocation[];
  activeStoreId?: number | null;
  onStoreSelect?: (id: number | null) => void;
  className?: string;
}

export function StoreMap(props: StoreMapProps) {
  return <DynamicLeafletMap {...props} />;
}
