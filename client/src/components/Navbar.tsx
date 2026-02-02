import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const { data: content } = trpc.admin.getPublicContent.useQuery();

  const botName = content?.botName || "vedoyh";
  const botAvatarUrl = content?.botAvatarUrl || "/bot-avatar.png";
  const addBotUrl = content?.addBotUrl || "https://add.vdyh.lat";
  const supportUrl = content?.supportUrl || "https://disc.vdyh.lat";

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/comandos", label: "Comandos" },
    { href: "/apoiar", label: "Apoiar" },
    { href: supportUrl, label: "Suporte", external: true },
    { href: addBotUrl, label: "Adicionar Bot", external: true },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={botAvatarUrl}
              alt={botName}
              className="h-10 w-10 rounded-full border-2 border-primary/50 shadow-md shadow-primary/20"
            />
            <span className="text-xl font-bold gradient-text">{botName}</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
              className="rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Menu Popup */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/50 bg-card/95 p-6 shadow-2xl backdrop-blur-xl"
            >
                <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={botAvatarUrl}
                    alt={botName}
                    className="h-10 w-10 rounded-full border-2 border-primary/50 shadow-md shadow-primary/20"
                  />
                  <span className="text-xl font-bold gradient-text">{botName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = location === link.href;
                  
                  if (link.external) {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium transition-all hover:bg-primary/10 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium transition-all ${
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 flex gap-3">
                <a
                  href={addBotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
                    Adicionar Bot
                  </Button>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
