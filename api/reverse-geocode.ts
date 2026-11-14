import { createHash } from 'node:crypto';

const publicHost = 'nominatim.openstreetmap.org';

async function redis(command: (string | number)[]) {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(3_000),
  });
  const data: { result?: unknown; error?: string } = await response.json();
  if (!response.ok || data.error) throw new Error('Address cache unavailable');
  return data.result;
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Use POST to look up an address.' }, { status: 405, headers: { Allow: 'POST' } });
    }
    const body = await request.json().catch(() => null);
    const latitude: unknown = body?.latitude;
    const longitude: unknown = body?.longitude;
    if (typeof latitude !== 'number' || !Number.isFinite(latitude) || Math.abs(latitude) > 90
      || typeof longitude !== 'number' || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      return Response.json({ error: 'Provide valid latitude and longitude.' }, { status: 400 });
    }

    const endpoint = process.env.NOMINATIM_REVERSE_URL?.trim();
    const userAgent = process.env.NOMINATIM_USER_AGENT?.trim();
    const unavailable = 'Address lookup is unavailable. You can enter the address manually.';
    if (!endpoint || !userAgent) return Response.json({ error: unavailable }, { status: 503 });

    try {
      const url = new URL(endpoint);
      const isPublic = url.hostname === publicHost;
      const hasRedis = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
      if (url.protocol !== 'https:' || (isPublic && !hasRedis)) {
        return Response.json({ error: unavailable }, { status: 503 });
      }

      url.search = new URLSearchParams({
        ...Object.fromEntries(url.searchParams),
        lat: latitude.toFixed(5),
        lon: longitude.toFixed(5),
        format: 'jsonv2',
        zoom: '18',
        'accept-language': 'en',
      }).toString();
      const cacheKey = 'leadlens:address:' + createHash('sha256').update(url.href).digest('hex');
      const headers = { 'Cache-Control': 'no-store' };
      if (hasRedis) {
        const cached = await redis(['GET', cacheKey]);
        if (typeof cached === 'string') return Response.json({ address: cached }, { headers });
      }
      // Hold a shared lease longer than the upstream timeout. The provider limit applies across Vercel instances.
      if (isPublic && await redis(['SET', 'leadlens:nominatim:lease', '1', 'NX', 'EX', 10]) !== 'OK') {
        return Response.json({ error: 'Address lookup is busy. Try again in a few seconds or enter the address manually.' }, { status: 429 });
      }
      const response = await fetch(url, {
        headers: { 'User-Agent': userAgent, Accept: 'application/json' },
        redirect: 'error',
        signal: AbortSignal.timeout(6_000),
      });
      if (response.status === 429) {
        return Response.json({ error: 'Address lookup is busy. Try again later or enter the address manually.' }, { status: 429 });
      }
      if (!response.ok && response.status !== 404) throw new Error('Geocoder request failed');
      const data: { display_name?: string } = response.ok ? await response.json() : {};
      const address = typeof data.display_name === 'string' ? data.display_name.trim() : '';
      if (hasRedis) await redis(['SET', cacheKey, address, 'EX', address ? 86_400 : 600]);
      return Response.json({ address }, { headers });
    } catch {
      return Response.json({ error: unavailable }, { status: 502 });
    }
  },
};
