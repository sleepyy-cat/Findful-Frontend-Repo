<template>
  <div class="panel">
    <h2>Location Logs</h2>

    <section>
      <h3>Create Location Log</h3>
      <input v-model="form.itemId" placeholder="item id" />
      <input v-model="form.location" placeholder="location" />
      <input v-model="form.timestamp" placeholder="timestamp (ISO)" />
      <button @click="create">Create</button>
      <div v-if="msg" class="msg">{{ msg }}</div>
    </section>

    <section>
      <h3>All Logs</h3>
      <button @click="load">Reload</button>
      <ul>
        <li v-for="l in logs" :key="l.id">
          <div v-if="editingId !== l.id">
            <strong>{{ l.itemId }}</strong> — {{ l.location }} @ {{ l.timestamp }}
            <button @click="startEdit(l)">Edit</button>
            <button @click="remove(l.id)">Delete</button>
          </div>
          <div v-else>
            <input v-model="editForm.itemId" />
            <input v-model="editForm.location" />
            <input v-model="editForm.timestamp" />
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
import {
  createLocationLog,
  getLocationLogs,
  updateLocationLog,
  deleteLocationLog,
  LocationLog,
} from '../api/locationlog'

const form = reactive<Partial<LocationLog>>({ itemId: '', location: '', timestamp: '' })
const logs = ref<LocationLog[]>([])
const msg = ref('')
const err = ref('')

async function create() {
  msg.value = ''
  err.value = ''
  try {
    await createLocationLog(form)
    msg.value = 'Created'
    form.itemId = ''
    form.location = ''
    form.timestamp = ''
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function load() {
  err.value = ''
  try {
    const res = await getLocationLogs()
    logs.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

const editingId = ref<string | null>(null)
const editForm = reactive<Partial<LocationLog>>({ id: '', itemId: '', location: '', timestamp: '' })

function startEdit(l: LocationLog) {
  editingId.value = l.id || null
  editForm.id = l.id
  editForm.itemId = l.itemId
  editForm.location = l.location
  editForm.timestamp = l.timestamp
}

function cancelEdit() {
  editingId.value = null
  editForm.id = ''
  editForm.itemId = ''
  editForm.location = ''
  editForm.timestamp = ''
}

async function saveEdit() {
  try {
    await updateLocationLog(editForm as any)
    cancelEdit()
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function remove(id?: string) {
  if (!id) return
  try {
    await deleteLocationLog(id)
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

onMounted(load)
</script>

<style scoped>
.panel {
  max-width: 700px;
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
