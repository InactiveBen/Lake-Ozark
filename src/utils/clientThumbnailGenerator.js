/**
 * @Author: BensonByte
 * @Date:   06/15/25 16:36:15 C0T
 * @Last Modified by:   BensonByteyte @Last Modified time:  06/15/25 16:51:57 C5TC5T

/**
 * Client-side thumbnail generator for YouTube videos
 * Generates branded thumbnails dynamically and stores in sessionStorage
 */

// Brand colors
const BRAND_COLORS = {
  red: '#9e1e3e',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#333333',
  lightGray: '#f8f9fa',
  mediumGray: '#e9ecef'
};

/**
 * Parse date from video title (client-side version)
 */
export function parseDateFromTitle(title) {
  const cleanTitle = title.replace(/^(Service|LOCC|Church Service)\s*[-|]\s*/i, '').replace(/\s*[-|]\s*(Service)$/i, '');
  
  const patterns = [
    /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/,
    /(\d{1,2})-(\d{1,2})-(\d{2,4})/,
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i,
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(st|nd|rd|th),?\s+(\d{4})/i,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})/i,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})(st|nd|rd|th),?\s+(\d{4})/i
  ];
  
  for (const pattern of patterns) {
    const match = cleanTitle.match(pattern);
    if (match) {
      let month, day, year;
      
      if (pattern.source.includes('January|February')) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        month = monthNames.indexOf(match[1]) + 1;
        
        if (pattern.source.includes('st|nd|rd|th')) {
          day = parseInt(match[2]);
          year = parseInt(match[4]);
        } else {
          day = parseInt(match[2]);
          year = parseInt(match[3]);
        }
      } else if (pattern.source.includes('Jan|Feb')) {
        const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        month = monthAbbr.indexOf(match[1]) + 1;
        
        if (pattern.source.includes('st|nd|rd|th')) {
          day = parseInt(match[2]);
          year = parseInt(match[4]);
        } else {
          day = parseInt(match[2]);
          year = parseInt(match[3]);
        }
      } else {
        month = parseInt(match[1]);
        day = parseInt(match[2]);
        year = parseInt(match[3]);
      }
      
      if (year < 50) year += 2000;
      else if (year < 100) year += 1900;
      
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900) {
        return new Date(year, month - 1, day);
      }
    }
  }
  
  return null;
}

/**
 * Determine liturgical season and color for a given date
 */
