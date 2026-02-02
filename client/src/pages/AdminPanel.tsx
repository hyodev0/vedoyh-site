import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Bot,
  ExternalLink,
  FileText,
  Globe,
  Home,
  Image,
  LayoutDashboard,
  Link2,
  Loader2,
  LogOut,
  MessageSquare,
  Save,
  Settings,
  Type,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface SiteContent {
  // Informações do Bot
  botName: string;
  botTagline: string;
  botAvatarUrl: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  
  // Features
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
  feature4Title: string;
  feature4Description: string;
  
  // URLs
  addBotUrl: string;
  supportUrl: string;
  discordInvite: string;
  termsUrl: string;
  privacyUrl: string;
  
  // Footer
  footerText: string;
  creatorName: string;
  creatorUrl: string;
  
  // Meta/SEO
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

const defaultContent: SiteContent = {
  botName: "vedoyh",
  botTagline: "Verificação e Segurança",
  botAvatarUrl: "/bot-avatar.png",
  
  heroTitle: "vedoyh",
  heroSubtitle: "Verificação e Segurança",
  heroDescription: "Bot público para Discord de nova geração com verificação via captcha, desenvolvido com Components V2 para máxima segurança e performance.",
  
  feature1Title: "Verificação via Captcha",
  feature1Description: "Sistema de verificação inteligente com captcha para proteger seu servidor contra bots e raids.",
  feature2Title: "Components V2",
  feature2Description: "Interface moderna utilizando os novos Discord Components V2 para melhor experiência.",
  feature3Title: "Alta Performance",
  feature3Description: "Desenvolvido com foco em velocidade e eficiência para servidores de qualquer tamanho.",
  feature4Title: "Fácil Configuração",
  feature4Description: "Configure em minutos com comandos simples e intuitivos.",
  
  addBotUrl: "https://add.vdyh.lat",
  supportUrl: "https://disc.vdyh.lat",
  discordInvite: "https://disc.vdyh.lat",
  termsUrl: "/termos",
  privacyUrl: "/termos",
  
  footerText: "© 2026 vedoyh. Todos os direitos reservados.",
  creatorName: "hyo",
  creatorUrl: "https://discord.com/users/oyh1",
  
  metaTitle: "vedoyh — Bot de Verificação e Segurança",
  metaDescription: "Bot público para Discord com verificação via captcha e Components V2.",
  ogImage: "/og-image.png",
};

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [hasChanges, setHasChanges] = useState(false);

  // Verificar sessão admin
  const sessionQuery = trpc.admin.verifySession.useQuery(undefined, {
    retry: false,
  });

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      setLocation("/vedoysadminpanel141412xx");
    },
  });

  const updateContentMutation = trpc.admin.updateContent.useMutation({
    onSuccess: () => {
      toast.success("Conteúdo atualizado com sucesso!");
      setHasChanges(false);
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Erro ao atualizar conteúdo.");
    },
  });

  // Carregar conteúdo do site
  const contentQuery = trpc.admin.getContent.useQuery(undefined, {
    enabled: sessionQuery.data?.valid === true,
  });

  useEffect(() => {
    if (contentQuery.data) {
      setContent({ ...defaultContent, ...contentQuery.data });
    }
  }, [contentQuery.data]);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (sessionQuery.isError || (sessionQuery.data && !sessionQuery.data.valid)) {
      setLocation("/vedoysadminpanel141412xx");
    }
  }, [sessionQuery.isError, sessionQuery.data, setLocation]);

  const updateField = (field: keyof SiteContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  if (sessionQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sessionQuery.data?.valid) {
    return null;
  }

  const handleSaveContent = () => {
    updateContentMutation.mutate(content);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bot", label: "Bot Info", icon: Bot },
    { id: "home", label: "Página Inicial", icon: Home },
    { id: "features", label: "Features", icon: MessageSquare },
    { id: "urls", label: "URLs & Links", icon: Link2 },
    { id: "texts", label: "Textos", icon: Type },
    { id: "media", label: "Imagens", icon: Image },
    { id: "seo", label: "SEO & Meta", icon: Globe },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
            <img
              src="/bot-avatar.png"
              alt="vedoyh"
              className="h-8 w-8 rounded-full border-2 border-primary/50"
            />
            <span className="font-bold gradient-text">Admin Panel</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Save Button & Logout */}
          <div className="border-t border-border/50 p-4 space-y-2">
            {hasChanges && (
              <Button
                onClick={handleSaveContent}
                disabled={updateContentMutation.isPending}
                className="w-full gap-2 bg-gradient-to-r from-primary to-secondary"
              >
                {updateContentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar Tudo
              </Button>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Bem-vindo ao painel administrativo do vedoyh.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Status do Site</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-muted-foreground">Online</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Última Atualização</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString("pt-BR")}
                    </span>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Versão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm text-muted-foreground">1.0.0</span>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>Acesse rapidamente as configurações mais usadas.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" onClick={() => setActiveTab("bot")} className="gap-2">
                    <Bot className="h-4 w-4" />
                    Editar Bot
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("urls")} className="gap-2">
                    <Link2 className="h-4 w-4" />
                    Editar URLs
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("texts")} className="gap-2">
                    <Type className="h-4 w-4" />
                    Editar Textos
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("media")} className="gap-2">
                    <Image className="h-4 w-4" />
                    Editar Imagens
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bot Info */}
          {activeTab === "bot" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Informações do Bot</h1>
                <p className="text-muted-foreground">
                  Configure as informações básicas do bot.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Identidade do Bot
                    </CardTitle>
                    <CardDescription>Nome e tagline do bot.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="botName">Nome do Bot</Label>
                      <Input
                        id="botName"
                        value={content.botName}
                        onChange={(e) => updateField("botName", e.target.value)}
                        className="bg-input/50"
                        placeholder="vedoyh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="botTagline">Tagline</Label>
                      <Input
                        id="botTagline"
                        value={content.botTagline}
                        onChange={(e) => updateField("botTagline", e.target.value)}
                        className="bg-input/50"
                        placeholder="Verificação e Segurança"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Avatar do Bot
                    </CardTitle>
                    <CardDescription>Imagem de perfil do bot.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={content.botAvatarUrl || "/bot-avatar.png"}
                        alt="Bot Avatar"
                        className="h-20 w-20 rounded-full border-4 border-primary/50"
                      />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="botAvatarUrl">URL do Avatar</Label>
                        <Input
                          id="botAvatarUrl"
                          value={content.botAvatarUrl}
                          onChange={(e) => updateField("botAvatarUrl", e.target.value)}
                          className="bg-input/50"
                          placeholder="/bot-avatar.png"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleSaveContent}
                disabled={updateContentMutation.isPending}
                className="gap-2"
              >
                {updateContentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </div>
          )}

          {/* Home Page */}
          {activeTab === "home" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Página Inicial</h1>
                <p className="text-muted-foreground">
                  Edite o conteúdo da seção hero.
                </p>
              </div>

              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Hero Section
                  </CardTitle>
                  <CardDescription>Título, subtítulo e descrição principal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="heroTitle">Título Principal</Label>
                      <Input
                        id="heroTitle"
                        value={content.heroTitle}
                        onChange={(e) => updateField("heroTitle", e.target.value)}
                        className="bg-input/50"
                        placeholder="vedoyh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heroSubtitle">Subtítulo</Label>
                      <Input
                        id="heroSubtitle"
                        value={content.heroSubtitle}
                        onChange={(e) => updateField("heroSubtitle", e.target.value)}
                        className="bg-input/50"
                        placeholder="Verificação e Segurança"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroDescription">Descrição</Label>
                    <Textarea
                      id="heroDescription"
                      value={content.heroDescription}
                      onChange={(e) => updateField("heroDescription", e.target.value)}
                      className="bg-input/50"
                      rows={4}
                      placeholder="Descrição do bot..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSaveContent}
                disabled={updateContentMutation.isPending}
                className="gap-2"
              >
                {updateContentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </div>
          )}

          {/* Features */}
          {activeTab === "features" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Features</h1>
                <p className="text-muted-foreground">
                  Edite os recursos/features exibidos na página inicial.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {[1, 2, 3, 4].map((num) => (
                  <Card key={num} className="border-border/50 bg-card/50">
                    <CardHeader>
                      <CardTitle>Feature {num}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Título</Label>
                        <Input
                          value={content[`feature${num}Title` as keyof SiteContent] as string}
                          onChange={(e) => updateField(`feature${num}Title` as keyof SiteContent, e.target.value)}
                          className="bg-input/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                          value={content[`feature${num}Description` as keyof SiteContent] as string}
                          onChange={(e) => updateField(`feature${num}Description` as keyof SiteContent, e.target.value)}
                          className="bg-input/50"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                onClick={handleSaveContent}
                disabled={updateContentMutation.isPending}
                className="gap-2"
              >
                {updateContentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </div>
          )}

          {/* URLs & Links */}
          {activeTab === "urls" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">URLs & Links</h1>
                <p className="text-muted-foreground">
                  Configure todos os links externos do site.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Links Principais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="addBotUrl">URL Adicionar Bot</Label>
                      <Input
                        id="addBotUrl"
                        value={content.addBotUrl}
                        onChange={(e) => updateField("addBotUrl", e.target.value)}
                        className="bg-input/50"
                        placeholder="https://add.vdyh.lat"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportUrl">URL de Suporte</Label>
                      <Input
                        id="supportUrl"
                        value={content.supportUrl}
                        onChange={(e) => updateField("supportUrl", e.target.value)}
                        className="bg-input/50"
                        placeholder="https://disc.vdyh.lat"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discordInvite">Convite Discord</Label>
                      <Input
                        id="discordInvite"
                        value={content.discordInvite}
                        onChange={(e) => updateField("discordInvite", e.target.value)}
                        className="bg-input/50"
                        placeholder="https://disc.vdyh.lat"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Links Legais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="termsUrl">URL Termos de Uso</Label>
                      <Input
                        id="termsUrl"
                        value={content.termsUrl}
                        onChange={(e) => updateField("termsUrl", e.target.value)}
                        className="bg-input/50"
                        placeholder="/termos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="privacyUrl">URL Privacidade</Label>
                      <Input
                        id="privacyUrl"
                        value={content.privacyUrl}
                        onChange={(e) => updateField("privacyUrl", e.target.value)}
                        className="bg-input/50"
                        placeholder="/termos"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleSaveContent}
                disabled={updateContentMutation.isPending}
                className="gap-2"
              >
                {updateContentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </div>
          )}

          {/* Texts */}
          {activeTab === "texts" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Textos</h1>
                <p className="text-muted-foreground">
                  Edite todos os textos do site.
                </p>
              </div>

              <Tabs defaultValue="footer" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="footer">Footer</TabsTrigger>
                  <TabsTrigger value="creator">Criador</TabsTrigger>
                </TabsList>

                <TabsContent value="footer">
                  <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                      <CardTitle>Texto do Footer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="footerText">Texto de Copyright</Label>
                        <Input
                          id="footerText"
                          value={content.footerText}
                          onChange={(e) => updateField("footerText", e.target.value)}
                          className="bg-input/50"
                          placeholder="© 2026 vedoyh. Todos os direitos reservados."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="creator">
                  <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                      <CardTitle>Informações do Criador</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="creatorName">Nome do Criador</Label>
                        <Input
                          id="creatorName"
                          value={content.creatorName}
                          onChange={(e) => updateField("creatorName", e.target.value)}
                          className="bg-input/50"
                          placeholder="hyo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="creatorUrl">URL do Criador</Label>
                        <Input
                          id="creatorUrl"
                          value={content.creatorUrl}
                          onChange={(e) => updateField("creatorUrl", e.target.value)}
                          className="bg-input/50"
                          placeholder="https://discord.com/users/oyh1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleSaveContent}
                disabled={updateContentMutation.isPending}
                className="gap-2"
              >
                {updateContentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </div>
          )}

          {/* Media/Images */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Imagens</h1>
                <p className="text-muted-foreground">
                  Configure as imagens do site.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Avatar do Bot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={content.botAvatarUrl || "/bot-avatar.png"}
                        alt="Bot Avatar"
                        className="h-24 w-24 rounded-full border-4 border-primary/50"
                      />
                      <div className="flex-1 space-y-2">
                        <Label>URL do Avatar</Label>
                        <Input
                          value={content.botAvatarUrl}
                          onChange={(e) => updateField("botAvatarUrl", e.target.value)}
                          className="bg-input/50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Recomendado: 512x512px, formato PNG
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Imagem Open Graph
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>URL da Imagem OG</Label>
                      <Input
                        value={content.ogImage}
                        onChange={(e) => updateField("ogImage", e.target.value)}
                        className="bg-input/50"
                        placeholder="/og-image.png"
                      />
                      <p className="text-xs text-muted-foreground">
                        Imagem exibida nos embeds do Discord. Recomendado: 1200x630px
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleSaveContent}
                disabled={updateContentMutation.isPending}
                className="gap-2"
              >
                {updateContentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </div>
          )}

          {/* SEO & Meta */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">SEO & Meta Tags</h1>
                <p className="text-muted-foreground">
                  Configure as meta tags para SEO e embeds.
                </p>
              </div>

              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Meta Tags
                  </CardTitle>
                  <CardDescription>
                    Essas informações aparecem nos resultados de busca e embeds do Discord.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Título da Página</Label>
                    <Input
                      id="metaTitle"
                      value={content.metaTitle}
                      onChange={(e) => updateField("metaTitle", e.target.value)}
                      className="bg-input/50"
                      placeholder="vedoyh — Bot de Verificação e Segurança"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Descrição</Label>
                    <Textarea
                      id="metaDescription"
                      value={content.metaDescription}
                      onChange={(e) => updateField("metaDescription", e.target.value)}
                      className="bg-input/50"
                      rows={3}
                      placeholder="Descrição para SEO..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">URL da Imagem OG</Label>
                    <Input
                      id="ogImage"
                      value={content.ogImage}
                      onChange={(e) => updateField("ogImage", e.target.value)}
                      className="bg-input/50"
                      placeholder="/og-image.png"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle>Prévia do Embed</CardTitle>
                  <CardDescription>Como vai aparecer no Discord.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border-l-4 border-primary bg-[#2f3136] p-4 max-w-md">
                    <p className="text-xs text-[#00b0f4] mb-1">vdyh.lat</p>
                    <p className="text-[#00b0f4] font-semibold hover:underline cursor-pointer">
                      {content.metaTitle || "vedoyh — Bot de Verificação e Segurança"}
                    </p>
                    <p className="text-sm text-[#dcddde] mt-1">
                      {content.metaDescription || "Descrição do bot..."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSaveContent}
                disabled={updateContentMutation.isPending}
                className="gap-2"
              >
                {updateContentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Configurações</h1>
                <p className="text-muted-foreground">
                  Configurações gerais do painel.
                </p>
              </div>

              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    Zona de Perigo
                  </CardTitle>
                  <CardDescription>
                    Ações irreversíveis. Tenha cuidado.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma ação destrutiva disponível no momento.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Encerrar Sessão
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
