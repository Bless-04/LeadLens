import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from './reverse-geocode';

describe('reverse-geocode API handler', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('rejects non-POST methods with 405', async () => {
    const request = new Request('http://localhost/api/reverse-geocode', { method: 'GET' });
    const response = await handler.fetch(request);
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.error).toContain('Use POST');
  });

  it('returns 400 for out-of-range coordinates', async () => {
    const request = new Request('http://localhost/api/reverse-geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: 150, longitude: -76.6 }),
    });
    const response = await handler.fetch(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('valid latitude and longitude');
  });

  it('returns 503 when NOMINATIM service is not configured', async () => {
    delete process.env.NOMINATIM_REVERSE_URL;
    delete process.env.NOMINATIM_USER_AGENT;

    const request = new Request('http://localhost/api/reverse-geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: 39.29, longitude: -76.61 }),
    });
    const response = await handler.fetch(request);
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error).toContain('Address lookup is unavailable');
  });

  it('returns address for valid geocode response', async () => {
    process.env.NOMINATIM_REVERSE_URL = 'https://custom-geocoder.example.com/reverse';
    process.env.NOMINATIM_USER_AGENT = 'LeadLens/1.0';

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ display_name: '100 North Calvert St, Baltimore, MD 21202' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const request = new Request('http://localhost/api/reverse-geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: 39.2904, longitude: -76.6122 }),
    });

    const response = await handler.fetch(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.address).toBe('100 North Calvert St, Baltimore, MD 21202');
  });
});
