import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
    } as TrpcContext["req"],
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("admin.getPublicContent", () => {
  it("returns default content when database is empty", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getPublicContent();

    // Verify default values are returned
    expect(result).toBeDefined();
    expect(result.botName).toBe("vedoyh");
    expect(result.botTagline).toBe("Verificação e Segurança");
    expect(result.botAvatarUrl).toBe("/bot-avatar.png");
    expect(result.addBotUrl).toBe("https://add.vdyh.lat");
    expect(result.supportUrl).toBe("https://disc.vdyh.lat");
    expect(result.feature1Title).toBe("Verificação via Captcha");
    expect(result.feature2Title).toBe("Components V2");
  });

  it("returns all expected content fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getPublicContent();

    // Verify all expected fields exist
    const expectedFields = [
      "botName",
      "botTagline",
      "botAvatarUrl",
      "heroTitle",
      "heroSubtitle",
      "heroDescription",
      "feature1Title",
      "feature1Description",
      "feature2Title",
      "feature2Description",
      "feature3Title",
      "feature3Description",
      "feature4Title",
      "feature4Description",
      "addBotUrl",
      "supportUrl",
      "discordInvite",
      "termsUrl",
      "privacyUrl",
      "footerText",
      "creatorName",
      "creatorUrl",
      "metaTitle",
      "metaDescription",
      "ogImage",
    ];

    for (const field of expectedFields) {
      expect(result).toHaveProperty(field);
      expect(result[field as keyof typeof result]).toBeDefined();
    }
  });
});
