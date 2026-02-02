import { TRPCError } from "@trpc/server";
import { eq, and, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { adminSessions, loginAttempts, siteContent } from "../drizzle/schema";
import { getDb } from "./db";
import { publicProcedure, router } from "./_core/trpc";
import crypto from "crypto";
import { parse as parseCookieHeader } from "cookie";

// Credenciais do admin (hash das senhas para segurança)
const ADMIN_USERNAME = "miguelborgeskruger";
const ADMIN_PASSWORD_HASH = crypto.createHash("sha256").update("2323@Miguel14141212").digest("hex");
const ADMIN_SECURITY_CODE_HASH = crypto.createHash("sha256").update("03416196760408").digest("hex");

// Configurações de segurança
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const SESSION_DURATION_HOURS = 2;
const ADMIN_COOKIE_NAME = "vedoyh_admin_session";

// Helper para obter IP do cliente
function getClientIP(req: { headers: Record<string, string | string[] | undefined>; ip?: string }): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    return ip?.trim() || "unknown";
  }
  return req.ip || "unknown";
}

// Helper para gerar token seguro
function generateSecureToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

// Helper para hash de senha
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Conteúdo padrão expandido
const defaultContent = {
  // Informações do Bot
  botName: "vedoyh",
  botTagline: "Verificação e Segurança",
  botAvatarUrl: "/bot-avatar.png",
  
  // Hero Section
  heroTitle: "vedoyh",
  heroSubtitle: "Verificação e Segurança",
  heroDescription: "Bot público para Discord de nova geração com verificação via captcha, desenvolvido com Components V2 para máxima segurança e performance.",
  
  // Features
  feature1Title: "Verificação via Captcha",
  feature1Description: "Sistema de verificação inteligente com captcha para proteger seu servidor contra bots e raids.",
  feature2Title: "Components V2",
  feature2Description: "Interface moderna utilizando os novos Discord Components V2 para melhor experiência.",
  feature3Title: "Alta Performance",
  feature3Description: "Desenvolvido com foco em velocidade e eficiência para servidores de qualquer tamanho.",
  feature4Title: "Fácil Configuração",
  feature4Description: "Configure em minutos com comandos simples e intuitivos.",
  
  // URLs
  addBotUrl: "https://add.vdyh.lat",
  supportUrl: "https://disc.vdyh.lat",
  discordInvite: "https://disc.vdyh.lat",
  termsUrl: "/termos",
  privacyUrl: "/termos",
  
  // Footer
  footerText: "© 2026 vedoyh. Todos os direitos reservados.",
  creatorName: "hyo",
  creatorUrl: "https://discord.com/users/oyh1",
  
  // Meta/SEO
  metaTitle: "vedoyh — Bot de Verificação e Segurança",
  metaDescription: "Bot público para Discord com verificação via captcha e Components V2.",
  ogImage: "/og-image.png",
};

// Schema de validação para atualização de conteúdo
const contentUpdateSchema = z.object({
  botName: z.string().optional(),
  botTagline: z.string().optional(),
  botAvatarUrl: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  feature1Title: z.string().optional(),
  feature1Description: z.string().optional(),
  feature2Title: z.string().optional(),
  feature2Description: z.string().optional(),
  feature3Title: z.string().optional(),
  feature3Description: z.string().optional(),
  feature4Title: z.string().optional(),
  feature4Description: z.string().optional(),
  addBotUrl: z.string().optional(),
  supportUrl: z.string().optional(),
  discordInvite: z.string().optional(),
  termsUrl: z.string().optional(),
  privacyUrl: z.string().optional(),
  footerText: z.string().optional(),
  creatorName: z.string().optional(),
  creatorUrl: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
});