export function getLiturgicalSeason(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const dateKey = `${year}-${month}-${day}`;
  
  // Specific dates (same every year)
  // Disciples of Christ liturgical calendar
  if (dateKey === `${year}-12-25`) return { season: 'Christmas', color: '#ffffff' }; // White (Disciples use White, not Gold)
  if (dateKey === `${year}-1-6`) return { season: 'Epiphany', color: '#ffffff' }; // White (Disciples use White)
  if (dateKey === `${year}-11-1`) return { season: 'All Saints', color: '#ffffff' }; // White or Gold (using White for consistency)
  
  // 2022 dates
  if (year === 2022) {
    // Advent 2022: Nov 27 - Dec 24
    if (month === 11 && day >= 27) return { season: 'Advent', color: '#2563eb' }; // Blue
    if (month === 12 && day <= 24) return { season: 'Advent', color: '#2563eb' }; // Blue
  }
  
  // 2023 dates (note: Lent and Easter are in 2023 but span into 2024)
  if (year === 2023) {
    // Easter 2023: April 9, 2023
    if (dateKey === '2023-4-2') return { season: 'Palm Sunday', color: '#dc2626' }; // Red (April 2, 2023)
    if (dateKey === '2023-4-7') return { season: 'Good Friday', color: '#dc2626' }; // Red (Disciples use Red, not Black)
    if (dateKey === '2023-4-9') return { season: 'Easter', color: '#ffffff' }; // White (Disciples use White, not Gold)
    if (dateKey === '2023-5-28') return { season: 'Pentecost', color: '#dc2626' }; // Red (May 28, 2023)
    
    // Advent 2023: Dec 3 - Dec 24
    if (month === 12 && day >= 3 && day <= 24) return { season: 'Advent', color: '#2563eb' }; // Blue
    
    // Lent 2023: Feb 22 (Ash Wednesday) - Apr 6 (Holy Thursday)
    if (month === 2 && day >= 22) return { season: 'Lent', color: '#7c3aed' }; // Purple
    if (month === 3) return { season: 'Lent', color: '#7c3aed' }; // Purple
    if (month === 4 && day <= 6) return { season: 'Lent', color: '#7c3aed' }; // Purple
    
    // Ordinary Time 2023: Jan 9 - Feb 21, then May 29 - Dec 2
    if (month === 1 && day >= 9) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 2 && day <= 21) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 5 && day >= 29) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month >= 6 && month <= 11) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 12 && day <= 2) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
  }
  
  // 2024 dates (note: Lent and Easter are in 2024 but span into 2025)
  if (year === 2024) {
    // Easter 2024: March 31, 2024
    if (dateKey === '2024-3-24') return { season: 'Palm Sunday', color: '#dc2626' }; // Red (March 24, 2024)
    if (dateKey === '2024-3-29') return { season: 'Good Friday', color: '#dc2626' }; // Red (Disciples use Red, not Black)
    if (dateKey === '2024-3-31') return { season: 'Easter', color: '#ffffff' }; // White (Disciples use White, not Gold)
    if (dateKey === '2024-5-19') return { season: 'Pentecost', color: '#dc2626' }; // Red (May 19, 2024)
    
    // Advent 2024: Dec 1 - Dec 24
    if (month === 12 && day >= 1 && day <= 24) return { season: 'Advent', color: '#2563eb' }; // Blue
    
    // Lent 2024: Feb 14 (Ash Wednesday) - Mar 28 (Holy Thursday)
    if (month === 2 && day >= 14) return { season: 'Lent', color: '#7c3aed' }; // Purple
    if (month === 3 && day <= 28) return { season: 'Lent', color: '#7c3aed' }; // Purple
    
    // Ordinary Time 2024: Jan 8 - Feb 13, then May 20 - Nov 30
    if (month === 1 && day >= 8) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 2 && day <= 13) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 5 && day >= 20) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month >= 6 && month <= 10) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 11 && day <= 30) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
  }
  
  // 2025 dates
  if (year === 2025) {
    // Easter 2025: April 20, 2025
    if (dateKey === '2025-4-13') return { season: 'Palm Sunday', color: '#dc2626' }; // Red (April 13, 2025)
    if (dateKey === '2025-4-18') return { season: 'Good Friday', color: '#dc2626' }; // Red (Disciples use Red, not Black)
    if (dateKey === '2025-4-20') return { season: 'Easter', color: '#ffffff' }; // White (Disciples use White, not Gold)
    if (dateKey === '2025-6-8') return { season: 'Pentecost', color: '#dc2626' }; // Red (June 8, 2025)
    
    // Advent 2025: Nov 30 - Dec 24
    if (month === 11 && day >= 30) return { season: 'Advent', color: '#2563eb' }; // Blue
    if (month === 12 && day <= 24) return { season: 'Advent', color: '#2563eb' }; // Blue
    
    // Lent 2025: March 5 (Ash Wednesday) - April 19 (Holy Saturday)
    if (month === 3 && day >= 5) return { season: 'Lent', color: '#7c3aed' }; // Purple
    if (month === 4 && day <= 19) return { season: 'Lent', color: '#7c3aed' }; // Purple
    
    // Ordinary Time 2025: Jan 13 - March 4, then June 9 - Nov 29
    if (month === 1 && day >= 13) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 2) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 3 && day <= 4) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 6 && day >= 9) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month >= 7 && month <= 10) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 11 && day <= 29) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
  }
  
  // 2026 dates
  if (year === 2026) {
    // Easter 2026: April 5, 2026
    if (dateKey === '2026-3-29') return { season: 'Palm Sunday', color: '#dc2626' }; // Red (March 29, 2026)
    if (dateKey === '2026-4-3') return { season: 'Good Friday', color: '#dc2626' }; // Red (Disciples use Red, not Black)
    if (dateKey === '2026-4-5') return { season: 'Easter', color: '#ffffff' }; // White (Disciples use White, not Gold)
    if (dateKey === '2026-5-24') return { season: 'Pentecost', color: '#dc2626' }; // Red (May 24, 2026)
    
    // Advent 2026: Nov 29 - Dec 24
    if (month === 11 && day >= 29) return { season: 'Advent', color: '#2563eb' }; // Blue
    if (month === 12 && day <= 24) return { season: 'Advent', color: '#2563eb' }; // Blue
    
    // Lent 2026: Feb 18 (Ash Wednesday) - April 2 (Holy Thursday)
    if (month === 2 && day >= 18) return { season: 'Lent', color: '#7c3aed' }; // Purple
    if (month === 3) return { season: 'Lent', color: '#7c3aed' }; // Purple
    if (month === 4 && day <= 2) return { season: 'Lent', color: '#7c3aed' }; // Purple
    
    // Ordinary Time 2026: Jan 12 - Feb 17, then May 25 - Nov 28
    if (month === 1 && day >= 12) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 2 && day <= 17) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 5 && day >= 25) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month >= 6 && month <= 10) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
    if (month === 11 && day <= 28) return { season: 'Ordinary Time', color: '#16a34a' }; // Green
  }
  
  // Default to red (brand color) if no season matches
  return { season: 'Default', color: BRAND_COLORS.red };
}

