import { Mosque } from "./types";

// Gebetszeiten-Berechnungsmethoden
type CalculationMethod = 
  | "MWL" // Muslim World League
  | "ISNA" // Islamic Society of North America
  | "Egypt" // Egyptian General Authority of Survey
  | "Makkah" // Umm al-Qura University, Makkah
  | "Karachi" // University of Islamic Sciences, Karachi
  | "Tehran" // Institute of Geophysics, University of Tehran
  | "Jafari" // Shia Ithna Ashari
  | "MoonsightingCommittee" // Moonsighting Committee
  | "NorthAmerica" // ISNA with different settings
  | "Diyanet" // Türkiye Diyanet İşleri Başkanlığı
  | "Turkey" // Diyanet alias
  | "Custom"; // Benutzerdefinierte Methode

// Standardeinstellungen für verschiedene Berechnungsmethoden
const methodSettings = {
  MWL: {
    fajr: 18,
    isha: 17,
    maghrib: 0, // Minuten nach Sonnenuntergang
    midnight: "Standard", // Standard oder Jafari
    higherLatitudes: "NightMiddle" // NightMiddle, Angle oder None
  },
  ISNA: {
    fajr: 15,
    isha: 15,
    maghrib: 0,
    midnight: "Standard",
    higherLatitudes: "NightMiddle"
  },
  Egypt: {
    fajr: 19.5,
    isha: 17.5,
    maghrib: 0,
    midnight: "Standard",
    higherLatitudes: "NightMiddle"
  },
  Makkah: {
    fajr: 18.5,
    isha: 90, // 90 Minuten nach Maghrib
    maghrib: 0,
    midnight: "Standard",
    higherLatitudes: "NightMiddle"
  },
  Karachi: {
    fajr: 18,
    isha: 18,
    maghrib: 0,
    midnight: "Standard",
    higherLatitudes: "NightMiddle"
  },
  Tehran: {
    fajr: 17.7,
    isha: 14,
    maghrib: 4.5, // 4.5 Grad nach Sonnenuntergang
    midnight: "Jafari",
    higherLatitudes: "NightMiddle"
  },
  Jafari: {
    fajr: 16,
    isha: 14,
    maghrib: 4,
    midnight: "Jafari",
    higherLatitudes: "NightMiddle"
  },
  MoonsightingCommittee: {
    fajr: 18,
    isha: 18,
    maghrib: 0,
    midnight: "Standard",
    higherLatitudes: "NightMiddle"
  },
  NorthAmerica: {
    fajr: 15,
    isha: 15,
    maghrib: 0,
    midnight: "Standard",
    higherLatitudes: "AngleBased"
  },
  Diyanet: {
    fajr: 18,
    isha: 17,
    maghrib: 0,
    midnight: "Standard",
    higherLatitudes: "AngleBased"
  },
  Turkey: {
    fajr: 18,
    isha: 17,
    maghrib: 0,
    midnight: "Standard",
    higherLatitudes: "AngleBased"
  },
  Custom: {
    fajr: 18,
    isha: 17,
    maghrib: 0,
    midnight: "Standard",
    higherLatitudes: "NightMiddle"
  }
};

// Interface für Gebetszeiten
export interface PrayerTimes {
  fajr: string;
  shuruk: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: Date;
}

// Hilfsfunktion zur Umrechnung von Dezimalgrad in Radianten
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Hilfsfunktion zur Umrechnung von Radianten in Grad
function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

// Berechnet die Gleichung der Zeit (Equation of Time) in Minuten
function equationOfTime(jd: number): number {
  const n = jd - 2451545.0;
  const g = 357.528 + 0.9856003 * n; // Mittlere Anomalie der Sonne
  const c = 1.9148 * Math.sin(degreesToRadians(g)) + 0.02 * Math.sin(degreesToRadians(2 * g)) + 0.0003 * Math.sin(degreesToRadians(3 * g)); // Gleichung des Zentrums
  const lambda = g + c + 282.634; // Ekliptische Länge
  const epsilonDeg = 23.439 - 0.0000004 * n; // Neigung der Erdachse
  const epsilon = degreesToRadians(epsilonDeg);
  const alpha = radiansToDegrees(Math.atan2(Math.cos(epsilon) * Math.sin(degreesToRadians(lambda)), Math.cos(degreesToRadians(lambda))));
  const deltaPsi = -0.000319 * Math.sin(degreesToRadians(125.04 - 1934.136 * n)) + 0.000024 * Math.sin(degreesToRadians(280.47 + n * 36000.76892));
  const eot = 4 * (lambda - alpha - deltaPsi);
  return eot;
}

