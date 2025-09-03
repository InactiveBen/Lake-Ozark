/**
 * @Author: BensonByte
 * @Date:   09/03/25 15:25:27 C1T
 * @Last Modified by:   BensonByte
 * @Last Modified time: 09/03/25 15:26:00 C4T
 */
interface GeoResponse {
  country_code: string;
  country_name: string;
  region: string;
  city: string;
  county?: string;  // Optional since not all geo APIs provide county
  latitude: string;
  longitude: string;
  ip: string;
  gdpr: boolean;
  cpa: boolean;
  lgpd: boolean;
  pipeda: boolean;
  appa: boolean;
  language: string;
  timezone: string;
  asn: number;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Lake Ozark coordinates
const LAKE_OZARK_LAT = 38.1981839;
const LAKE_OZARK_LON = -92.6386717;

// Cities within approximately 50 miles of Lake Ozark, MO
export const LOCAL_CITIES = [
  // Lake Area Core
  'Lake Ozark',
  'Osage Beach',
  'Camdenton',
  'Sunrise Beach',
  'Village of Four Seasons',
  'Rocky Mount',
  'Lakeside',
  'Linn Creek',
  'Eldon',
  'Kaiser',
  'Laurie',
  'Versailles',
  'Gravois Mills',
  'Stover',
  'Tuscumbia',

  // Nearby Cities
  'Lebanon',
  'Richland',
  'Iberia',
  'Brumley',
  'Montreal',
  'Climax Springs',
  'Macks Creek',
  'Barnett',
  'Cole Camp',
  'Lincoln',
  'Warsaw',
  'Edwards',
  'Fortuna',
  'California',
  'Tipton',
];

// Counties considered local to Lake Ozark
export const LOCAL_COUNTIES = [
  'Camden',
  'Miller',
  'Morgan',
  'Benton',
  'Laclede',
  'Pulaski',
  'Cole',
  'Moniteau',
  'Cooper',
  'Pettis',
];

interface VisitorInfo {
  isLocal: boolean;
  distance?: number;
  reason: string;
}

export async function isLocalVisitor(): Promise<boolean> {
  const info = await getVisitorInfo();
  
  // Log visitor info for debugging
  console.log('[GEO] Visitor Info:', {
    ...info,
    distance: info.distance ? `${Math.round(info.distance)} miles` : 'unknown'
  });
  
  return info.isLocal;
}

export async function getVisitorInfo(): Promise<VisitorInfo> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://geo.locc.us/where', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return {
        isLocal: false,
        reason: 'API request failed'
      };
    }
    
    const data = await response.json() as GeoResponse;

    // If not in the US, definitely not local
    if (data.country_code !== 'US') {
      return {
        isLocal: false,
        reason: `Visitor from ${data.country_name}`
      };
    }

    // If in Missouri, do detailed checks
    if (data.region === 'Missouri') {
      // Check if in a known local city
      const visitorCity = data.city?.trim().toLowerCase();
      const isLocalCity = LOCAL_CITIES.some(city => 
        city.toLowerCase() === visitorCity
      );

      if (isLocalCity) {
        return {
          isLocal: true,
          reason: `Known local city: ${data.city}`
        };
      }

      // Check if in a known local county
      const visitorCounty = data.county?.trim().toLowerCase();
      const isLocalCounty = visitorCounty && LOCAL_COUNTIES.some(county =>
        county.toLowerCase() === visitorCounty
      );

      if (isLocalCounty) {
        return {
          isLocal: true,
          reason: `Known local county: ${data.county}`
        };
      }

      // If we have coordinates, check distance
      if (data.latitude && data.longitude) {
        const distance = calculateDistance(
          parseFloat(data.latitude),
          parseFloat(data.longitude),
          LAKE_OZARK_LAT,
          LAKE_OZARK_LON
        );

        // If within 50 miles, consider them local
        if (distance <= 50) {
          return {
            isLocal: true,
            distance,
            reason: `Within 50 miles of Lake Ozark (${Math.round(distance)} miles)`
          };
        }

        return {
          isLocal: false,
          distance,
          reason: `Missouri location but too far (${Math.round(distance)} miles)`
        };
      }

      return {
        isLocal: false,
        reason: `Unknown Missouri location: ${data.city}`
      };
    }

    return {
      isLocal: false,
      reason: `Out of state visitor from ${data.region}`
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        isLocal: false,
        reason: 'Location check timed out'
      };
    }
    
    return {
      isLocal: false,
      reason: `Error: ${error.message}`
    };
  }
}
