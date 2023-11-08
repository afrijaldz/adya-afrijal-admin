<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { ref } from 'vue'
import { useTimeout } from '@vueuse/core'

const code = ref('')
const cookies = useCookies(['auth'])

const login = () => {
  code.value = code.value.trim()
  if (code.value !== 'adyaijalbersatu') {
    start()
    code.value = ''
  } else {
    cookies.set('auth', new Date().toISOString())
  }
}

const { ready: valueValid, start } = useTimeout(1000, { controls: true })
</script>

<template>
  <div class="flex justify-center items-center w-screen min-h-screen">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <div v-if="!valueValid" class="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! Task failed successfully.</span>
        </div>
        <h2 class="card-title">Login</h2>

        <input
          v-model="code"
          type="text"
          placeholder="Masukkan Kode"
          class="input input-bordered w-full max-w-xs"
        />
        <div class="card-actions justify-end">
          <button class="btn btn-primary" @click.stop="login">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>
