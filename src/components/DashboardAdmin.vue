<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useInviteeStore } from '../stores/invitee'
import { useFetch, useTimeout } from '@vueuse/core'

import { useClipboard } from '@vueuse/core'

const inviteStore = useInviteeStore()

const name = ref('')
const sumbangan = ref('')
const from = ref('')
const hash = ref('')

const invitee = ref<{
  id: number
  name: string
  from: string
  sumbangan: string
}>()

const loading = ref(false)

const waText = ref('')

const {
  copied: textWaCopied,
  copy: copytextWa,
  isSupported: copyTextSupported
} = useClipboard({ source: waText })
const total = computed(() => inviteStore.list.length)
const ijal = computed(
  () => inviteStore.list.map((li) => li.from).filter((li) => li === 'ijal').length
)
const ijalSumbangan = computed(
  () => inviteStore.list.filter((li) => li.from === 'ijal' && li.sumbangan === 'ya').length
)
const adya = computed(
  () => inviteStore.list.map((li) => li.from).filter((li) => li === 'adya').length
)
const adyaSumbangan = computed(
  () => inviteStore.list.filter((li) => li.from === 'adya' && li.sumbangan === 'ya').length
)

onMounted(() => {
  getList()
})

const resetForm = () => {
  name.value = ''
  sumbangan.value = ''
  from.value = ''
  hash.value = ''
  invitee.value = undefined
}

const getList = async () => {
  const { data, isFetching, isFinished } = await useFetch('https://api-a2.jlab.my.id/')

  if (isFetching.value) {
    loading.value = true
  }

  if (isFinished.value) {
    loading.value = false
  }

  if (data.value) {
    const invitees = JSON.parse(data.value as string)
    inviteStore.list = invitees.data
  }
}

const addUser = async () => {
  if (name.value) {
    const { data } = await useFetch('https://api-a2.jlab.my.id')
      .post({
        name: name.value,
        sumbangan: sumbangan.value,
        from: from.value
      })
      .json()

    if (data.value) {
      resetForm()
      start()
      getList()
      ;(document.getElementById('my_modal_1') as any).close()
    }
  }
}
const { ready: valueValid, start } = useTimeout(1000, { controls: true })

const edit = (ok: any) => {
  name.value = ok.name
  sumbangan.value = ok.sumbangan
  from.value = ok.from
  invitee.value = ok
  ;(document.getElementById('my_modal_2') as any).showModal()
}

const editUser = async () => {
  if (name.value) {
    const { data } = await useFetch('https://api-a2.jlab.my.id/' + invitee.value?.id)
      .put({
        name: name.value,
        sumbangan: sumbangan.value,
        from: from.value
      })
      .json()

    if (data.value) {
      resetForm()
      start()
      getList()
      ;(document.getElementById('my_modal_2') as any).close()
    }
  }
}

const hapusUser = async () => {
  if (invitee.value?.id) {
    const { data } = await useFetch('https://api-a2.jlab.my.id/' + invitee.value?.id).delete()

    if (data.value) {
      start()
      getList()
      resetForm()
      ;(document.getElementById('modal_hapus') as any).close()
    }
  }
}

const hapus = (ok: any) => {
  invitee.value = ok
  ;(document.getElementById('modal_hapus') as any).showModal()
}

watch(textWaCopied, (value) => {
  if (!value) {
    resetForm()
  }
})

const copyTextWa = (ok: any) => {
  hash.value = ok.hash
  waText.value = `
Kepada Yth.
Bapak/Ibu/Saudara/i
*${ok.name}*


Assalamu'alaikum Warahmatullahi Wabarakatuh.

Dengan menghaturkan syukur kehadirat Tuhan YME, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami.

Adya Restina Prameswari
&
Afrijal Dzuhri

Berikut link undangan kami, untuk info lengkap dari acara dapat mengunjungi:

https://adya-afrijal.com/${ok.hash}

kode undangan: ${ok.hash}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya dibagikan melalui pesan ini.

Terima kasih atas perhatiannya.
Wassalamu'alaikum Warahmatullahi Wabarakatuh.

Salam hangat,
Adya & Afrijal
Beserta Keluarga
`

  copytextWa(waText.value)
}
</script>

<template>
  <div v-if="!valueValid" class="alert alert-success">
    <span>Sukses</span>
  </div>
  <div class="container">
    <div class="my-3">
      <button :disabled="loading" class="btn btn-sm btn-success" onclick="my_modal_1.showModal()">
        <template v-if="loading"> Loading... </template>
        <template v-else> Tambah data </template>
      </button>
    </div>

    <div class="flex">
      <div>
        <div>total tamu ijal : {{ ijal }} (sumbangan: {{ ijalSumbangan }})</div>
        <div>total tamu adya : {{ adya }} (sumbangan: {{ adyaSumbangan }})</div>
      </div>
    </div>
    <div>total sumbangan: {{ ijalSumbangan + adyaSumbangan }}</div>

    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Hash</th>
            <th>Link</th>
            <th>Text WA</th>
            <th>Tamu dari</th>
            <th>Sumbangan</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(invitee, i) in inviteStore.list" :key="`invitee-${i}`">
            <th>{{ i + 1 }}</th>
            <td>{{ invitee.name }}</td>
            <td>{{ invitee.hash }}</td>
            <td>
              <a :href="`https://adya-afrijal.com/${invitee.hash}`">
                {{ `https://adya-afrijal.com/${invitee.hash}` }}
              </a>
            </td>
            <td>
              <button class="py-2 px-3 bg-primary rounded text-white" @click="copyTextWa(invitee)">
                {{ !textWaCopied || (hash && hash !== invitee.hash) ? 'Copy Text' : 'Copied' }}
              </button>
            </td>
            <td :class="[invitee.from === 'adya' ? 'bg-pink-400' : 'bg-blue-400']">
              {{ invitee.from }}
            </td>
            <td :class="[invitee.sumbangan === 'ya' ? 'bg-green-400' : 'bg-yellow-400']">
              {{ invitee.sumbangan }}
            </td>
            <td class="w-full">
              <button
                :disabled="loading"
                class="py-2 px-3 bg-primary rounded text-white"
                @click="edit(invitee)"
              >
                <template v-if="loading"> Loading... </template>
                <template v-else> Edit </template>
              </button>
              &nbsp;
              <button
                :disabled="loading"
                class="py-2 px-3 bg-red-400 rounded text-white"
                @click="hapus(invitee)"
              >
                <template v-if="loading"> Loading... </template>
                <template v-else> Delete </template>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">
        <template v-if="loading"> Loading... </template>
        <template v-else> Tambah data </template>
      </h3>

      <div class="mt-2">
        <input
          v-model="name"
          type="text"
          placeholder="Masukkan Nama"
          class="input input-bordered w-full max-w-xs"
        />
      </div>
      <div class="mt-2">
        <select class="select select-bordered w-full max-w-xs" v-model="from">
          <option value="ijal">ijal</option>
          <option value="adya">Adya</option>
        </select>
      </div>
      <div class="mt-2">
        <select class="select select-bordered w-full max-w-xs" v-model="sumbangan">
          <option value="ya">ya</option>
          <option value="tidak">Tidak</option>
        </select>
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
      <div class="mt-2">
        <select class="select select-bordered w-full max-w-xs" v-model="from">
          <option value="ijal">ijal</option>
          <option value="adya">Adya</option>
        </select>
      </div>
      <div class="mt-2">
        <select class="select select-bordered w-full max-w-xs" v-model="sumbangan">
          <option value="ya">ya</option>
          <option value="tidak">Tidak</option>
        </select>
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
  v0.2
</template>
