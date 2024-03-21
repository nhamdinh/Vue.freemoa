<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import DeliveryFriend from './DeliveryFriend.vue'
import DeliveryGroup from './DeliveryGroup.vue'

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const props = defineProps(['prStData'])
const tab = ref<any>(1)

watch(props, async (newV, oldV) => {
  tab.value = 1
})
</script>

<template>
  <div class="DeliveryFriends">
    <div class="DeliveryFriends__content">
      <div class="content__title">전달 대상 선택</div>
      <div class="DeliveryFriends__navigate mt30px">
        <div
          @click="tab = 1"
          :class="tab === 1 ? 'navigate__btn__enabled' : 'navigate__btn__disabled'"
        >
          친구
        </div>
        <div
          @click="tab = 2"
          :class="tab === 2 ? 'navigate__btn__enabled' : 'navigate__btn__disabled'"
        >
          채팅
        </div>
      </div>
    </div>
    <DeliveryFriend v-if="tab === 1" :content="prStData?.content"></DeliveryFriend>
    <DeliveryGroup
      :content="prStData?.content"
      :day="prStData?.day"
      :groupChatId="prStData?.groupChatId"
      v-if="tab === 2"
    ></DeliveryGroup>
  </div>
</template>

<style lang="scss">
.DeliveryFriends {
  .DeliveryFriends__content {
    padding: 0 20px;
    padding-top: 30px;
    .content__title {
      font-family: SpoqaHanSansNeo;
      font-size: 18px;
      font-weight: 600;
      line-height: 22px;
      letter-spacing: -0.45px;
      color: #000;
      text-align: center;
    }
  }

  .DeliveryFriends__navigate {
    margin: 0 auto;
    width: 288px;
    height: 42px;
    border-radius: 6px;
    background-color: #f1f2f6;
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;
    @mixin navigate__btn {
      width: 136px;
      height: 32px;
      border-radius: 6px;

      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: 500;
      line-height: 18px;
      letter-spacing: -0.38px;

      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .navigate__btn__enabled {
      @include navigate__btn;
      background-color: #fff;
      color: #3566ae;
    }
    .navigate__btn__disabled {
      @include navigate__btn;
      background-color: #f1f2f6;
      color: #55606c;
    }
  }
  .find__relative {
    position: relative;
    .find__icon {
      position: absolute;
      right: 16px;
      top: 20px;
      cursor: pointer;
    }
  }
  .invite__someone__bot {
    display: flex;
    padding: 0 20px;

    flex-direction: column;
    flex: 1;
    position: relative;
    .invite__someone {
      background-color: #fff;
      // padding: 0 20px;
      padding-top: 20px;
    }
    .Invite {
      margin: 0 auto;
      width: 100px;
      height: 32px;
      border-radius: 6px;
      border: solid 1px #1767b3;
      background-color: #fff;

      font-family: SpoqaHanSansNeo;
      font-size: 13px;
      font-weight: normal;
      line-height: 16px;
      letter-spacing: -0.33px;
      color: #1767b3;

      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .getout {
      position: absolute;
      bottom: 0;
      display: flex;
      align-items: center;
      gap: 4px;
      background-color: #fff;
      border-top: 1px solid #f1f2f6;
      height: 40px;
      padding-left: 20px;
      cursor: pointer;
      .getout__icon {
        width: 20px;
        height: 20px;
      }
      .getout__title {
        font-family: SpoqaHanSansNeo;
        font-size: 13px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: -0.33px;
        color: #52606d;
      }
    }
  }
  .partner__list {
    display: flex;
    flex-direction: column;
    height: 170px;
    max-height: 170px;
    overflow-y: scroll;
    width: 288px;
    margin: 0 auto;
  }
  .partner__item {
    display: flex;
    align-items: center;
    gap: 10px;
    .partner__avatar {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      border-radius: 50%;
      background-position: center center;
      object-fit: cover;
      background-size: cover;
      background-attachment: fixed;
      background-repeat: no-repeat;
    }
    .partner__avatar__act {
      border: solid 2px #f58220 !important;
    }
    .partner__name {
      font-family: SpoqaHanSansNeo;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.3px;
      color: #242a37;
    }
    .partner__name__act {
      color: #f58220 !important;
    }
  }

  .DeliveryFriends__btns {
    display: flex;
    border-top: 1px solid #0067b9;
    @mixin DeliveryFriends__btn {
      flex: 1;
      cursor: pointer;
      height: 46px;

      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: 20px;
      letter-spacing: -0.75px;

      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn__cancel {
      @include DeliveryFriends__btn;
      background-color: #fff;
      color: #0067b9;
      border-bottom-left-radius: 10px;
    }
    .btn__ok {
      @include DeliveryFriends__btn;
      background-color: #0067b9;
      color: #fff;
      border-bottom-right-radius: 10px;
    }
  }
}
</style>
