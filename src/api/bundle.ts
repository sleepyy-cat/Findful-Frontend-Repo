import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

export interface Bundle {
  owner: string
  name: string
  members: string[]
  [key: string]: any
}

// Responses based on api-spec-bundle.md
export interface CreateBundleResponse {
  bundle: Bundle
}

export type ActionResponse = Record<string, unknown> // {} on success per spec

export type GetBundlesResponse = Bundle[]

function handleAxiosError(e: any): Promise<never> {
  const msg = e?.response?.data?.error ?? e?.message ?? 'Unknown error'
  return Promise.reject(new Error(msg))
}

/** Create a new bundle for a user. Returns the newly created bundle. */
export async function createBundle(payload: {
  user: string
  name: string
}): Promise<CreateBundleResponse> {
  try {
    const res = await api.post('/api/Bundle/createBundle', payload)
    return res.data as CreateBundleResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Delete a bundle for a user by name. */
export async function deleteBundle(payload: {
  user: string
  name: string
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Bundle/deleteBundle', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Add an item to a user's bundle by bundleName. */
export async function addItemToBundle(payload: {
  user: string
  item: string
  bundleName: string
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Bundle/addItemToBundle', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Remove an item from a user's bundle by bundleName. */
export async function removeItemFromBundle(payload: {
  user: string
  item: string
  bundleName: string
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Bundle/removeItemFromBundle', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get all bundles. */
export async function getBundles(): Promise<GetBundlesResponse> {
  try {
    // spec defines /api/Bundle/getBundles, but older code used _getBundles — support both via compatibility wrapper below
    const res = await api.post('/api/Bundle/getBundles', {})
    return res.data as GetBundlesResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

// Compatibility wrappers for older endpoints present in the repo
export async function getBundle(id: string): Promise<any> {
  try {
    const res = await api.post('/api/Bundle/getBundle', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function updateBundle(payload: { id: string; [key: string]: any }): Promise<any> {
  try {
    const res = await api.post('/api/Bundle/updateBundle', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function deleteBundleById(id: string): Promise<any> {
  try {
    const res = await api.post('/api/Bundle/deleteBundle', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}
