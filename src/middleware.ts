/**
 * @file Site Middleware
 * @module Middleware
 * @description Middleware that tracks requests and shows Cloudflare Turnstile challenge
 * after 10 requests from the same IP.
 */

import type { MiddlewareHandler } from 'astro';

// ============================================================================
// Configuration
// ============================================================================

const TURNSTILE_SITE_KEY = '0x4AAAAAACDxELqL03gteMgN';
const MAX_REQUESTS_BEFORE_CHALLENGE = 10;
const CHALLENGE_COOKIE_NAME = 'turnstile_verified';
const CHALLENGE_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// ============================================================================
// Request Tracking Store (In-Memory)
// ============================================================================

interface RequestTracker {
  count: number;
  resetTime: number;
  verified: boolean;
}

const requestStore = new Map<string, RequestTracker>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requestStore.entries()) {
    if (entry.resetTime < now && !entry.verified) {
      requestStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

// ============================================================================
// Utility Functions
// ============================================================================

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

function getTrackerKey(ip: string): string {
  return `ip:${ip}`;
}

function getRequestCount(ip: string): RequestTracker {
  const key = getTrackerKey(ip);
  const now = Date.now();
  
  let tracker = requestStore.get(key);
  
  if (!tracker || (tracker.resetTime < now && !tracker.verified)) {
    // Create new tracker or reset expired one
    tracker = {
      count: 0,
      resetTime: now + (60 * 60 * 1000), // Reset after 1 hour
      verified: false,
    };
    requestStore.set(key, tracker);
  }
  
  return tracker;
}

function incrementRequestCount(ip: string): RequestTracker {
  const tracker = getRequestCount(ip);
  tracker.count++;
  return tracker;
}

function markAsVerified(ip: string): void {
  const tracker = getRequestCount(ip);
  tracker.verified = true;
  tracker.count = 0; // Reset count after verification
}

// ============================================================================
// Challenge Page HTML
// ============================================================================

function getChallengePageHTML(originalUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Required - Lake Ozark Christian Church</title>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #ffffff;
      min-height: 100vh;
    }
    .section {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 96px 24px;
    }
    h1 {
      font-size: 3.75rem;
      font-weight: 700;
      color: #9e1e3e;
      margin-bottom: 1rem;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }
    p {
      color: #4b5563;
      margin-bottom: 1.5rem;
      max-width: 36rem;
      line-height: 1.6;
    }
    .turnstile-container {
      display: flex;
      justify-content: center;
      margin: 2rem 0;
    }
    .error {
      color: #dc2626;
      margin-top: 1rem;
      font-size: 0.875rem;
      display: none;
    }
    .error.show {
      display: block;
    }
    .loading {
      color: #4b5563;
      margin-top: 1rem;
      font-size: 0.875rem;
      display: none;
    }
    .loading.show {
      display: block;
    }
  </style>
</head>
<body>
  <section class="section">
    <h2>Verification Required</h2>
    <p>
      Please complete the verification below to continue browsing our website.
    </p>
    <div class="turnstile-container">
      <div class="cf-turnstile" data-sitekey="${TURNSTILE_SITE_KEY}" data-callback="onTurnstileSuccess" data-error-callback="onTurnstileError"></div>
    </div>
    <div class="error" id="error"></div>
    <div class="loading" id="loading">Verifying...</div>
  </section>
  <script>
    let verified = false;
    
    function onTurnstileSuccess(token) {
      if (verified) return;
      verified = true;
      
      document.getElementById('error').classList.remove('show');
      document.getElementById('loading').classList.add('show');
      
      // Submit the token to verify
      fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Redirect to original URL
          window.location.href = '${originalUrl}';
        } else {
          document.getElementById('loading').classList.remove('show');
          document.getElementById('error').classList.add('show');
          document.getElementById('error').textContent = 'Verification failed. Please try again.';
          verified = false;
          // Reset Turnstile
          if (window.turnstile) {
            window.turnstile.reset();
          }
        }
      })
      .catch(error => {
        console.error('Verification error:', error);
        document.getElementById('loading').classList.remove('show');
        document.getElementById('error').classList.add('show');
        document.getElementById('error').textContent = 'An error occurred. Please try again.';
        verified = false;
        if (window.turnstile) {
          window.turnstile.reset();
        }
      });
    }
    
    function onTurnstileError() {
      document.getElementById('error').classList.add('show');
      document.getElementById('error').textContent = 'Verification failed. Please try again.';
      verified = false;
    }
  </script>
</body>
</html>`;
}

// ============================================================================
// Main Middleware
// ============================================================================

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const ip = getClientIP(request);
  
  // Skip challenge page and API endpoints
  if (url.pathname === '/challenge' || url.pathname.startsWith('/api/')) {
    return next();
  }
  
  // Check if user has verified cookie
  const verifiedCookie = context.cookies.get(CHALLENGE_COOKIE_NAME);
  if (verifiedCookie?.value === 'true') {
    // User is verified, mark in tracker and allow request
    markAsVerified(ip);
    return next();
  }
  
  // User doesn't have verified cookie - show challenge immediately
  // Track requests as a fallback (if they somehow bypass cookie check, show after 10 requests)
  const tracker = incrementRequestCount(ip);
  
  // Show challenge immediately if no verified cookie
  // Also show if they've made more than MAX_REQUESTS_BEFORE_CHALLENGE requests (fallback)
  if (!tracker.verified || tracker.count > MAX_REQUESTS_BEFORE_CHALLENGE) {
    // Show challenge page
    return new Response(getChallengePageHTML(url.href), {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
  
  // Allow request to proceed (fallback - shouldn't normally reach here)
  return next();
}; 

// Intentional syntax error for testing deployment notifications
const intentionalError = {
  thisWillFail: true
  // Missing comma - will cause build to fail
  missingComma: 'error'
};