export const adminRouter = router({
  // Login com validação server-side completa
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
        securityCode: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro interno do servidor.",
        });
      }

      const clientIP = getClientIP(ctx.req);
      const now = new Date();
      const lockoutTime = new Date(now.getTime() - LOCKOUT_DURATION_MINUTES * 60 * 1000);

      // Verificar rate limiting - contar tentativas falhas recentes
      const recentAttempts = await db
        .select({ count: sql<number>`count(*)` })
        .from(loginAttempts)
        .where(
          and(
            eq(loginAttempts.ipAddress, clientIP),
            eq(loginAttempts.successful, false),
            gte(loginAttempts.attemptedAt, lockoutTime)
          )
        );

      const attemptCount = recentAttempts[0]?.count || 0;

      if (attemptCount >= MAX_LOGIN_ATTEMPTS) {
        // Registrar tentativa bloqueada
        await db.insert(loginAttempts).values({
          ipAddress: clientIP,
          successful: false,
          username: input.username,
        });

        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Muitas tentativas de login. Tente novamente em ${LOCKOUT_DURATION_MINUTES} minutos.`,
        });
      }

      // Validar credenciais
      const passwordHash = hashPassword(input.password);
      const securityCodeHash = hashPassword(input.securityCode);

      const isValidUsername = input.username === ADMIN_USERNAME;
      const isValidPassword = passwordHash === ADMIN_PASSWORD_HASH;
      const isValidSecurityCode = securityCodeHash === ADMIN_SECURITY_CODE_HASH;

      if (!isValidUsername || !isValidPassword || !isValidSecurityCode) {
        // Registrar tentativa falha
        await db.insert(loginAttempts).values({
          ipAddress: clientIP,
          successful: false,
          username: input.username,
        });

        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Credenciais inválidas.",
        });
      }

      // Login bem-sucedido - criar sessão
      const sessionToken = generateSecureToken();
      const expiresAt = new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

      await db.insert(adminSessions).values({
        sessionToken,
        expiresAt,
        ipAddress: clientIP,
        userAgent: ctx.req.headers["user-agent"] as string || null,
      });

      // Registrar tentativa bem-sucedida
      await db.insert(loginAttempts).values({
        ipAddress: clientIP,
        successful: true,
        username: input.username,
      });

      // Definir cookie de sessão
      ctx.res.cookie(ADMIN_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: ctx.req.protocol === "https",
        sameSite: ctx.req.protocol === "https" ? "none" : "lax",
        maxAge: SESSION_DURATION_HOURS * 60 * 60 * 1000,
        path: "/",
      });

      return { success: true };
    }),

  // Verificar sessão
  verifySession: publicProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return { valid: false };
    }

    const cookies = parseCookieHeader(ctx.req.headers.cookie || "");
    const sessionToken = cookies[ADMIN_COOKIE_NAME];
    if (!sessionToken) {
      return { valid: false };
    }

    const now = new Date();
    const sessions = await db
      .select()
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.sessionToken, sessionToken),
          gte(adminSessions.expiresAt, now)
        )
      )
      .limit(1);

    if (sessions.length === 0) {
      return { valid: false };
    }

    // Verificar IP (proteção adicional)
    const clientIP = getClientIP(ctx.req);
    const session = sessions[0];
    if (session.ipAddress && session.ipAddress !== clientIP) {
      // IP diferente - sessão pode ter sido roubada
      await db.delete(adminSessions).where(eq(adminSessions.sessionToken, sessionToken));
      return { valid: false };
    }

    return { valid: true };
  }),

  // Logout
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    const cookies = parseCookieHeader(ctx.req.headers.cookie || "");
    const sessionToken = cookies[ADMIN_COOKIE_NAME];

    if (db && sessionToken) {
      await db.delete(adminSessions).where(eq(adminSessions.sessionToken, sessionToken));
    }

    ctx.res.clearCookie(ADMIN_COOKIE_NAME, {
      httpOnly: true,
      secure: ctx.req.protocol === "https",
      sameSite: ctx.req.protocol === "https" ? "none" : "lax",
      path: "/",
    });

    return { success: true };
  }),

  // Obter conteúdo do site (público - para exibir no site)
  getPublicContent: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return defaultContent;
    }

    // Buscar conteúdo do banco
    const contents = await db.select().from(siteContent);
    const contentMap: Record<string, string> = {};
    contents.forEach((c) => {
      contentMap[c.key] = c.value;
    });

    // Retornar conteúdo com valores padrão
    return {
      botName: contentMap["botName"] || defaultContent.botName,
      botTagline: contentMap["botTagline"] || defaultContent.botTagline,
      botAvatarUrl: contentMap["botAvatarUrl"] || defaultContent.botAvatarUrl,
      heroTitle: contentMap["heroTitle"] || defaultContent.heroTitle,
      heroSubtitle: contentMap["heroSubtitle"] || defaultContent.heroSubtitle,
      heroDescription: contentMap["heroDescription"] || defaultContent.heroDescription,
      feature1Title: contentMap["feature1Title"] || defaultContent.feature1Title,
      feature1Description: contentMap["feature1Description"] || defaultContent.feature1Description,
      feature2Title: contentMap["feature2Title"] || defaultContent.feature2Title,
      feature2Description: contentMap["feature2Description"] || defaultContent.feature2Description,
      feature3Title: contentMap["feature3Title"] || defaultContent.feature3Title,
      feature3Description: contentMap["feature3Description"] || defaultContent.feature3Description,
      feature4Title: contentMap["feature4Title"] || defaultContent.feature4Title,
      feature4Description: contentMap["feature4Description"] || defaultContent.feature4Description,
      addBotUrl: contentMap["addBotUrl"] || defaultContent.addBotUrl,
      supportUrl: contentMap["supportUrl"] || defaultContent.supportUrl,
      discordInvite: contentMap["discordInvite"] || defaultContent.discordInvite,
      termsUrl: contentMap["termsUrl"] || defaultContent.termsUrl,
      privacyUrl: contentMap["privacyUrl"] || defaultContent.privacyUrl,
      footerText: contentMap["footerText"] || defaultContent.footerText,
      creatorName: contentMap["creatorName"] || defaultContent.creatorName,
      creatorUrl: contentMap["creatorUrl"] || defaultContent.creatorUrl,
      metaTitle: contentMap["metaTitle"] || defaultContent.metaTitle,
      metaDescription: contentMap["metaDescription"] || defaultContent.metaDescription,
      ogImage: contentMap["ogImage"] || defaultContent.ogImage,
    };
  }),

  // Obter conteúdo do site (protegido - para admin)
  getContent: publicProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return defaultContent;
    }

    // Verificar sessão primeiro
    const cookies = parseCookieHeader(ctx.req.headers.cookie || "");
    const sessionToken = cookies[ADMIN_COOKIE_NAME];
    if (!sessionToken) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Não autorizado." });
    }

    const now = new Date();
    const sessions = await db
      .select()
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.sessionToken, sessionToken),
          gte(adminSessions.expiresAt, now)
        )
      )
      .limit(1);

    if (sessions.length === 0) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão expirada." });
    }

    // Buscar conteúdo
    const contents = await db.select().from(siteContent);
    const contentMap: Record<string, string> = {};
    contents.forEach((c) => {
      contentMap[c.key] = c.value;
    });

    // Retornar conteúdo com valores padrão
    return {
      botName: contentMap["botName"] || defaultContent.botName,
      botTagline: contentMap["botTagline"] || defaultContent.botTagline,
      botAvatarUrl: contentMap["botAvatarUrl"] || defaultContent.botAvatarUrl,
      heroTitle: contentMap["heroTitle"] || defaultContent.heroTitle,
      heroSubtitle: contentMap["heroSubtitle"] || defaultContent.heroSubtitle,
      heroDescription: contentMap["heroDescription"] || defaultContent.heroDescription,
      feature1Title: contentMap["feature1Title"] || defaultContent.feature1Title,
      feature1Description: contentMap["feature1Description"] || defaultContent.feature1Description,
      feature2Title: contentMap["feature2Title"] || defaultContent.feature2Title,
      feature2Description: contentMap["feature2Description"] || defaultContent.feature2Description,
      feature3Title: contentMap["feature3Title"] || defaultContent.feature3Title,
      feature3Description: contentMap["feature3Description"] || defaultContent.feature3Description,
      feature4Title: contentMap["feature4Title"] || defaultContent.feature4Title,
      feature4Description: contentMap["feature4Description"] || defaultContent.feature4Description,
      addBotUrl: contentMap["addBotUrl"] || defaultContent.addBotUrl,
      supportUrl: contentMap["supportUrl"] || defaultContent.supportUrl,
      discordInvite: contentMap["discordInvite"] || defaultContent.discordInvite,
      termsUrl: contentMap["termsUrl"] || defaultContent.termsUrl,
      privacyUrl: contentMap["privacyUrl"] || defaultContent.privacyUrl,
      footerText: contentMap["footerText"] || defaultContent.footerText,
      creatorName: contentMap["creatorName"] || defaultContent.creatorName,
      creatorUrl: contentMap["creatorUrl"] || defaultContent.creatorUrl,
      metaTitle: contentMap["metaTitle"] || defaultContent.metaTitle,
      metaDescription: contentMap["metaDescription"] || defaultContent.metaDescription,
      ogImage: contentMap["ogImage"] || defaultContent.ogImage,
    };
  }),

  // Atualizar conteúdo do site (expandido)
  updateContent: publicProcedure
    .input(contentUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro interno do servidor.",
        });
      }

      // Verificar sessão
      const cookies = parseCookieHeader(ctx.req.headers.cookie || "");
      const sessionToken = cookies[ADMIN_COOKIE_NAME];
      if (!sessionToken) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Não autorizado." });
      }

      const now = new Date();
      const sessions = await db
        .select()
        .from(adminSessions)
        .where(
          and(
            eq(adminSessions.sessionToken, sessionToken),
            gte(adminSessions.expiresAt, now)
          )
        )
        .limit(1);

      if (sessions.length === 0) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão expirada." });
      }

      // Atualizar conteúdo
      const updates = Object.entries(input).filter(([, value]) => value !== undefined);
      
      for (const [key, value] of updates) {
        if (value) {
          await db
            .insert(siteContent)
            .values({ key, value })
            .onDuplicateKeyUpdate({ set: { value } });
        }
      }

      return { success: true };
    }),
});
