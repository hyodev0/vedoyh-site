import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { CheckCircle2, Command, Send, Settings } from "lucide-react";

const commands = [
  {
    name: "/verificar",
    description: "Verifica manualmente um usuário no servidor",
    icon: CheckCircle2,
    usage: "/verificar @usuário",
    details: "Use este comando para verificar manualmente um usuário que não passou pela verificação automática ou que precisa ser reverificado.",
  },
  {
    name: "/gerenciar",
    description: "Abre o painel de gerenciamento geral",
    icon: Settings,
    usage: "/gerenciar",
    details: "Acesse o painel completo de gerenciamento do bot, onde você pode configurar verificação, segurança e outras opções do servidor.",
  },
  {
    name: "/enviar",
    description: "Envia o container de verificação",
    icon: Send,
    usage: "/enviar #canal",
    details: "Envia a mensagem de verificação com botão interativo para o canal especificado, permitindo que novos membros se verifiquem.",
  },
];

export default function Comandos() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
              <Command className="h-4 w-4" />
              <span>Comandos Disponíveis</span>
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Comandos do <span className="gradient-text">vedoyh</span>
            </h1>

            <p className="text-lg text-muted-foreground">
              Confira todos os comandos disponíveis e aprenda como gerenciar seu
              servidor com segurança.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Commands Section */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-6">
            {commands.map((command, index) => (
              <motion.div
                key={command.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:bg-card"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                    {/* Icon */}
                    <div className="inline-flex shrink-0 rounded-xl bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary/20">
                      <command.icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-foreground">
                          {command.name}
                        </h3>
                        <code className="rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                          {command.usage}
                        </code>
                      </div>

                      <p className="mb-3 font-medium text-foreground">
                        {command.description}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {command.details}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-12 max-w-4xl rounded-2xl border border-secondary/30 bg-secondary/10 p-6 md:p-8"
          >
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Precisa de ajuda?
            </h3>
            <p className="text-muted-foreground">
              Se você tiver dúvidas sobre algum comando ou precisar de suporte,
              entre no nosso{" "}
              <a
                href="https://disc.vdyh.lat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                servidor de suporte
              </a>{" "}
              e nossa equipe terá prazer em ajudar.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
