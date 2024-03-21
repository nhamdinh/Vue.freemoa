<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '@/router'
import { DATE_DOT } from '@/common/constance'
import moment from 'moment'
import Loading from '@/components/Loading.vue'
import eye from '@/assets/img/eye.png'
import comment from '@/assets/img/comment.png'
import likexanh from '@/assets/img/likexanh.png'
import likexanhlike from '@/assets/img/likexanhlike.png'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import avataradmin from '@/assets/svg/avataradmin.svg'

// const props = defineProps(['pathTo', 'articleType', 'communitySearchType'])
defineProps(['item'])
const showDetail = ref<any>(false)
</script>

<template>
  <div
    @click="showDetail = !showDetail"
    :style="showDetail ? '' : 'border-bottom: 1px solid #cbd2da'"
  >
    <div
      v-if="item?.file ? item?.file?.length >= 1 : false"
      class="OrganizationPostsListView__content__top"
      style="border: none"
    >
      <img
        v-for="(img, index) in item?.file?.filter((img: any, index: any) => index < 1)"
        :key="index"
        class="top__img__ProductReview"
        :src="img"
        alt="img"
      />
      <div class="top__content__ProductReview">
        <div class="content__ProductReview__a" :class="!item?.isRead && 'fw600'">
          {{ item?.title }}
        </div>
        <div class="content__ProductReview__b mt10px">
          <div v-if="item?.answerDetailResponses?.length > 0" class="status__label__ena">
            답변완료
          </div>
          <div v-else class="status__label__dis">답변대기</div>

          <div class="createdDate">{{ moment(item?.createdDate).format(DATE_DOT) }}</div>
        </div>
      </div>
    </div>
    <div v-else class="OrganizationPostsListView__content__bottom" style="border: none">
      <div class="content__bottom__a" :class="!item?.isRead && 'fw600'">
        {{ item?.title }}
      </div>
      <div class="content__bottom__b mt11px">
        <div v-if="item?.answerDetailResponses?.length > 0" class="status__label__ena">
          답변완료
        </div>
        <div v-else class="status__label__dis">답변대기</div>
        <div class="createdDate">{{ moment(item?.createdDate).format(DATE_DOT) }}</div>
      </div>
    </div>
  </div>
  <div v-if="showDetail">
    <div class="OrganizationPostsListView__content__question">
      <div class="list__img">
        <img
          v-for="(img, index) in item?.file"
          :key="index"
          class="top__img__ProductReview"
          :src="img"
          alt="img"
        />
      </div>
      <div>
        <div class="question">
          {{ item?.question }}
        </div>
      </div>
    </div>
    <div class="end__block__line">
      <div class="end__block"></div>
    </div>
    <div
      class="OrganizationPostsListView__content__answer"
      v-if="item?.answerDetailResponses?.length > 0"
    >
      <div v-for="(ans, index) in item?.answerDetailResponses">
        <div class="admin__avatar">
          <img :src="avataradmin" alt="avatar" class="avatar" />
          <div class="admin__name">ABCD</div>
        </div>
        <div class="list__img mt10px">
        <img
          v-for="(img, index) in ans?.answerImage"
          :key="index"
          class="top__img__ProductReview"
          :src="img"
          alt="img"
        />
      </div>
        <div class="answer mt10px">{{ ans?.answer }}</div>
        <div style="justify-content: flex-start" class="createdDate mt10px">
          {{ moment(item?.createdDate).format(DATE_DOT) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
