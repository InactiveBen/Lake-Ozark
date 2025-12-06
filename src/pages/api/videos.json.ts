/**
 * @Author: BensonByte
 * @Date:   06/12/25 07:21:35 C5T
 * @Last Modified by:   BensonByte
 * @Last Modified time: 06/15/25 17:29:36 C5T
 */
import type { APIRoute } from 'astro';
import { fetchLatestVideos } from '../../utils/fetchYouTubeVideos.js';

// Cache video results for 5 minutes to reduce API calls
// Videos don't change frequently, so short caching improves performance
const CACHE_MAX_AGE = 300; // 5 minutes in seconds
const STALE_WHILE_REVALIDATE = 600; // 10 minutes - serve stale while fetching fresh

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const videos = await fetchLatestVideos();
    
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
      },
    });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to fetch videos' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
};
