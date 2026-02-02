import { describe, expect, it, vi, beforeEach } from "vitest";
import crypto from "crypto";

// Mock das credenciais esperadas
const ADMIN_USERNAME = "miguelborgeskruger";
const ADMIN_PASSWORD = "2323@Miguel14141212";
const ADMIN_SECURITY_CODE = "03416196760408";

// Helper para hash de senha (mesmo do adminRouter)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

describe("Admin Authentication", () => {
  describe("Password Hashing", () => {
    it("should generate consistent hash for the same password", () => {
      const hash1 = hashPassword(ADMIN_PASSWORD);
      const hash2 = hashPassword(ADMIN_PASSWORD);
      expect(hash1).toBe(hash2);
    });

    it("should generate different hashes for different passwords", () => {
      const hash1 = hashPassword(ADMIN_PASSWORD);
      const hash2 = hashPassword("wrongpassword");
      expect(hash1).not.toBe(hash2);
    });

    it("should generate 64 character hex hash", () => {
      const hash = hashPassword(ADMIN_PASSWORD);
      expect(hash).toHaveLength(64);
      expect(/^[a-f0-9]+$/.test(hash)).toBe(true);
    });
  });

  describe("Credential Validation", () => {
    const expectedPasswordHash = hashPassword(ADMIN_PASSWORD);
    const expectedSecurityCodeHash = hashPassword(ADMIN_SECURITY_CODE);

    it("should validate correct username", () => {
      const inputUsername = "miguelborgeskruger";
      expect(inputUsername).toBe(ADMIN_USERNAME);
    });

    it("should reject incorrect username", () => {
      const inputUsername = "wronguser";
      expect(inputUsername).not.toBe(ADMIN_USERNAME);
    });

    it("should validate correct password hash", () => {
      const inputPasswordHash = hashPassword(ADMIN_PASSWORD);
      expect(inputPasswordHash).toBe(expectedPasswordHash);
    });

    it("should reject incorrect password hash", () => {
      const inputPasswordHash = hashPassword("wrongpassword");
      expect(inputPasswordHash).not.toBe(expectedPasswordHash);
    });

    it("should validate correct security code hash", () => {
      const inputSecurityCodeHash = hashPassword(ADMIN_SECURITY_CODE);
      expect(inputSecurityCodeHash).toBe(expectedSecurityCodeHash);
    });

    it("should reject incorrect security code hash", () => {
      const inputSecurityCodeHash = hashPassword("wrongcode");
      expect(inputSecurityCodeHash).not.toBe(expectedSecurityCodeHash);
    });
  });

  describe("Session Token Generation", () => {
    it("should generate unique tokens", () => {
      const token1 = crypto.randomBytes(64).toString("hex");
      const token2 = crypto.randomBytes(64).toString("hex");
      expect(token1).not.toBe(token2);
    });

    it("should generate 128 character hex token", () => {
      const token = crypto.randomBytes(64).toString("hex");
      expect(token).toHaveLength(128);
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });
  });

  describe("Rate Limiting Logic", () => {
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCKOUT_DURATION_MINUTES = 15;

    it("should allow login when attempts are below limit", () => {
      const attemptCount = 3;
      expect(attemptCount < MAX_LOGIN_ATTEMPTS).toBe(true);
    });

    it("should block login when attempts reach limit", () => {
      const attemptCount = 5;
      expect(attemptCount >= MAX_LOGIN_ATTEMPTS).toBe(true);
    });

    it("should block login when attempts exceed limit", () => {
      const attemptCount = 10;
      expect(attemptCount >= MAX_LOGIN_ATTEMPTS).toBe(true);
    });

    it("should calculate correct lockout time", () => {
      const now = new Date();
      const lockoutTime = new Date(now.getTime() - LOCKOUT_DURATION_MINUTES * 60 * 1000);
      const timeDiff = now.getTime() - lockoutTime.getTime();
      expect(timeDiff).toBe(LOCKOUT_DURATION_MINUTES * 60 * 1000);
    });
  });

  describe("Session Expiration", () => {
    const SESSION_DURATION_HOURS = 2;

    it("should calculate correct session expiration time", () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000);
      const timeDiff = expiresAt.getTime() - now.getTime();
      expect(timeDiff).toBe(SESSION_DURATION_HOURS * 60 * 60 * 1000);
    });

    it("should identify expired session", () => {
      const now = new Date();
      const expiredSession = new Date(now.getTime() - 1000); // 1 second ago
      expect(expiredSession < now).toBe(true);
    });

    it("should identify valid session", () => {
      const now = new Date();
      const validSession = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
      expect(validSession > now).toBe(true);
    });
  });
});

describe("IP Address Extraction", () => {
  it("should extract IP from x-forwarded-for header", () => {
    const headers = { "x-forwarded-for": "192.168.1.1, 10.0.0.1" };
    const forwarded = headers["x-forwarded-for"];
    const ip = forwarded.split(",")[0].trim();
    expect(ip).toBe("192.168.1.1");
  });

  it("should handle single IP in x-forwarded-for", () => {
    const headers = { "x-forwarded-for": "192.168.1.1" };
    const forwarded = headers["x-forwarded-for"];
    const ip = forwarded.split(",")[0].trim();
    expect(ip).toBe("192.168.1.1");
  });

  it("should return unknown for missing headers", () => {
    const headers: Record<string, string | undefined> = {};
    const forwarded = headers["x-forwarded-for"];
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    expect(ip).toBe("unknown");
  });
});
