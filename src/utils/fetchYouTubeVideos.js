/**
 * @Author: BensonByte
 * @Date:   06/12/25 07:21:35 C5T
 * @Last Modified by:   BensonByte
 * @Last Modified time: 06/15/25 16:11:48 C1T
 */
import { YouTube } from 'youtube-sr';

const customThumbnailMap = {
  "FIkeDt8Wcqw": "http://cdn.lakeozarkdisciples.org/images/12-29-24.png?raw=true",
  "jDp0lVpSzWI": "http://cdn.lakeozarkdisciples.org/images/12-24-24.png?raw=true",
  "1ffwnu_KJIA": "http://cdn.lakeozarkdisciples.org/images/12-15-24.png?raw=true",
  "fLRG9qGhfi0": "http://cdn.lakeozarkdisciples.org/images/12-8-24.png?raw=true",
  "pDzV9eAPpdE": "http://cdn.lakeozarkdisciples.org/images/12-1-24.png?raw=true",
  "raPRdmVIuP4": "http://cdn.lakeozarkdisciples.org/images/Thumbnail_Aug282023.png?raw=true",
  "I6DtUm7hjlI": "http://cdn.lakeozarkdisciples.org/images/The%20Courage%20of%20Faith.png?raw=true",
  "b8lPbrYl3O4": "http://cdn.lakeozarkdisciples.org/images/More%20Than%20Enough.png?raw=true",
  "ZU1o1US-kj8": "http://cdn.lakeozarkdisciples.org/images/First%20Glimpses%20of%20God.png?raw=true",
  "ySGwhmp7630": "http://cdn.lakeozarkdisciples.org/images/Faith%20and%20Sacrifice.png?raw=true",
  "dJFAlALIKxs": "http://cdn.lakeozarkdisciples.org/images/Grace%20for%20the%20Unwanted.png?raw=true",
  "jvz4ih6x_NY": "http://cdn.lakeozarkdisciples.org/images/Laughing%20Doubt.png?raw=true",
  "lfEnlH_z998": "http://cdn.lakeozarkdisciples.org/images/Promise%20of%20Blessing.png?raw=true",
  "TgJyHmQqYiA": "http://cdn.lakeozarkdisciples.org/images/God%20as%20Community.png?raw=true",
  "LuPsEbFND10": "http://cdn.lakeozarkdisciples.org/images/Where%20Will%20the%20Spirit%20Take%20You.png?raw=true",
  "yFZ-GXCi0Jk": "http://cdn.lakeozarkdisciples.org/images/A%20Prayer%20for%20Us.png?raw=true",
  "0FuPRt6COU4": "http://cdn.lakeozarkdisciples.org/images/Promised%20Support.png?raw=true",
  "e-9mEwaopaQ": "http://cdn.lakeozarkdisciples.org/images/The%20Way%20of%20Faith.png?raw=true",
  "lkZh3EU0LSc": "http://cdn.lakeozarkdisciples.org/images/Walking%20Presence.png?raw=true",
  "yjClz_yocjI": "http://cdn.lakeozarkdisciples.org/images/Reaching%20Thomas.png?raw=true",
  "EuNkJEFXsTo": "http://cdn.lakeozarkdisciples.org/images/Fully%20Alive.png?raw=true"
};

function parseDateFromTitle(title) {
  const cleanTitle = title.replace(/^(Service|LOCC|Church Service)\s*[-|]\s*/i, '').replace(/\s*[-|]\s*(Service)$/i, '');
  
  const patterns = [
    // Standard formats
    /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/,
    /(\d{1,2})-(\d{1,2})-(\d{2,4})/,
    
    // Full month names with optional comma
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i,
    
    // Full month names with ordinal suffixes (st, nd, rd, th) and optional comma
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(st|nd|rd|th),?\s+(\d{4})/i,
    
    // Abbreviated month names with optional comma
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})/i,
    
    // Abbreviated month names with ordinal suffixes
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
          // Format: "Month DDst/nd/rd/th, YYYY" or "Month DDst/nd/rd/th YYYY"
          day = parseInt(match[2]);
          year = parseInt(match[4]);
        } else {
          // Format: "Month DD, YYYY" or "Month DD YYYY"
          day = parseInt(match[2]);
          year = parseInt(match[3]);
        }
      } else if (pattern.source.includes('Jan|Feb')) {
        const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        month = monthAbbr.indexOf(match[1]) + 1;
        
        if (pattern.source.includes('st|nd|rd|th')) {
          // Format: "Mon DDst/nd/rd/th, YYYY" or "Mon DDst/nd/rd/th YYYY" 
          day = parseInt(match[2]);
          year = parseInt(match[4]);
        } else {
          // Format: "Mon DD, YYYY" or "Mon DD YYYY"
          day = parseInt(match[2]);
          year = parseInt(match[3]);
        }
      } else {
        // Numeric formats: MM/DD/YYYY or MM-DD-YYYY
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

export async function fetchLatestVideos() {
  try {
    const uploadsPlaylistId = 'UUUcLKfZo5Su6-ypmt1dkPKA';
    const playlistUrl = `https://www.youtube.com/playlist?list=${uploadsPlaylistId}`;
    
    let playlist;
    
    try {
      // First attempt: Fetch the playlist with fetchAll: true to get all videos
      playlist = await YouTube.getPlaylist(playlistUrl, { fetchAll: true });
    } catch (fetchAllError) {
      console.log('fetchAll failed, trying manual fetch:', fetchAllError.message);
      
      // Fallback: Manual pagination using .fetch() method
      playlist = await YouTube.getPlaylist(playlistUrl);
      if (playlist && playlist.fetch) {
        await playlist.fetch(); // Fetch remaining videos manually
      }
    }
    
    if (!playlist || !playlist.videos) {
      throw new Error('No videos found in playlist');
    }
    
    console.log(`Fetched ${playlist.videos.length} total videos from playlist`);
    
    const excludedVideoIds = ['-29vYs8MAhc'];
    
    const filteredVideos = playlist.videos.filter(video => {
      const title = video.title.toLowerCase();
      const isServiceVideo = title.includes('service') || title.includes('locc');
      const isNotExcluded = !excludedVideoIds.includes(video.id);
      return isServiceVideo && isNotExcluded;
    });
    
    console.log(`Found ${filteredVideos.length} service videos after filtering`);
    
    const videosWithDates = filteredVideos.map(video => {
      const videoData = {
        id: video.id,
        title: video.title,
        parsedDate: parseDateFromTitle(video.title)
      };
      
      if (customThumbnailMap[video.id]) {
        videoData.customThumbnail = customThumbnailMap[video.id];
      }
      
      return videoData;
    });
    
    const sortedVideos = videosWithDates.sort((a, b) => {
      if (a.parsedDate && b.parsedDate) {
        return b.parsedDate - a.parsedDate;
      }
      if (a.parsedDate && !b.parsedDate) return -1;
      if (!a.parsedDate && b.parsedDate) return 1;
      return 0;
    });
    
    const videos = sortedVideos.map(({ parsedDate, ...video }) => video);
    
    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return getFallbackVideos();
  }
}

function getFallbackVideos() {
  return [
  ];
}
