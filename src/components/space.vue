<template>
  <div class="panel">
    <h2>Spaces</h2>

    <section>
      <h3>Create Space</h3>
      <input v-model="form.owner" placeholder="owner (user id)" />
      <input v-model="form.name" placeholder="name" />
      <input v-model="form.spaceType" placeholder="space type" />
      <button @click="create">Create</button>
      <div v-if="createErr" class="err">{{ createErr }}</div>
      <div v-if="msg" class="msg">{{ msg }}</div>
    </section>

    <section>
      <h3>All Spaces</h3>
      <ul class="space-list">
        <li v-for="s in spaces" :key="s.id" class="space-card">
          <div v-if="editingId !== s.id">
            <div class="space-header">
              <span class="space-name">{{ s.name || 'Untitled' }}</span>
              <span class="space-type" v-if="s.spaceType">{{ s.spaceType }}</span>
            </div>
            <div class="space-meta">
              <span class="meta-item"
                ><label>Owner</label><span>{{ s.owner || '—' }}</span></span
              >
              <span class="meta-item"
                ><label>Parent</label><span>{{ displayParent(s.parent) }}</span></span
              >
              <span class="meta-item" v-if="s.id"
                ><label>ID</label><span>{{ s.id }}</span></span
              >
            </div>
            <div class="space-actions">
              <button @click="startEdit(s)">Edit</button>
              <button @click="remove(s.id)">Delete</button>
            </div>
          </div>
          <div v-else class="space-edit">
            <input v-model="editForm.name" placeholder="name" />
            <input v-model="editForm.spaceType" placeholder="space type" />
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
import { ref, reactive, onMounted, computed } from 'vue'
import { createSpace, getSpaces, updateSpace, deleteSpaceById } from '../api/space'
import { getUsersString } from '../api/user'
import type { Space } from '../api/space'

const form = reactive<Partial<Space>>({ name: '' })
const spaces = ref<Space[]>([])
const msg = ref('')
const err = ref('')
const createErr = ref('')

const spacesById = computed<Record<string, Space>>(() => {
  const map: Record<string, Space> = {}
  for (const s of spaces.value) {
    if (s.id) map[s.id] = s
  }
  return map
})

function displayParent(parent: string | null | undefined): string {
  if (!parent) return 'Root'
  return spacesById.value[parent]?.name || parent
}

async function create() {
  msg.value = ''
  err.value = ''
  createErr.value = ''
  try {
    if (!form.owner || !form.name || !form.spaceType) {
      createErr.value = 'owner, name and spaceType are required'
      return
    }
    // Verify the owner (user) exists before creating the space
    const users = await getUsersString()
    const ownerExists = users.some((u) => u.username === String(form.owner))
    if (!ownerExists) {
      createErr.value = 'Owner does not exist'
      return
    }
    // Prevent duplicate names for the same owner and same parent (root or given parent)
    const parentNormalized = form.parent ? String(form.parent) : null
    const existing = await getSpaces()
    const ownerKey = String(form.owner).trim().toLowerCase()
    const desiredName = String(form.name).trim().toLowerCase()
    const isDuplicate = existing.some((s) => {
      const sOwner = String(s.owner ?? '')
        .trim()
        .toLowerCase()
      const sParent = s.parent ?? null
      const sName = String(s.name ?? '')
        .trim()
        .toLowerCase()
      return sOwner === ownerKey && sParent === parentNormalized && sName === desiredName
    })
    if (isDuplicate) {
      createErr.value = 'A space with this name already exists under this owner and parent'
      return
    }
    await createSpace({
      owner: String(form.owner),
      name: String(form.name),
      spaceType: String(form.spaceType),
      parent: parentNormalized,
    })
    msg.value = 'Created'
    form.name = ''
    form.owner = ''
    form.spaceType = ''
    await load()
  } catch (e: any) {
    // Surface API error near the create form if owner-related, otherwise general error
    const message = e?.message ?? String(e)
    if (typeof message === 'string' && message.toLowerCase().includes('owner')) {
      createErr.value = message
    } else {
      err.value = message
    }
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
    await deleteSpaceById(id)
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

onMounted(load)
</script>

<style scoped>
.panel {
  max-width: 720px;
  padding: 12px;
}
input {
  display: block;
  width: 100%;
  padding: 6px;
  margin: 6px 0;
}
.space-list {
  list-style: none;
  padding: 0;
}
.space-card {
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 10px 12px;
  margin: 10px 0;
}
.space-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.space-name {
  font-weight: 600;
}
.space-type {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #3730a3;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 999px;
}
.space-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 6px 0 10px;
  color: #444;
}
.meta-item {
  display: inline-flex;
  gap: 6px;
}
.meta-item > label {
  color: #666;
  font-size: 12px;
}
.space-actions button {
  margin-right: 8px;
}
.err {
  color: crimson;
}
.msg {
  color: green;
}
</style>
