# 📖 Guia de Uso - Champion Dex 2.0

## 🎯 Visão Geral

Este guia mostra como usar todas as funcionalidades do **Champion Dex** após a atualização para a database **Dragontail 16.1.1**.

---

## 🚀 Iniciando o Projeto

### 1. Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### 2. Acessar no Navegador

```
http://localhost:3000
```

---

## 🔍 Usando os Filtros

### Barra de Busca

Digite o **nome** ou **título** do campeão:

```
Exemplos:
- "Ahri" → Encontra Ahri
- "Nine-Tailed" → Encontra Ahri
- "Shadow" → Encontra Shadow Assassin Kayn, etc.
```

### Filtro de Role

Filtra campeões por classe principal:

- **Fighter** - Lutadores corpo a corpo
- **Tank** - Tanques com alta defesa
- **Mage** - Magos com dano mágico
- **Assassin** - Assassinos de alto burst
- **Marksman** - Atiradores de longo alcance
- **Support** - Suportes e curandeiros

### Filtro de Dificuldade

Selecione o nível de complexidade:

- **Fácil (1-3)** - Ideal para iniciantes
  - Exemplos: Garen, Annie, Ashe
- **Médio (4-6)** - Requer prática
  - Exemplos: Ahri, Lux, Jinx
- **Difícil (7-10)** - Para jogadores avançados
  - Exemplos: Yasuo, Azir, Riven

### Filtro de Tipo de Recurso 💎

Filtra pelo recurso utilizado pelo campeão:

| Recurso        | Descrição               | Exemplos               |
| -------------- | ----------------------- | ---------------------- |
| **Mana**       | Recurso mágico padrão   | Ahri, Lux, Syndra      |
| **Energy**     | Regenera rapidamente    | Akali, Zed, Kennen     |
| **Rage**       | Acumula em combate      | Renekton, Shyvana      |
| **Fury**       | Gerado por ataques      | Tryndamere             |
| **Heat**       | Sistema de temperatura  | Rumble                 |
| **Blood Well** | Sistema único           | Aatrox                 |
| **Ferocity**   | Acumula com habilidades | Rengar                 |
| **Flow**       | Sistema de movimento    | Yasuo                  |
| **Courage**    | Escala com farm         | Sion                   |
| **Shield**     | Escudo próprio          | Mordekaiser            |
| **None**       | Sem recurso             | Garen, Katarina, Riven |

### Filtro de Alcance de Ataque 📏

| Categoria         | Range   | Descrição                   | Exemplos              |
| ----------------- | ------- | --------------------------- | --------------------- |
| **Corpo a Corpo** | < 200   | Ataques físicos próximos    | Garen, Darius, Riven  |
| **Curto**         | 200-400 | Alcance limitado            | Urgot, Thresh         |
| **Médio**         | 400-550 | Alcance equilibrado         | Lucian, Sivir, Jinx   |
| **Longo**         | > 550   | Atiradores de longo alcance | Caitlyn, Ashe, Xerath |

---

## 🏠 Página Inicial (HomePage)

### Visão Geral

- **Grid Responsivo** - 1 a 4 colunas dependendo da tela
- **Scroll Infinito** - Carrega 20 campeões por vez
- **Stats Overview** - Estatísticas gerais dos campeões

### Cards de Campeão

Cada card exibe:

- 🖼️ **Imagem** do campeão
- 📛 **Nome** e **Título**
- 🏷️ **Tags/Roles** (até 2)
- ⭐ **Dificuldade** (1-10 estrelas)
- 🎨 **Efeito hover** com gradient colorido

### Navegação

- Clique no card para ver detalhes completos
- Barra de rolagem carrega mais campeões automaticamente

---

## 📋 Página de Detalhes (ChampionDetailPage)

### Hero Section

- 🎨 **Splash Art** em tela cheia
- 🖼️ **Ícone Square** do campeão
- 📛 **Nome** e **Título**
- 🏷️ **Tags/Roles**

### Seção de História

📖 **Lore Completa** - História e origem do campeão

### Gráficos de Estatísticas

#### 1. Radar Chart (Atributos)

Visualiza 4 atributos principais:

- 🗡️ **Attack** (0-10) - Potencial de dano físico
- 🛡️ **Defense** (0-10) - Resistência e tanque
- ✨ **Magic** (0-10) - Dano mágico e AP scaling
- 🎯 **Difficulty** (0-10) - Complexidade

#### 2. Bar Chart (Stats Base)

Estatísticas fundamentais:

- ❤️ **HP** - Pontos de vida
- 💙 **MP** - Mana/Energia/Recurso
- 🛡️ **Armor** - Armadura física
- 🔮 **MR** - Resistência mágica
- ⚔️ **AD** - Dano de ataque
- 👟 **Speed** - Velocidade de movimento

