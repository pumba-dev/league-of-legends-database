/**
 * Riot API Utilities
 * Funções para interagir com as APIs da Riot Games
 */

// Nota: Para produção, você precisará de uma API Key da Riot Games
// e um backend proxy para fazer as chamadas (CORS e segurança)
const RIOT_API_KEY = import.meta.env.VITE_RIOT_API_KEY;

// Validar se a API key está configurada
if (!RIOT_API_KEY || RIOT_API_KEY === "RGAPI-your-api-key-here") {
  console.error(
    "⚠️ RIOT API KEY não configurada! Configure em .env: VITE_RIOT_API_KEY=sua-chave",
  );
}

// Regiões disponíveis
export const REGIONS = {
  BR1: { name: "Brasil", platform: "br1", region: "americas" },
  NA1: { name: "North America", platform: "na1", region: "americas" },
  EUW1: { name: "Europe West", platform: "euw1", region: "europe" },
  EUNE1: { name: "Europe Nordic & East", platform: "eun1", region: "europe" },
  KR: { name: "Korea", platform: "kr", region: "asia" },
  JP1: { name: "Japan", platform: "jp1", region: "asia" },
  LA1: { name: "Latin America North", platform: "la1", region: "americas" },
  LA2: { name: "Latin America South", platform: "la2", region: "americas" },
  OC1: { name: "Oceania", platform: "oc1", region: "sea" },
  TR1: { name: "Turkey", platform: "tr1", region: "europe" },
  RU: { name: "Russia", platform: "ru", region: "europe" },
  PH2: { name: "Philippines", platform: "ph2", region: "sea" },
  SG2: { name: "Singapore", platform: "sg2", region: "sea" },
  TH2: { name: "Thailand", platform: "th2", region: "sea" },
  TW2: { name: "Taiwan", platform: "tw2", region: "sea" },
  VN2: { name: "Vietnam", platform: "vn2", region: "sea" },
};

/**
 * Função helper para fazer requisições com retry logic
 */
const fetchWithRetry = async (
  url,
  options = {},
  retries = 3,
  skipRetryOn404 = false,
) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(
        `[Riot API] Requesting: ${url.replace(RIOT_API_KEY, "API_KEY_HIDDEN")}`,
      );
      const response = await fetch(url, options);

      if (response.status === 429) {
        // Rate limit - aguardar e tentar novamente
        const retryAfter = response.headers.get("Retry-After") || 5;
        console.warn(`[Riot API] Rate limited. Retrying after ${retryAfter}s`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[Riot API] Error ${response.status}: ${errorBody}`);

        // Se é 404 e devemos pular retry, retornar erro imediatamente
        if (skipRetryOn404 && response.status === 404) {
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorBody}`,
          );
        }

        throw new Error(
          `HTTP error! status: ${response.status} - ${errorBody}`,
        );
      }

      const data = await response.json();
      console.log(`[Riot API] Success:`, data);
      return data;
    } catch (error) {
      // Se é 404 e devemos pular retry, lançar erro imediatamente
      if (skipRetryOn404 && error.message.includes("404")) {
        throw error;
      }

      console.error(`[Riot API] Attempt ${i + 1}/${retries} failed:`, error);
      if (i === retries - 1) throw error;
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000),
      );
    }
  }
};

/**
 * Buscar conta por Riot ID
 * @param {string} gameName - Nome do jogador
 * @param {string} tagLine - Tag da Riot (ex: BR1)
 * @param {string} region - Região (americas, europe, asia, sea)
 */
export const getAccountByRiotId = async (gameName, tagLine, region) => {
  const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?api_key=${RIOT_API_KEY}`;
  return await fetchWithRetry(url);
};

/**
 * Buscar dados do invocador por PUUID
 * @param {string} puuid - PUUID do jogador
 * @param {string} platform - Platform (br1, na1, etc)
 */
export const getSummonerByPuuid = async (puuid, platform) => {
  const url = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`;
  return await fetchWithRetry(url);
};

/**
 * Buscar dados de ranked do invocador
 * @param {string} puuid - PUUID do jogador
 * @param {string} platform - Platform (br1, na1, etc)
 */
export const getLeagueEntries = async (puuid, platform) => {
  // Primeiro, precisamos buscar o summoner para obter o ID encriptado
  const summoner = await getSummonerByPuuid(puuid, platform);

  // A resposta pode ou não ter o campo 'id'. Se não tiver, tentamos buscar por PUUID
  if (summoner.id) {
    const url = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}?api_key=${RIOT_API_KEY}`;
    return await fetchWithRetry(url);
  } else {
    // Fallback: buscar por PUUID usando o endpoint alternativo
    // Nota: Este endpoint pode não existir em todas as regiões
    try {
      const url = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`;
      return await fetchWithRetry(url);
    } catch (error) {
      console.warn("Não foi possível buscar dados de ranked:", error);
      return []; // Retorna array vazio se falhar
    }
  }
};

/**
 * Buscar IDs das últimas partidas
 * @param {string} puuid - PUUID do jogador
 * @param {string} region - Região de roteamento (americas, europe, asia, sea)
 * @param {number} count - Número de partidas (default: 20, max: 100)
 * @param {number} start - Offset (default: 0)
 */
