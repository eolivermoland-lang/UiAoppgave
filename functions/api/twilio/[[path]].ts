export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  
  // Remove the /api/twilio prefix to get the path for Twilio API
  const twilioPath = url.pathname.replace(/^\/api\/twilio/, '');
  
  // Construct the target URL
  const targetUrl = `https://verify.twilio.com/v2${twilioPath}${url.search}`;

  // Clone the request with the new URL
  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow'
  });

  try {
    const response = await fetch(newRequest);
    
    // Return the response from Twilio, but we might need to handle CORS 
    // or other headers if the frontend expects them.
    // Cloudflare Pages Functions handle CORS naturally if the request comes from the same domain.
    return response;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from Twilio', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
