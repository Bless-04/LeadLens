import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import handler from './address-suggestions';

const search = (query: string) => handler.fetch(new Request('http://localhost/api/address-suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
}));

beforeEach(() => vi.stubEnv('GEOAPIFY_API_KEY', ''));
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

it('returns a Geoapify address outside Baltimore when configured', async () => {
  vi.stubEnv('GEOAPIFY_API_KEY', 'test-key');
  const address = '350 5th Avenue, New York, NY';
  const fetchAddresses = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    Response.json({ results: [{ formatted: address, lat: 40.7484, lon: -73.9857 }] }),
  );
  expect(await (await search('350 5th Avenue, New York')).json()).toEqual({
    provider: 'geoapify',
    suggestions: [{ address, latitude: 40.7484, longitude: -73.9857 }],
  });
  const url = new URL(String(fetchAddresses.mock.calls[0][0]));
  expect(url.origin).toBe('https://api.geoapify.com');
  expect(url.searchParams.get('text')).toBe('350 5th Avenue, New York');
  expect(url.searchParams.get('apiKey')).toBe('test-key');
  expect(url.searchParams.has('type')).toBe(false);
});

it('finds address prefixes and returns coordinates for selecting a pin', async () => {
  const feature = { attributes: { full_addr: '100 N CALVERT ST' }, geometry: { x: -76.6128, y: 39.2908 } };
  const fetchAddresses = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json({ features: [feature, feature] }));
  const response = await search(' 100 n cal ');
  expect(await response.json()).toEqual({
    suggestions: [{ address: '100 N CALVERT ST, Baltimore, MD', latitude: 39.2908, longitude: -76.6128 }],
  });
  const url = new URL(String(fetchAddresses.mock.calls[0][0]));
  expect(url.searchParams.get('where')).toBe("full_addr LIKE '100 N CAL%'");
});

it('skips short and unsupported prefixes', async () => {
  const fetchAddresses = vi.spyOn(globalThis, 'fetch');
  for (const query of ['100', '100 N_%']) {
    expect(await (await search(query)).json()).toEqual({ suggestions: [] });
  }
  expect(fetchAddresses).not.toHaveBeenCalled();
});

it.each([
  ['Calvert', "full_addr LIKE '% CALVERT%'"],
  ['100 North Calvert Street', "full_addr LIKE '100 N CALVERT ST%'"],
])('looks up %s in the city address data', async (query, where) => {
  const fetchAddresses = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json({ features: [] }));
  await search(query);
  const url = new URL(String(fetchAddresses.mock.calls[0][0]));
  expect(url.searchParams.get('where')).toBe(where);
});

it('returns a manual-entry fallback when the address service fails', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 503 }));
  expect((await search('100 N CAL')).status).toBe(502);
});
