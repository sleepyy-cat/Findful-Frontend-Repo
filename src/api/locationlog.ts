import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

export interface OwnerRef {
  username: string
}

export interface ItemRef {
  name: string
  owner: OwnerRef
}

export interface SpaceRef {
  name: string
  owner: OwnerRef
}

export interface LocationLog {
  thisItem: ItemRef
  currentSpace: SpaceRef
  locationHistory: SpaceRef[]
  [key: string]: any
}

// Responses
export type CreateLogResponse = LocationLog
export type ActionResponse = Record<string, unknown> // {} on success per spec
export type GetItemLogResponse = LocationLog[]
export type GetLogsResponse = LocationLog[]

function handleAxiosError(e: any): Promise<never> {
  const msg = e?.response?.data?.error ?? e?.message ?? 'Unknown error'
  return Promise.reject(new Error(msg))
}

/** Create a new location log for an item. Returns the created LocationLog. */
export async function createLog(payload: {
  thisItem: ItemRef
  currentSpace: SpaceRef
}): Promise<CreateLogResponse> {
  try {
    const res = await api.post('/api/LocationLog/createLog', payload)
    return res.data as CreateLogResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Place an item into a space (updates existing log or creates one). */
export async function placeItem(payload: {
  linkItem: ItemRef
  linkSpace: SpaceRef
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/LocationLog/placeItem', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Delete the location log for the specified item. */
export async function deleteLog(payload: { currItem: ItemRef }): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/LocationLog/deleteLog', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get the location log for an item. Returns an array (possibly empty) per spec. */
export async function getItemLog(item: ItemRef): Promise<GetItemLogResponse> {
  try {
    const res = await api.post('/api/LocationLog/_getItemLog', { item })
    return res.data as GetItemLogResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get all location logs. */
export async function getLogs(): Promise<GetLogsResponse> {
  try {
    const res = await api.post('/api/LocationLog/_getLogs', {})
    return res.data as GetLogsResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

// Compatibility wrappers for older/non-spec endpoints that may exist in the repo
export async function createLocationLog(payload: Partial<LocationLog>): Promise<any> {
  try {
    const res = await api.post('/api/LocationLog/createLocationLog', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getLocationLog(id: string): Promise<any> {
  try {
    const res = await api.post('/api/LocationLog/getLocationLog', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getLocationLogs(): Promise<any> {
  try {
    const res = await api.post('/api/LocationLog/_getLocationLogs', {})
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function updateLocationLog(payload: { id: string; [key: string]: any }): Promise<any> {
  try {
    const res = await api.post('/api/LocationLog/updateLocationLog', payload)
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function deleteLocationLog(id: string): Promise<any> {
  try {
    const res = await api.post('/api/LocationLog/deleteLocationLog', { id })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}
