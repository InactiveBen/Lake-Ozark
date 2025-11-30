/**
 * Server-side liturgical calendar utility
 * Based on Disciples of Christ liturgical calendar
 * Can be used in both server-side (Astro) and client-side code
 */

const BRAND_COLORS = {
  red: '#9e1e3e',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#333333',
  lightGray: '#f8f9fa',
  mediumGray: '#e9ecef'
};

export interface LiturgicalSeason {
  season: string;
  color: string;
  message?: string;
  icon?: string;
}

/**
 * Determine liturgical season and color for a given date
 */
export function getLiturgicalSeason(date: Date): LiturgicalSeason {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const dateKey = `${year}-${month}-${day}`;
  
  // Specific dates (same every year)
  // Disciples of Christ liturgical calendar
  if (dateKey === `${year}-12-25`) {
    return { 
      season: 'Christmas', 
      color: '#ffffff',
      message: 'Have a merry Christmas from your LOCC family!',
      icon: '🎄'
    };
  }
  if (dateKey === `${year}-1-6`) {
    return { 
      season: 'Epiphany', 
      color: '#ffffff',
      message: 'Have a blessed Epiphany from your LOCC family!',
      icon: '⭐'
    };
  }
  if (dateKey === `${year}-11-1`) {
    return { 
      season: 'All Saints', 
      color: '#ffffff',
      message: 'Remembering our loved ones - blessings from your LOCC family',
      icon: '👼'
    };
  }
  
  // 2022 dates
  if (year === 2022) {
    // Advent 2022: Nov 27 - Dec 24
    if (month === 11 && day >= 27) return { season: 'Advent', color: '#2563eb', message: 'Have a blessed Advent season from your LOCC family!', icon: '🕯️' };
    if (month === 12 && day <= 24) return { season: 'Advent', color: '#2563eb', message: 'Have a blessed Advent season from your LOCC family!', icon: '🕯️' };
  }
  
  // 2023 dates
  if (year === 2023) {
    // Easter 2023: April 9, 2023
    if (dateKey === '2023-4-2') return { season: 'Palm Sunday', color: '#dc2626', message: 'Have a blessed Palm Sunday from your LOCC family!', icon: '🌴' };
    if (dateKey === '2023-4-7') return { season: 'Good Friday', color: '#dc2626', message: 'We remember together - blessings from your LOCC family', icon: '✝️' };
    if (dateKey === '2023-4-9') return { season: 'Easter', color: '#ffffff', message: 'Have a blessed Easter! He is risen! - Your LOCC family', icon: '🌸' };
    if (dateKey === '2023-5-28') return { season: 'Pentecost', color: '#dc2626', message: 'Have a blessed Pentecost from your LOCC family!', icon: '🔥' };
    
    // Advent 2023: Dec 3 - Dec 24
    if (month === 12 && day >= 3 && day <= 24) return { season: 'Advent', color: '#2563eb', message: 'Have a blessed Advent season from your LOCC family!', icon: '🕯️' };
    
    // Lent 2023: Feb 22 (Ash Wednesday) - Apr 6 (Holy Thursday)
    if (month === 2 && day >= 22) return { season: 'Lent', color: '#7c3aed', message: 'Have a blessed Lenten season from your LOCC family!', icon: '🕊️' };
    if (month === 3) return { season: 'Lent', color: '#7c3aed', message: 'Have a blessed Lenten season from your LOCC family!', icon: '🕊️' };
    if (month === 4 && day <= 6) return { season: 'Lent', color: '#7c3aed', message: 'Have a blessed Lenten season from your LOCC family!', icon: '🕊️' };
    
    // Ordinary Time 2023: Jan 9 - Feb 21, then May 29 - Dec 2
    if (month === 1 && day >= 9) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 2 && day <= 21) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 5 && day >= 29) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month >= 6 && month <= 11) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 12 && day <= 2) return { season: 'Ordinary Time', color: '#16a34a' };
  }
  
  // 2024 dates
  if (year === 2024) {
    // Easter 2024: March 31, 2024
    if (dateKey === '2024-3-24') return { season: 'Palm Sunday', color: '#dc2626', message: 'Have a blessed Palm Sunday from your LOCC family!', icon: '🌴' };
    if (dateKey === '2024-3-29') return { season: 'Good Friday', color: '#dc2626', message: 'We remember together - blessings from your LOCC family', icon: '✝️' };
    if (dateKey === '2024-3-31') return { season: 'Easter', color: '#ffffff', message: 'Have a blessed Easter! He is risen! - Your LOCC family', icon: '🌸' };
    if (dateKey === '2024-5-19') return { season: 'Pentecost', color: '#dc2626', message: 'Have a blessed Pentecost from your LOCC family!', icon: '🔥' };
    
    // Advent 2024: Dec 1 - Dec 24
    if (month === 12 && day >= 1 && day <= 24) return { season: 'Advent', color: '#2563eb', message: 'Have a blessed Advent season from your LOCC family!', icon: '🕯️' };
    
    // Lent 2024: Feb 14 (Ash Wednesday) - Mar 28 (Holy Thursday)
    if (month === 2 && day >= 14) return { season: 'Lent', color: '#7c3aed', message: 'Have a blessed Lenten season from your LOCC family!', icon: '🕊️' };
    if (month === 3 && day <= 28) return { season: 'Lent', color: '#7c3aed', message: 'Have a blessed Lenten season from your LOCC family!', icon: '🕊️' };
    
    // Ordinary Time 2024: Jan 8 - Feb 13, then May 20 - Nov 30
    if (month === 1 && day >= 8) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 2 && day <= 13) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 5 && day >= 20) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month >= 6 && month <= 10) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 11 && day <= 30) return { season: 'Ordinary Time', color: '#16a34a' };
  }
  
  // 2025 dates
  if (year === 2025) {
    // Easter 2025: April 20, 2025
    if (dateKey === '2025-4-13') return { season: 'Palm Sunday', color: '#dc2626', message: 'Have a blessed Palm Sunday from your LOCC family!', icon: '🌴' };
    if (dateKey === '2025-4-18') return { season: 'Good Friday', color: '#dc2626', message: 'We remember together - blessings from your LOCC family', icon: '✝️' };
    if (dateKey === '2025-4-20') return { season: 'Easter', color: '#ffffff', message: 'Have a blessed Easter! He is risen! - Your LOCC family', icon: '🌸' };
    if (dateKey === '2025-6-8') return { season: 'Pentecost', color: '#dc2626', message: 'Have a blessed Pentecost from your LOCC family!', icon: '🔥' };
    
    // Advent 2025: Nov 30 - Dec 24
    if (month === 11 && day >= 30) return { season: 'Advent', color: '#2563eb', message: 'Have a blessed Advent season from your LOCC family!', icon: '🕯️' };
    if (month === 12 && day <= 24) return { season: 'Advent', color: '#2563eb', message: 'Have a blessed Advent season from your LOCC family!', icon: '🕯️' };
    
    // Lent 2025: March 5 (Ash Wednesday) - April 19 (Holy Saturday)
    if (month === 3 && day >= 5) return { season: 'Lent', color: '#7c3aed', message: 'Have a blessed Lenten season from your LOCC family!', icon: '🕊️' };
    if (month === 4 && day <= 19) return { season: 'Lent', color: '#7c3aed', message: 'Have a blessed Lenten season from your LOCC family!', icon: '🕊️' };
    
    // Ordinary Time 2025: Jan 13 - March 4, then June 9 - Nov 29
    if (month === 1 && day >= 13) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 2) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 3 && day <= 4) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 6 && day >= 9) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month >= 7 && month <= 10) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 11 && day <= 29) return { season: 'Ordinary Time', color: '#16a34a' };
  }
  
  // 2026 dates
  if (year === 2026) {
    // Easter 2026: April 5, 2026
    if (dateKey === '2026-3-29') return { season: 'Palm Sunday', color: '#dc2626', message: 'Have a blessed Palm Sunday from your LOCC family!', icon: '🌴' };
    if (dateKey === '2026-4-3') return { season: 'Good Friday', color: '#dc2626', message: 'We remember together - blessings from your LOCC family', icon: '✝️' };
    if (dateKey === '2026-4-5') return { season: 'Easter', color: '#ffffff', message: 'Have a blessed Easter! He is risen! - Your LOCC family', icon: '🌸' };
    if (dateKey === '2026-5-24') return { season: 'Pentecost', color: '#dc2626', message: 'Have a blessed Pentecost from your LOCC family!', icon: '🔥' };
    
    // Advent 2026: Nov 29 - Dec 24
    if (month === 11 && day >= 29) return { season: 'Advent', color: '#2563eb', message: 'Have a blessed Advent season from your LOCC family!', icon: '🕯️' };
    if (month === 12 && day <= 24) return { season: 'Advent', color: '#2563eb', message: 'Have a blessed Advent season from your LOCC family!', icon: '🕯️' };
    
    // Lent 2026: Feb 18 (Ash Wednesday) - April 2 (Holy Thursday)
    if (month === 2 && day >= 18) return { season: 'Lent', color: '#7c3aed', message: 'Have a blessed Lenten season from your LOCC family!', icon: '🕊️' };
    if (month === 3) return { season: 'Lent', color: '#7c3aed', message: 'Have a blessed Lenten season from your LOCC family!', icon: '🕊️' };
    if (month === 4 && day <= 2) return { season: 'Lent', color: '#7c3aed', message: 'Have a blessed Lenten season from your LOCC family!', icon: '🕊️' };
    
    // Ordinary Time 2026: Jan 12 - Feb 17, then May 25 - Nov 28
    if (month === 1 && day >= 12) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 2 && day <= 17) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 5 && day >= 25) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month >= 6 && month <= 10) return { season: 'Ordinary Time', color: '#16a34a' };
    if (month === 11 && day <= 28) return { season: 'Ordinary Time', color: '#16a34a' };
  }
  
  // Default to red (brand color) if no season matches
  return { season: 'Default', color: BRAND_COLORS.red };
}

/**
 * Get banner configuration for a liturgical season
 * Only shows banners for special seasons (not Ordinary Time or Default)
 */
export function getSeasonalBannerConfig(date: Date): LiturgicalSeason | null {
  const liturgical = getLiturgicalSeason(date);
  
  // Only show banners for special seasons
  const specialSeasons = ['Christmas', 'Easter', 'Advent', 'Lent', 'Palm Sunday', 'Good Friday', 'Pentecost', 'Epiphany', 'All Saints'];
  
  if (specialSeasons.includes(liturgical.season)) {
    return liturgical;
  }
  
  return null;
}

