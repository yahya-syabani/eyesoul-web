"use client";

import { useState } from "react";
import { StoreLocation } from "@/lib/cms/types";
import { StoreMap } from "@/components/ui/StoreMap";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Navigation, Phone, MessageCircle, Clock, Search, Locate, ChevronRight } from "lucide-react";
import Link from "next/link";

interface StoreLocatorClientProps {
  stores: StoreLocation[];
}

export function StoreLocatorClient({ stores }: StoreLocatorClientProps) {
  const [activeStoreId, setActiveStoreId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Simple client-side text filter
  const filteredStores = stores.filter(store => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return store.name.toLowerCase().includes(query) || 
           store.address.toLowerCase().includes(query);
  });

  const handleStoreSelect = (id: number) => {
    setActiveStoreId(id);
    if (window.innerWidth < 1024) {
      // On mobile, smoothly scroll map into view if it's sticky at the top
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      
      {/* Page Hero & Search */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight">Find a Showroom</h1>
        <p className="text-muted-foreground text-base md:text-lg px-4">
          Discover our premium collections in person and receive a comprehensive eye examination from our specialists.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center w-full max-w-2xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by city, store name, or address..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 rounded-xl border border-neutral-300 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow text-base shadow-sm bg-white" 
            />
          </div>
          <button 
            className="h-14 px-6 border border-neutral-300 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm flex items-center justify-center gap-2 font-medium w-full sm:w-auto bg-white" 
            aria-label="Use my location"
            onClick={() => alert("Geolocation feature coming soon!")}
          >
            <Locate className="w-5 h-5" />
            <span className="sm:hidden">Use Current Location</span>
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 w-full relative">
        
        {/* Map Side (Top on Mobile, Right on Desktop) */}
        <div className="w-full lg:w-[55%] h-[50vh] lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24 rounded-2xl overflow-hidden shadow-lg border border-neutral-200 order-1 lg:order-2 z-10 bg-neutral-100">
          <StoreMap 
            stores={filteredStores} 
            activeStoreId={activeStoreId} 
            onStoreSelect={setActiveStoreId}
            className="rounded-2xl"
          />
        </div>

        {/* List Side (Bottom on Mobile, Left on Desktop) */}
        <div className="w-full lg:w-[45%] flex flex-col gap-4 order-2 lg:order-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-xl font-medium">
              {filteredStores.length} {filteredStores.length === 1 ? 'Store' : 'Stores'} Found
            </h2>
          </div>

          {filteredStores.length > 0 ? (
            filteredStores.map((store) => (
              <Card 
                key={store.id} 
                className={`overflow-hidden transition-all cursor-pointer group ${activeStoreId === store.id ? 'ring-2 ring-primary border-transparent shadow-md bg-neutral-50' : 'hover:border-neutral-300 shadow-sm bg-white'}`}
                onClick={() => handleStoreSelect(store.id)}
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-display font-medium text-xl mb-1.5 group-hover:text-primary transition-colors">{store.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{store.address}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${activeStoreId === store.id ? 'bg-primary text-primary-foreground' : 'bg-neutral-100 text-neutral-500'}`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Operating Hours (Simplified) */}
                  {store.hours && store.hours.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                      <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="font-medium">{store.hours[0].day}:</span>
                      <span>{store.hours[0].open} - {store.hours[0].close}</span>
                      {store.hours.length > 1 && (
                        <span className="text-xs text-neutral-400 ml-auto">+ {store.hours.length - 1} more</span>
                      )}
                    </div>
                  )}

                  {/* Actions Hierarchy */}
                  <div className="flex items-center gap-2 mt-5">
                    {store.lat && store.lng && (
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={buttonVariants({ size: "default", variant: "default", className: "flex-1 shadow-sm font-medium" })}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </a>
                    )}
                    {store.whatsapp && (
                      <a 
                        href={`https://wa.me/${store.whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={buttonVariants({ size: "icon", variant: "outline", className: "shrink-0 w-10 h-10 border-neutral-200 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200" })}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </a>
                    )}
                    {store.phone && (
                      <a 
                        href={`tel:${store.phone}`}
                        className={buttonVariants({ size: "icon", variant: "outline", className: "shrink-0 w-10 h-10 border-neutral-200 text-neutral-600" })}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Call Store"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50 flex flex-col items-center">
              <Search className="w-12 h-12 text-neutral-300 mb-4" />
              <h3 className="font-display text-lg mb-2">No stores found</h3>
              <p className="text-muted-foreground text-sm">We couldn't find any locations matching "{searchQuery}".</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
