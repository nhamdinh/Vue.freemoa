<script setup lang="ts">
import router from '@/router'
import { DATE_DOT } from '@/common/constance'
import moment from 'moment'
import eye from '@/assets/img/eye.png'
import comment from '@/assets/img/comment.png'
import ListLike from '@/components/ListLike/ListLike.vue'
import { getPre, getNext } from '@/common/commonFunction'

const props = defineProps(['item', 'pathTo', 'dataArticleIds'])
const emits = defineEmits(['getArticleList'])
</script>

<template>
  <!-- {{ console.log(dataArticleIds) }} -->
  <div
    @click="
      router.push({
        path: pathTo,
        query: {
          id: item?.id,
          previousId: getPre(dataArticleIds, item?.id),
          nextId: getNext(dataArticleIds, item?.id)
        }
      })
    "
    v-if="item?.image ? item?.image?.length >= 1 : false"
    class="OrganizationPostsListView__content__top"
  >
    <img class="top__img__ProductReview" :src="item?.image" alt="img" />
    <div class="top__content__ProductReview">
      <div class="content__ProductReview__a" :class="!item?.isRead && 'fw600'">
        {{ item?.title }}
      </div>
      <div class="content__ProductReview__b mt10px">
        <div>{{ item?.createdBy }}</div>
        <div>{{ moment(item?.createdDate).format(DATE_DOT) }}</div>
      </div>
      <div class="content__ProductReview__c mt7px">
        <div>
          <img class="icon_img" :src="eye" alt="eye" />
          <div>{{ item?.viewNumber ?? 0 }}</div>
        </div>

        <ListLike
          v-if="!pathTo.includes('notices-events')"
          :item="item"
          @getArticleList="
            (id: any) => {
              emits('getArticleList', id)
            }
          "
        ></ListLike>

        <div v-if="!pathTo.includes('notices-events')">
          <img class="icon_img" :src="comment" alt="comment" />
          <div>{{ item?.totalComments ?? 0 }}</div>
        </div>
      </div>
    </div>
  </div>
  <div
    @click="router.push({ path: pathTo, query: { id: item?.id } })"
    class="OrganizationPostsListView__content__bottom"
    v-else
  >
    <div class="content__bottom__a" :class="!item?.isRead && 'fw600'">
      {{ item?.title }}
    </div>
    <div class="content__bottom__b mt11px">
      <div>{{ item?.createdBy }}</div>
      <div>{{ moment(item?.createdDate).format(DATE_DOT) }}</div>
      <div>
        <img class="icon_img" :src="eye" alt="eye" />
        <div>{{ item?.viewNumber ?? 0 }}</div>
      </div>
      <ListLike
        v-if="!pathTo.includes('notices-events')"
        :item="item"
        @getArticleList="
          (id: any) => {
            emits('getArticleList', id)
          }
        "
      ></ListLike>
      <div v-if="!pathTo.includes('notices-events')">
        <img class="icon_img" :src="comment" alt="comment" />
        <div>{{ item?.totalComments ?? 0 }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
