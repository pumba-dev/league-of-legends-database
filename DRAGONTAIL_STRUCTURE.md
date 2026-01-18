# 📦 Dragontail Database - Estrutura Completa

## 📋 Visão Geral

A pasta `dragontail-16.1.1` contém a base de dados oficial completa do League of Legends (Data Dragon), versão **16.1.1**. Esta é uma base de dados muito mais rica e detalhada que a anterior, incluindo:

- ✅ **171 campeões** (incluindo novos: Ambessa, Mel, Yunara, Zaahen)
- ✅ **Habilidades completas** (Q, W, E, R) com descrições, danos, cooldowns
- ✅ **Passivas detalhadas** de cada campeão
- ✅ **Skins e Chromas** de todos os campeões
- ✅ **Dicas para aliados e inimigos**
- ✅ **Lore completa** de cada campeão
- ✅ **Múltiplos idiomas** (28 idiomas disponíveis)
- ✅ **Imagens de alta qualidade** (splash arts, loadings, tiles, centered)

## 🗂️ Estrutura de Diretórios

```
database/dragontail-16.1.1/
│
├── 📁 16.1.1/                          # Versão principal
│   ├── 📁 css/                         # Estilos CSS
│   ├── 📁 data/                        # DADOS PRINCIPAIS
│   │   ├── 📁 en_US/                   # Inglês (US)
│   │   ├── 📁 pt_BR/                   # Português (Brasil)
│   │   ├── 📁 es_ES/                   # Espanhol (Espanha)
│   │   ├── 📁 fr_FR/                   # Francês
│   │   ├── 📁 ja_JP/                   # Japonês
│   │   ├── 📁 ko_KR/                   # Coreano
│   │   └── ... (28 idiomas no total)
│   │
│   ├── 📁 img/                         # Imagens
│   │   ├── champion/
│   │   ├── item/
│   │   ├── spell/
│   │   ├── passive/
│   │   └── ...
│   │
│   ├── 📁 js/                          # JavaScript
│   ├── manifest.js
│   └── manifest.json
│
├── 📁 img/                             # Imagens de alta qualidade
│   ├── 📁 champion/
│   │   ├── 📁 splash/                  # Splash arts (1215x717)
│   │   ├── 📁 loading/                 # Loading screens (308x560)
│   │   ├── 📁 centered/                # Imagens centralizadas
│   │   └── 📁 tiles/                   # Tiles menores
│   │
│   ├── 📁 bg/                          # Backgrounds
│   ├── 📁 challenges-images/           # Desafios
│   └── 📁 perk-images/                 # Runas/Perks
│
├── dragonhead.js
├── languages.js
└── languages.json                      # Lista de idiomas
```

## 📊 Estrutura de Dados (en_US)

### Arquivos Principais

```
16.1.1/data/en_US/
│
├── 📄 champion.json                    # Lista resumida de campeões
├── 📄 championFull.json                # TODOS os campeões (completo)
├── 📁 champion/                        # Campeões individuais
│   ├── Aatrox.json
│   ├── Ahri.json
│   ├── Ambessa.json                    # NOVO!
│   ├── Mel.json                        # NOVO!
│   ├── Yunara.json                     # NOVO!
│   ├── Zaahen.json                     # NOVO!
│   └── ... (171 arquivos)
│
├── 📄 item.json                        # Itens do jogo
├── 📄 summoner.json                    # Feitiços de invocador
├── 📄 runesReforged.json              # Runas
├── 📄 profileicon.json                 # Ícones de perfil
└── ... (outros arquivos de jogo)
```

## 🛡️ Estrutura de um Campeão (JSON)

### Campos Disponíveis

