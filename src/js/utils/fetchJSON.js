const fetchJSON = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Fetch error:', error);
    return { data: null, error: error.message };
  }
};

const api = {
  get: url => fetchJSON(url, { method: 'GET' }),

  post: (url, body) =>
    fetchJSON(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: (url, body) =>
    fetchJSON(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: url => fetchJSON(url, { method: 'DELETE' }),
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchJSON, api };
}
