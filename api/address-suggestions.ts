const addressPoints = 'https://baltegis.baltimorecity.gov/mapping/rest/services/Address_Points/AddressPoint_Native/FeatureServer/0/query';

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Use POST to search addresses.' }, { status: 405, headers: { Allow: 'POST' } });
    }
    const body = await request.json().catch(() => null);
    const input = typeof body?.query === 'string' ? body.query.trim().replace(/\s+/g, ' ') : '';
    if (input.length < 3 || input.length > 160 || !/\p{L}/u.test(input)) {
      return Response.json({ suggestions: [] });
    }

    const key = process.env.GEOAPIFY_API_KEY?.trim();
    if (key) return searchGeoapify(input, key);

    const query = normalizeAddressQuery(input);
    if (!query) return Response.json({ suggestions: [] });

    const url = new URL(addressPoints);
    url.search = new URLSearchParams({
      where: `full_addr LIKE '${/^\d/.test(query) ? '' : '% '}${query.replace(/'/g, "''")}%'`,
      outFields: 'full_addr',
      outSR: '4326',
      resultRecordCount: '8',
      f: 'json',
    }).toString();

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error('Address service failed');
      const data: { features?: { attributes?: { full_addr?: string }; geometry?: { x?: number; y?: number } }[] } = await response.json();
      if (!Array.isArray(data.features)) throw new Error('Invalid address service response');
      const seen = new Set<string>();
      const suggestions = data.features.flatMap(({ attributes, geometry }) => {
        const address = attributes?.full_addr?.trim();
        const latitude = geometry?.y;
        const longitude = geometry?.x;
        if (!address || seen.has(address) || typeof latitude !== 'number' || !Number.isFinite(latitude) || Math.abs(latitude) > 90
          || typeof longitude !== 'number' || !Number.isFinite(longitude) || Math.abs(longitude) > 180) return [];
        seen.add(address);
        return [{ address: `${address}, Baltimore, MD`, latitude, longitude }];
      });
      return Response.json({ suggestions }, { headers: { 'Cache-Control': 'no-store' } });
    } catch {
      return Response.json({ error: 'Address suggestions are unavailable. You can enter an address manually.' }, { status: 502 });
    }
  },
};

async function searchGeoapify(text: string, key: string) {
  const url = new URL('https://api.geoapify.com/v1/geocode/autocomplete');
  url.search = new URLSearchParams({
    text,
    apiKey: key,
    format: 'json',
    filter: 'countrycode:us',
    bias: 'proximity:-76.6122,39.2904',
    limit: '8',
  }).toString();

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000), redirect: 'error' });
    if (!response.ok) throw new Error('Geoapify request failed');
    const data: { results?: { formatted?: string; lat?: number; lon?: number }[] } = await response.json();
    if (!Array.isArray(data.results)) throw new Error('Invalid Geoapify response');
    const seen = new Set<string>();
    const suggestions = data.results.flatMap(({ formatted, lat, lon }) => {
      const address = typeof formatted === 'string' ? formatted.trim() : '';
      if (!address || seen.has(address) || typeof lat !== 'number' || !Number.isFinite(lat) || Math.abs(lat) > 90
        || typeof lon !== 'number' || !Number.isFinite(lon) || Math.abs(lon) > 180) return [];
      seen.add(address);
      return [{ address, latitude: lat, longitude: lon }];
    });
    return Response.json({ suggestions, provider: 'geoapify' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Address suggestions are unavailable. You can enter an address manually.' }, { status: 502 });
  }
}
const abbreviations: ReadonlyMap<string, string> = new Map(Object.entries({
  NORTH: 'N', SOUTH: 'S', EAST: 'E', WEST: 'W',
  STREET: 'ST', AVENUE: 'AVE', ROAD: 'RD', BOULEVARD: 'BLVD',
  DRIVE: 'DR', COURT: 'CT', LANE: 'LN', PLACE: 'PL',
}));

function normalizeAddressQuery(value: string) {
  const query = value.trim().replace(/,\s*BALTIMORE(?:,\s*(?:MD|MARYLAND)(?:\s+\d{5})?)?$/i, '')
    .toUpperCase().replace(/\./g, '').replace(/\s+/g, ' ');
  if (!/^[A-Z0-9 '-]{3,60}$/.test(query) || !/[A-Z]/.test(query)) return '';
  return query.split(' ').map((word) => abbreviations.get(word) ?? word).join(' ');
}