### Tabela de Estatísticas Detalhadas

15 stats completos com valores por nível:

- HP / HP por Nível
- Mana / Mana por Nível
- Armadura / Armadura por Nível
- RM / RM por Nível
- AD / AD por Nível
- Attack Speed
- Movement Speed
- Attack Range
- Regeneração HP
- Regeneração Mana

---

## 🔮 Seção de Habilidades

### Passiva

- 💡 **Ícone** da habilidade passiva
- 📝 **Nome** e **Descrição**
- 🎨 **Destaque amarelo**

### Habilidades Ativas (Q/W/E/R)

Cada habilidade mostra:

| Campo         | Descrição                   | Exemplo                |
| ------------- | --------------------------- | ---------------------- |
| **Ícone**     | Imagem da habilidade        | ![Q Icon]              |
| **Nome**      | Nome oficial da skill       | "Orb of Deception"     |
| **Descrição** | Como funciona               | "Ahri sends out..."    |
| **Cooldown**  | Tempo de recarga (5 níveis) | 7 / 6.5 / 6 / 5.5 / 5  |
| **Custo**     | Gasto de recurso            | 65 / 70 / 75 / 80 / 85 |
| **Alcance**   | Distância máxima            | 880                    |
| **Max Rank**  | Nível máximo                | 5                      |

#### Cores por Tecla

- 🟡 **Passiva** - Amarelo
- 🔵 **Q** - Azul
- 🟣 **W** - Roxo
- 🟢 **E** - Verde
- 🔴 **R** - Vermelho

---

## 🎨 Galeria de Skins

### Funcionalidades

- 🖼️ **Preview em Tela Cheia** - Skin selecionada em destaque
- 🎞️ **Grid de Thumbnails** - Todas as skins em miniaturas
- 🎨 **Indicador de Chromas** - Badge "🎨" para skins com variações
- ↔️ **Navegação por Clique** - Clique no thumbnail para trocar
- 📱 **Responsivo** - 4 a 8 colunas conforme a tela

### Como Usar

1. A skin padrão aparece primeiro
2. Role para ver todas as thumbnails
3. Clique em qualquer thumbnail para preview
4. Skins com 🎨 possuem chromas disponíveis

### Exemplos de Skins Populares

- **Ahri**
  - Dynasty Ahri
  - Midnight Ahri
  - Foxfire Ahri
  - Popstar Ahri
  - K/DA Ahri
  - Star Guardian Ahri
  - Spirit Blossom Ahri
  - (13 skins totais)

---

## 💡 Seção de Tips

### 🟢 Ally Tips (Jogando COM o Campeão)

Dicas para **maximizar** o potencial:

- Como usar combos de habilidades
- Sinergias com outros campeões
- Momento ideal para engajar
- Estratégias de farm e macro

**Exemplo (Ahri):**

```
1. Use Charm to set up your combos, it makes landing your other
   abilities significantly easier.
2. Essence Theft allows you to sustain yourself in lane, giving
   you the survivability edge.
3. Use Spirit Rush intelligently - it's your escape, engage, and
   chase tool.
```

### 🔴 Enemy Tips (Jogando CONTRA o Campeão)

Dicas para **counterear** o campeão:

- Janelas de vulnerabilidade
- Como evitar habilidades principais
- Items recomendados
- Estratégias de team fight

**Exemplo (Ahri):**

```
1. Ahri's survivability is dramatically reduced when her ultimate
   is down. Stay out of range until you see it used.
2. Charm will only stun one target, positioning behind your team
   will prevent her from landing it on you.
3. Stay behind your minions to avoid Charm, which has a slow
   projectile speed.
```

---

## 🎮 Casos de Uso Comuns

### Caso 1: Encontrar Campeão Iniciante de Mana

```
Filtros:
✓ Dificuldade: Fácil (1-3)
✓ Tipo de Recurso: Mana

Resultados: Annie, Ashe, Garen (sem mana), etc.
```

### Caso 2: Assassinos de Energia de Longo Alcance

```
Filtros:
✓ Role: Assassin
✓ Tipo de Recurso: Energy
✓ Alcance: Médio ou Longo

Resultados: Kennen, Akali (médio)
```

### Caso 3: Tanques Fáceis de Corpo a Corpo

```
Filtros:
✓ Role: Tank
✓ Dificuldade: Fácil (1-3)
✓ Alcance: Corpo a Corpo

Resultados: Garen, Malphite, Mundo
```

### Caso 4: Magos Sem Mana de Alta Dificuldade

