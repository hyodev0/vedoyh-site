# Project TODO - vedoyh Bot Website

## Páginas Públicas
- [x] Página inicial (Home) com apresentação do bot
- [x] Página de Comandos com cards organizados
- [x] Página Apoiar com redirecionamento para livepix.gg/oyh

## Navegação e Layout
- [x] Top bar fixa com logo, nome, toggle tema e menu
- [x] Menu popup centralizado com animação e blur
- [x] Footer completo com links e informações

## Painel de Administração
- [x] Rota secreta /vedoysadminpanel141412xx
- [x] Sistema de login com credenciais específicas
- [x] Validação server-side obrigatória
- [x] Rate limiting em tentativas de login
- [x] Bloqueio temporário após múltiplas tentativas
- [x] Tokens de sessão seguros com expiração
- [x] Hash forte de credenciais (SHA-256)
- [x] Proteção contra bypass via console/DevTools
- [x] Painel para editar textos do site
- [x] Painel para gerenciar seções e conteúdos

## Embeds Open Graph
- [x] Meta tags para página inicial
- [x] Meta tags para página de comandos
- [x] Meta tags para página apoiar
- [x] Fallback embed padrão
- [x] theme-color configurado por página

## Design e Estilo
- [x] Tema dark com gradiente azul escuro → azul claro
- [x] Cor secundária ciano
- [x] Animações suaves e transições elegantes
- [x] Design responsivo mobile-first
- [x] Toggle modo claro/escuro

## Banco de Dados
- [x] Tabela para configurações do site
- [x] Tabela para sessões admin
- [x] Tabela para tentativas de login (rate limiting)

## Atualizações Solicitadas
- [x] Usar imagem do cadeado como foto do bot
- [x] Atualizar informações: verificação via captcha, Components V2
- [x] Adicionar prévia do Discord na página inicial
- [x] Corrigir painel administrativo após login

## Melhorias no Painel Admin e Logo
- [x] Substituir todos os logos "V" pela foto do cadeado
- [x] Adicionar opção de foto do bot no painel admin
- [x] Adicionar edição de todas as URLs no painel
- [x] Adicionar edição de cada texto do site no painel
- [x] Expandir opções gerais do painel admin

## Integração Admin Panel com Banco de Dados
- [x] Criar tabela site_settings para armazenar configurações
- [x] Implementar endpoint para salvar configurações no banco
- [x] Implementar endpoint para carregar configurações do banco
- [x] Atualizar Home.tsx para buscar dados do banco
- [x] Atualizar Navbar.tsx para buscar dados do banco
- [x] Atualizar Footer.tsx para buscar dados do banco
- [ ] Atualizar Comandos.tsx para buscar dados do banco
- [x] Testar alterações em tempo real
