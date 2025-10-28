import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

export interface ItemOwner {
  username: string
}

export interface Item {
  owner: ItemOwner
  name: string
  description?: string
  category?: string
  [key: string]: any
}

// Responses per api-spec-item.md
export interface CreateItemResponse {
  item: Item
}

export type ActionResponse = Record<string, unknown> // {} on success per spec

export type GetItemOwnerResponse = Array<{ ownerUsername: string }>
export type GetItemNameResponse = Array<{ itemName: string }>
export type GetItemDescriptionResponse = Array<{ itemDescription: string }>
export type GetItemCategoryResponse = Array<{ itemCategory: string }>

export type GetItemsResponse = Item[]
export type GetItemsStringResponse = Array<{ itemName: string }>

function handleAxiosError(e: any): Promise<never> {
  const msg = e?.response?.data?.error ?? e?.message ?? 'Unknown error'
  return Promise.reject(new Error(msg))
}

/** Create a new item. Returns the created item. */
export async function createItem(payload: {
  owner: ItemOwner
  name: string
  description?: string
  category?: string
  [key: string]: any
}): Promise<CreateItemResponse> {
  try {
    const res = await api.post('/api/Item/createItem', payload)
    return res.data as CreateItemResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Delete an item. Expects owner and item object per spec. */
export async function deleteItem(payload: {
  owner: ItemOwner
  item: Item
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Item/deleteItem', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Update item details (name/description/category). */
export async function updateItemDetails(payload: {
  owner: ItemOwner
  item: Item
  name?: string
  description?: string
  category?: string
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Item/updateItemDetails', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Query: get owner username for an item. */
export async function getItemOwner(item: Item): Promise<GetItemOwnerResponse> {
  try {
    const res = await api.post('/api/Item/_getItemOwner', { item })
    return res.data as GetItemOwnerResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getItemName(item: Item): Promise<GetItemNameResponse> {
  try {
    const res = await api.post('/api/Item/_getItemName', { item })
    return res.data as GetItemNameResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getItemDescription(item: Item): Promise<GetItemDescriptionResponse> {
  try {
    const res = await api.post('/api/Item/_getItemDescription', { item })
    return res.data as GetItemDescriptionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getItemCategory(item: Item): Promise<GetItemCategoryResponse> {
  try {
    const res = await api.post('/api/Item/_getItemCategory', { item })
    return res.data as GetItemCategoryResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get all items. */
export async function getItems(): Promise<GetItemsResponse> {
  try {
    const res = await api.post('/api/Item/_getItems', {})
    return res.data as GetItemsResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get all item names as strings. */
export async function getItemsString(): Promise<GetItemsStringResponse> {
  try {
    const res = await api.post('/api/Item/_getItemsString', {})
    return res.data as GetItemsStringResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get items by user. */
export async function getItemsByUser(user: ItemOwner): Promise<GetItemsResponse> {
  try {
    const res = await api.post('/api/Item/_getItemsByUser', { user })
    return res.data as GetItemsResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

// Compatibility helpers for older endpoints that other modules may call
export async function getItem(id: string): Promise<Item> {
  try {
    const res = await api.post('/api/Item/getItem', { id })
    return res.data as Item
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function updateItem(payload: {
  id: string
  [key: string]: any
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Item/updateItem', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}
