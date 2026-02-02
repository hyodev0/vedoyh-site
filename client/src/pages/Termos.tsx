import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function Termos() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
              <FileText className="h-4 w-4" />
              <span>Documento Legal</span>
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Termos de Uso
            </h1>

            <p className="text-lg text-muted-foreground">
              Última atualização: Janeiro de 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto max-w-3xl space-y-8"
          >
            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground">
                Ao utilizar o bot vedoyh, você concorda com estes termos de uso. Se você não concordar com qualquer parte destes termos, não utilize o bot.
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">2. Uso do Serviço</h2>
              <p className="text-muted-foreground">
                O vedoyh é um bot de verificação e segurança para servidores Discord. Você concorda em usar o bot apenas para fins legítimos e de acordo com os Termos de Serviço do Discord.
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">3. Privacidade</h2>
              <p className="text-muted-foreground">
                O vedoyh coleta apenas as informações necessárias para seu funcionamento, como IDs de usuários e servidores. Não compartilhamos dados com terceiros.
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">4. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground">
                O vedoyh é fornecido "como está". Não nos responsabilizamos por danos diretos ou indiretos resultantes do uso do bot.
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">5. Contato</h2>
              <p className="text-muted-foreground">
                Para dúvidas sobre estes termos, entre em contato através do nosso{" "}
                <a
                  href="https://disc.vdyh.lat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  servidor de suporte
                </a>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
