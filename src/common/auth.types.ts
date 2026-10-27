/** Defines the authenticated user and JWT payload shapes used by access guards. */
export type UserRole = 'ADMIN' | 'TECHNICIAN';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