/**
 * Create a simple logo using canvas (client-side)
 */
function createLogo(size = 120) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background circle
  ctx.fillStyle = BRAND_COLORS.red;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - 6, 0, 2 * Math.PI);
  ctx.fill();

  // White border
  ctx.strokeStyle = BRAND_COLORS.white;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Cross symbol
  ctx.strokeStyle = BRAND_COLORS.white;
  ctx.lineWidth = Math.max(6, size/20);
  ctx.lineCap = 'round';
  
  // Vertical line of cross
  ctx.beginPath();
  ctx.moveTo(size/2, size * 0.25);
  ctx.lineTo(size/2, size * 0.6);
  ctx.stroke();
  
  // Horizontal line of cross
  ctx.beginPath();
  ctx.moveTo(size * 0.35, size * 0.4);
  ctx.lineTo(size * 0.65, size * 0.4);
  ctx.stroke();

  // Text "LOCC"
  ctx.fillStyle = BRAND_COLORS.white;
  ctx.font = `bold ${Math.max(12, size/10)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LOCC', size/2, size * 0.75);

  return canvas;
}

/**
 * Generate a thumbnail for a video
 */
export function generateThumbnail(video, options = {}) {
  const {
    width = 480,  // Smaller for client-side performance
    height = 270,
    pastor = "Rev. Ron Trimmer"
  } = options;

  // Parse date from title
  const parsedDate = parseDateFromTitle(video.title);
  if (!parsedDate) {
    console.warn(`Could not parse date from title: ${video.title}`);
    return null;
  }

  const normalizedDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 0, 0, 0, 0);
  const liturgical = getLiturgicalSeason(normalizedDate);

  // Format date
  const formattedDate = parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get the day of the week
  const dayOfWeek = parsedDate.toLocaleDateString('en-US', { weekday: 'long' });

  return new Promise((resolve) => {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Add roundRect polyfill if not available (for older browsers)
    if (!ctx.roundRect) {
      ctx.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
      };
    }

    // Load the church background image
    const backgroundImg = new Image();
    backgroundImg.crossOrigin = 'anonymous';
    
    backgroundImg.onload = function() {
      // Draw the background image with proper aspect ratio (cover behavior)
      const imgAspect = backgroundImg.width / backgroundImg.height;
      const canvasAspect = width / height;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imgAspect > canvasAspect) {
        // Image is wider than canvas - fit height and crop width
        drawHeight = height;
        drawWidth = height * imgAspect;
        drawX = (width - drawWidth) / 2;
        drawY = 0;
      } else {
        // Image is taller than canvas - fit width and crop height
        drawWidth = width;
        drawHeight = width / imgAspect;
        drawX = 0;
        drawY = (height - drawHeight) / 2;
      }
      
      ctx.drawImage(backgroundImg, drawX, drawY, drawWidth, drawHeight);
      
      // Create shadow blur overlay from the left side
      const shadowGradient = ctx.createLinearGradient(0, 0, width * 0.65, 0);
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      shadowGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.4)');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadowGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add liturgical season tag in top right corner (if not default)
      if (liturgical.season !== 'Default') {
        const tagPadding = 8;
        const tagFontSize = Math.max(12, height * 0.04);
        ctx.font = `bold ${tagFontSize}px Arial, sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        
        // Measure text width
        const tagText = liturgical.season;
        const textMetrics = ctx.measureText(tagText);
        const tagWidth = textMetrics.width + tagPadding * 2;
        const tagHeight = tagFontSize + tagPadding * 2;
        const tagX = width - 10; // 10px from right edge
        const tagY = 10; // 10px from top
        
        // Draw tag background with liturgical color
        ctx.fillStyle = liturgical.color;
        ctx.beginPath();
        ctx.roundRect(tagX - tagWidth, tagY, tagWidth, tagHeight, 4);
        ctx.fill();
        
        // Draw white text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(tagText, tagX - tagPadding, tagY + tagPadding);
      }
      
      // Text positioning on the left side - moved to a better position
      const textX = width * 0.08;
      
      // Day of week service text with shadow - moved up slightly
      ctx.fillStyle = BRAND_COLORS.white;
      ctx.font = `bold ${height * 0.12}px Arial, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(`${dayOfWeek} Service`, textX, height * 0.16);
      
      // Date text - moved up slightly
      ctx.font = `bold ${height * 0.09}px Arial, sans-serif`;
      ctx.fillText(formattedDate, textX, height * 0.27);
      
      // Reset shadow for bottom bar
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Bottom red bar - made smaller from 0.18 to 0.14
      const barHeight = height * 0.14;
      ctx.fillStyle = BRAND_COLORS.red;
      ctx.fillRect(0, height - barHeight, width, barHeight);
      
      // Video title on bar (without date) - smaller text
      let displayTitle = video.title;
      
      // Remove date patterns from title for cleaner display
      const datePatterns = [
        /\s*[-|]\s*\d{1,2}\/\d{1,2}\/\d{2,4}/g,
        /\s*[-|]\s*\d{1,2}-\d{1,2}-\d{2,4}/g,
        /\s*[-|]\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}/gi,
        /\s*[-|]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}/gi,
        /\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}\s*[-|]?\s*/gi,
        /\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}\s*[-|]?\s*/gi,
        /\s*\d{1,2}\/\d{1,2}\/\d{2,4}\s*[-|]?\s*/g,
        /\s*\d{1,2}-\d{1,2}-\d{2,4}\s*[-|]?\s*/g
      ];
      
      datePatterns.forEach(pattern => {
        displayTitle = displayTitle.replace(pattern, '');
      });
      
      // Clean up any remaining separators at start/end
      displayTitle = displayTitle.replace(/^[-|]\s*/, '').replace(/\s*[-|]$/, '').trim();
      
      // If title is too long, truncate it
      if (displayTitle.length > 45) {
        displayTitle = displayTitle.substring(0, 42) + '...';
      }
      
      ctx.fillStyle = BRAND_COLORS.white;
      ctx.font = `bold ${height * 0.06}px Arial, sans-serif`; // Smaller font from 0.07 to 0.06
      ctx.textAlign = 'center';
      ctx.fillText(displayTitle, width/2, height - barHeight/2);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(dataUrl);
    };
    
    backgroundImg.onerror = function() {
      console.warn('Failed to load church background image, using fallback');
      
      // Fallback to gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, BRAND_COLORS.lightGray);
      gradient.addColorStop(1, BRAND_COLORS.mediumGray);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Text positioning - moved to a better position
      const textX = width * 0.08;
      
      // Day of week service text - moved up slightly
      ctx.fillStyle = BRAND_COLORS.darkGray;
      ctx.font = `bold ${height * 0.12}px Arial, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${dayOfWeek} Service`, textX, height * 0.23);
      
      // Date text - moved up slightly
      ctx.font = `bold ${height * 0.09}px Arial, sans-serif`;
      ctx.fillText(formattedDate, textX, height * 0.36);
      
      // Bottom red bar - made smaller from 0.18 to 0.14
      const barHeight = height * 0.14;
      ctx.fillStyle = BRAND_COLORS.red;
      ctx.fillRect(0, height - barHeight, width, barHeight);
      
      // Video title on bar (without date) - smaller text
      let displayTitle = video.title;
      
      // Remove date patterns from title for cleaner display
      const datePatterns = [
        /\s*[-|]\s*\d{1,2}\/\d{1,2}\/\d{2,4}/g,
        /\s*[-|]\s*\d{1,2}-\d{1,2}-\d{2,4}/g,
        /\s*[-|]\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}/gi,
        /\s*[-|]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}/gi,
        /\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}\s*[-|]?\s*/gi,
        /\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}\s*[-|]?\s*/gi,
        /\s*\d{1,2}\/\d{1,2}\/\d{2,4}\s*[-|]?\s*/g,
        /\s*\d{1,2}-\d{1,2}-\d{2,4}\s*[-|]?\s*/g
      ];
      
      datePatterns.forEach(pattern => {
        displayTitle = displayTitle.replace(pattern, '');
      });
      
      // Clean up any remaining separators at start/end
      displayTitle = displayTitle.replace(/^[-|]\s*/, '').replace(/\s*[-|]$/, '').trim();
      
      // If title is too long, truncate it
      if (displayTitle.length > 45) {
        displayTitle = displayTitle.substring(0, 42) + '...';
      }
      
      ctx.fillStyle = BRAND_COLORS.white;
      ctx.font = `bold ${height * 0.06}px Arial, sans-serif`; // Smaller font from 0.07 to 0.06
      ctx.textAlign = 'center';
      ctx.fillText(displayTitle, width/2, height - barHeight/2);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(dataUrl);
    };
    
    // Start loading the background image
    backgroundImg.src = 'https://usercontent.donorkit.io/clients/LOCC/7767E813-185B-48B7-A7C8-A5C919258FEA%20(1).jpeg';
  });
}

/**
 * Get or generate thumbnail for a video
 */
export async function getVideoThumbnail(video) {
  // Parse date to determine liturgical season (for cache key) - only calculate once
  const parsedDate = parseDateFromTitle(video.title);
  let seasonKey = 'default';
  if (parsedDate) {
    const normalizedDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 0, 0, 0, 0);
    const liturgical = getLiturgicalSeason(normalizedDate);
    seasonKey = liturgical.season.toLowerCase().replace(/\s+/g, '-');
  }
  
  // Check sessionStorage for cached thumbnail first (include season in cache key)
  const cacheKey = `thumbnail_${video.id}_${seasonKey}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return cached;
  }

  // Generate new thumbnail with church background
  try {
    const generatedThumbnail = await generateThumbnail(video);
    if (generatedThumbnail) {
      // Cache in sessionStorage - reuse the already calculated cacheKey
      try {
        sessionStorage.setItem(cacheKey, generatedThumbnail);
      } catch (e) {
        console.warn('Failed to cache thumbnail in sessionStorage:', e);
      }
      return generatedThumbnail;
    }
  } catch (error) {
    console.warn('Failed to generate thumbnail:', error);
  }

  // Fallback to YouTube thumbnail
  return `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
}

/**
 * Preload thumbnails for a list of videos (non-blocking)
 */
export function preloadThumbnails(videos) {
  // Use requestIdleCallback for better performance
  if (window.requestIdleCallback) {
    window.requestIdleCallback(async () => {
      for (const video of videos) {
        try {
          await getVideoThumbnail(video);
        } catch (error) {
          console.warn(`Failed to preload thumbnail for ${video.id}:`, error);
        }
      }
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(async () => {
      for (const video of videos) {
        try {
          await getVideoThumbnail(video);
        } catch (error) {
          console.warn(`Failed to preload thumbnail for ${video.id}:`, error);
        }
      }
    }, 100);
  }
} 