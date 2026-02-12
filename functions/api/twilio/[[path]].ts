export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  
  // CORS Headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Remove the /api/twilio prefix
  const twilioPath = url.pathname.replace(/^\/api\/twilio/, '');
  const targetUrl = `https://verify.twilio.com/v2${twilioPath}${url.search}`;

  try {
    const headers = new Headers(request.headers);
    // Remove headers that should be set by the fetch call or that might conflict
    headers.delete('Host');
    headers.delete('Origin');
    headers.delete('Referer');
    headers.delete('CF-Connecting-IP');
    headers.delete('CF-Ray');
    headers.delete('CF-Visitor');

    const requestInit: RequestInit = {
      method: request.method,
      headers: headers,
      redirect: 'follow'
    };

    // Only add body for methods that support it
    if (!['GET', 'HEAD'].includes(request.method)) {
      requestInit.body = await request.arrayBuffer();
    }

    const response = await fetch(targetUrl, requestInit);
    
    // Create new response to inject CORS headers
    const newResponse = new Response(response.body, response);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });
    
    return newResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy Error', message: error.message }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
};
