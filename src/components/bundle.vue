<template>
  <div class="panel">
    <h2>Bundles</h2>

    <section>
      <h3>Create Bundle</h3>
      <input v-model="form.name" placeholder="name" />
      <input v-model="newItemId" placeholder="add item id" />
      <button @click="addItemId">Add Item ID</button>
      <div class="items">
        <span v-for="(it, i) in form.items" :key="i"
          >{{ it }} <button @click="removeItem(i)">x</button></span
        >
      </div>
      <button @click="create">Create</button>
      <div v-if="msg" class="msg">{{ msg }}</div>
    </section>

    <section>
      <h3>All Bundles</h3>
      <button @click="load">Reload</button>
      <ul>
        <li v-for="b in bundles" :key="b.id">
          <div v-if="editingId !== b.id">
            <strong>{{ b.name }}</strong> — items: {{ (b.items || []).join(', ') }}
            <button @click="startEdit(b)">Edit</button>
            <button @click="remove(b.id)">Delete</button>
          </div>

          <div v-else>
            <input v-model="editForm.name" />
            <input v-model="editNewItem" placeholder="add item id" />
            <button @click="editAddItem">Add</button>
            <div>
              <span v-for="(it, idx) in editForm.items" :key="idx"
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
import { createBundle, getBundles, updateBundle, deleteBundle, Bundle } from '../api/bundle'

const form = reactive<Partial<Bundle>>({ name: '', items: [] })
const newItemId = ref('')
const bundles = ref<Bundle[]>([])
const msg = ref('')
const err = ref('')

async function create() {
  msg.value = ''
  err.value = ''
  try {
    await createBundle(form)
    msg.value = 'Created'
    form.name = ''
    form.items = []
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

function addItemId() {
  if (newItemId.value.trim()) {
    form.items = [...(form.items || []), newItemId.value.trim()]
    newItemId.value = ''
  }
}

function removeItem(i: number) {
  form.items = (form.items || []).filter((_, idx) => idx !== i)
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
const editForm = reactive<Partial<Bundle>>({ id: '', name: '', items: [] })
const editNewItem = ref('')

function startEdit(b: Bundle) {
  editingId.value = b.id || null
  editForm.id = b.id
  editForm.name = b.name
  editForm.items = (b.items || []).slice()
}

function cancelEdit() {
  editingId.value = null
  editForm.id = ''
  editForm.name = ''
  editForm.items = []
  editNewItem.value = ''
}

function editAddItem() {
  if (editNewItem.value.trim()) {
    editForm.items = [...(editForm.items || []), editNewItem.value.trim()]
    editNewItem.value = ''
  }
}

function editRemoveItem(i: number) {
  editForm.items = (editForm.items || []).filter((_, idx) => idx !== i)
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

async function remove(id?: string) {
  if (!id) return
  try {
    await deleteBundle(id)
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
