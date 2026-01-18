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