```json
{
  "type": "champion",
  "format": "standAloneComplex",
  "version": "16.1.1",
  "data": {
    "ChampionName": {
      // === INFORMAÇÕES BÁSICAS ===
      "id": "Aatrox",
      "key": "266", // ID numérico
      "name": "Aatrox",
      "title": "the Darkin Blade",

      // === IMAGEM PRINCIPAL ===
      "image": {
        "full": "Aatrox.png",
        "sprite": "champion0.png",
        "group": "champion",
        "x": 0,
        "y": 0,
        "w": 48,
        "h": 48
      },

      // === SKINS E CHROMAS ===
      "skins": [
        {
          "id": "266000",
          "num": 0,
          "name": "default",
          "chromas": false
        },
        {
          "id": "266001",
          "num": 1,
          "name": "Justicar Aatrox",
          "chromas": false
        }
        // ... todas as skins
      ],

      // === LORE COMPLETO ===
      "lore": "Once honored defenders of Shurima...",
      "blurb": "Short version...",

      // === DICAS ===
      "allytips": [
        "Use Umbral Dash while casting...",
        "Crowd Control abilities..."
      ],
      "enemytips": [
        "Aatrox's attacks are very telegraphed...",
        "Keep your distance when Aatrox uses..."
      ],

      // === CLASSIFICAÇÃO ===
      "tags": ["Fighter"],
      "partype": "Blood Well",
      "info": {
        "attack": 8,
        "defense": 4,
        "magic": 3,
        "difficulty": 4
      },

      // === ESTATÍSTICAS ===
      "stats": {
        "hp": 650,
        "hpperlevel": 114,
        "mp": 0,
        "mpperlevel": 0,
        "movespeed": 345,
        "armor": 38,
        "armorperlevel": 4.8,
        "spellblock": 32,
        "spellblockperlevel": 2.05,
        "attackrange": 175,
        "hpregen": 3,
        "hpregenperlevel": 0.5,
        "mpregen": 0,
        "mpregenperlevel": 0,
        "crit": 0,
        "critperlevel": 0,
        "attackdamage": 60,
        "attackdamageperlevel": 5,
        "attackspeedperlevel": 2.5,
        "attackspeed": 0.651
      },

      // === HABILIDADES (Q, W, E, R) ===
      "spells": [
        {
          "id": "AatroxQ",
          "name": "The Darkin Blade",
          "description": "Aatrox slams his greatsword down...",
          "tooltip": "Aatrox slams his greatsword...",
          "leveltip": {
            "label": ["Cooldown", "Damage", "Total AD Ratio"],
            "effect": ["14/12/10/8/6", "10/20/30/40/50", "..."]
          },
          "maxrank": 5,
          "cooldown": [14, 12, 10, 8, 6],
          "cooldownBurn": "14/12/10/8/6",
          "cost": [0, 0, 0, 0, 0],
          "costBurn": "0",
          "range": [25000, 25000, 25000, 25000, 25000],
          "rangeBurn": "25000",
          "image": {
            "full": "AatroxQ.png",
            "sprite": "spell0.png",
            "group": "spell",
            "x": 384,
            "y": 48,
            "w": 48,
            "h": 48
          },
          "resource": "No Cost"
        }
        // ... W, E, R
      ],

      // === PASSIVA ===
      "passive": {
        "name": "Deathbringer Stance",
        "description": "Periodically, Aatrox's next basic attack...",
        "image": {
          "full": "Aatrox_Passive.png",
          "sprite": "passive0.png",
          "group": "passive",
          "x": 0,
          "y": 0,
          "w": 48,
          "h": 48
        }
      },

      "recommended": []
    }
  }
}
```

## 🆕 Novos Campeões (vs. Database Antiga)

A nova database inclui **4 novos campeões**:

1. **Ambessa** - Novo campeão
2. **Mel** - Novo campeão
3. **Yunara** - Novo campeão
4. **Zaahen** - Novo campeão

**Total:** 171 campeões (vs. 168 da database antiga)

## 🎨 Tipos de Imagens Disponíveis

### 1. Splash Arts (`img/champion/splash/`)

- **Resolução:** 1215x717 pixels
- **Formato:** JPG
- **Exemplo:** `Aatrox_0.jpg` (skin padrão)
- **Exemplo:** `Aatrox_1.jpg` (primeira skin)

### 2. Loading Screens (`img/champion/loading/`)

- **Resolução:** 308x560 pixels
- **Formato:** JPG
- **Uso:** Tela de loading do jogo

### 3. Centered (`img/champion/centered/`)

- **Resolução:** 1024x1024 pixels
- **Formato:** JPG
- **Uso:** Imagem centralizada do campeão

### 4. Tiles (`img/champion/tiles/`)

- **Resolução:** 120x120 pixels
- **Formato:** JPG
- **Uso:** Miniaturas

### 5. Icons (`16.1.1/img/champion/`)

- **Resolução:** 48x48 pixels (sprite)
- **Formato:** PNG
- **Uso:** Ícones pequenos

## 📝 Novos Dados Disponíveis

### Informações que NÃO estavam na database antiga:

