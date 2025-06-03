import { YouTube } from 'youtube-sr';

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
    
    const videos = filteredVideos.map(video => ({
      id: video.id,
      title: video.title,
    }));
    
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