// Berechnet die Deklination der Sonne in Grad
function sunDeclination(jd: number): number {
  const n = jd - 2451545.0;
  const g = 357.528 + 0.9856003 * n;
  const c = 1.9148 * Math.sin(degreesToRadians(g)) + 0.02 * Math.sin(degreesToRadians(2 * g)) + 0.0003 * Math.sin(degreesToRadians(3 * g));
  const lambda = g + c + 282.634;
  const epsilonDeg = 23.439 - 0.0000004 * n;
  const epsilon = degreesToRadians(epsilonDeg);
  return radiansToDegrees(Math.asin(Math.sin(epsilon) * Math.sin(degreesToRadians(lambda))));
}

// Berechnet den Julianischen Tag für ein Datum
function getJulianDay(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  return jd;
}

// Berechnet die Zeit eines bestimmten Sonnenwinkels
function computeSunAngleTime(date: Date, angle: number, longitude: number, latitude: number, direction: "after" | "before", noon: number): number {
  const jd = getJulianDay(date);
  const decl = sunDeclination(jd);
  const eot = equationOfTime(jd);
  
  const latRad = degreesToRadians(latitude);
  const declRad = degreesToRadians(decl);
  const angleRad = degreesToRadians(angle);
  
  let cosHourAngle = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(declRad)) / (Math.cos(latRad) * Math.cos(declRad));
  
  console.log('computeSunAngleTime:', {
    date, angle, longitude, latitude, direction, noon,
    cosHourAngle,
    decl, eot
  });
  
  // Überprüfen, ob die Sonne den angegebenen Winkel erreicht
  if (cosHourAngle > 1) return -1; // Sonne erreicht den Winkel nicht (z.B. Polarnacht)
  if (cosHourAngle < -1) return -2; // Sonne erreicht den Winkel nicht (z.B. Mitternachtssonne)
  
  let hourAngle = radiansToDegrees(Math.acos(cosHourAngle));
  if (direction === "after") hourAngle = -hourAngle;
  
  const time = noon + hourAngle / 15;
  return time;
}

// Berechnet die Zeit eines bestimmten Gebets basierend auf der Position und Methode
function computePrayerTime(date: Date, angle: number, longitude: number, latitude: number, direction: "after" | "before", noon: number): number {
  const time = computeSunAngleTime(date, angle, longitude, latitude, direction, noon);
  return time;
}

// Berechnet den Sonnenstand zu Mittag (wenn die Sonne im Meridian steht)
function computeSolarNoon(date: Date, longitude: number): number {
  const jd = getJulianDay(date);
  const eot = equationOfTime(jd);
  const noon = 12 - eot / 60 - longitude / 15;
  return noon;
}

