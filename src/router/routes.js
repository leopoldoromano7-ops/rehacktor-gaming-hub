const encodeSegment = (value) => encodeURIComponent(String(value).trim())

export const routePaths = {
  home: '/',
  search: 'search/:query',
  genre: 'genres/:genreSlug',
  detail: 'detail/:id',
  register: 'auth/register',
  login: 'auth/login',
  profile: 'auth/profile',
  profile_settings: '/auth/profile/settings',
}

export const routes = {
  home: '/',
  search: (query) => `/search/${encodeSegment(query)}`,
  genre: (genreSlug) => `/genres/${encodeSegment(genreSlug)}`,
  detail: (id) => `/detail/${encodeSegment(id)}`,
  register: '/auth/register',
  login: '/auth/login',
  profile: '/auth/profile',
  profile_settings: '/auth/profile/settings',
}