```
Filtros:
✓ Role: Mage
✓ Tipo de Recurso: None
✓ Dificuldade: Difícil (7-10)

Resultados: Vladimir, Rumble
```

---

## 📱 Responsividade

### Desktop (> 1024px)

- Grid de 4 colunas
- Sidebar de stats visível
- Preview de skins em 8 colunas

### Tablet (768px - 1024px)

- Grid de 3 colunas
- Filtros em 2 linhas
- Preview de skins em 6 colunas

### Mobile (< 768px)

- Grid de 1-2 colunas
- Filtros empilhados verticalmente
- Preview de skins em 4 colunas
- Navigation menu hamburguer

---

## ⌨️ Atalhos de Teclado

| Tecla       | Ação                      |
| ----------- | ------------------------- |
| `/`         | Focar na busca            |
| `Esc`       | Limpar busca              |
| `↑` `↓`     | Navegar pelos cards       |
| `Enter`     | Abrir detalhes do campeão |
| `Backspace` | Voltar à lista            |

---

## 🔧 Personalização

### Mudando o Idioma (Futuro)

```javascript
// Em HomePage.jsx, trocar:
const response = await fetch("/champions-full.json");

// Para outro idioma:
const response = await fetch("/champions-full-pt_BR.json");
```

### Adicionando Novo Filtro

```javascript
// 1. Em FilterBar.jsx, adicionar estado:
const [selectedNewFilter, setSelectedNewFilter] = useState('all')

// 2. Adicionar ao useEffect:
useEffect(() => {
  onFilterChange({
    // ... outros filtros
    newFilter: selectedNewFilter
  })
}, [..., selectedNewFilter])

// 3. Adicionar select no JSX
```

---

## 🐛 Troubleshooting

### Imagens Não Carregam

**Problema:** Cards aparecem sem imagem
**Solução:** Verificar se a pasta `/database/dragontail-16.1.1/` existe

### Filtros Não Funcionam

**Problema:** Filtros não alteram resultados
**Solução:** Verificar console do navegador, pode ser problema no `champions-full.json`

### Site Muito Lento

**Problema:** Carregamento demorado
**Solução:**

1. Usar `npm run build` para versão otimizada
2. Verificar tamanho do `champions-full.json` (deve ser ~2.92 MB)

### Erro 404 no champions-full.json

**Problema:** Arquivo não encontrado
**Solução:** Executar `node consolidate-champions.js` novamente

---

## 📊 Estatísticas do Projeto

### Componentes

- **10 componentes reutilizáveis**
- **3 novos componentes** (AbilityCard, SkinsGallery, TipsSection)
- **2 páginas principais** (Home, Detail)

### Dados

- **172 campeões** (168 + 4 novos)
- **28 idiomas** disponíveis
- **2.92 MB** de dados JSON
- **Centenas de skins** catalogadas

### Performance

- **< 1s** carregamento inicial
- **20 campeões** por scroll
- **Lazy loading** de imagens
- **Memoization** de filtros

---

## 📚 Referências

### Documentação Relacionada

- [README.md](./README.md) - Documentação principal
- [DRAGONTAIL_STRUCTURE.md](./DRAGONTAIL_STRUCTURE.md) - Estrutura da database
- [DRAGONTAIL_UPGRADE_SUMMARY.md](./DRAGONTAIL_UPGRADE_SUMMARY.md) - Resumo da atualização
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Solução de problemas

### Links Externos

- [Riot Games Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon)
- [League of Legends Official](https://www.leagueoflegends.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

## 🎯 Próximas Atualizações

### Em Desenvolvimento

- [ ] Sistema de favoritos
- [ ] Comparação de campeões lado a lado
- [ ] Suporte a múltiplos idiomas

### Planejado

- [ ] Calculadora de builds
- [ ] Integração com API Riot para stats ao vivo
- [ ] Modo dark/light toggle

---

**Versão:** 2.0.0
**Última Atualização:** 19/01/2025
**Autor:** Champion Dex Team

---

## ❓ FAQ

### P: Como atualizar a database quando a Riot lançar nova versão?

**R:** Execute `node consolidate-champions.js` com a nova pasta dragontail.

### P: Posso usar isso em produção?

**R:** Sim! Execute `npm run build` e hospede a pasta `dist/`.

### P: Como contribuir com o projeto?

**R:** Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para guidelines.

### P: Onde está o arquivo champions-full.json?

**R:** Em `/public/champions-full.json` (gerado pelo consolidate script).

### P: Posso adicionar meus próprios campeões customizados?

**R:** Sim! Adicione ao `champions-full.json` seguindo o schema documentado.

---

**🎮 Bom jogo e boa exploração dos campeões! 🎮**
