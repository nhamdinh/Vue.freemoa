<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import Footer from '@/components/Footer.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import logomini from '@/assets/img/logomini.png'
import Header from '@/components/Header.vue'
import login from '@/assets/svg/login.svg'
import logout from '@/assets/img/logout.png'

import MyInfoUpdate from '@/components/MyInfo/MyInfoUpdate.vue'
import MyInfoIntro from '@/components/MyInfo/MyInfoIntro.vue'

import router from '@/router'
import { ACCESSTOKEN_STORAGE, TO_LOGIN } from '@/common/constance'
import { useCustomDialogStore } from '@/stores/customDialog'

const step = ref<any>(1)

const storeAuth = useAuthStore()
const { stProfile } = storeToRefs(storeAuth)
const profile = ref<any>(stProfile)
watch(stProfile, async (newV, oldV) => {
  profile.value = stProfile.value
})

const { setProfile } = storeAuth
const AuthRepo = RepositoryFactory.get('auth')

const store = useCustomDialogStore()
const { openDialog } = store

const openPopup = (stType: any) => {
  openDialog({
    stType: stType,
    stTitle: TO_LOGIN,
    stCancelText: '취소',
    stOkText: '확인',
    stClosable: false,
    actionConfirm: () => {
      router.push('/login')
      console.log('ok')
      //   console.log(props?.item?.id)
      // showAction.value = false
    },
    actionCancel: () => {
      // showAction.value = false
      router.push('/home')

      console.log('cancel')
    },
    actionAfterClose: () => {}
  })
}

const onGetProfile = async () => {
  await AuthRepo.getProfile()
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        // console.log(data?.data)
        // dataPost.value = data?.data
        setProfile({ stProfile: data?.data })
      }
    })
    .catch((err: any) => {
      if (err?.response?.status === 401) {
        openPopup('confirm')
        step.value = 3
      }
      console.log(err)
    })
}

const onLogout = async () => {
  await AuthRepo.logOut()
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
      }
    })
    .catch((err: any) => {
      console.log(err)
    })
  localStorage.removeItem(ACCESSTOKEN_STORAGE)
  setProfile({ stProfile: {} })
  router.push({ path: '/login' })
}
watchEffect(() => {
  onGetProfile()
})
</script>

<template>
  <div class="MyInfoView">
    <div v-if="step === 1" class="Header__main__logo">
      <div class="logo__a">
        <img class="logomini" :src="logomini" alt="logomini" />
      </div>
      <div class="logo__a cursor__pointer" @click="onLogout">
        <img class="logout" :src="logout" alt="logout" />
      </div>
    </div>
    <div v-if="step === 2" @click="step = 1">
      <Header :back="'/my-info'" :icon="2" :title="'내 정보'"></Header>
    </div>

    <MyInfoIntro :profile="profile" v-if="step === 1" @setStep="step = 2"></MyInfoIntro>
    <MyInfoUpdate v-if="step === 2"></MyInfoUpdate>
    <Footer v-if="step === 1" :active="6"></Footer>
  </div>
