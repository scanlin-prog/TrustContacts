import { useAuthStore } from '@store/auth';

const API_URL = import.meta.env.VITE_API_URL;

export async function useApiFetch<T>(path: string, options = {}) {
  const { token } = useAuthStore();

  const fullPath = `${API_URL}${path}`;

  if (token) {
    /** @ts-ignore */
    if (!options.headers) {
      /** @ts-ignore */
      options.headers = {};
    }
    /** @ts-ignore */
    options.headers = Object.assign({}, options.headers, {
      Authorization: `Bearer ${token}`,
    });
  }

  let responseStatus = 0;
  let responseError = null;

  try {
    const response = await fetch(fullPath, {
      ...options,
    });

    responseStatus = response.status;

    if (!response.ok) {
      responseError = await response.json();
      return { data: null, error: responseError, status: responseStatus };
    }

    const data = (await response.json()) as T;

    return { data, error: null, status: responseStatus };
  } catch (error) {
    return { data: null, error: error, status: 500 };
  }
}
