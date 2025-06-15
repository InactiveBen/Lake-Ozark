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
function parseDateFromTitle(title) {
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
      
      // Video title on red bar (without date) - smaller text
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
      
      // Video title on red bar (without date) - smaller text
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
    backgroundImg.src = 'https://cdn.lakeozarkdisciples.org/media/7767E813-185B-48B7-A7C8-A5C919258FEA.jpeg';
  });
}

/**
 * Get or generate thumbnail for a video
 */
export async function getVideoThumbnail(video) {
  // Check sessionStorage for cached thumbnail first
  const cacheKey = `thumbnail_${video.id}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return cached;
  }

  // Generate new thumbnail with church background
  try {
    const generatedThumbnail = await generateThumbnail(video);
    if (generatedThumbnail) {
      // Cache in sessionStorage
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