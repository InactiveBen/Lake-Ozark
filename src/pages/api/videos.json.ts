/**
 * @Author: BensonByte
 * @Date:   06/12/25 07:21:35 C5T
 * @Last Modified by:   BensonByte
 * @Last Modified time: 06/15/25 16:10:28 C3T
 */
import type { APIRoute } from 'astro';
import { fetchLatestVideos } from '../../utils/fetchYouTubeVideos.js';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const videos = await fetchLatestVideos();
    
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to fetch videos' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  }
};
