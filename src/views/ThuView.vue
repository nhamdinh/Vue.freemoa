<template>
  <p>Has published books:</p>
  <div>{{ publishedBooksMessage }}</div>
  <input
    :value="searchText"
    @input="
      (event: any) => {
        searchText = +event.target.value
      }
    "
  />

  <div @click="(n) => increment('answer', 9)">{{ now }}</div>
  <div class="static" :class="[isActive ? 'activeClass' : 'UNactiveClass', 'class2']">
    - Advanced Guide', 'Vue 3 - Basic Guide', 'Vu
  </div>
  <p>
    Ask a yes/no question:
    <input ref="input" v-model="question" />
  </p>
  <p>{{ answer }}</p>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
  {{ count }}

  <ThuChi @enlarge-text="increment" title="titletitle" v-for="(item, index) in list" :key="index" />
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from 'vue'
import { reactive, computed } from 'vue'
import ThuChi from './ThuChi.vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'

const count = ref<any>(0)
const isActive = ref<any>(true)
const searchText = ref<any>(1)
const hasError = ref<any>(0)
const TodoRepo = RepositoryFactory.get('tasks')

const question = ref<any>('')
const answer = ref<any>('Questions usually contain a question mark. ;-)')

const author = reactive({
  name: 'John Doe',
  books: ['Vue 2 - Advanced Guide', 'Vue 3 - Basic Guide', 'Vue 4 - The Mystery']
})
const now = computed(() => Date.now())

const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
const input = ref<any>(null)

const list = ref<any>([1])

const itemRefs = ref<any>([])

function emitValue(e: any) {
  let value = e.target.value
}

// onMounted(() => {
//   console.log(itemRefs.value.map(i => i.textContent))
// })

watch(question, async (newQuestion, oldQuestion) => {
  console.log(newQuestion.indexOf('?'))
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})

watchEffect(() => {
  // console.log(itemRefs.value.map(i => i.textContent))
  if (input.value) {
    //@ts-ignore
    input.value.focus()
  } else {
    // not mounted yet, or the element was unmounted (e.g. by v-if)
  }
})

function increment(xxx: any, yyy: any) {
  console.log(xxx)
  console.log(yyy)
  count.value++
  isActive.value = !isActive.value
}
</script>
