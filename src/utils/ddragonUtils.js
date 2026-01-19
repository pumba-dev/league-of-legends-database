/**
 * Utilitários para trabalhar com Data Dragon API
 */

// Cache para a versão do Data Dragon
let cachedVersion = null;

/**
 * Busca a versão mais recente do Data Dragon
 * @returns {Promise<string>} Versão mais recente
 */
const fetchLatestVersion = async () => {
  if (cachedVersion) return cachedVersion;

  try {
    const response = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json",
    );
    if (!response.ok) throw new Error("Falha ao buscar versões");
    const versions = await response.json();
    cachedVersion = versions[0]; // Primeira versão é sempre a mais recente
    return cachedVersion;
  } catch (error) {
    console.error("Erro ao buscar versão do Data Dragon:", error);
    return "16.1.1"; // Fallback para versão conhecida
  }
};

/**
 * Exporta a função para obter a versão (para uso em componentes)
 * @returns {Promise<string>} Versão mais recente
 */
export const getLatestVersion = fetchLatestVersion;

// Mapeamento de idiomas i18n para códigos do Data Dragon
const languageMap = {
  "pt-BR": "pt_BR",
  "en-US": "en_US",
  "es-ES": "es_ES",
  "fr-FR": "fr_FR",
  "it-IT": "it_IT",
  "zh-CN": "zh_CN",
};

/**
 * Converte código de idioma i18n para código Data Dragon
 * @param {string} i18nLang - Código i18n (ex: 'pt-BR')
 * @returns {string} Código Data Dragon (ex: 'pt_BR')
 */
export const getDDragonLanguage = (i18nLang) => {
  return languageMap[i18nLang] || "en_US";
};

/**
 * Normaliza nome do campeão para uso no Data Dragon
 * A API da Riot retorna alguns nomes diferentes do Data Dragon
 * @param {string} championName - Nome do campeão da API
 * @returns {string} Nome normalizado para Data Dragon
 */
export const normalizeChampionName = (championName) => {
  const nameMap = {
    FiddleSticks: "Fiddlesticks",
    Wukong: "MonkeyKing",
    RenataGlasc: "Renata",
  };
  if (nameMap[championName]) {
    console.log("Normalizing champion name:", championName);
    console.log("Mapped name:", nameMap[championName]);
  }
  return nameMap[championName] || championName;
};

/**
 * Mapeia ID do campeão para nome
 * @param {number} championId - ID do campeão
 * @returns {string} Nome do campeão
 */
export const getChampionNameById = (championId) => {
  const championMap = {
    1: "Annie",
    2: "Olaf",
    3: "Galio",
    4: "TwistedFate",
    5: "XinZhao",
    6: "Urgot",
    7: "Leblanc",
    8: "Vladimir",
    9: "Fiddlesticks",
    10: "Kayle",
    11: "MasterYi",
    12: "Alistar",
    13: "Ryze",
    14: "Sion",
    15: "Sivir",
    16: "Soraka",
    17: "Teemo",
    18: "Tristana",
    19: "Warwick",
    20: "Nunu",
    21: "MissFortune",
    22: "Ashe",
    23: "Tryndamere",
    24: "Jax",
    25: "Morgana",
    26: "Zilean",
    27: "Singed",
    28: "Evelynn",
    29: "Twitch",
    30: "Karthus",
    31: "Chogath",
    32: "Amumu",
    33: "Rammus",
    34: "Anivia",
    35: "Shaco",
    36: "DrMundo",
    37: "Sona",
    38: "Kassadin",
    39: "Irelia",
    40: "Janna",
    41: "Gangplank",
    42: "Corki",
    43: "Karma",
    44: "Taric",
    45: "Veigar",
    48: "Trundle",
    50: "Swain",
    51: "Caitlyn",
    53: "Blitzcrank",
    54: "Malphite",
    55: "Katarina",
    56: "Nocturne",
    57: "Maokai",
    58: "Renekton",
    59: "JarvanIV",
    60: "Elise",
    61: "Orianna",
    62: "MonkeyKing",
    63: "Brand",
    64: "LeeSin",
    67: "Vayne",
    68: "Rumble",
    69: "Cassiopeia",
    72: "Skarner",
    74: "Heimerdinger",
    75: "Nasus",
    76: "Nidalee",
    77: "Udyr",
    78: "Poppy",
    79: "Gragas",
    80: "Pantheon",
    81: "Ezreal",
    82: "Mordekaiser",
    83: "Yorick",
    84: "Akali",
    85: "Kennen",
    86: "Garen",
    89: "Leona",
    90: "Malzahar",
    91: "Talon",
    92: "Riven",
    96: "KogMaw",
    98: "Shen",
    99: "Lux",
    101: "Xerath",
    102: "Shyvana",
    103: "Ahri",
    104: "Graves",
    105: "Fizz",
    106: "Volibear",
    107: "Rengar",
    110: "Varus",
    111: "Nautilus",
    112: "Viktor",
    113: "Sejuani",
    114: "Fiora",
    115: "Ziggs",
    117: "Lulu",
    119: "Draven",
    120: "Hecarim",
    121: "Khazix",
    122: "Darius",
    126: "Jayce",
    127: "Lissandra",
    131: "Diana",
    133: "Quinn",
    134: "Syndra",
    136: "AurelionSol",
    141: "Kayn",
    142: "Zoe",
    143: "Zyra",
    145: "Kaisa",
    147: "Seraphine",
    150: "Gnar",
    154: "Zac",
    157: "Yasuo",
    161: "Velkoz",
    163: "Taliyah",
    164: "Camille",
    166: "Akshan",
    200: "Belveth",
    201: "Braum",
    202: "Jhin",
    203: "Kindred",
    221: "Zeri",
    222: "Jinx",
    223: "TahmKench",
    233: "Briar",
    234: "Viego",
    235: "Senna",
    236: "Lucian",
    238: "Zed",
    240: "Kled",
    245: "Ekko",
    246: "Qiyana",
    254: "Vi",
    266: "Aatrox",
    267: "Nami",
    268: "Azir",
    350: "Yuumi",
    360: "Samira",
    412: "Thresh",
    420: "Illaoi",
    421: "RekSai",
    427: "Ivern",
    429: "Kalista",
    432: "Bard",
    497: "Rakan",
    498: "Xayah",
    516: "Ornn",
    517: "Sylas",
    518: "Neeko",
    523: "Aphelios",
    526: "Rell",
    555: "Pyke",
    711: "Vex",
    777: "Yone",
    799: "Ambessa",
    800: "Mel",
    804: "Yunara",
    875: "Sett",
    876: "Lillia",
    887: "Gwen",
    888: "Renata",
    893: "Aurora",
    895: "Nilah",
    897: "KSante",
    901: "Smolder",
    902: "Milio",
    904: "Zaahen",
    910: "Hwei",
    950: "Naafiri",
  };
  return championMap[championId] || "Unknown";
};

