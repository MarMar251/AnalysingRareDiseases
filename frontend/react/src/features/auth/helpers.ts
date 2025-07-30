import { tokenService } from './tokenService';

/**
 * Returns an object with the Authorization header containing the JWT token
 * Used for authenticated API requests
 */
export const authHeader = () => {
  const token = tokenService.get();
  return token ? { Authorization: `Bearer ${token}` } : {};
};