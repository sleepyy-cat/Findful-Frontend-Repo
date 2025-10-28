<template>
  <div class="panel">
    <h2>Location Logs</h2>

    <section>
      <h3>Create Location Log</h3>
      <input v-model="createForm.thisItemName" placeholder="item name" />
      <input v-model="createForm.thisItemOwner" placeholder="item owner (username)" />
      <input v-model="createForm.currentSpaceName" placeholder="current space name" />
      <input v-model="createForm.currentSpaceOwner" placeholder="space owner (username)" />
      <button @click="create">Create</button>
      <div v-if="msg" class="msg">{{ msg }}</div>
    </section>

    <section>
      <h3>Place Item</h3>
      <input v-model="placeForm.linkItemName" placeholder="item name" />
      <input v-model="placeForm.linkItemOwner" placeholder="item owner (username)" />
      <input v-model="placeForm.linkSpaceName" placeholder="space name" />
      <input v-model="placeForm.linkSpaceOwner" placeholder="space owner (username)" />
      <button @click="place">Place</button>
      <div v-if="placeMsg" class="msg">{{ placeMsg }}</div>
    </section>

    <section>
      <h3>All Logs</h3>
      <button @click="load">Reload</button>
      <ul>
        <li v-for="l in logs" :key="l.thisItem.owner.username + ':' + l.thisItem.name">
          <strong>{{ l.thisItem.name }}</strong>
          <div class="meta">
            Owner: {{ l.thisItem.owner.username }} • Current: {{ l.currentSpace.name }} ({{
              l.currentSpace.owner.username
            }})
          </div>
          <div>
            History:
            <span v-if="l.locationHistory && l.locationHistory.length">{{
              l.locationHistory.map((h) => h.name).join(' → ')
            }}</span
            ><span v-else>—</span>
          </div>
          <button @click="remove(l)">Delete</button>
        </li>
      </ul>
      <div v-if="err" class="err">{{ err }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { createLog, placeItem, deleteLog, getLogs } from '../api/locationlog'
import type { ItemRef, SpaceRef, LocationLog } from '../api/locationlog'

const createForm = reactive({
  thisItemName: '',
  thisItemOwner: '',
  currentSpaceName: '',
  currentSpaceOwner: '',
})
const placeForm = reactive({
  linkItemName: '',
  linkItemOwner: '',
  linkSpaceName: '',
  linkSpaceOwner: '',
})
const logs = ref<LocationLog[]>([])
const msg = ref('')
const placeMsg = ref('')
const err = ref('')

async function create() {
  msg.value = ''
  err.value = ''
  try {
    if (
      !createForm.thisItemName ||
      !createForm.thisItemOwner ||
      !createForm.currentSpaceName ||
      !createForm.currentSpaceOwner
    ) {
      err.value = 'all fields are required'
      return
    }
    const thisItem: ItemRef = {
      name: String(createForm.thisItemName),
      owner: { username: String(createForm.thisItemOwner) },
    }
    const currentSpace: SpaceRef = {
      name: String(createForm.currentSpaceName),
      owner: { username: String(createForm.currentSpaceOwner) },
    }
    await createLog({ thisItem, currentSpace })
    msg.value = 'Created'
    createForm.thisItemName = ''
    createForm.thisItemOwner = ''
    createForm.currentSpaceName = ''
    createForm.currentSpaceOwner = ''
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function place() {
  placeMsg.value = ''
  err.value = ''
  try {
    if (
      !placeForm.linkItemName ||
      !placeForm.linkItemOwner ||
      !placeForm.linkSpaceName ||
      !placeForm.linkSpaceOwner
    ) {
      err.value = 'all fields are required'
      return
    }
    const linkItem: ItemRef = {
      name: String(placeForm.linkItemName),
      owner: { username: String(placeForm.linkItemOwner) },
    }
    const linkSpace: SpaceRef = {
      name: String(placeForm.linkSpaceName),
      owner: { username: String(placeForm.linkSpaceOwner) },
    }
    await placeItem({ linkItem, linkSpace })
    placeMsg.value = 'Placed'
    placeForm.linkItemName = ''
    placeForm.linkItemOwner = ''
    placeForm.linkSpaceName = ''
    placeForm.linkSpaceOwner = ''
    await load()
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function load() {
  err.value = ''
  try {
    const res = await getLogs()
    logs.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    err.value = e?.message ?? String(e)
  }
}

async function remove(l: LocationLog) {
  try {
    await deleteLog({ currItem: l.thisItem })
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
