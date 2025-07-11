'use client';

import { useEffect, useState } from 'react';
import { getPrayerNames, PrayerTimes } from '@/lib/prayer-times';
import { Mosque } from '@/lib/types';
import { Coordinates, CalculationMethod, CalculationParameters, PrayerTimes as AdhanPrayerTimes } from 'adhan';
import { useTranslations } from 'next-intl';

interface PrayerTimesDisplayProps {
  mosque: Mosque;
  className?: string;
}

export default function PrayerTimesDisplayAdhan({ mosque, className = "" }: PrayerTimesDisplayProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [activeTime, setActiveTime] = useState<string | null>(null);
  const t = useTranslations('prayerTimes');
  const mosqueT = useTranslations('mosque');
  
  useEffect(() => {
    if (mosque && (mosque.longitude !== null && mosque.latitude !== null)) {
      try {
        // Koordinaten erstellen
        const coordinates = new Coordinates(
          Number(mosque.latitude),
          Number(mosque.longitude)
        );
        
        console.log('Created coordinates:', coordinates);

        // Berechnungsmethode festlegen
        let params: CalculationParameters;
        
        switch(mosque.prayer_time_calculation) {
          case 'MoonsightingCommittee':
            params = CalculationMethod.MoonsightingCommittee();
            break;
          case 'MuslimWorldLeague':
            params = CalculationMethod.MuslimWorldLeague();
            break;
          case 'NorthAmerica':
            params = CalculationMethod.NorthAmerica();
            break;
          case 'Egytian':
            params = CalculationMethod.Egyptian();
            break;
          case 'UmmAlQura':
            params = CalculationMethod.UmmAlQura();
            break;
          case 'Karachi':
            params = CalculationMethod.Karachi();
            break;
          case 'Tehran':
            params = CalculationMethod.Tehran();
            break;
          case 'Qatar':
            params = CalculationMethod.Qatar();
            break;
          case 'Singapore':
            params = CalculationMethod.Singapore();
            break;
          case 'Dubai':
            params = CalculationMethod.Dubai();
            break;
          case 'Diyanet':
          case 'Turkey':
            params = CalculationMethod.Turkey();
            break;
          default:
            params = CalculationMethod.MuslimWorldLeague();
        }
        
        console.log('Using calculation method:', mosque.prayer_time_calculation || 'Default (MWL)');
        
        // Gebetszeiten mit adhan berechnen
        const date = new Date();
        const adhanPrayerTimes = new AdhanPrayerTimes(coordinates, date, params);
        console.log('Adhan prayer times:', adhanPrayerTimes);
        
        // Formatieren der Zeiten
        const formatTime = (date: Date | null) => {
          if (!date) return "––:––";
          return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        };
        
        // Konvertieren zu unserem Format
        const times: PrayerTimes = {
          fajr: formatTime(adhanPrayerTimes.fajr),
          shuruk: formatTime(adhanPrayerTimes.sunrise),
          dhuhr: formatTime(adhanPrayerTimes.dhuhr),
          asr: formatTime(adhanPrayerTimes.asr),
          maghrib: formatTime(adhanPrayerTimes.maghrib),
          isha: formatTime(adhanPrayerTimes.isha),
          date: date
        };
        
        console.log('Converted prayer times:', times);
        
        // Offsets anwenden, falls vorhanden
        if (mosque.prayer_time_offsets) {
          console.log('Applying offsets:', mosque.prayer_time_offsets);
          Object.entries(mosque.prayer_time_offsets).forEach(([prayer, offset]) => {
            const prayerKey = prayer as keyof Omit<PrayerTimes, 'date'>;
            if (typeof times[prayerKey] === "string" && times[prayerKey] !== "––:––" && offset) {
              const [hours, minutes] = (times[prayerKey] as string).split(":").map(Number);
              let totalMinutes = hours * 60 + minutes + offset;
              
              // Sicherstellen, dass wir im 24-Stunden-Format bleiben
              if (totalMinutes < 0) totalMinutes += 24 * 60;
              totalMinutes %= 24 * 60;
              
              const newHours = Math.floor(totalMinutes / 60);
              const newMinutes = totalMinutes % 60;
              
              times[prayerKey] = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
            }
          });
        }
        
        setPrayerTimes(times);
        
        // Aktuelle Gebetszeit ermitteln
        const determineActiveTime = () => {
          const now = new Date();
          const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          
          const prayers = ['fajr', 'shuruk', 'dhuhr', 'asr', 'maghrib', 'isha'];
          let active = null;
          
          // Finde das nächste anstehende Gebet
          for (let i = 0; i < prayers.length; i++) {
            const prayer = prayers[i] as keyof Omit<PrayerTimes, 'date'>;
            const time = times[prayer];
            
            // Überspringen, wenn keine Zeit vorhanden ist
            if (time === "––:––") continue;
            
            if (time > currentTimeStr) {
              active = prayer;
              break;
            }
          }
          
          // Wenn alle Gebete für heute vorbei sind, ist das nächste Gebet morgen fajr
          if (!active) {
            active = 'fajr';
          }
          
          setActiveTime(active);
        };
        
        determineActiveTime();
        const interval = setInterval(determineActiveTime, 60000); // Jede Minute aktualisieren
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error calculating prayer times with adhan:', error);
      }
    }
  }, [mosque]);
  
  if (!prayerTimes || !mosque.longitude || !mosque.latitude) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-muted-foreground text-center">{t('noCalculation')}</p>
      </div>
    );
  }
  
  const prayerNames = getPrayerNames();
  const prayers = Object.keys(prayerNames) as Array<keyof typeof prayerNames>;
  
  if (!mosque.longitude || !mosque.latitude) {
    if (mosque.prayer_time_calculation) {
      return (
        <section className={`mb-10 ${className}`}>
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">{mosqueT('prayerTimes')}</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-muted-foreground text-center">{mosqueT('noPrayerTimes')}</p>
          </div>
        </section>
      );
    }
    return null;
  }
  
  return (
    <section className={`mb-8 md:mb-10 ${className}`}>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 md:mb-6 border-b pb-2">{mosqueT('prayerTimes')}</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold mb-4">{t('todayTimes')}</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4">
          {prayers.map((prayer) => (
            <div 
              key={prayer} 
              className={`p-2 md:p-3 rounded-lg ${activeTime === prayer 
                ? 'bg-primary/10 border border-primary/30' 
                : 'bg-muted/30'
              }`}
            >
              <div className="font-medium text-xs sm:text-sm">{prayerNames[prayer]}</div>
              <div className={`text-base md:text-lg ${activeTime === prayer ? 'text-primary font-semibold' : ''}`}>
                {prayerTimes[prayer]}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>{mosqueT('calculationMethod')}: {mosque.prayer_time_calculation || mosqueT('standard')}</p>
          <p className="mt-1">{t('asOf')}: {new Date().toLocaleDateString('de-DE')}</p>
        </div>
      </div>
    </section>
  );
}
