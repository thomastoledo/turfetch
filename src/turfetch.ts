import { objectToQueryString } from 'urlchemy';

interface TurfetchOptions {
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  query?: Record<string, any>;
  retry?: number;
  onRetry?: (attempt: number) => void;
}

interface TurfetchConfig {
  baseUrl?: string;
}

/**
 * Creates a Turfetch instance with a base URL.
 */
export function createTurfetch({ baseUrl = '' }: TurfetchConfig = {}) {
  /**
   * Makes a fetch request with support for retries, timeouts, and query parameters.
   */
  async function request(
    method: string,
    endpoint: string,
    options: TurfetchOptions = {}
  ): Promise<any> {
    const { headers = {}, body, timeout = 10000, query, retry = 0, onRetry } = options;

    // Construct the full URL with query parameters
    const url = baseUrl + endpoint + (query ? `?${objectToQueryString(query)}` : '');

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const signal = controller.signal;

    // Set up a timeout to abort the request
    const timeoutId = setTimeout(() => {
      return controller.abort()
    }, timeout);

    try {
      // Perform the fetch request
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });

      // Clear the timeout once the request is completed
      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      // Parse and return JSON response
      return await response.json();
    } catch (error: any) {
      // Handle timeout errors
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }

      // Retry logic
      if (retry > 0) {
        if (onRetry) onRetry(retry);
        return request(method, endpoint, { ...options, retry: retry - 1 });
      }

      throw error;
    }
  }

  /**
   * Public API for GET requests.
   */
  function get(endpoint: string, options?: TurfetchOptions) {
    return request('GET', endpoint, options);
  }

  /**
   * Public API for POST requests.
   */
  function post(endpoint: string, options?: TurfetchOptions) {
    return request('POST', endpoint, options);
  }

  /**
   * Public API for PUT requests.
   */
  function put(endpoint: string, options?: TurfetchOptions) {
    return request('PUT', endpoint, options);
  }

  /**
   * Public API for DELETE requests.
   */
  function del(endpoint: string, options?: TurfetchOptions) {
    return request('DELETE', endpoint, options);
  }

  return {
    get,
    post,
    put,
    delete: del,
  };
}
