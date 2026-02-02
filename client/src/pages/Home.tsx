import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  Bot,
  Command,
  ExternalLink,
  Loader2,
  Puzzle,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Puzzle,
  Zap,
  Command,
};

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "<50ms", label: "Latência" },
  { value: "24/7", label: "Suporte" },
];

export default function Home() {
  const { data: content, isLoading } = trpc.admin.getPublicContent.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const features = [
    {
      icon: Shield,
      title: content?.feature1Title || "Verificação via Captcha",
      description: content?.feature1Description || "Sistema de verificação com captcha integrado para garantir que apenas humanos reais acessem seu servidor.",
    },
    {
      icon: Puzzle,
      title: content?.feature2Title || "Components V2",
      description: content?.feature2Description || "Desenvolvido com a mais recente tecnologia do Discord: Components V2 para interações modernas e responsivas.",
    },
    {
      icon: Zap,
      title: content?.feature3Title || "Alta Performance",
      description: content?.feature3Description || "Respostas instantâneas e processamento rápido para uma experiência fluida e sem travamentos.",
    },
    {
      icon: Command,
      title: content?.feature4Title || "Fácil de Usar",
      description: content?.feature4Description || "Comandos intuitivos e painel de gerenciamento simples para configurar tudo rapidamente.",
    },
  ];

  const botName = content?.botName || "vedoyh";
  const botTagline = content?.botTagline || "Verificação e Segurança";
  const heroDescription = content?.heroDescription || "Bot público para Discord de nova geração com verificação via captcha, desenvolvido com Components V2 para máxima segurança e performance.";
  const addBotUrl = content?.addBotUrl || "https://add.vdyh.lat";
  const supportUrl = content?.supportUrl || "https://disc.vdyh.lat";
  const botAvatarUrl = content?.botAvatarUrl || "/bot-avatar.png";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Bot Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6 flex justify-center"
            >
              <div className="relative">
                <img
                  src={botAvatarUrl}
                  alt={`${botName} Bot`}
                  className="h-24 w-24 rounded-full border-4 border-primary/50 shadow-lg shadow-primary/30 md:h-32 md:w-32"
                />
                <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1.5 ring-4 ring-background">
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span>Bot para Discord • Components V2</span>
            </motion.div>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="gradient-text">{botName}</span>
              <br />
              <span className="text-foreground">{botTagline}</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {heroDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href={addBotUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 glow-primary"
                >
                  <Bot className="h-5 w-5" />
                  Adicionar ao Discord
                </Button>
              </a>
              <a href={supportUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-5 w-5" />
                  Servidor de Suporte
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-text md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Discord Preview Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Veja o <span className="gradient-text">{botName}</span> em ação
            </h2>
            <p className="text-muted-foreground">
              Sistema de verificação moderno com captcha e interface intuitiva usando Components V2.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-lg"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-2 shadow-2xl shadow-primary/10">
              <img
                src="/discord-preview.jpg"
                alt={`Prévia do sistema de verificação do ${botName} no Discord`}
                className="w-full rounded-xl"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Container de verificação com captcha integrado e botões interativos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Por que escolher o <span className="gradient-text">{botName}</span>?
            </h2>
            <p className="text-muted-foreground">
              Recursos poderosos para manter seu servidor seguro e organizado.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8 md:p-16"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Pronto para proteger seu servidor?
              </h2>
              <p className="mb-8 text-muted-foreground">
                Adicione o {botName} agora e tenha acesso a verificação via captcha
                com a tecnologia mais moderna do Discord.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a href={addBotUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Adicionar Bot
                  </Button>
                </a>
                <a href="/comandos">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Command className="h-5 w-5" />
                    Ver Comandos
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
