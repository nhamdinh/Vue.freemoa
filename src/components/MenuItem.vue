<script setup lang="ts">
import moment from 'moment'
import { useRoute } from 'vue-router'

import { ref, watch, watchEffect, onMounted } from 'vue'
import { reactive, computed } from 'vue'
import router from '@/router'

const props = defineProps(['menuName', 'url', 'subMenu'])

const route = useRoute()
const currentRouteName = computed(() => route.path)

const isExpand = ref<any>(false)
const isFirstSub = ref<any>(false)

const hasSubMenu = () => {
  return props.subMenu.length > 0
}

const handleCheckActiveMenu = (menu: string) => {
  if (currentRouteName.value) {
    return currentRouteName.value.toString().includes(menu)
  } else {
    return false
  }
}

const onClickTitle = () => {
  onClickToMajorMenu()
  if (hasSubMenu()) {
    isExpand.value = !isExpand.value
  } else {
    isExpand.value = true
  }
}
const onClickToMajorMenu = () => {
  if (hasSubMenu()) {
    router.push({ path: `${props.url}${props.subMenu[0].url}` })
  } else {
    router.push({ path: props.url })
  }
}

const checkPathStartsWith = (menu: string) => {
  if (currentRouteName.value) {
    let routeName = currentRouteName.value.toString()
    return routeName.startsWith(menu)
  } else {
    return false
  }
}

const onClickToSubMenu = (sub: any) => {
  router.push({ path: `${props.url}${sub.url}` })
}

watch(currentRouteName, async (newQuestion, oldQuestion) => {
  if (checkPathStartsWith(props.url)) isExpand.value = true
})

watchEffect(() => {
  // console.log(itemRefs.value.map(i => i.textContent))
})
</script>
<template>
  <div class="menu-item">
    <div
      @click="onClickTitle"
      class="menu-content"
      :class="checkPathStartsWith(url) && isExpand ? 'item-active' : ''"
    >
      <div class="menu-title">
        {{ menuName }}
      </div>

      <div class="menu-icon">
        <img v-if="subMenu.length > 0" alt="" src="" />
      </div>
    </div>

    <div class="sub-menu" v-if="checkPathStartsWith(url) && isExpand">
      <div
        v-for="(sub, index) in subMenu"
        :key="index"
        class="sub-menu-content"
        :class="handleCheckActiveMenu(`${url}${sub.url}`) ? 'active' : ''"
        @click="onClickToSubMenu(sub)"
      >
        {{ sub.name }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.menu-item {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  width: 100%;

  .menu-content {
    display: flex;
    flex-direction: row;
    padding: 14px 20px;

    .menu-title {
      width: 150px;
      // margin: auto;
      align-self: center;
      font-size: 16px;
      font-weight: 700;
      line-height: 44px;
      cursor: pointer;
    }
    .menu-icon {
      width: 30px;
      color: gray;
      text-align: center;
      font-weight: 600;
      font-size: 28px;
      align-self: center;
      cursor: pointer;
    }
  }

  .item-active {
    .menu-title {
      // margin: auto;
      font-size: 20px;
      font-weight: 700;
      line-height: 44px;
      cursor: pointer;
    }
  }
  .sub-menu {
    display: flex;
    flex-direction: column;
    .sub-menu-content {
      padding: 12px 10px;
      margin-left: 30px;
      width: 100%;

      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;

      color: #fff;
      border-left: 1px solid #273252;

      cursor: pointer;
      &.active {
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        border-left: 3px solid #fff;
      }
    }
  }
}
</style>
