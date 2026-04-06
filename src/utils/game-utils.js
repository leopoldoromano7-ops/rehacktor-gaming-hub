const CARD_TONES = [
  'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  'linear-gradient(135deg, #C084FC 0%, #8B5CF6 100%)',
  'linear-gradient(135deg, #1E1B4B 0%, #8B5CF6 100%)',
  'linear-gradient(135deg, #EC4899 0%, #C084FC 100%)',
  'linear-gradient(135deg, #8B5CF6 0%, #1E1B4B 100%)',
]

export function clampText(text, limit = 140) {
  if (!text) {
    return ''
  }

  if (text.length <= limit) {
    return text
  }

  return `${text.slice(0, limit).trimEnd()}...`
}

export function formatReleaseDate(value) {
  if (!value) {
    return 'Data TBD'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatScore(score) {
  return typeof score === 'number' ? score.toFixed(1) : 'n/a'
}

export function getGenreNames(game) {
  return (game.genres ?? []).map((genre) => genre.name).filter(Boolean)
}

export function getPlatformNames(game) {
  const entries =
    game.parent_platforms?.map((item) => item.platform?.name) ??
    game.platforms?.map((item) => item.platform?.name ?? item.name)

  return (entries ?? []).filter(Boolean)
}

export function getPeopleNames(items = []) {
  return items.map((item) => item.name).filter(Boolean)
}

export function getTagNames(game) {
  return (game.tags ?? []).map((tag) => tag.name).filter(Boolean)
}

export function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function getGameDescription(game) {
  return stripHtml(game.description_raw || game.description || '')
}

export function humanizeSlug(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

export function getToneFromSeed(seed = 'reactor') {
  let hash = 0

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % CARD_TONES.length
  }

  return CARD_TONES[Math.abs(hash) % CARD_TONES.length]
}
