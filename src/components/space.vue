<template>
  <div class="panel">
    <h2>Spaces</h2>

    <section>
      <h3>Create Space</h3>
      <input v-model="form.name" placeholder="name" />
      <button @click="create">Create</button>
      <div v-if="msg" class="msg">{{ msg }}</div>
    </section>

    <section>
      <h3>All Spaces</h3>
      <button @click="load">Reload</button>
      <ul>
        <li v-for="s in spaces" :key="s.id">
          <div v-if="editingId !== s.id">
            <strong>{{ s.name }}</strong>
            <button @click="startEdit(s)">Edit</button>
            <button @click="remove(s.id)">Delete</button>
          </div>
          <div v-else>
            <input v-model="editForm.name" />
            <button @click="saveEdit">Save</button>
            <button @click="cancelEdit">Cancel</button>
          </div>
        </li>
      </ul>
      <div v-if="err" class="err">{{ err }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { createSpace, getSpaces, updateSpace, deleteSpace, Space } from '../api/space'

const form = reactive<Partial<Space>>({ name: '' })
const spaces = ref<Space[]>([])
const msg = ref('')
const err = ref('')

async function create() {
  msg.value = ''
  err.value = ''
  try {
    await createSpace(form)
    msg.value = 'Created'
    form.name = ''
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function load() {
  err.value = ''
  try {
    const res = await getSpaces()
    spaces.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

const editingId = ref<string | null>(null)
const editForm = reactive<Partial<Space>>({ id: '', name: '' })

function startEdit(s: Space) {
  editingId.value = s.id || null
  editForm.id = s.id
  editForm.name = s.name
}

function cancelEdit() {
  editingId.value = null
  editForm.id = ''
  editForm.name = ''
}

async function saveEdit() {
  try {
    await updateSpace(editForm as any)
    cancelEdit()
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function remove(id?: string) {
  if (!id) return
  try {
    await deleteSpace(id)
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

onMounted(load)
</script>

<style scoped>
.panel {
  max-width: 600px;
  padding: 12px;
}
input {
  display: block;
  width: 100%;
  padding: 6px;
  margin: 6px 0;
}
.err {
  color: crimson;
}
.msg {
  color: green;
}
</style>
