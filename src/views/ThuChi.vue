<template>
  <div>child</div>
  {{ title }} ---{{ key }}
  {{ countLocal }}
  <button @click="$emit('enlarge-text', count, 'count')">Enlarge text</button>
  {{ moment('20220203').format('YYYY-MM-DD') }}
  {{ AAA }}

  <el-row class="mb-4">
    <el-button @click="onFinish">Default</el-button>

    <el-button type="warning" @click="openDialogProp">Warning</el-button>
    <el-button type="danger" @click="incre">incre</el-button>
    <el-button @click="onGetProfile">onGetProfile</el-button>
  </el-row>
  <div v-if="taskLoaded.length > 0">
    <div>co {{ formatMoney(taskLoaded.length) }} records</div>
    <div class="list">
      <div
        class="item"
        v-for="(task, index) in taskLoaded.filter((it: any, ind: any) => ind < 3)"
        :key="index"
      >
        {{ index }} -- {{ task?.name }}
      </div>
    </div>
  </div>
  <div v-else>chua co records nao</div>
  <div class="info" v-if="profile?.name">
    <div>
      {{ profile?.name }}
    </div>
    <div>
      {{ profile?.email }}
    </div>
    <div>
      {{ moment(profile?.createdAt).format('LL') }}
    </div>
  </div>
  <div v-if="isLoading">Loading...</div>
</template>

<script setup lang="ts">
import moment from 'moment'

import { ref, watch, watchEffect, onMounted } from 'vue'
import { reactive, computed } from 'vue'
import { useCustomDialogStore } from '@/stores/customDialog'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { formatMoney } from '@/common/commonFunction'
import { AAA, ACCESSTOKEN_STORAGE } from '@/common/constance'

defineProps(['title', 'key'])
defineEmits(['enlarge-text'])

const store = useCustomDialogStore()
const { openDialog } = store
const TodoRepo = RepositoryFactory.get('tasks')

const count = ref<any>(0)

const isActive = ref<any>(true)
const countLocal = ref<any>(1)
const taskLoaded = ref<any>([])
const profile = ref<any>({})
const isLoading = ref<any>(false)

const initData = async () => {
  isLoading.value = true
  const { data } = await TodoRepo.get()
  isLoading.value = false
  taskLoaded.value = data
}

const onFinish = async () => {
  console.log('Received values of form: ')
  isLoading.value = true
  const res = await TodoRepo.login({
    email: 'admin1@example.com',
    password: '123456'
  })
  isLoading.value = false

  //@ts-ignore
  const data = res?.data

  if (data) {
    localStorage.setItem(ACCESSTOKEN_STORAGE, data.token)
  } else {
  }

  console.log('rp error: ', res)
}

const onGetProfile = async () => {
  isLoading.value = true
  const res = await TodoRepo.getProfile()
  isLoading.value = false

  //@ts-ignore
  const data = res?.data

  if (data) {
    profile.value = data
  } else {
  }

  console.log('rp error: ', res)
}

const question = ref<any>('')
const answer = ref<any>('Questions usually contain a question mark. ;-)')

const openDialogProp = () => {
  openDialog({
    stType: 'confirm',
    stTitle: 'day la qq',
    stContent: 'noi dung qwe',
    stCancelText: 'THOII',
    stOkText: 'CHOI',
    stClosable: false,
    actionConfirm: () => {
      countLocal.value = countLocal.value + 100
    },
    actionCancel: () => {
      countLocal.value = countLocal.value + 30
    },
    actionAfterClose: () => {
      countLocal.value = countLocal.value + 50
    }
  })
}
const incre = () => {
  countLocal.value = countLocal.value + 1
}

const author = reactive({
  name: 'John Doe',
  books: ['Vue 2 - Advanced Guide', 'Vue 3 - Basic Guide', 'Vue 4 - The Mystery']
})
const now = computed(() => Date.now())

const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
const input = ref<any>(null)

const list = ref<any>([1, 2, 3])

const itemRefs = ref<any>([])

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
  initData()

  if (input.value) {
    //@ts-ignore
    input.value.focus()
  } else {
    // not mounted yet, or the element was unmounted (e.g. by v-if)
  }
})

function increment() {
  count.value++
  isActive.value = !isActive.value
}
</script>
<style scoped lang="scss">
.info {
  color: red;
}
</style>
