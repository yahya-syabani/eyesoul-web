"use client";

import { useState } from "react";
import { StoreLocation } from "@/lib/cms/types";
import { StoreMap } from "@/components/ui/StoreMap";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Navigation, Phone, MessageCircle, Clock, Camera } from "lucide-react";
import Image from "next/image";

interface StoreLocatorClientProps {
  stores: StoreLocation[];
}

export function StoreLocatorClient({ stores }: StoreLocatorClientProps) {
  const [activeStoreId, setActiveStoreId] = useState<number | null>(null);

  // When a store card is clicked in the list, update the active store (which pans the map)
  const handleStoreSelect = (id: number) => {
    setActiveStoreId(id);
    // On mobile, scroll map into view
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-4rem)]">
      
      {/* Map Side (Top on Mobile, Left on Desktop 60%) */}
      <div className="w-full lg:w-[60%] h-[40vh] lg:h-full relative">
        <StoreMap 
          stores={stores} 
          activeStoreId={activeStoreId} 
          onStoreSelect={setActiveStoreId}
          className="rounded-none lg:rounded-none"
        />
      </div>

      {/* List Side (Bottom on Mobile, Right on Desktop 40%) */}
      <div className="w-full lg:w-[40%] h-[60vh] lg:h-full overflow-y-auto bg-neutral-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-3xl mb-2">Store Locator</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Find an Eyesoul showroom near you to explore our collections and get a comprehensive eye examination.
          </p>

          <div className="space-y-4">
            {stores.length > 0 ? (
              stores.map((store) => (
                <Card 
                  key={store.id} 
                  className={`overflow-hidden transition-all cursor-pointer ${activeStoreId === store.id ? 'ring-2 ring-primary border-transparent shadow-md' : 'hover:border-neutral-300 shadow-sm'}`}
                  onClick={() => handleStoreSelect(store.id)}
                >
                  <CardContent className="p-5">
                    <h3 className="font-display font-medium text-lg mb-1">{store.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{store.address}</p>
                    
                    {/* Operating Hours */}
                    {store.hours && store.hours.length > 0 && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="flex flex-col">
                          {store.hours.map((h, i) => (
                            <span key={i}>{h.day}: {h.open} - {h.close}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gallery Preview */}
                    {store.images && store.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 snap-x">
                        {store.images.map((img, idx) => {
                          const url = typeof img.image === 'object' && img.image !== null ? img.image.url : null;
                          if (!url) return null;
                          return (
                            <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 snap-center bg-neutral-100">
                              <Image src={url} alt={`${store.name} photo`} fill className="object-cover" />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-100">
                      {store.lat && store.lng && (
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={buttonVariants({ size: "sm", variant: "default", className: "flex-1 text-xs" })}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Navigation className="w-3.5 h-3.5 mr-1.5" />
                          Directions
                        </a>
                      )}
                      {store.whatsapp && (
                        <a 
                          href={`https://wa.me/${store.whatsapp}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={buttonVariants({ size: "sm", variant: "outline", className: "text-xs" })}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                          WhatsApp
                        </a>
                      )}
                      {store.phone && (
                        <a 
                          href={`tel:${store.phone}`}
                          className={buttonVariants({ size: "sm", variant: "outline", className: "text-xs" })}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
                No stores found.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
