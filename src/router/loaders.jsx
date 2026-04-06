import { redirect } from 'react-router-dom'
import {
  getGameDetailPayload,
  getGenrePayload,
  getGenresPayload,
  getHomepagePayload,
  getHomepagePayloadBySort,
  getSearchPayload,
} from '../services/rawg.js'
import { routes } from './routes.js'

function normalizeParam(value = '') {
  return decodeURIComponent(value).trim()
}

function isAbortError(error) {
  return error?.name === 'AbortError'
}

export async function rootLoader({ request }) {
  try {
    return await getGenresPayload(request.signal)
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }

    return {
      genres: [],
      source: 'offline',
      sourceMessage: 'RAWG non e disponibile al momento. La navigazione resta comunque attiva.',
    }
  }
}

export async function homeLoader({ request }) {
  const url = new URL(request.url)
  const sortMode = url.searchParams.get('sort') || 'catalog'

  try {
    if (sortMode === 'trending' || sortMode === 'top-rated') {
      return await getHomepagePayloadBySort(sortMode, request.signal)
    }

    return await getHomepagePayload(request.signal)
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }

    return {
      games: [],
      totalCount: 0,
      sortMode,
      source: 'offline',
      sourceMessage: 'Feed RAWG temporaneamente non raggiungibile. La home resta disponibile senza dati live.',
    }
  }
}

export async function searchLoader({ params, request }) {
  const query = normalizeParam(params.query)

  if (!query) {
    return redirect(routes.home)
  }

  try {
    return await getSearchPayload(query, request.signal)
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }

    return {
      games: [],
      query,
      source: 'offline',
      sourceMessage: `RAWG non raggiungibile in questo momento. Nessun risultato live per "${query}".`,
    }
  }
}

export async function genreLoader({ params, request }) {
  const genreSlug = normalizeParam(params.genreSlug)

  if (!genreSlug) {
    return redirect(routes.home)
  }

  try {
    return await getGenrePayload(genreSlug, request.signal)
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }

    return {
      games: [],
      totalCount: 0,
      genreSlug,
      genreLabel: genreSlug,
      source: 'offline',
      sourceMessage: `RAWG non raggiungibile in questo momento. Nessun dato live per il genere ${genreSlug}.`,
    }
  }
}

export async function getGameDetails({ params, request }) {
  const gameId = normalizeParam(params.id)

  if (!gameId) {
    return redirect(routes.home)
  }

  const payload = await getGameDetailPayload(gameId, request.signal)

  if (!payload.game) {
    throw new Response('Game not found', {
      status: 404,
      statusText: 'Game not found',
    })
  }

  return payload
}

export const gameDetailLoader = getGameDetails
