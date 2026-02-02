import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// Meta tags dinâmicas por rota para Discord embeds
const routeMetaTags: Record<string, { title: string; description: string; themeColor: string }> = {
  "/": {
    title: "vedoyh — Bot de Verificação e Segurança",
    description: "Bot público de nova geração focado em segurança, performance e sistemas avançados de verificação para servidores Discord.",
    themeColor: "#0d4f8c",
  },
  "/comandos": {
    title: "vedoyh — Comandos",
    description: "Confira todos os comandos disponíveis do bot vedoyh e aprenda como gerenciar seu servidor com segurança.",
    themeColor: "#1a6eb8",
  },
  "/apoiar": {
    title: "Apoiar o vedoyh",
    description: "Apoie o desenvolvimento do bot vedoyh e ajude a manter o projeto ativo.",
    themeColor: "#00d4ff",
  },
};

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Middleware para servir meta tags dinâmicas para crawlers (Discord, WhatsApp, etc)
  app.use((req, res, next) => {
    const userAgent = req.headers["user-agent"] || "";
    const isCrawler = /discordbot|whatsapp|twitterbot|facebookexternalhit|telegrambot|slackbot/i.test(userAgent);
    
    if (isCrawler && !req.path.startsWith("/api")) {
      const meta = routeMetaTags[req.path] || routeMetaTags["/"];
      const baseUrl = "https://vdyh.lat";
      
      const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}">
  <meta name="theme-color" content="${meta.themeColor}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${baseUrl}${req.path}">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:image" content="${baseUrl}/og-image.png">
  <meta property="og:site_name" content="vedoyh">
  <meta property="og:locale" content="pt_BR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${baseUrl}/og-image.png">
</head>
<body></body>
</html>`;
      
      return res.send(html);
    }
    next();
  });
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
