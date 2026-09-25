const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8084';

export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const token = localStorage.getItem('admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customConfig.headers,
  };

  const config = {
    method: customConfig.method || (body ? 'POST' : 'GET'),
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Call failed [${config.method} ${endpoint}]:`, error);
    throw error;
  }
}
