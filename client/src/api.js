import axios from 'axios'

// `withCredentials: true` makes the browser send the httpOnly auth cookie on
// every request to the API — including requests triggered by a different site.
// That convenience is exactly what leaves this app open to CSRF: there is no
// second proof that a state-changing request actually came from our own UI.
export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true
})

const csrfExemptPaths = ['/auth/login', '/auth/register']

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase()
  const path = config.url || ''

  if (['get', 'head', 'options'].includes(method) || csrfExemptPaths.includes(path)) {
    return config
  }

  const response = await api.get('/csrf-token')
  config.headers = config.headers || {}
  config.headers['x-csrf-token'] = response.data.csrfToken
  return config
})