</template>
<style lang="scss">
.Header__main__logo {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  position: fixed;
  width: 360px;
  background-color: #fff;
  z-index: 999;
  top: 0;
  border-top: 1px solid #bebdbd;
  // border-right: 1px solid #bebdbd;
}
.MyInfoView {
  width: 100%;
  .logout {
    width: 24px;
    height: 24px;
  }
  .MyInfoView__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 30px;

    .MyInfoView__mani__menu {
      position: absolute;
      top: 195px;

      width: 328px;
      height: 323px;
      border-radius: 10px;
      box-shadow: 0 0 6px 0 rgba(27, 55, 77, 0.2);
      background-color: #fff;
      padding-top: 20px;
      .all {
        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: -0.38px;
        color: #242a37;
      }
      .deli {
        width: 283px;
        height: 1px;
        background-color: #cbd2da;
        margin: 0 auto;
      }

      .arr3__list {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 54px;
        .arr3__item {
          display: flex;
          gap: 10px;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          .arr3__list__wrapper {
            width: 60px;
            height: 60px;
            box-shadow: 0 0 6px 0 rgba(129, 147, 162, 0.26);
            background-color: #f4f9ff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
          }
          .app__name {
            font-family: SpoqaHanSansNeo;
            font-size: 12px;
            font-weight: 500;
            line-height: 16px;
            letter-spacing: -0.3px;
            color: #242a37;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      }
    }
    .h55px {
      height: 55px;
      width: 100%;
      background-color: #e6f3fe;
    }
    .avatar__back__intro {
      width: 359px;
      height: 195px;
      position: relative;
      .user__info {
        position: absolute;
        z-index: 1;
        right: 16px;
        top: 42px;
        width: 328px;
        display: flex;
        gap: 16px;
        align-items: center;
        .name__user {
          width: 238px;
          .name__user__a {
            font-family: SpoqaHanSansNeo;
            font-size: 22px;
            font-weight: bold;
            font-style: normal;
            line-height: 30px;
            letter-spacing: -0.55px;
            color: #000;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .name__user__b {
            font-family: SpoqaHanSansNeo;
            font-size: 22px;
            font-weight: 500;
            font-style: normal;
            line-height: 30px;
            letter-spacing: -0.55px;
            color: #000;
          }
        }
        .avatar__user__bgc {
          background-color: #fff;
          border-radius: 50%;
          width: 74px;
          height: 74px;
        }
        .avatar__user {
          width: 74px;
          height: 74px;
          min-width: 74px;
          min-height: 74px;
          border-radius: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-position: center center;
          object-fit: cover;
        }
      }
      .to__myinfo {
        cursor: pointer;
        position: absolute;
        z-index: 1;
        right: 16px;
        top: 21px;
        width: 328px;
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: flex-end;
        div {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: bold;
          line-height: 16px;
          letter-spacing: -0.3px;
          color: #242a37;
        }
      }
    }
    .avatar__back__update {
      width: 359px;
      height: 195px;
      position: relative;
      .user__info {
        position: absolute;
        z-index: 1;
        top: 40px;
        width: 328px;
        display: flex;
        gap: 16px;
        align-items: center;
        justify-content: center;

        .avatar__user {
          width: 115px;
          height: 115px;
          min-width: 115px;
          min-height: 115px;
          border-radius: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-position: center center;
          object-fit: cover;
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
        }
      }
    }

    .btn__save {
      width: 328px;
      height: 49px;
      border-radius: 6px;
      background-color: #1767b3;
      display: flex;
      justify-content: center;
      align-items: center;

      font-family: SpoqaHanSansNeo;
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: -0.4px;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }

    .top__RegisterViewS2 {
      .input__change {
        position: relative;
        .change__btn {
          position: absolute;
          bottom: 13px;
          right: 16px;

          font-family: SpoqaHanSansNeo;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: -0.38px;
          color: #52606d;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .cell__phone {
        display: flex;
        gap: 10px;
        .btn {
          width: 120px;
          height: 46px;
          border-radius: 10px;
          background-color: #1767b3;
          display: flex;
          justify-content: center;
          align-items: center;

          font-family: SpoqaHanSansNeo;
          font-size: 15px;
          font-weight: normal;
          line-height: 20px;
          letter-spacing: normal;
          color: #fff;
          cursor: pointer;
        }
      }
      .el-input {
        height: 46px;
      }

      .err {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: -0.3px;
        color: #f3485b;
      }

      .label {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: normal;
        line-height: 14px;
        letter-spacing: -0.6px;
        text-align: left;
        color: #252a36;
      }
      .line {
        display: flex;
        justify-content: space-between;
        .relative {
          position: relative;
        }
        .clock {
          position: absolute;
          right: 15px;
          top: 13px;
          font-family: SpoqaHanSansNeo;
          font-size: 15px;
          font-weight: normal;
          line-height: normal;
          letter-spacing: -0.75px;
          color: #f3485b;
        }
        .btn {
          width: 120px;
          height: 46px;
          border-radius: 10px;
          background-color: #1767b3;
          display: flex;
          align-items: center;
          justify-content: center;

          font-family: SpoqaHanSansNeo;
          font-size: 15px;
          font-weight: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
}
.gif {
  height: 170px;
  position: relative;
  .gif__img {
    position: absolute;
  }
  .gif__text {
    position: relative;
    padding: 20px 16px;
    height: 170px;

    .maketing {
      font-family: SpoqaHanSansNeo;
      font-size: 20px;
      font-weight: bold;
      line-height: 26px;
      letter-spacing: -0.5px;
      color: #fff;
    }
    .zzz {
      display: flex;
      .kkk {
        font-size: 15px;
        font-weight: normal;
        line-height: 20px;
        letter-spacing: -0.38px;
        color: #fff;
      }
    }
    .line__707 {
      width: 327px;
      height: 2px;
      background-color: #707070;
      .line__fff {
        width: 80px;
        height: 2px;
        background-color: #fff;
      }
    }
  }
}
</style>
