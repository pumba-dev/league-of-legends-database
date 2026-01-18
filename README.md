# 🎮 Champion Dex - League of Legends Encyclopedia

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

Um site moderno e interativo para explorar todos os campeões do League of Legends, desenvolvido com React JS e Tailwind CSS. Inspirado no conceito de uma Pokédex, este projeto oferece uma experiência visual atrativa e informativa para os fãs de LoL.

## ✨ Funcionalidades

### 📋 Página Inicial

- **Grid de Campeões**: Exibição em cards responsivos com imagens, nomes, títulos e roles
- **Filtros Dinâmicos**:
  - 🔍 Busca por nome ou título
  - 🎯 Filtro por Role/Classe (Fighter, Mage, Assassin, etc.)
  - ⭐ Filtro por Dificuldade (Fácil, Médio, Difícil)
- **Scroll Infinito**: Carregamento progressivo de campeões conforme você rola a página
- **Skeleton Loaders**: Placeholders animados durante o carregamento
- **Animações Suaves**: Efeitos de hover e transições elegantes

### 🛡️ Página de Detalhes do Campeão

- **Hero Section**: Splash art em alta qualidade com overlay de gradiente
- **Informações Completas**:
  - Nome, título e lore do campeão
  - Tags/Roles com cores personalizadas
  - Indicador visual de dificuldade
  - Tipo de recurso (Mana, Energy, etc.)
- **Gráficos Interativos**:
  - 📊 **Gráfico Radar**: Visualização de atributos (Ataque, Defesa, Magia, Dificuldade)
  - 📈 **Gráfico de Barras**: Estatísticas base (HP, Mana, Armor, etc.)
- **Estatísticas Detalhadas**: Todos os stats base e por nível
- **Navegação Intuitiva**: Botão de voltar e transições suaves

### 🎨 Design e UX

- **Tema Dark**: Interface escura inspirada no universo do LoL
- **Paleta de Cores**: Tons de ouro (#C89B3C), azul (#0AC8B9) e escuro (#010A13)
- **Layout Responsivo**: Totalmente otimizado para desktop, tablet e mobile
- **Glass Morphism**: Efeitos de vidro fosco em cards e modais
- **Animações com Framer Motion**: Transições fluidas entre páginas

## 🚀 Tecnologias Utilizadas

- **React 18.2.0**: Biblioteca JavaScript para interfaces de usuário
- **Vite 5.0**: Build tool moderna e extremamente rápida
- **Tailwind CSS 3.4**: Framework CSS utility-first
- **React Router DOM 6.21**: Navegação e roteamento
- **Recharts 2.10**: Biblioteca de gráficos para React
- **Framer Motion 10.16**: Animações e transições avançadas

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório** (ou navegue até a pasta do projeto):

```bash
cd c:\Users\eduar\github\lol-db
```

2. **Instale as dependências**:

```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**:

```bash
npm run dev
```

4. **Acesse no navegador**:
   O projeto abrirá automaticamente em `http://localhost:3000`

### Scripts Disponíveis

```bash
# Modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Lint do código
npm run lint
```

## 📁 Estrutura do Projeto

```
lol-db/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Layout.jsx       # Layout principal com header e footer
│   │   ├── ChampionCard.jsx # Card individual de campeão
│   │   ├── FilterBar.jsx    # Barra de filtros e busca
│   │   ├── SkeletonCard.jsx # Loading placeholder
│   │   ├── StatsRadarChart.jsx   # Gráfico radar de atributos
│   │   └── BaseStatsChart.jsx    # Gráfico de barras de stats
│   ├── pages/               # Páginas da aplicação
│   │   ├── HomePage.jsx     # Página inicial com lista
│   │   └── ChampionDetailPage.jsx # Página de detalhes
│   ├── App.jsx              # Componente raiz com rotas
│   ├── main.jsx             # Ponto de entrada da aplicação
│   └── index.css            # Estilos globais e customizações
├── database/                # Database dragontail completa
│   └── dragontail-16.1.1/   # 172 campeões com dados completos
├── public/
│   └── champions-full.json  # Dados consolidados (2.92 MB)
├── consolidate-champions.js # Script de consolidação
├── index.html               # HTML principal
├── package.json             # Dependências e scripts
├── vite.config.js           # Configuração do Vite
├── tailwind.config.js       # Configuração do Tailwind
└── postcss.config.js        # Configuração do PostCSS
```

## 🎯 Funcionalidades Técnicas

### Filtros e Busca

O sistema de filtros utiliza `useMemo` para otimização de performance, filtrando os campeões em tempo real sem re-renderizações desnecessárias.

### Scroll Infinito

Implementado com event listeners nativos do DOM, carregando 20 campeões por vez quando o usuário se aproxima do final da página.

### Gráficos Responsivos

Utiliza `ResponsiveContainer` do Recharts para garantir que os gráficos se adaptem a qualquer tamanho de tela.

### Animações

Framer Motion fornece animações declarativas com `initial`, `animate` e `transition` props, criando experiências fluidas.

### Otimização de Imagens

As imagens dos campeões são carregadas do CDN oficial da Riot (Data Dragon), com lazy loading nativo.

## 🎨 Customização

### Cores do Tema

As cores principais podem ser modificadas em `tailwind.config.js`:

```javascript
colors: {
  'lol-gold': '#C89B3C',
  'lol-blue': '#0AC8B9',
  'lol-dark': '#010A13',
  'lol-dark-secondary': '#1E2328',
  'lol-gray': '#5B5A56',
}
```

### Animações

Novos keyframes e animações podem ser adicionados em `tailwind.config.js` ou `index.css`.

## 📊 Dados

Os dados dos campeões são carregados do arquivo `champions-full.json` (database dragontail consolidada), que contém:

- 172 campeões (incluindo Ambessa, Mel, Yunara, Zaahen)
- Informações completas (nome, título, lore, tags)
- Estatísticas base e por nível
- Atributos de dificuldade e estilos de jogo

## 🌐 Deploy

Para fazer deploy em produção:

```bash
# Gerar build otimizada
npm run build

# A pasta 'dist' conterá os arquivos prontos para deploy
```

A build pode ser hospedada em:

- Vercel (recomendado para React)
- Netlify
- GitHub Pages
- Qualquer servidor estático

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas funcionalidades
- Melhorar a documentação
- Enviar pull requests

## 📝 Licença

Este projeto é apenas para fins educacionais. League of Legends e todos os assets relacionados são propriedade da Riot Games.

## 🔗 Links Úteis

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/)
- [Data Dragon API](https://developer.riotgames.com/docs/lol#data-dragon)

---

Desenvolvido com ❤️ para a comunidade de League of Legends
