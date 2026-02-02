import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Footer() {
  const { data: content } = trpc.admin.getPublicContent.useQuery();

  const botName = content?.botName || "vedoyh";
  const botAvatarUrl = content?.botAvatarUrl || "/bot-avatar.png";
  const addBotUrl = content?.addBotUrl || "https://add.vdyh.lat";
  const supportUrl = content?.supportUrl || "https://disc.vdyh.lat";
  const termsUrl = content?.termsUrl || "/termos";
  const privacyUrl = content?.privacyUrl || "/termos";
  const footerText = content?.footerText || "© 2026 vedoyh. Todos os direitos reservados.";
  const creatorName = content?.creatorName || "hyo";
  const creatorUrl = content?.creatorUrl || "https://discord.com/users/oyh1";

  const footerLinks = {
    navegacao: [
      { href: "/", label: "Início" },
      { href: "/comandos", label: "Comandos" },
      { href: "/apoiar", label: "Apoiar" },
    ],
    recursos: [
      { href: supportUrl, label: "Suporte", external: true },
      { href: addBotUrl, label: "Adicionar Bot", external: true },
    ],
    legal: [
      { href: termsUrl, label: "Termos de Uso" },
      { href: privacyUrl, label: "Privacidade" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={botAvatarUrl}
                alt={botName}
                className="h-10 w-10 rounded-full border-2 border-primary/50 shadow-md shadow-primary/20"
              />
              <span className="text-xl font-bold gradient-text">{botName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Bot de verificação e segurança de nova geração para servidores Discord.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Navegação
            </h3>
            <ul className="space-y-2">
              {footerLinks.navegacao.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Recursos
            </h3>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            {footerText.includes("Criado por") ? footerText : (
              <>
                {footerText.replace("Todos os direitos reservados.", "").trim()} Criado por{" "}
                <a
                  href={creatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {creatorName}
                </a>
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
