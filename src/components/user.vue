<template>
  <div class="user-panel">
    <h2>User</h2>

    <section>
      <h3>Register</h3>
      <input v-model="registerForm.username" placeholder="username" />
      <input v-model="registerForm.password" type="password" placeholder="password" />
      <button @click="onRegister">Register</button>
      <div v-if="registerMsg" :class="{ error: registerError, success: !registerError }">
        {{ registerMsg }}
      </div>
    </section>

    <section>
      <h3>Login</h3>
      <input v-model="loginForm.username" placeholder="username" />
      <input v-model="loginForm.password" type="password" placeholder="password" />
      <button @click="onLogin">Login</button>
      <div v-if="loginMsg" :class="{ error: loginError, success: !loginError }">{{ loginMsg }}</div>
    </section>

    <section>
      <h3>All Users</h3>
      <button @click="loadUsers">Reload</button>
      <ul>
        <li v-for="u in users" :key="u.username">{{ u.username }}</li>
      </ul>
      <div v-if="usersError" class="error">{{ usersError }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { registerUser, authenticateUser, getUsersString, getUsers } from '../api/user'

const registerForm = reactive({ username: '', password: '' })
const loginForm = reactive({ username: '', password: '' })

const registerMsg = ref('')
const registerError = ref(false)
const loginMsg = ref('')
const loginError = ref(false)
const users = ref<Array<{ username: string }>>([])
const usersError = ref('')

async function onRegister() {
  registerMsg.value = ''
  registerError.value = false
  try {
    // Frontend pre-check to provide immediate feedback on duplicate usernames
    const existing = await getUsersString()
    if (Array.isArray(existing) && existing.some((u) => u.username === registerForm.username)) {
      registerMsg.value = 'Username already exists'
      registerError.value = true
      return
    }

    const res = await registerUser(registerForm.username, registerForm.password)
    registerMsg.value = res?.user ? `Registered ${res.user.username}` : 'Registered'
    registerError.value = false
    // clear password after successful registration
    registerForm.password = ''
    await loadUsers()
  } catch (err: any) {
    console.error('Register error', err)
    registerError.value = true
    registerMsg.value = err?.response?.data?.error ?? err?.message ?? String(err)
  }
}

async function onLogin() {
  loginMsg.value = ''
  loginError.value = false

  if (!loginForm.username || !loginForm.password) {
    loginMsg.value = 'Username and password are required'
    loginError.value = true
    return
  }

  // Minimal UX guard: if the username doesn't exist, show a clear error immediately
  try {
    const existing = await getUsersString()
    const exists =
      Array.isArray(existing) && existing.some((u) => u.username === loginForm.username)
    if (!exists) {
      loginMsg.value = `No user found with username "${loginForm.username}"`
      loginError.value = true
      loginForm.password = ''
      return
    }
  } catch (_) {
    // If this lookup fails, fall through to auth which will surface backend error
  }

  // Minimal UX guard: if the username exists but password is wrong, show error immediately
  try {
    const allUsers = await getUsers()
    const found = Array.isArray(allUsers)
      ? allUsers.find((u) => u.username === loginForm.username)
      : undefined
    if (found && found.password !== loginForm.password) {
      loginMsg.value = 'Invalid username or password'
      loginError.value = true
      loginForm.password = ''
      return
    }
  } catch (_) {
    // If this lookup fails, fall through to auth which will surface backend error
  }

  try {
    await authenticateUser(loginForm.username, loginForm.password)
    loginMsg.value = 'Successfully logged in'
    loginError.value = false
    // clear sensitive field
    loginForm.password = ''
  } catch (err: any) {
    console.error('Auth error:', err)
    loginError.value = true

    // Specific error handling
    if (err?.message === 'User not found') {
      loginMsg.value = `No user found with username "${loginForm.username}"`
    } else if (err?.message === 'Invalid username or password') {
      loginMsg.value = 'Invalid username or password'
    } else {
      loginMsg.value = err?.message ?? 'Authentication failed'
    }

    // Clear password on failed attempt for security
    loginForm.password = ''
  }
}

async function loadUsers() {
  usersError.value = ''
  try {
    const res = await getUsersString()
    users.value = Array.isArray(res) ? res : []
  } catch (err: any) {
    usersError.value = err?.message ?? String(err)
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-panel {
  max-width: 420px;
  margin: 1rem;
}
section {
  margin-bottom: 1rem;
}
input {
  display: block;
  margin: 0.25rem 0;
  width: 100%;
  padding: 0.4rem;
}
button {
  margin-top: 0.5rem;
}
.error {
  color: #dc3545;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  background-color: #f8d7da;
}

.success {
  color: #28a745;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  background-color: #d4edda;
}
</style>
