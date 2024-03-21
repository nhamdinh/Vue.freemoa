<template>
  <!-- {{ console.log(taskLoaded) }} -->
  <div class="TodoView__view">
    <div class="TodoView__content">
      <div class="todo-header">
        Count: {{ countLocal }} <button @click="countLocal++">+</button>
        <button @click="decrement('decrement')">-</button>
      </div>
      <!-- <div class="todo-header">
        Count from store: {{ count }} <button @click="incrementProp">+</button>
        <button @click="decrementProp">-</button>
      </div> -->
      <div class="todo-input">
        <input v-model="newTask" placeholder="nhap vao day" />
        <button @click="openDialogProp">Add task</button>
      </div>

      <button class="popup" @click="openDialogProp">{{ i18n.t('Stock Status') }}</button>

      <div class="todo-wrapper">
        <div class="todo">
          <div class="title">Todo</div>

          <div class="content">
            <div v-for="item in listTasks.filter((it: any) => it.status === 'todo')" class="item">
              {{ item.title }}
              <button @click="moveTaskInprogress(item.id)">Next</button>
            </div>
          </div>
        </div>
        <div class="in-progress">
          <div class="title">In progress</div>

          <div class="content">
            <div
              v-for="item in listTasks.filter((it: any) => it.status === 'inprogress')"
              class="item"
            >
              {{ item.title }}
              <button @click="moveTaskDone(item.id)">Next</button>
            </div>
          </div>
        </div>
        <div class="done">
          <div class="title">Done</div>
          <div class="title"></div>

          <div class="content">
            <div v-for="item in listTasks.filter((it: any) => it.status === 'done')" class="item">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading">Loading...</div>

      <div v-if="taskLoaded.length > 0">
        <div>co {{ formatMoney(taskLoaded.length) }} records</div>
        <div class="list">
          <div
            class="item"
            v-for="(task, index) in taskLoaded.filter((it: any, ind: any) => ind < 10)"
            :key="index"
          >
            {{ index }} -- {{ task?.name }}
          </div>
        </div>
      </div>
      <div v-else>chua co records nao</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import i18n from '@/locales/config'

import { storeToRefs } from 'pinia'
import { useCustomDialogStore } from '@/stores/customDialog'
import { formatMoney } from '@/common/commonFunction'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { ref, watch, watchEffect, onMounted } from 'vue'

const store = useCustomDialogStore()
const { openDialog } = store
const TodoRepo = RepositoryFactory.get('tasks')

const countLocal = ref<any>(1)
const message = ref<any>('this is text')
const isLoading = ref<any>(false)
const newTask = ref<any>('')
const taskLoaded = ref<any>([])
const listTasks = ref<any>([
  {
    id: 0,
    title: 'Task 1',
    status: 'todo'
  },
  {
    id: 1,
    title: 'Task 2',
    status: 'inprogress'
  },
  { id: 2, title: 'Task 3', status: 'inprogress' },
  { id: 3, title: 'Task 4', status: 'inprogress' },
  { id: 4, title: 'Task 5', status: 'done' }
])

const addTask = (newTask1: string) => {
  newTask.value = ''
  listTasks.value.push({
    id: listTasks.value.length,
    title: newTask1,
    status: 'todo'
  })
  console.log(listTasks.value)
}
const moveTaskInprogress = (id: number) => {
  let newList = listTasks.value.map((it: any) => {
    if (it.id == id) {
      return { ...it, status: 'inprogress' }
    }
    return it
  })
  listTasks.value = newList
}
const moveTaskDone = (id: number) => {
  let newList = listTasks.value.map((it: any) => {
    if (it.id === id) {
      return { ...it, status: 'done' }
    }
    return it
  })
  listTasks.value = newList
}

const openDialogProp = () => {
  if (i18n.current.value === 'ko') {
    i18n.changeLocale('en')
  } else {
    i18n.changeLocale('ko')
  }
  // openDialog({
  //   stType: 'confirm',
  //   stTitle: 'day la qq',
  //   stContent: 'noi dung qwe',
  //   stCancelText: 'KO phai em',
  //   stOkText: 'DUOC la em',
  //   stClosable: true,
  //   actionConfirm: () => {
  //     countLocal.value = countLocal.value + 100
  //   },
  //   actionCancel: () => {
  //     countLocal.value = countLocal.value + 30
  //   },
  //   actionAfterClose: () => {
  //     countLocal.value = countLocal.value + 50
  //   }
  // })
}

const decrement = (countLocal1: any) => {
  countLocal.value++
}

const initData = async () => {
  isLoading.value = true
  const { data } = await TodoRepo.get()
  isLoading.value = false
  taskLoaded.value = data
}
watchEffect(() => {
  // console.log(itemRefs.value.map(i => i.textContent))
  initData()
})
</script>
<style scoped lang="scss">
.TodoView__view {
  padding: 100px;
  .TodoView__content {
    padding: 20px;
    color: red;
    background-color: #fff;
    border: 1px solid greenyellow;
    border-radius: 10px;
    .popup {
      width: 100px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      outline: none;
      border: 1px solid green;
      margin: 0 auto;

      margin-bottom: 20px;
      margin-top: 20px;
      cursor: pointer;
    }
  }

  .todo-wrapper {
    background: #fff;
    display: flex;
    flex-direction: row;
    gap: 24px;
    .todo,
    .in-progress,
    .done {
      .title {
        text-align: center;
        font-size: 24px;
      }
      .content {
        height: 200px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: space-between;
        .item {
          display: flex;
          justify-content: space-around;
          padding: 5px;
          width: 100%;
        }
      }
    }
    .todo {
      // background: lightcoral;
      flex: 1;
      border: 1px solid lightcoral;
      border-radius: 4px;
    }
    .in-progress {
      // background: lightgreen;
      flex: 1;
      border: 1px solid lightgreen;
      border-radius: 4px;
    }
    .done {
      // background: lightblue;
      flex: 1;
      border: 1px solid lightblue;
      border-radius: 4px;
    }
  }
}
</style>
