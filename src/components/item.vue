<template>
  <div class="panel">
    <h2>Items</h2>

    <section>
      <h3>Create Item</h3>
      <input v-model="form.owner" placeholder="owner (username)" />
      <input v-model="form.name" placeholder="name" />
      <input v-model="form.description" placeholder="description" />
      <input v-model="form.category" placeholder="category" />
      <button @click="create">Create</button>
      <div v-if="msg" class="msg">{{ msg }}</div>
    </section>

    <section>
      <h3>All Items</h3>
      <button @click="load">Reload</button>
      <ul>
        <li v-for="it in items" :key="it.owner.username + ':' + it.name">
          <div v-if="editingKey !== it.owner.username + ':' + it.name">
            <strong>{{ it.name }}</strong> — {{ it.description }}
            <div class="meta">Owner: {{ it.owner.username }} • Category: {{ it.category }}</div>
            <button @click="startEdit(it)">Edit</button>
            <button @click="remove(it)">Delete</button>
          </div>
          <div v-else>
            <input v-model="editForm.name" />
            <input v-model="editForm.description" />
            <input v-model="editForm.category" />
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
import { createItem, getItems, updateItemDetails, deleteItem } from '../api/item'
import type { Item, ItemOwner } from '../api/item'

const form = reactive<{ owner?: string; name?: string; description?: string; category?: string }>({
  owner: '',
  name: '',
  description: '',
  category: '',
})
const items = ref<Item[]>([])
const msg = ref('')
const err = ref('')

async function create() {
  msg.value = ''
  err.value = ''
  try {
    if (!form.owner || !form.name) {
      err.value = 'owner and name are required'
      return
    }
    await createItem({
      owner: { username: String(form.owner) },
      name: String(form.name),
      description: form.description,
      category: form.category,
    })
    msg.value = 'Created'
    form.name = ''
    form.description = ''
    form.category = ''
    // keep owner (logged-in user) if desired
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function load() {
  err.value = ''
  try {
    const res = await getItems()
    items.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

const editingKey = ref<string | null>(null)
const editForm = reactive<{
  owner?: ItemOwner | null
  name?: string
  description?: string
  category?: string
}>({ owner: null, name: '', description: '', category: '' })

function startEdit(it: Item) {
  editingKey.value = `${it.owner.username}:${it.name}`
  editForm.owner = it.owner
  editForm.name = it.name
  editForm.description = it.description
  editForm.category = it.category
}

function cancelEdit() {
  editingKey.value = null
  editForm.owner = null
  editForm.name = ''
  editForm.description = ''
  editForm.category = ''
}

async function saveEdit() {
  try {
    if (!editForm.owner || !editForm.name) {
      err.value = 'owner and name are required'
      return
    }
    await updateItemDetails({
      owner: editForm.owner,
      item: {
        owner: editForm.owner,
        name: editForm.name,
        description: editForm.description,
        category: editForm.category,
      },
      name: editForm.name,
      description: editForm.description,
      category: editForm.category,
    })
    cancelEdit()
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function remove(it: Item) {
  try {
    await deleteItem({ owner: it.owner, item: it })
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
