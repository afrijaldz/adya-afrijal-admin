import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInviteeStore = defineStore('invitee', () => {
  const list = ref<
    {
      name: string
      hash: string
    }[]
  >([])

  return { list }
})
