import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from './analyze-photo';

describe('analyze-photo API handler', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('rejects non-POST methods with 405', async () => {
    const request = new Request('http://localhost/api/analyze-photo', { method: 'GET' });
    const response = await handler.fetch(request);
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.error).toContain('Use POST');
  });

  it('rejects unsupported content-type with 415', async () => {
    const request = new Request('http://localhost/api/analyze-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'invalid',
    });
    const response = await handler.fetch(request);
    expect(response.status).toBe(415);
  });

  it('returns 503 when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const request = new Request('http://localhost/api/analyze-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: '/9j/4AAQSkZJRg==' }),
    });
    const response = await handler.fetch(request);
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error).toContain('not configured');
  });

  it('returns 400 for invalid image payload', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    const request = new Request('http://localhost/api/analyze-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: 'not-base64-jpeg' }),
    });
    const response = await handler.fetch(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('valid JPEG');
  });

  it('parses valid Gemini API response', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    const mockGeminiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  material: 'lead',
                  confidence: 0.85,
                  reasoning: 'Dull gray surface with soft rounded joints visible.',
                }),
              },
            ],
          },
        },
      ],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockGeminiResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const validBase64Jpeg = '/9j/4AAQSkZJRgABAQEASABIAAD/';
    const request = new Request('http://localhost/api/analyze-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: validBase64Jpeg }),
    });

    const response = await handler.fetch(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.material).toBe('lead');
    expect(body.confidence).toBe(0.85);
    expect(body.reasoning).toContain('Dull gray');
  });
});
