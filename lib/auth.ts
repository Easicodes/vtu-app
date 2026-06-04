import { apiRequest } from "./apiClient";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

type JwtPayload = {
  userId: string;
  email?: string;
  role?: string;
};

// CREATE TOKEN
export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

// VERIFY TOKEN
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function getAuthUserId(req: Request): string {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header missing or invalid");
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload.userId) {
    throw new Error("Invalid token payload");
  }

  return payload.userId;
}