/**
 * Carrega lista completa de campeões do Data Dragon
 * @param {string} language - Idioma (código i18n)
 * @returns {Promise<Array>} Array de campeões
 */
export const fetchChampionsList = async (language) => {
  const ddLang = getDDragonLanguage(language);
  const version = await fetchLatestVersion();
  // Usar championFull.json para ter todos os campeões com dados completos
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${ddLang}/championFull.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha ao carregar dados");
    const data = await response.json();

    // Converter objeto de campeões em array
    return Object.values(data.data);
  } catch (error) {
    console.error("Erro ao carregar campeões:", error);
    // Fallback para inglês se o idioma falhar
    if (ddLang !== "en_US") {
      return fetchChampionsList("en-US");
    }
    return [];
  }
};

/**
 * Carrega dados completos de um campeão específico
 * @param {string} championId - ID do campeão
 * @param {string} language - Idioma (código i18n)
 * @returns {Promise<Object>} Dados completos do campeão
 */
export const fetchChampionDetails = async (championId, language) => {
  const ddLang = getDDragonLanguage(language);
  const version = await fetchLatestVersion();
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${ddLang}/champion/${championId}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Campeão não encontrado");
    const data = await response.json();

    // Retorna os dados do campeão específico
    return data.data[championId];
  } catch (error) {
    console.error(`Erro ao carregar campeão ${championId}:`, error);
    // Fallback para inglês se o idioma falhar
    if (ddLang !== "en_US") {
      return fetchChampionDetails(championId, "en-US");
    }
    return null;
  }
};

/**
 * Constrói URL para imagem de campeão
 * @param {string} imageName - Nome do arquivo da imagem
 * @returns {Promise<string>} URL completa
 */
export const getChampionImageUrl = async (imageName) => {
  const version = await fetchLatestVersion();
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${imageName}`;
};

/**
 * Constrói URL para splash art
 * @param {string} championId - ID do campeão
 * @param {number} skinNum - Número da skin
 * @returns {string} URL completa
 */
export const getSplashUrl = (championId, skinNum) => {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${skinNum}.jpg`;
};

/**
 * Constrói URL para imagem de habilidade
 * @param {string} imageName - Nome do arquivo da imagem
 * @param {string} type - Tipo: 'spell' ou 'passive'
 * @returns {Promise<string>} URL completa
 */
export const getAbilityImageUrl = async (imageName, type = "spell") => {
  const version = await fetchLatestVersion();
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/${type}/${imageName}`;
};

/**
 * Carrega lista completa de itens do Data Dragon
 * @param {string} language - Idioma (código i18n)
 * @returns {Promise<Array>} Array de itens
 */
export const fetchItemsList = async (language) => {
  const ddLang = getDDragonLanguage(language);
  const version = await fetchLatestVersion();
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${ddLang}/item.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha ao carregar itens");
    const data = await response.json();

    // Converter objeto de itens em array e adicionar ID
    return Object.entries(data.data).map(([id, item]) => ({
      ...item,
      id,
    }));
  } catch (error) {
    console.error("Erro ao carregar itens:", error);
    // Fallback para inglês se o idioma falhar
    if (ddLang !== "en_US") {
      return fetchItemsList("en-US");
    }
    return [];
  }
};

/**
 * Constrói URL para imagem de item
 * @param {string} itemId - ID do item
 * @returns {Promise<string>} URL completa
 */
export const getItemImageUrl = async (itemId) => {
  const version = await fetchLatestVersion();
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
};
