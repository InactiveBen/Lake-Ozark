import { YouTube } from 'youtube-sr';

const customThumbnailMap = {
  "FIkeDt8Wcqw": "https://cdn-locc-org.vercel.app/images/12-29-24.png?raw=true",
  "jDp0lVpSzWI": "https://cdn-locc-org.vercel.app/images/12-24-24.png?raw=true",
  "1ffwnu_KJIA": "https://cdn-locc-org.vercel.app/images/12-15-24.png?raw=true",
  "fLRG9qGhfi0": "https://cdn-locc-org.vercel.app/images/12-8-24.png?raw=true",
  "pDzV9eAPpdE": "https://cdn-locc-org.vercel.app/images/12-1-24.png?raw=true",
  "raPRdmVIuP4": "https://cdn-locc-org.vercel.app/images/Thumbnail_Aug282023.png?raw=true",
  "I6DtUm7hjlI": "https://cdn-locc-org.vercel.app/images/The%20Courage%20of%20Faith.png?raw=true",
  "b8lPbrYl3O4": "https://cdn-locc-org.vercel.app/images/More%20Than%20Enough.png?raw=true",
  "ZU1o1US-kj8": "https://cdn-locc-org.vercel.app/images/First%20Glimpses%20of%20God.png?raw=true",
  "ySGwhmp7630": "https://cdn-locc-org.vercel.app/images/Faith%20and%20Sacrifice.png?raw=true",
  "dJFAlALIKxs": "https://cdn-locc-org.vercel.app/images/Grace%20for%20the%20Unwanted.png?raw=true",
  "jvz4ih6x_NY": "https://cdn-locc-org.vercel.app/images/Laughing%20Doubt.png?raw=true",
  "lfEnlH_z998": "https://cdn-locc-org.vercel.app/images/Promise%20of%20Blessing.png?raw=true",
  "TgJyHmQqYiA": "https://cdn-locc-org.vercel.app/images/God%20as%20Community.png?raw=true",
  "LuPsEbFND10": "https://cdn-locc-org.vercel.app/images/Where%20Will%20the%20Spirit%20Take%20You.png?raw=true",
  "yFZ-GXCi0Jk": "https://cdn-locc-org.vercel.app/images/A%20Prayer%20for%20Us.png?raw=true",
  "0FuPRt6COU4": "https://cdn-locc-org.vercel.app/images/Promised%20Support.png?raw=true",
  "e-9mEwaopaQ": "https://cdn-locc-org.vercel.app/images/The%20Way%20of%20Faith.png?raw=true",
  "lkZh3EU0LSc": "https://cdn-locc-org.vercel.app/images/Walking%20Presence.png?raw=true",
  "yjClz_yocjI": "https://cdn-locc-org.vercel.app/images/Reaching%20Thomas.png?raw=true",
  "EuNkJEFXsTo": "https://cdn-locc-org.vercel.app/images/Fully%20Alive.png?raw=true"
};

export async function fetchLatestVideos() {
  try {
    const uploadsPlaylistId = 'UUUcLKfZo5Su6-ypmt1dkPKA';
    const playlistUrl = `https://www.youtube.com/playlist?list=${uploadsPlaylistId}`;
    
    const playlist = await YouTube.getPlaylist(playlistUrl);
    
    if (!playlist || !playlist.videos) {
      throw new Error('No videos found in playlist');
    }
    
    const filteredVideos = playlist.videos.filter(video => {
      const title = video.title.toLowerCase();
      return title.includes('service') || title.includes('locc');
    });
    
    const videos = filteredVideos.map(video => {
      const videoData = {
        id: video.id,
        title: video.title,
      };
      
      if (customThumbnailMap[video.id]) {
        videoData.customThumbnail = customThumbnailMap[video.id];
      }
      
      return videoData;
    });
    
    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return getFallbackVideos();
  }
}

function getFallbackVideos() {
  return [
    { id: "KBx8zE_vLiY", title: "Service - 6/1/25" },
    { id: "MxqJCnCSmmY", title: "Service - 5/25/25" },
    { id: "0Ipo36Ea6HA", title: "Donald Paul Langley, Jr. Service" },
    { id: "JN_WDjuyWgg", title: "3-2-25 | Service" },
    { id: "5CM12KLa50g", title: "Service | 2-23-25" },
    { id: "rltClKVqN4g", title: "Service - 2/16/25" },
    { id: "VWZPFWoJhWs", title: "Service - 2/9/25" },
    { id: "8D5tujxaRlg", title: "Service - 2/2/25" },
    { id: "dmQk2bTSfR0", title: "1/26/25 - Service" },
    { id: "W2vo1E1v7xs", title: "1/19/25 - Service" }
  ];
}
