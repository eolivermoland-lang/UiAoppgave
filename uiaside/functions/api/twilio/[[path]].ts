export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Remove the /api/twilio prefix to get the path for Twilio API
  const twilioPath = url.pathname.replace(/^\/api\/twilio/, '');
  
  // Construct the target URL
  const targetUrl = `https://verify.twilio.com/v2${twilioPath}${url.search}`;

  // Clone headers and remove any Cloudflare-specific or problematic ones
  const headers = new Headers(request.headers);
  headers.delete('Host'); // Let fetch set the correct Host header for the target

  // Clone the request with the new URL
  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'follow'
  });

  try {
    const response = await fetch(newRequest);
    
    // Create a new response with CORS headers
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    
    return newResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from Twilio', message: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
