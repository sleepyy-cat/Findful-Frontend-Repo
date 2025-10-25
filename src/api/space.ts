import { api, handleAxiosError } from './api'

export interface Space {
  id?: string
  name?: string
  [key: string]: any
}

/** Create a new Space */
export async function createSpace(payload: Partial<Space>) {
  try {
    const res = await api.post('/api/Space/createSpace', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get a single Space by id (expects { id }) */
export async function getSpace(id: string) {
  try {
    const res = await api.post('/api/Space/getSpace', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get all Spaces */
export async function getSpaces() {
  try {
    const res = await api.post('/api/Space/_getSpaces', {})
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Update a Space (expects { id, ...updates }) */
export async function updateSpace(payload: { id: string; [key: string]: any }) {
  try {
    const res = await api.post('/api/Space/updateSpace', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Delete a Space (expects { id }) */
export async function deleteSpace(id: string) {
  try {
    const res = await api.post('/api/Space/deleteSpace', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}
