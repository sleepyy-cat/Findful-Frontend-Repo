import { api, handleAxiosError } from './api'

export interface Bundle {
  id?: string
  name?: string
  items?: string[] // item ids
  [key: string]: any
}

export async function createBundle(payload: Partial<Bundle>) {
  try {
    const res = await api.post('/api/Bundle/createBundle', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getBundle(id: string) {
  try {
    const res = await api.post('/api/Bundle/getBundle', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getBundles() {
  try {
    const res = await api.post('/api/Bundle/_getBundles', {})
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function updateBundle(payload: { id: string; [key: string]: any }) {
  try {
    const res = await api.post('/api/Bundle/updateBundle', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function deleteBundle(id: string) {
  try {
    const res = await api.post('/api/Bundle/deleteBundle', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}
