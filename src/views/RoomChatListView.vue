<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import pluswhite24 from '@/assets/svg/pluswhite24.svg'
import RoomChat from '@/components/Company/RoomChat.vue'
import router from '@/router'
import tune_black_24dp from '@/assets/svg/tune_black_24dp.svg'
import logomini from '@/assets/img/logomini.png'
import { ref } from 'vue'

const step = ref<any>(1)
</script>

<template>
  <div class="RoomChatListView">
    <div class="RoomChatListView__content">
      <div class="uptotop" @click="step === 1 && router.push({ path: `/room-chat-create` })">
        <img :src="pluswhite24" alt="uparrow" />
      </div>
      <div class="Header__main__logo">
        <div class="logo__a">
          <img class="logomini" :src="logomini" alt="logomini" />
        </div>
<!--         <img class="cursor__pointer iconx__right" :src="tune_black_24dp" width="24" alt="iconx" />
 -->      </div>
      <div class="navigate mb15px">
        <div class="navigate__btn__disabled" @click="router.push({ path: `/company-list` })">
          회원사 리스트
        </div>
        <div class="navigate__btn__enabled">채팅방 리스트</div>
      </div>
      <RoomChat
        @setStep2="
          () => {
            step = 2
          }
        "
      ></RoomChat>

      <Footer :active="1"></Footer>
    </div>
  </div>
</template>

<style lang="scss">
.RoomChatListView {
  width: 100%;
  .RoomChatListView__content {
    .RoomChat__mid {
      height: calc(100vh - 160px);
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px 16px;
      padding-top: 0;
      background-color: #fff;

      display: flex;
      flex-direction: column;
      .RoomChat__mid__item {
        width: 328.5px;
        height: 76.5px;
        min-height: 76.5px;
        background-color: #fff;
        border-bottom: 1px solid #cbd2da;
        display: flex;
        gap: 21px;
        .RoomChat__img {
          width: 56px;
          height: 56px;
          min-width: 56px;
          min-height: 56px;
          border-radius: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-position: center center;
          object-fit: cover;
          margin-right: 3px;
        }
        .RoomChat__group {
          width: 59px;
          height: 59px;
          display: flex;
          gap: 3px;
          flex-wrap: wrap;
          .RoomChat__item {
            width: 28px;
            height: 28px;
            min-width: 28px;
            min-height: 28px;
            border-radius: 50%;
            background-size: cover;
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-position: center center;
            object-fit: cover;
          }
        }
        .RoomChat__text {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 4px;

          .text__a {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .name__date {
              display: flex;
              align-items: center;
              gap: 17px;
            }
            .name {
              font-family: SpoqaHanSansNeo;
              font-size: 15px;
              font-weight: 600;
              line-height: 20px;
              letter-spacing: -0.38px;
              color: #242a37;

              width: 94px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
            .date {
              font-family: SpoqaHanSansNeo;
              font-size: 12px;
              font-weight: 500;
              line-height: 16px;
              letter-spacing: -0.3px;
              color: #52606d;
            }
            .time {
              font-family: SpoqaHanSansNeo;
              font-size: 12px;
              font-weight: 500;
              line-height: 16px;
              letter-spacing: -0.3px;
              color: #52606d;
            }
          }
          @mixin text__b {
            font-family: SpoqaHanSansNeo;
            font-size: 12px;
            line-height: 16px;
            letter-spacing: -0.3px;
            color: #242a37;
            width: 173px;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .text__b__read {
            @include text__b;
            font-weight: 600;
          }
          .text__b__unread {
            @include text__b;
            font-weight: 400;
          }
        }
      }
    }
  }
  ::-webkit-scrollbar {
    width: 0.4em;
    height: 0.4em;
    position: absolute;
    right: 0;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #c4c7ca;
  }

  ::-webkit-scrollbar-track {
    background: #f1f2f3;
  }
}
</style>
