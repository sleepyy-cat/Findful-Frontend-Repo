import { api, handleAxiosError } from './api'

export interface Item {
  id?: string
  name?: string
  [key: string]: any
}

export async function createItem(payload: Partial<Item>) {
  try {
    const res = await api.post('/api/Item/createItem', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getItem(id: string) {
  try {
    const res = await api.post('/api/Item/getItem', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getItems() {
  try {
    const res = await api.post('/api/Item/_getItems', {})
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function updateItem(payload: { id: string; [key: string]: any }) {
  try {
    const res = await api.post('/api/Item/updateItem', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function deleteItem(id: string) {
  try {
    const res = await api.post('/api/Item/deleteItem', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}
