const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  BASE: BASE_URL,
  // Auth endpoints
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  GOOGLE_AUTH: `${BASE_URL}/auth/google`,
  VALIDATE_TOKEN: `${BASE_URL}/auth/validate`,
  
  // Event endpoints
  EVENTS: `${BASE_URL}/events`,
  EVENT: (id: string) => `${BASE_URL}/events/${id}`,
  NEARBY_EVENTS: `${BASE_URL}/events/nearby`,
  
  // Place endpoints
  PLACES: `${BASE_URL}/places`,
  PLACE: (id: string) => `${BASE_URL}/places/${id}`,
  NEARBY_PLACES: `${BASE_URL}/places/nearby`,
  
  // User endpoints
  USER_SETTINGS: `${BASE_URL}/users/settings`,
};

export default API_ENDPOINTS;
