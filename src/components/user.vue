<template>
  <div class="user-panel">
    <h2>User</h2>

    <section>
      <h3>Register</h3>
      <input v-model="registerForm.username" placeholder="username" />
      <input v-model="registerForm.password" type="password" placeholder="password" />
      <button @click="onRegister">Register</button>
      <div v-if="registerMsg">{{ registerMsg }}</div>
    </section>

    <section>
      <h3>Login</h3>
      <input v-model="loginForm.username" placeholder="username" />
      <input v-model="loginForm.password" type="password" placeholder="password" />
      <button @click="onLogin">Login</button>
      <div v-if="loginMsg">{{ loginMsg }}</div>
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
import { registerUser, authenticateUser, getUsersString } from '../api/user'

const registerForm = reactive({ username: '', password: '' })
const loginForm = reactive({ username: '', password: '' })

const registerMsg = ref('')
const loginMsg = ref('')
const users = ref<Array<{ username: string }>>([])
const usersError = ref('')

async function onRegister() {
  registerMsg.value = ''
  try {
    const res = await registerUser(registerForm.username, registerForm.password)
    registerMsg.value = res?.user ? `Registered ${res.user.username}` : 'Registered'
    // clear password after successful registration
    registerForm.password = ''
    await loadUsers()
  } catch (err: any) {
    console.error('Register error', err)
    registerMsg.value = err?.response?.data?.error ?? err?.message ?? String(err)
  }
}

async function onLogin() {
  loginMsg.value = ''
  try {
    await authenticateUser(loginForm.username, loginForm.password)
    loginMsg.value = 'Authenticated'
    // clear sensitive field
    loginForm.password = ''
  } catch (err: any) {
    console.error('Auth error', err)
    loginMsg.value = err?.response?.data?.error ?? err?.message ?? String(err)
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
  color: red;
}
</style>
