import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

export interface Space {
  id?: string
  owner?: string
  name?: string
  spaceType?: string
  parent?: string | null
  [key: string]: any
}

// Response types from api-spec-space.md
export interface CreateSpaceResponse {
  space: string
}

export type ActionResponse = Record<string, unknown> // {} on success per spec

export type GetSpaceOwnerResponse = Array<{ owner: string }>
export type GetSpaceNameResponse = Array<{ name: string }>
export type GetSpaceTypeResponse = Array<{ spaceType: string }>
export type GetSpaceParentResponse = Array<{ parent: string | null }>
export type GetSpaceChildrenResponse = Array<{ child: string }>
export type GetSpaceChildrenStringResponse = Array<{ childName: string }>

export type GetSpacesResponse = Space[]

function handleAxiosError(e: any): Promise<never> {
  const msg = e?.response?.data?.error ?? e?.message ?? 'Unknown error'
  return Promise.reject(new Error(msg))
}

/** Create a new Space. Returns the new space ID as { space: ID } */
export async function createSpace(payload: {
  owner: string
  name: string
  spaceType: string
  parent?: string | null
  [key: string]: any
}): Promise<CreateSpaceResponse> {
  try {
    const res = await api.post('/api/Space/createSpace', payload)
    return res.data as CreateSpaceResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Move a space to a new parent. */
export async function moveSpace(payload: {
  owner: string
  space: string
  newParent: string
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Space/moveSpace', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Rename a space. */
export async function renameSpace(payload: {
  owner: string
  space: string
  newName: string
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Space/renameSpace', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Delete a space (expects { owner, space }). */
export async function deleteSpace(payload: {
  owner: string
  space: string
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Space/deleteSpace', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Compatibility helper: delete by internal id (older callers) */
export async function deleteSpaceById(id: string): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Space/deleteSpace', { id })
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get a single Space by id (internal helper) */
export async function getSpace(id: string): Promise<Space> {
  try {
    const res = await api.post('/api/Space/getSpace', { id })
    return res.data as Space
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get all Spaces */
export async function getSpaces(): Promise<GetSpacesResponse> {
  try {
    const res = await api.post('/api/Space/getSpaces', {})
    return res.data as GetSpacesResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Update a Space (expects { id, ...updates }) */
export async function updateSpace(payload: {
  id: string
  [key: string]: any
}): Promise<ActionResponse> {
  try {
    const res = await api.post('/api/Space/updateSpace', payload)
    return res.data as ActionResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Query helpers from spec */
export async function getSpaceOwner(space: string): Promise<GetSpaceOwnerResponse> {
  try {
    const res = await api.post('/api/Space/_getSpaceOwner', { space })
    return res.data as GetSpaceOwnerResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getSpaceName(space: string): Promise<GetSpaceNameResponse> {
  try {
    const res = await api.post('/api/Space/_getSpaceName', { space })
    return res.data as GetSpaceNameResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getSpaceType(space: string): Promise<GetSpaceTypeResponse> {
  try {
    const res = await api.post('/api/Space/_getSpaceType', { space })
    return res.data as GetSpaceTypeResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getSpaceParent(space: string): Promise<GetSpaceParentResponse> {
  try {
    const res = await api.post('/api/Space/_getSpaceParent', { space })
    return res.data as GetSpaceParentResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getSpaceChildren(space: string): Promise<GetSpaceChildrenResponse> {
  try {
    const res = await api.post('/api/Space/_getSpaceChildren', { space })
    return res.data as GetSpaceChildrenResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getSpaceChildrenString(
  space: string,
): Promise<GetSpaceChildrenStringResponse> {
  try {
    const res = await api.post('/api/Space/_getSpaceChildrenString', { space })
    return res.data as GetSpaceChildrenStringResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}
