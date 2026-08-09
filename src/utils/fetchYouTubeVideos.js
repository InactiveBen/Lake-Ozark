const CHANNEL_ID = 'UCUcLKfZo5Su6-ypmt1dkPKA';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

const customThumbnailMap = {
  "FIkeDt8Wcqw": "https://cdn.lakeozarkdisciples.org/images/12-29-24.png?raw=true",
  "jDp0lVpSzWI": "https://cdn.lakeozarkdisciples.org/images/12-24-24.png?raw=true",
  "1ffwnu_KJIA": "https://cdn.lakeozarkdisciples.org/images/12-15-24.png?raw=true",
  "fLRG9qGhfi0": "https://cdn.lakeozarkdisciples.org/images/12-8-24.png?raw=true",
  "pDzV9eAPpdE": "https://cdn.lakeozarkdisciples.org/images/12-1-24.png?raw=true",
  "raPRdmVIuP4": "https://cdn.lakeozarkdisciples.org/images/Thumbnail_Aug282023.png?raw=true",
  "I6DtUm7hjlI": "https://cdn.lakeozarkdisciples.org/images/The%20Courage%20of%20Faith.png?raw=true",
  "b8lPbrYl3O4": "https://cdn.lakeozarkdisciples.org/images/More%20Than%20Enough.png?raw=true",
  "ZU1o1US-kj8": "https://cdn.lakeozarkdisciples.org/images/First%20Glimpses%20of%20God.png?raw=true",
  "ySGwhmp7630": "https://cdn.lakeozarkdisciples.org/images/Faith%20and%20Sacrifice.png?raw=true",
  "dJFAlALIKxs": "https://cdn.lakeozarkdisciples.org/images/Grace%20for%20the%20Unwanted.png?raw=true",
  "jvz4ih6x_NY": "https://cdn.lakeozarkdisciples.org/images/Laughing%20Doubt.png?raw=true",
  "lfEnlH_z998": "https://cdn.lakeozarkdisciples.org/images/Promise%20of%20Blessing.png?raw=true",
  "TgJyHmQqYiA": "https://cdn.lakeozarkdisciples.org/images/God%20as%20Community.png?raw=true",
  "LuPsEbFND10": "https://cdn.lakeozarkdisciples.org/images/Where%20Will%20the%20Spirit%20Take%20You.png?raw=true",
  "yFZ-GXCi0Jk": "https://cdn.lakeozarkdisciples.org/images/A%20Prayer%20for%20Us.png?raw=true",
  "0FuPRt6COU4": "https://cdn.lakeozarkdisciples.org/images/Promised%20Support.png?raw=true",
  "e-9mEwaopaQ": "https://cdn.lakeozarkdisciples.org/images/The%20Way%20of%20Faith.png?raw=true",
  "lkZh3EU0LSc": "https://cdn.lakeozarkdisciples.org/images/Walking%20Presence.png?raw=true",
  "yjClz_yocjI": "https://cdn.lakeozarkdisciples.org/images/Reaching%20Thomas.png?raw=true",
  "EuNkJEFXsTo": "https://cdn.lakeozarkdisciples.org/images/Fully%20Alive.png?raw=true"
};

function decodeXmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export function parseDateFromTitle(title) {
  const cleanTitle = title.replace(/^(Service|LOCC|Church Service)\s*[-|]\s*/i, '').replace(/\s*[-|]\s*(Service)$/i, '');

  const compactDateMatch = cleanTitle.match(/\b(\d{5,6})\b/);
  if (compactDateMatch) {
    const dateStr = compactDateMatch[1];
    let month, day, year;

    if (dateStr.length === 6) {
      month = parseInt(dateStr.substring(0, 2));
      day = parseInt(dateStr.substring(2, 4));
      year = parseInt(dateStr.substring(4, 6));
    } else if (dateStr.length === 5) {
      month = parseInt(dateStr.substring(0, 1));
      day = parseInt(dateStr.substring(1, 3));
      year = parseInt(dateStr.substring(3, 5));
    }

    if (year !== undefined) {
      year = year + 2000;
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2000) {
        const date = new Date(year, month - 1, day);
        if (date.getMonth() === month - 1 && date.getDate() === day) {
          return date;
        }
      }
    }
  }

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

export async function fetchLatestVideos() {
  try {
    const response = await fetch(RSS_URL, {
      headers: { 'Accept': 'application/xml, text/xml, */*' }
    });

    if (!response.ok) {
      throw new Error(`RSS feed returned ${response.status}`);
    }

    const xml = await response.text();

    // Extract all <entry> blocks
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const videoIdRegex = /<yt:videoId>(.*?)<\/yt:videoId>/;
    const titleRegex = /<title>([\s\S]*?)<\/title>/;
    const publishedRegex = /<published>(.*?)<\/published>/;

    const excludedVideoIds = ['-29vYs8MAhc'];
    const videos = [];
    let match;

    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1];
      const idMatch = videoIdRegex.exec(entry);
      const titleMatch = titleRegex.exec(entry);
      const publishedMatch = publishedRegex.exec(entry);

      if (!idMatch || !titleMatch) continue;

      const id = idMatch[1].trim();
      const title = decodeXmlEntities(titleMatch[1].trim());
      const publishedAt = publishedMatch ? new Date(publishedMatch[1].trim()) : null;

      if (excludedVideoIds.includes(id)) continue;

      const titleLower = title.toLowerCase();
      const isServiceVideo = titleLower.includes('service') || titleLower.includes('locc');
      if (!isServiceVideo) continue;

      const parsedDate = parseDateFromTitle(title) || publishedAt;

      const videoData = { id, title, parsedDate };
      if (customThumbnailMap[id]) {
        videoData.customThumbnail = customThumbnailMap[id];
      }

      videos.push(videoData);
    }

    // Sort newest first
    videos.sort((a, b) => {
      if (a.parsedDate && b.parsedDate) return b.parsedDate - a.parsedDate;
      if (a.parsedDate) return -1;
      if (b.parsedDate) return 1;
      return 0;
    });

    return videos.map(({ parsedDate, ...video }) => video);
  } catch (error) {
    console.error('Error fetching YouTube RSS feed:', error);
    return [];
  }
}
