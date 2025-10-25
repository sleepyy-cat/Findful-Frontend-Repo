import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

export interface User {
  username: string
  password: string
}

function handleAxiosError(e: any) {
  const msg = e?.response?.data?.error ?? e?.message ?? 'Unknown error'
  return Promise.reject(new Error(msg))
}

export async function registerUser(username: string, password: string) {
  try {
    const res = await api.post('/api/User/registerUser', { username, password })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function authenticateUser(username: string, password: string) {
  try {
    const res = await api.post('/api/User/authenticateUser', { username, password })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getUserName(user: User) {
  try {
    const res = await api.post('/api/User/_getUserName', { user })
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getUsers() {
  try {
    const res = await api.post('/api/User/_getUsers', {})
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}

export async function getUsersString() {
  try {
    const res = await api.post('/api/User/_getUsersString', {})
    return res.data
  } catch (e) {
    return handleAxiosError(e)
  }
}
