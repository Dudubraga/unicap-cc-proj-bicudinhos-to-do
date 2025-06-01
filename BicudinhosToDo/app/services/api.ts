const APPLICATION_ID = process.env.EXPO_PUBLIC_PARSE_APPLICATION_ID;
const REST_API_KEY = process.env.EXPO_PUBLIC_PARSE_REST_API_KEY;
const BASE_URL = 'https://parseapi.back4app.com/classes';

const getHeaders = () => {
  if (!APPLICATION_ID || !REST_API_KEY) {
    throw new Error("As chaves da API não foram encontradas. Verifique o arquivo .env");
  }

  return {
    'X-Parse-Application-Id': APPLICATION_ID,
    'X-Parse-REST-API-Key': REST_API_KEY,
    'Content-Type': 'application/json',
  };
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Ocorreu um erro na chamada da API.");
  }
  return response.json();
};

export const api = {
  get: (endpoint: string) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  del: (endpoint: string) => apiFetch(endpoint, { method: 'DELETE' }),
};