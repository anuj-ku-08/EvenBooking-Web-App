import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eventticket_super_secret_jwt_key_2026';

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Bearer token missing.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded || decoded.role !== 'admin') {
    return res.status(401).json({ error: 'Invalid or expired admin authorization token.' });
  }

  req.user = decoded;
  next();
}