1. ✅ **Habilidades Completas** (Q, W, E, R)
   - Nome, descrição, tooltip
   - Cooldown por nível
   - Custo de mana/energia
   - Alcance
   - Dano base e escalamento
   - Imagem da habilidade

2. ✅ **Passiva Detalhada**
   - Nome e descrição completa
   - Imagem

3. ✅ **Skins e Chromas**
   - Lista completa de todas as skins
   - Indicação de quais têm chromas
   - ID de cada skin

4. ✅ **Dicas de Jogo**
   - `allytips`: Dicas para quem joga COM o campeão
   - `enemytips`: Dicas para jogar CONTRA o campeão

5. ✅ **Lore Completo**
   - História completa (não apenas resumo)
   - Blurb (resumo curto)

6. ✅ **Múltiplos Idiomas**
   - 28 idiomas disponíveis
   - Fácil internacionalização

## 🎯 Novos Filtros Possíveis

Com a nova database, podemos adicionar filtros por:

### 1. **Tipo de Recurso** (`partype`)

- Mana
- Energy
- Rage
- Blood Well
- Shield
- Fury
- Ferocity
- Heat
- No Cost
- ...

### 2. **Alcance** (`attackrange`)

- Corpo a Corpo (< 200)
- Curto Alcance (200-400)
- Médio Alcance (400-550)
- Longo Alcance (> 550)

### 3. **Tipo de Dano Principal**

- Físico (AD)
- Mágico (AP)
- Misto
- True Damage

### 4. **Possui Skins**

- Com Chromas
- Sem Chromas
- Skins Prestige
- Quantidade de skins

### 5. **Estatísticas**

- HP Base (Tanques vs. Squishies)
- Velocidade de Movimento
- Armadura Base
- etc.

## 📊 Comparação: Database Antiga vs. Nova

| Característica  | Antiga (`champions_18-01-2026.json`) | Nova (`dragontail-16.1.1`) |
| --------------- | ------------------------------------ | -------------------------- |
| **Campeões**    | 168                                  | 171 (+3 novos)             |
| **Habilidades** | ❌ Não                               | ✅ Sim (Q, W, E, R)        |
| **Passiva**     | ❌ Não                               | ✅ Sim                     |
| **Skins**       | ❌ Não                               | ✅ Sim (todas)             |
| **Dicas**       | ❌ Não                               | ✅ Sim (ally/enemy)        |
| **Lore**        | Resumo                               | ✅ Completo                |
| **Idiomas**     | 1 (EN)                               | ✅ 28 idiomas              |
| **Imagens**     | Externa (CDN)                        | ✅ Local (4 tipos)         |
| **Tamanho**     | ~7MB                                 | ~50MB+ (com imagens)       |

## 🚀 Melhorias no Site

Com a nova database, podemos implementar:

1. **Seção de Habilidades**
   - Mostrar Q, W, E, R com ícones
   - Descrição de cada habilidade
   - Cooldown e custos
   - Escalamento de dano

2. **Passiva Destacada**
   - Card especial para a passiva
   - Imagem e descrição

3. **Galeria de Skins**
   - Carousel com todas as skins
   - Filtro por skins com chromas
   - Contador de skins

4. **Dicas de Jogo**
   - Seção "Como Jogar"
   - Seção "Como Jogar Contra"

5. **Filtros Avançados**
   - Por tipo de recurso
   - Por alcance de ataque
   - Por tipo de dano

6. **Internacionalização**
   - Suporte para múltiplos idiomas
   - Toggle de idioma

## 📂 Arquivos Recomendados para Uso

Para otimizar o site, recomendo:

1. **Dados dos Campeões:**
   - `16.1.1/data/en_US/champion/[Nome].json` (individual)
   - Ou criar um arquivo consolidado

2. **Imagens:**
   - Splash Arts: `img/champion/splash/`
   - Ícones de habilidades: `16.1.1/img/spell/`
   - Ícones de passiva: `16.1.1/img/passive/`
   - Ícones pequenos: `16.1.1/img/champion/`

## 💡 Próximos Passos

1. ✅ Criar script para consolidar dados
2. ✅ Atualizar componentes do site
3. ✅ Adicionar seção de habilidades
4. ✅ Implementar novos filtros
5. ✅ Adicionar galeria de skins
6. ✅ Implementar dicas de jogo

---

**Versão da Database:** 16.1.1  
**Data:** Janeiro 2026  
**Total de Campeões:** 171  
**Idiomas Disponíveis:** 28
