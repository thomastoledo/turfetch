import { createTurfetch } from './turfetch';

describe('Turfetch', () => {
  let turfetch: ReturnType<typeof createTurfetch>;
  const baseUrl = 'https://api.example.com';

  beforeEach(() => {
    turfetch = createTurfetch({ baseUrl });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET requests', () => {
    test('should make a successful GET request', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });

      const response = await turfetch.get('/test');
      expect(response).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/test`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    test('should handle query parameters', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });

      const response = await turfetch.get('/test', { query: { limit: 10, sort: 'desc' } });
      expect(response).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/test?limit=10&sort=desc`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    test('should handle HTTP errors', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(turfetch.get('/not-found')).rejects.toThrow('HTTP error: 404 Not Found');
    });
  });

  describe('POST requests', () => {
    test('should send a POST request with a JSON body', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });

      const data = { name: 'John Doe' };
      const response = await turfetch.post('/submit', { body: data });

      expect(response).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/submit`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    test('should handle POST request with custom headers', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });

      const data = { name: 'Jane Doe' };
      const response = await turfetch.post('/submit', {
        body: data,
        headers: { Authorization: 'Bearer token' },
      });

      expect(response).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/submit`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer token',
          }),
        })
      );
    });
  });

  describe('Timeouts', () => {
    test('should abort the request after the timeout', async () => {
      jest.useFakeTimers(); // Active les timers mockés
    
      // Mock de `fetch` pour simuler une requête longue
      global.fetch = jest.fn().mockImplementation((_, { signal }) => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            resolve({ ok: true, json: () => Promise.resolve({}) });
          }, 2000);
    
          // Si la requête est annulée, on force un rejet avec "AbortError"
          if (signal) {
            signal.addEventListener('abort', () => {
              clearTimeout(timeout);
              reject(new DOMException('Request timed out', 'AbortError'));
            });
          }
        });
      });
    
      // Lancement de la requête avec un timeout de 1000ms
      const promise = turfetch.get('/slow', { timeout: 1000 });
    
      // Avance le temps de 1500ms pour déclencher l'abandon
      jest.advanceTimersByTime(1500);
    
      // Vérifie que la promesse a bien été rejetée avec "Request timed out"
      await expect(promise).rejects.toThrow('Request timed out');
    
      // Remet les timers à la normale
      jest.useRealTimers();
    });
    
  });

  describe('Retries', () => {
    test('should retry a request on failure', async () => {
      const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ success: true }),
        });

      global.fetch = mockFetch;

      const response = await turfetch.get('/retry', { retry: 1 });
      expect(response).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    test('should stop retrying after max attempts', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(turfetch.get('/fail', { retry: 2 })).rejects.toThrow('Network error');
      expect(global.fetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe('Error handling', () => {
    test('should throw an error for invalid JSON', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      await expect(turfetch.get('/invalid-json')).rejects.toThrow('Invalid JSON');
    });

    test('should handle AbortError gracefully', async () => {
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';

      global.fetch = jest.fn().mockRejectedValueOnce(abortError);

      await expect(turfetch.get('/abort')).rejects.toThrow('Request timed out');
    });
  });

  describe('Edge cases', () => {
    test('should handle undefined query parameters gracefully', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      const response = await turfetch.get('/test', { query: undefined });
      expect(response).toEqual({});
      expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}/test`, expect.anything());
    });

    test('should handle undefined body for POST request', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });

      const response = await turfetch.post('/submit');
      expect(response).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/submit`,
        expect.objectContaining({ body: undefined })
      );
    });
  });
});
