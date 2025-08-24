export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/resolve' && request.method === 'POST') {
      const body = await request.json();
      if (!body.url) {
        return new Response(JSON.stringify({ ok: false, error: 'Missing URL' }), {
          headers: { 'Content-Type': 'application/json' }, status: 400
        });
      }

      const RAPIDAPI_HOST = env.RAPIDAPI_HOST;
      const RAPIDAPI_KEY = env.RAPIDAPI_KEY;

      const apiUrl = `https://${RAPIDAPI_HOST}/instagram/post-info?url=${encodeURIComponent(body.url)}`;

      try {
        const resp = await fetch(apiUrl, {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
          }
        });
        const data = await resp.json();

        // Normalize response
        let items = [];
        if (data?.video_url) {
          items.push({ type: 'video', url: data.video_url });
        } else if (data?.display_url) {
          items.push({ type: 'image', url: data.display_url });
        } else if (Array.isArray(data?.media)) {
          items = data.media.map(m => ({ type: m.type || 'image', url: m.url || m.video_url }));
        }

        return new Response(JSON.stringify({ ok: true, result: { items } }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          headers: { 'Content-Type': 'application/json' }, status: 500
        });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
