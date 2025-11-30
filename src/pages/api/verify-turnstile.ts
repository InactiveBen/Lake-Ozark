/**
 * @file Turnstile Verification API
 * @module VerifyTurnstile
 * @description API endpoint to verify Cloudflare Turnstile tokens
 */

import type { APIRoute } from 'astro';

const TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SECRET_KEY;
const CHALLENGE_COOKIE_NAME = 'turnstile_verified';
const CHALLENGE_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check if secret key is configured
    if (!TURNSTILE_SECRET_KEY) {
      console.error('TURNSTILE_SECRET_KEY is not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await request.json();
    const token = body.token;

    if (!token || typeof token !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing token' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify token with Cloudflare
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      // Set verified cookie
      cookies.set(CHALLENGE_COOKIE_NAME, 'true', {
        maxAge: CHALLENGE_COOKIE_MAX_AGE,
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        path: '/',
      });

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Verification failed',
          'cf-errors': verifyData['error-codes'] || [],
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

