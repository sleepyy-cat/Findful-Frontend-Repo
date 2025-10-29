<template>
  <div class="panel">
    <h2>Bundles</h2>

    <section>
      <h3>Create Bundle</h3>
      <input v-model="form.owner" placeholder="owner (user id)" />
      <input v-model="form.name" placeholder="name" />
      <input v-model="newItemId" placeholder="add item id" />
      <button @click="addItemId">Add Item ID</button>
      <div class="items">
        <span v-for="(it, i) in form.members" :key="i"
          >{{ it }} <button @click="removeItem(i)">x</button></span
        >
      </div>
      <button @click="create">Create</button>
      <div v-if="createErr" class="err">{{ createErr }}</div>
      <div v-if="msg" class="msg">{{ msg }}</div>
    </section>

    <section>
      <h3>All Bundles</h3>
      <button @click="load">Reload</button>
      <ul>
        <li v-for="b in bundles" :key="b.name">
          <div v-if="editingId !== b.name">
            <strong>{{ b.name }}</strong> — Owner: {{ b.owner }} — members:
            {{ (b.members || []).join(', ') || 'none' }}
            <button @click="startEdit(b)">Edit</button>
            <button @click="remove(b.name, b.owner)">Delete</button>
          </div>

          <div v-else>
            <input v-model="editForm.name" />
            <input v-model="editNewItem" placeholder="add item id" />
            <button @click="editAddItem">Add</button>
            <div>
              <span v-for="(it, idx) in editForm.members" :key="idx"
                >{{ it }} <button @click="editRemoveItem(idx)">x</button></span
              >
            </div>
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
import { createBundle, getBundles, updateBundle, deleteBundle } from '../api/bundle'
import type { Bundle } from '../api/bundle'

const form = reactive<Partial<Bundle>>({ name: '', owner: '', members: [] })
const newItemId = ref('')
const bundles = ref<Bundle[]>([])
const msg = ref('')
const err = ref('')
const createErr = ref('')

async function create() {
  msg.value = ''
  err.value = ''
  createErr.value = ''
  try {
    if (!form.owner || !form.name) {
      createErr.value = 'owner and name are required'
      return
    }
    await createBundle({
      user: String(form.owner),
      name: String(form.name),
    })
    msg.value = 'Created'
    form.name = ''
    form.owner = ''
    form.members = []
    await load()
  } catch (e: any) {
    const message = e?.message ?? String(e)
    createErr.value = message
  }
}

function addItemId() {
  if (newItemId.value.trim()) {
    form.members = [...(form.members || []), newItemId.value.trim()]
    newItemId.value = ''
  }
}

function removeItem(i: number) {
  form.members = (form.members || []).filter((_: any, idx: number) => idx !== i)
}

async function load() {
  err.value = ''
  try {
    const res = await getBundles()
    bundles.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

const editingId = ref<string | null>(null)
const editForm = reactive<Partial<Bundle>>({ owner: '', name: '', members: [] })
const editNewItem = ref('')

function startEdit(b: Bundle) {
  editingId.value = b.name || null
  editForm.owner = b.owner
  editForm.name = b.name
  editForm.members = (b.members || []).slice()
}

function cancelEdit() {
  editingId.value = null
  editForm.owner = ''
  editForm.name = ''
  editForm.members = []
  editNewItem.value = ''
}

function editAddItem() {
  if (editNewItem.value.trim()) {
    editForm.members = [...(editForm.members || []), editNewItem.value.trim()]
    editNewItem.value = ''
  }
}

function editRemoveItem(i: number) {
  editForm.members = (editForm.members || []).filter((_: any, idx: number) => idx !== i)
}

async function saveEdit() {
  try {
    await updateBundle(editForm as any)
    cancelEdit()
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function remove(name?: string, owner?: string) {
  if (!name || !owner) return
  try {
    await deleteBundle({ user: owner, name })
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
section {
  margin-bottom: 16px;
}
input {
  margin: 4px 0;
  display: block;
  width: 100%;
  padding: 6px;
}
.items span {
  display: inline-block;
  margin: 4px;
  background: #eee;
  padding: 4px 8px;
  border-radius: 4px;
}
.err {
  color: crimson;
}
.msg {
  color: green;
}
</style>