// Hilfsfunktion zur Konvertierung einer Dezimalzeit in eine Zeitzeichenfolge (HH:MM)
function timeToString(time: number): string {
  if (time < 0) return "––:––";
  
  const hours = Math.floor(time);
  const minutes = Math.floor((time - hours) * 60);
  
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

// Hilfsfunktion zur Anwendung von Zeitverschiebungen auf die berechneten Gebetszeiten
function applyOffsets(times: PrayerTimes, offsets: Record<string, number>): PrayerTimes {
  const result = { ...times };
  
  // Anwenden der Offsets für jedes Gebet, falls vorhanden
  for (const [prayer, offset] of Object.entries(offsets)) {
    const prayerKey = prayer as keyof Omit<PrayerTimes, 'date'>;
    if (typeof result[prayerKey] === "string" && result[prayerKey] !== "––:––") {
      const [hours, minutes] = (result[prayerKey] as string).split(":").map(Number);
      let totalMinutes = hours * 60 + minutes + offset;
      
      // Sicherstellen, dass wir im 24-Stunden-Format bleiben
      if (totalMinutes < 0) totalMinutes += 24 * 60;
      totalMinutes %= 24 * 60;
      
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      
      result[prayerKey] = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
    }
  }
  
  return result;
}

/**
 * Berechnet die Gebetszeiten für eine bestimmte Moschee und ein bestimmtes Datum
 */
export function calculatePrayerTimes(mosque: Mosque, date = new Date()): PrayerTimes {
  console.log('Calculating prayer times for mosque:', {
    longitude: mosque.longitude,
    latitude: mosque.latitude,
    type_longitude: typeof mosque.longitude,
    type_latitude: typeof mosque.latitude,
    prayer_time_calculation: mosque.prayer_time_calculation
  });
  
  if (mosque.longitude === null || mosque.latitude === null || 
      mosque.longitude === undefined || mosque.latitude === undefined ||
      isNaN(Number(mosque.longitude)) || isNaN(Number(mosque.latitude))) {
    console.warn('Invalid or missing coordinates:', mosque.longitude, mosque.latitude);
    // Rückgabe von Fallback-Werten, wenn keine Koordinaten verfügbar sind
    return {
      fajr: "––:––",
      shuruk: "––:––",
      dhuhr: "––:––",
      asr: "––:––",
      maghrib: "––:––",
      isha: "––:––",
      date
    };
  }
  
  const longitude = typeof mosque.longitude === 'number' ? mosque.longitude : parseFloat(String(mosque.longitude));
  const latitude = typeof mosque.latitude === 'number' ? mosque.latitude : parseFloat(String(mosque.latitude));
  
  console.log('Parsed coordinates:', { longitude, latitude });
  
  // Bestimme die Berechnungsmethode
  const methodName = (mosque.prayer_time_calculation as CalculationMethod) || "MWL";
  const method = methodSettings[methodName];
  
  // Berechne den Sonnenstand zu Mittag
  const noon = computeSolarNoon(date, longitude);
  
  // Berechne die einzelnen Gebetszeiten
  const fajrTime = computePrayerTime(date, method.fajr, longitude, latitude, "before", noon);
  const sunriseTime = computePrayerTime(date, 0.833, longitude, latitude, "before", noon); // Standardwinkel für Sonnenaufgang
  const dhuhrTime = noon;
  
  // Asr-Zeit (Schatten 1x oder 2x Länge)
  const sunDec = sunDeclination(getJulianDay(date));
  const asrFactor = 1; // 1 für Shafi"i (Standard), 2 für Hanafi
  const zenithDistance = Math.abs(latitude - sunDec);
  const asrAngle = radiansToDegrees(Math.atan(1 / (asrFactor + Math.tan(degreesToRadians(zenithDistance)))));
  const asrTime = computePrayerTime(date, asrAngle, longitude, latitude, "after", noon);
  
  // Maghrib (Sonnenuntergang)
  const maghribTime = computePrayerTime(date, 0.833, longitude, latitude, "after", noon);
  
  // Isha
  let ishaTime;
  if (typeof method.isha === "number" && method.isha > 30) {
    // Wenn Isha als Minuten nach Maghrib definiert ist
    ishaTime = maghribTime + method.isha / 60;
  } else {
    // Wenn Isha als Winkel definiert ist
    ishaTime = computePrayerTime(date, method.isha, longitude, latitude, "after", noon);
  }
  
  // Erstelle das Ergebnisobjekt
  const times: PrayerTimes = {
    fajr: timeToString(fajrTime),
    shuruk: timeToString(sunriseTime),
    dhuhr: timeToString(dhuhrTime),
    asr: timeToString(asrTime),
    maghrib: timeToString(maghribTime),
    isha: timeToString(ishaTime),
    date
  };
  
  // Wende Offsets an, falls vorhanden
  if (mosque.prayer_time_offsets) {
    return applyOffsets(times, mosque.prayer_time_offsets);
  }
  
  return times;
}

/**
 * Gibt die Namen der Gebete auf Deutsch zurück
 */
export function getPrayerNames(): Record<keyof Omit<PrayerTimes, "date">, string> {
  return {
    fajr: "Fajr",
    shuruk: "Sonnenaufgang",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha"
  };
}