export const getMatchIds = async (puuid, region, count = 20, start = 0) => {
  if (!puuid) throw new Error("PUUID é obrigatório");
  if (!["americas", "europe", "asia", "sea"].includes(region)) {
    throw new Error(
      `Região inválida: ${region}. Use: americas, europe, asia ou sea`,
    );
  }

  const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${RIOT_API_KEY}`;
  return await fetchWithRetry(url);
};

/**
 * Buscar detalhes de uma partida
 * @param {string} matchId - ID da partida (formato: REGION_MATCHID, ex: BR1_2839203940)
 * @param {string} region - Região de roteamento (americas, europe, asia, sea)
 */
export const getMatchDetails = async (matchId, region) => {
  if (!matchId) throw new Error("Match ID é obrigatório");
  if (!["americas", "europe", "asia", "sea"].includes(region)) {
    throw new Error(
      `Região inválida: ${region}. Use: americas, europe, asia ou sea`,
    );
  }

  const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`;
  return await fetchWithRetry(url);
};

/**
 * Buscar partida ao vivo
 * @param {string} puuid - PUUID do jogador
 * @param {string} platform - Platform (br1, na1, etc)
 */
export const getActiveGame = async (puuid, platform) => {
  try {
    const url = `https://${platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}?api_key=${RIOT_API_KEY}`;
    return await fetchWithRetry(url, {}, 1, true); // skipRetryOn404=true, retries=1
  } catch (error) {
    if (error.message.includes("404")) {
      return null; // Jogador não está em partida
    }
    throw error;
  }
};

/**
 * Validar formato do Riot ID
 * @param {string} riotId - Riot ID no formato "Nome#TAG"
 * @returns {Object|null} { gameName, tagLine } ou null se inválido
 */
export const validateRiotId = (riotId) => {
  const match = riotId.match(/^(.+)#(.+)$/);
  if (!match) return null;

  const [, gameName, tagLine] = match;
  if (gameName.length < 3 || gameName.length > 16) return null;
  if (tagLine.length < 3 || tagLine.length > 5) return null;

  return { gameName: gameName.trim(), tagLine: tagLine.trim() };
};

/**
 * Obter URL do ícone de perfil
 * @param {number} profileIconId - ID do ícone
 * @param {string} version - Versão do Data Dragon
 */
export const getProfileIconUrl = (profileIconId, version = "14.1.1") => {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`;
};

/**
 * Obter cor do tier
 * @param {string} tier - Tier (IRON, BRONZE, SILVER, etc)
 */
export const getTierColor = (tier) => {
  const colors = {
    IRON: "#6B6B6B",
    BRONZE: "#CD7F32",
    SILVER: "#C0C0C0",
    GOLD: "#FFD700",
    PLATINUM: "#00CED1",
    EMERALD: "#50C878",
    DIAMOND: "#B9F2FF",
    MASTER: "#9D4EDD",
    GRANDMASTER: "#FF4655",
    CHALLENGER: "#F4C430",
  };
  return colors[tier] || "#C8AA6E";
};

/**
 * Calcular KDA ratio
 * @param {number} kills
 * @param {number} deaths
 * @param {number} assists
 */
export const calculateKDA = (kills, deaths, assists) => {
  if (deaths === 0) return ((kills + assists) * 1.2).toFixed(2);
  return ((kills + assists) / deaths).toFixed(2);
};

/**
 * Formatar tempo desde a partida
 * @param {number} timestamp - Timestamp da partida
 * @param {string} locale - Locale para tradução
 */
export const getTimeAgo = (timestamp, locale = "pt-BR") => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}min atrás`;
  return "Agora";
};

/**
 * Obter nome do modo de jogo
 * @param {number} queueId - ID da fila
 */
export const getQueueName = (queueId) => {
  const queues = {
    420: "Ranked Solo/Duo",
    440: "Ranked Flex",
    400: "Normal Draft",
    430: "Normal Blind",
    450: "ARAM",
    900: "URF",
    1020: "One For All",
    1300: "Nexus Blitz",
    1700: "Arena",
  };
  return queues[queueId] || "Custom";
};

/**
 * Cache simples para evitar requisições repetidas
 */
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const getCachedData = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

export const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

/**
 * Buscar maestria de campeões
 * @param {string} puuid - PUUID do jogador
 * @param {string} platform - Platform (br1, na1, etc)
 * @param {number} count - Número de campeões (default: 5)
 */
export const getChampionMastery = async (puuid, platform, count = 5) => {
  try {
    const url = `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}&api_key=${RIOT_API_KEY}`;
    return await fetchWithRetry(url);
  } catch (error) {
    console.warn("Error fetching champion mastery:", error);
    return [];
  }
};

/**
 * Mapear summoner spell ID para nome
 */
export const getSummonerSpellName = (spellId) => {
  const spells = {
    1: "SummonerBoost", // Cleanse
    3: "SummonerExhaust",
    4: "SummonerFlash",
    6: "SummonerHaste", // Ghost
    7: "SummonerHeal",
    11: "SummonerSmite",
    12: "SummonerTeleport",
    13: "SummonerMana", // Clarity
    14: "SummonerdIgnite", // Ignite
    21: "SummonerBarrier",
    30: "SummonerPoroRecall",
    31: "SummonerPoroThrow",
    32: "SummonerSnowball", // Mark/Dash (ARAM)
    39: "SummonerSnowURFSwapBuff", // URF
    54: "Summoner_UltBookPlaceholder",
    55: "Summoner_UltBookSmitePlaceholder",
  };
  return spells[spellId] || `SummonerSpell${spellId}`;
};

/**
 * Obter nome da lane
 */
export const getLaneName = (lane, role) => {
  const lanes = {
    TOP: "Top",
    JUNGLE: "Jungle",
    MIDDLE: "Mid",
    BOTTOM: "Bot",
    UTILITY: "Support",
    NONE: "None",
  };
  return lanes[lane] || lanes[role] || "Unknown";
};
