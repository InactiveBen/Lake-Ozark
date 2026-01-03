/**
 * Proxy endpoint to fetch thumbnail images with CORS headers
 * This allows canvas manipulation of images from external domains
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const imageUrl = url.searchParams.get('url');
    
    if (!imageUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }

    // Validate that the URL is from an allowed domain
    const allowedDomains = [
      'usercontent.donorkit.io',
      'cdn.lakeozarkdisciples.org',
      'img.youtube.com'
    ];
    
    const urlObj = new URL(imageUrl);
    if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return new Response('Domain not allowed', { status: 403 });
    }

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      return new Response('Failed to fetch image', { status: imageResponse.status });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Return the image with CORS headers
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
