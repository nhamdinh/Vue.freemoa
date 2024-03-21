<template>
  <div class="left-menu">
    <div class="avatar">
          DOCS

        </div>
    <div class="avatar-group">
      <div class="user-name">
        <el-input
        v-model="input2"
        class="w-50 m-2"
        placeholder="Type something"
        :prefix-icon="Search"
      />
      </div>
    </div>
    <MenuItem
      v-for="(item, index) in menuList"
      :key="index"
      :menuName="item.name"
      :url="item.url"
      :subMenu="item.subMenu"
    ></MenuItem>
  </div>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import MenuItem from './MenuItem.vue'
import { ref, watch, watchEffect, onMounted } from 'vue'

import { Calendar, Search } from '@element-plus/icons-vue'
const input1 = ref<any>('')
const input2 = ref<any>('')
const menuList = [
  {
    name: 'home',
    url: '/home',
    subMenu: []
  },
  {
    name: 'about',
    url: '/about',
    subMenu: []
  },
  {
    name: 'todo',
    url: '/todo',
    subMenu: []
  },
  {
    name: 'thu',
    url: '/thu',
    subMenu: [
      { name: 'chinh', url: '/dung' },
      { name: 'comp', url: '/banner' },
      { name: 'option', url: '/popup' }
    ]
  },

  {
    name: 'box',
    url: '/products-management',
    subMenu: [
      { name: 'calender', url: '/list' },
      { name: 'input', url: '/create' },
      { name: 'output', url: '/inventory' }
    ]
  },
  {
    name: 'Props',
    url: '/orders-management',
    subMenu: [
      {
        name: 'State',
        url: '/state'
      },

      { name: 'Events', url: '/add-on' }
    ]
  }
]
</script>
<style scoped lang="scss">
.left-menu {
  display: flex;
  flex-direction: column;
  width: 312px;
  background: #101b3b;
  color: #fff;
  // height: calc(100vh - 80px);

  padding: 20px;
  min-height: 100vh;
  .pd20 {
    padding: 0 20px;
  }
  .go-back {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    cursor: pointer;
    .back-icon {
      width: 24px;
      height: 24px;
    }
    .back-label {
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #ffffff;
    }
  }
  .avatar{
    margin: 10px 0;
    font-size: 20px;
    font-weight: 600;
  }
  .avatar-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .user-name {
      margin-left: 10px;
      font-size: 20px;
      font-weight: 700;
    }
  }
  .sub-tiem {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
