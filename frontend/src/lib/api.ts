const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

async function refreshToken(): Promise<void> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = fetch(`${BACKEND_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error('Refresh failed')
      }
    })
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}

export async function api<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (res.status === 401 && !path.includes('/auth/refresh') && !path.includes('/auth/login') && !path.includes('/auth/register')) {
    try {
      await refreshToken()
      return api<T>(path, options)
    } catch {
      throw new Error('Unauthorized')
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || res.statusText)
  }

  return res.json() as Promise<T>
}

export async function apiFormData<T = unknown>(path: string, formData: FormData, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    ...options,
    credentials: 'include',
    body: formData,
  })

  if (res.status === 401 && !path.includes('/auth/refresh')) {
    try {
      await refreshToken()
      return apiFormData<T>(path, formData, options)
    } catch {
      throw new Error('Unauthorized')
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || res.statusText)
  }

  return res.json() as Promise<T>
}

export async function apiJson<T = unknown>(path: string, body: Record<string, unknown>, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || res.statusText)
  }

  return res.json() as Promise<T>
}
