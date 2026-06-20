import bcrypt from "bcryptjs";

// We use `bcryptjs` (pure-JS) rather than the native `bcrypt` package: it is a
// drop-in bcrypt implementation that needs no native compilation, which keeps
// builds reliable across Windows dev machines and serverless deploys.

const SALT_ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
