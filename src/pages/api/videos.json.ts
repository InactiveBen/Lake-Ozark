import type { APIRoute } from 'astro';
import { fetchLatestVideos } from '../../utils/fetchYouTubeVideos.js';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const videos = await fetchLatestVideos();
    
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to fetch videos' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
