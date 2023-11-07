<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInviteeStore } from '../stores/invitee'
import { useFetch, useTimeout } from '@vueuse/core'

const inviteStore = useInviteeStore()

const name = ref('')
const invitee = ref<{
  id: number
  name: string
}>()
const loading = ref(false)

onMounted(() => {
  getList()
})

const getList = async () => {
  const { data } = await useFetch('https://jlab.my.id/')

  if (data.value) {
    const invitees = JSON.parse(data.value as string)
    inviteStore.list = invitees.data
  }
}

const addUser = async () => {
  if (name.value) {
    const { data } = await useFetch('https://jlab.my.id')
      .post({
        name: name.value
      })
      .json()

    if (data.value) {
      name.value = ''
      start()
      getList()
      ;(document.getElementById('my_modal_1') as any).close()
    }
  }
}
const { ready: valueValid, start } = useTimeout(1000, { controls: true })

const edit = (ok: any) => {
  name.value = ok.name
  invitee.value = ok
  ;(document.getElementById('my_modal_2') as any).showModal()
}

const editUser = async () => {
  if (name.value) {
    const { data } = await useFetch('https://jlab.my.id/' + invitee.value?.id)
      .put({
        name: name.value
      })
      .json()

    if (data.value) {
      console.log('masukk')
      name.value = ''
      start()
      getList()
      invitee.value = undefined
      ;(document.getElementById('my_modal_2') as any).close()
    }
  }
}

const hapusUser = async () => {
  console.log('hapu')
  if (invitee.value?.id) {
    const { data } = await useFetch('https://jlab.my.id/' + invitee.value?.id).delete()

    if (data.value) {
      name.value = ''
      start()
      getList()
      invitee.value = undefined
      ;(document.getElementById('modal_hapus') as any).close()
    }
  }
}

const hapus = (ok: any) => {
  invitee.value = ok
  ;(document.getElementById('modal_hapus') as any).showModal()
}
</script>

<template>
  <div v-if="!valueValid" class="alert alert-success">
    <span>Sukses</span>
  </div>
  <div class="container">
    <div class="my-3">
      <button class="btn btn-sm btn-success" onclick="my_modal_1.showModal()">Tambah data</button>
    </div>

    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Hash</th>
            <th>Link</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(invitee, i) in inviteStore.list" :key="`invitee-${i}`">
            <th>{{ i + 1 }}</th>
            <td>{{ invitee.name }}</td>
            <td>{{ invitee.hash }}</td>
            <td>
              <a :href="`http://adya-afrijal.com/${invitee.hash}`">
                {{ `http://adya-afrijal.com/${invitee.hash}` }}
              </a>
            </td>
            <td>
              <button class="py-2 px-3 bg-primary rounded text-white" @click="edit(invitee)">
                Edit
              </button>
              &nbsp;
              <button class="py-2 px-3 bg-red-400 rounded text-white" @click="hapus(invitee)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Tambah Data</h3>
      <div class="py-2">
        <input
          v-model="name"
          type="text"
          placeholder="Masukkan Nama"
          class="input input-bordered w-full max-w-xs"
        />
      </div>
      <div class="modal-action">
        <button :disabled="loading" class="btn btn-primary" @click.stop="addUser">Tambah</button>
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button :disabled="loading" class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="my_modal_2" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Edit Data</h3>
      <div class="py-2">
        <input
          v-model="name"
          type="text"
          placeholder="Masukkan Nama"
          class="input input-bordered w-full max-w-xs"
        />
      </div>
      <div class="modal-action">
        <button :disabled="loading" class="btn btn-primary" @click.stop="editUser">Edit</button>
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button :disabled="loading" class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="modal_hapus" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Hapus Data</h3>
      <div class="py-2">
        Yakin akan menghapus orang ini? <b>{{ invitee?.name }}</b>
      </div>
      <div class="modal-action">
        <button :disabled="loading" class="btn btn-warning" @click.stop="hapusUser">Hapus</button>
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button :disabled="loading" class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
