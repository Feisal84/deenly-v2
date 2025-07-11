"use client";

import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";
import { Mosque } from "@/lib/types";

export default function MoscheenPage() {
  const t = useTranslations('navigation');
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMosques = useMemo(() => {
    if (!searchTerm.trim()) return mosques;
    
    const term = searchTerm.toLowerCase().trim();
    return mosques.filter(mosque => 
      mosque.name.toLowerCase().includes(term) || 
      mosque.address.toLowerCase().includes(term) || 
      mosque.city.toLowerCase().includes(term)
    );
  }, [mosques, searchTerm]);

  useEffect(() => {
    async function fetchMosques() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('mosques')
          .select('id, name, address, city, postal_code, handle, hero_path, created_at, services, prayer_time_calculation')
          .order('name');

        if (error) throw error;
        setMosques(data || []);
      } catch (error) {
        console.error('Fehler beim Laden der Moscheen:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMosques();
  }, []);

  return (
    <div className="mx-auto w-full max-w-[800px] px-4 mt-20 mb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
        <h1 className="text-3xl font-bold">{t('mosques')}</h1>
        
        <div className="md:max-w-xl w-full">
          <div className="relative">
            <Input
              type="search"
              placeholder={t('search-placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>
          {searchTerm.trim() && (
            <p className="text-sm text-muted-foreground mt-2 mr-2 text-right">
              {filteredMosques.length} {t('found')}
            </p>
          )}
        </div>
      </div>
      
      {loading ? (
        <p>{t('loading-mosques')}</p>
      ) : (
        <>
          {filteredMosques.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('no-mosques-found')} "{searchTerm}".</p>
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <table className="w-full border-collapse max-w-none">
                <thead>
                  <tr className="bg-muted border-b">
                    <th className="p-3 text-left font-semibold w-1/3">{t('name')}</th>
                    <th className="p-3 text-left font-semibold w-1/2">{t('address')}</th>
                    <th className="p-3 text-center font-semibold w-1/6">{t('route')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMosques.map((mosque) => (
                    <tr key={mosque.id} className="border-b hover:bg-muted/50 transition-colors duration-200">
                      <td className="p-3">
                        <Link 
                          href={`/moscheen/${mosque.handle}`}
                          className="font-medium hover:underline text-primary"
                        >
                          {mosque.name}
                        </Link>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {mosque.address}, {mosque.postal_code} {mosque.city}
                      </td>
                      <td className="p-3 text-center">
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${mosque.address}, ${mosque.postal_code} ${mosque.city}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
                          title="Route zu dieser Moschee anzeigen"
                        >
                          <ExternalLink size={18} />
                          <span className="sr-only">Route planen</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
