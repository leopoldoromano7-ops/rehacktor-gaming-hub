import { humanizeSlug } from '../utils/game-utils.js'

const RAWG_API_ROOT = 'https://api.rawg.io/api'
const rawgApiKey = import.meta.env.VITE_API_KEY?.trim() || ''

function getCurrentYear() {
  return new Date().getFullYear()
}

function assertApiKey() {
  if (!rawgApiKey) {
    throw new Error('RAWG API key mancante. Imposta VITE_API_KEY nel file .env.')
  }
}

function buildRawgUrl(endpoint, params = {}) {
  const url = new URL(endpoint.replace(/^\/+/, ''), `${RAWG_API_ROOT}/`)
  url.searchParams.set('key', rawgApiKey)

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

async function fetchRawg(endpoint, params = {}, signal) {
  assertApiKey()

  const response = await fetch(buildRawgUrl(endpoint, params), { signal })

  if (!response.ok) {
    throw new Error(`RAWG request failed with status ${response.status}`)
  }

  return response.json()
}

export async function getGenresPayload(signal) {
  const data = await fetchRawg('genres', { page_size: 20 }, signal)

  return {
    genres: data.results ?? [],
    source: 'rawg',
    sourceMessage: 'Generi e dati arrivano live da RAWG.',
  }
}

export async function getHomepagePayload(signal) {
  const currentYear = getCurrentYear()
  const data = await fetchRawg(
    'games',
    {
      dates: `${currentYear}-01-01,${currentYear}-12-31`,
      ordering: '-metacritic',
      page_size: 12,
    },
    signal,
  )

  return {
    games: data.results ?? [],
    totalCount: data.count ?? data.results?.length ?? 0,
    sortMode: 'catalog',
    source: 'rawg',
    sourceMessage: `Feed live RAWG con i giochi del ${currentYear}.`,
  }
}

export async function getHomepagePayloadBySort(sortMode, signal) {
  const currentYear = getCurrentYear()
  const ordering =
    sortMode === 'trending'
      ? '-added'
      : sortMode === 'top-rated'
        ? '-rating'
        : '-metacritic'
  const sourceMessage =
    sortMode === 'trending'
      ? `Feed live RAWG ordinato per popolarita e aggiunte recenti del ${currentYear}.`
      : sortMode === 'top-rated'
        ? `Feed live RAWG ordinato per rating dei giochi del ${currentYear}.`
        : `Feed live RAWG con i giochi del ${currentYear}.`
  const data = await fetchRawg(
    'games',
    {
      dates: `${currentYear}-01-01,${currentYear}-12-31`,
      ordering,
      page_size: 12,
    },
    signal,
  )

  return {
    games: data.results ?? [],
    totalCount: data.count ?? data.results?.length ?? 0,
    sortMode,
    source: 'rawg',
    sourceMessage,
  }
}

export async function getSearchPayload(query, signal) {
  const data = await fetchRawg(
    'games',
    {
      search: query,
      search_precise: true,
      page_size: 18,
    },
    signal,
  )

  return {
    games: data.results ?? [],
    query,
    source: 'rawg',
    sourceMessage: `Ricerca live RAWG per "${query}".`,
  }
}

export async function getSearchSuggestionsPayload(query, signal) {
  if (!query.trim()) {
    return []
  }

  const data = await fetchRawg(
    'games',
    {
      search: query,
      page_size: 6,
    },
    signal,
  )

  return data.results ?? []
}

export async function getGenrePayload(genreSlug, signal) {
  const currentYear = getCurrentYear()
  const genreLabel = humanizeSlug(genreSlug)
  const data = await fetchRawg(
    'games',
    {
      genres: genreSlug,
      dates: `${currentYear}-01-01,${currentYear}-12-31`,
      ordering: '-rating',
      page_size: 18,
    },
    signal,
  )

  return {
    games: data.results ?? [],
    totalCount: data.count ?? data.results?.length ?? 0,
    genreSlug,
    genreLabel,
    source: 'rawg',
    sourceMessage: `Filtro live per il genere ${genreLabel}.`,
  }
}

export async function getGameDetailPayload(gameId, signal) {
  const [game, screenshotsData] = await Promise.all([
    fetchRawg(`games/${gameId}`, {}, signal),
    fetchRawg(`games/${gameId}/screenshots`, { page_size: 10 }, signal).catch(() => ({
      results: [],
    })),
  ])

  const screenshots = [
    game.background_image,
    game.background_image_additional,
    ...(screenshotsData.results ?? []).map((item) => item.image),
  ].filter(Boolean)

  return {
    game,
    screenshots: [...new Set(screenshots)],
    source: 'rawg',
    sourceMessage: `Scheda live RAWG per ${game.name}.`,
  }
}
