<template>
  <div class="panel">
    <h2>Items</h2>

    <section>
      <h3>Create Item</h3>
      <input v-model="form.name" placeholder="name" />
      <input v-model="form.description" placeholder="description" />
      <button @click="create">Create</button>
      <div v-if="msg" class="msg">{{ msg }}</div>
    </section>

    <section>
      <h3>All Items</h3>
      <button @click="load">Reload</button>
      <ul>
        <li v-for="it in items" :key="it.id">
          <div v-if="editingId !== it.id">
            <strong>{{ it.name }}</strong> — {{ it.description }}
            <button @click="startEdit(it)">Edit</button>
            <button @click="remove(it.id)">Delete</button>
          </div>
          <div v-else>
            <input v-model="editForm.name" />
            <input v-model="editForm.description" />
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
import { createItem, getItems, updateItem, deleteItem, Item } from '../api/item'

const form = reactive<Partial<Item>>({ name: '', description: '' })
const items = ref<Item[]>([])
const msg = ref('')
const err = ref('')

async function create() {
  msg.value = ''
  err.value = ''
  try {
    await createItem(form)
    msg.value = 'Created'
    form.name = ''
    form.description = ''
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

const editingId = ref<string | null>(null)
const editForm = reactive<Partial<Item>>({ id: '', name: '', description: '' })

function startEdit(it: Item) {
  editingId.value = it.id || null
  editForm.id = it.id
  editForm.name = it.name
  editForm.description = it.description
}

function cancelEdit() {
  editingId.value = null
  editForm.id = ''
  editForm.name = ''
  editForm.description = ''
}

async function saveEdit() {
  try {
    await updateItem(editForm as any)
    cancelEdit()
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function remove(id?: string) {
  if (!id) return
  try {
    await deleteItem(id)
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
