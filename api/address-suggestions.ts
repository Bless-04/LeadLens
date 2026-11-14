const addressPoints = 'https://baltegis.baltimorecity.gov/mapping/rest/services/Address_Points/AddressPoint_Native/FeatureServer/0/query';

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Use POST to search addresses.' }, { status: 405, headers: { Allow: 'POST' } });
    }
    const body = await request.json().catch(() => null);
    const query = typeof body?.query === 'string' ? body.query.trim().replace(/\s+/g, ' ').toUpperCase() : '';
    if (!/^[0-9][A-Z0-9 .'-]{3,59}$/.test(query) || !/[A-Z]/.test(query)) {
      return Response.json({ suggestions: [] });
    }

    const url = new URL(addressPoints);
    url.search = new URLSearchParams({
      where: `full_addr LIKE '${query.replaceAll("'", "''")}%'`,
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
