const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
  VALIDATE_TOKEN: `${API_BASE_URL}/auth/validate`,
  
  // Event endpoints
  EVENTS: `${API_BASE_URL}/events`,
  EVENT: (id: string) => `${API_BASE_URL}/events/${id}`,
  NEARBY_EVENTS: `${API_BASE_URL}/events/nearby`,
  
  // User endpoints
  USER_SETTINGS: `${API_BASE_URL}/users/settings`,
};

export default API_ENDPOINTS;
