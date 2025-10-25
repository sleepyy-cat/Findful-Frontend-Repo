import { api, handleAxiosError } from './api'

export interface LocationLog {
  id?: string
  itemId?: string
  location?: string
  timestamp?: string
  [key: string]: any
}

export async function createLocationLog(payload: Partial<LocationLog>) {
  try {
    const res = await api.post('/api/LocationLog/createLocationLog', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getLocationLog(id: string) {
  try {
    const res = await api.post('/api/LocationLog/getLocationLog', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getLocationLogs() {
  try {
    const res = await api.post('/api/LocationLog/_getLocationLogs', {})
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function updateLocationLog(payload: { id: string; [key: string]: any }) {
  try {
    const res = await api.post('/api/LocationLog/updateLocationLog', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function deleteLocationLog(id: string) {
  try {
    const res = await api.post('/api/LocationLog/deleteLocationLog', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}
