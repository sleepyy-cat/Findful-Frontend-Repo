import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

export interface User {
  username: string
  password: string
  [key: string]: any
}

// Responses based on api-spec-user.md
export interface RegisterUserResponse {
  user: User
}

export type AuthenticateUserResponse = Record<string, unknown> // spec returns {} on success

export type GetUserNameResponse = Array<{ username: string }>

export type GetUsersResponse = User[]

export type GetUsersStringResponse = Array<{ username: string }>

function handleAxiosError(e: any): Promise<never> {
  const status = e?.response?.status
  const data = e?.response?.data
  const msg =
    data?.error ?? (typeof data === 'string' ? data : undefined) ?? e?.message ?? 'Unknown error'
  const err = new Error(`${msg} (status ${status ?? 'unknown'})`)
  ;(err as any).response = e?.response
  return Promise.reject(err)
}

/** Register a new user. Returns the created user on success. */
export async function registerUser(
  username: string,
  password: string,
): Promise<RegisterUserResponse> {
  try {
    const res = await api.post('/api/User/registerUser', { username, password })
    return res.data as RegisterUserResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Authenticate a user by username/password. Success returns an empty object per spec. */
export async function authenticateUser(
  username: string,
  password: string,
): Promise<AuthenticateUserResponse> {
  try {
    const res = await api.post('/api/User/authenticateUser', { username, password })
    return res.data as AuthenticateUserResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Extract username from a provided User object. Returns an array with a username object. */
export async function getUserName(user: User): Promise<GetUserNameResponse> {
  try {
    const res = await api.post('/api/User/_getUserName', { user })
    return res.data as GetUserNameResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get all registered users. */
export async function getUsers(): Promise<GetUsersResponse> {
  try {
    const res = await api.post('/api/User/_getUsers', {})
    return res.data as GetUsersResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}

/** Get all usernames as an array of objects with a `username` field. */
export async function getUsersString(): Promise<GetUsersStringResponse> {
  try {
    const res = await api.post('/api/User/getUsersString', {})
    return res.data as GetUsersStringResponse
  } catch (e) {
    return handleAxiosError(e)
  }
}
