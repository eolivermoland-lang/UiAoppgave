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
    headers.delete('Host');
    headers.delete('Origin');
    headers.delete('Referer');

    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : null,
      redirect: 'follow'
    });

    const response = await fetch(newRequest);
    
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
