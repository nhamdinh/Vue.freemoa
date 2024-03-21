<script setup lang="ts">
import avataradmin from '@/assets/svg/avataradmin.svg'
import { ref, watch } from 'vue'
import { DATE_DOT } from '@/common/constance'
import moment from 'moment'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import eye from '@/assets/img/eye.png'
// import eyenau from '@/assets/img/eyenau.png'
import commentnau from '@/assets/img/comment.png'
import Loading from '@/components/Loading.vue'
import ArticleComment from '@/components/OrganizationPosts/ArticleComment.vue'
import ListLike from '@/components/ListLike/ListLike.vue'
import ArticleCrud from '@/components/ArticleCrud/ArticleCrud.vue'
import star from '@/assets/svg/star.svg'
import starborder from '@/assets/svg/starborder.svg'
import { handleUpdateLike } from '@/common/commonFunction'
import router from '@/router'
import { TO_LOGIN } from '@/common/constance'
import { useCustomDialogStore } from '@/stores/customDialog'

const props = defineProps(['fromPath', 'item'])
const emits = defineEmits(['onGetArticleById'])

watch(props, async (newV, oldV) => {
  dataFetch.value = props.item
})

const dataFetch = ref<any>({ ...props?.item })

const ArticleRepo = RepositoryFactory.get('article')

const value = ref<any>('')

const isLoadingCreate = ref<any>(false)

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
      console.log('cancel')
    },
    actionAfterClose: () => {}
  })
}

const onCreateArticleComment = async (articleId: any) => {
  isLoadingCreate.value = true
  await ArticleRepo.createArticleComment({
    articleId: articleId,
    content: value.value.trim()
  })
    .then((res: any) => {
      const data = res?.data
      if (data?.status === 'OK') {
        value.value = ''
        emits('onGetArticleById')
      }
    })
    .catch((err: any) => {
      if (err?.response?.status === 401) {
        openPopup('confirm')
      }
      console.log(err)
    })
  isLoadingCreate.value = false
}

const handleUpdateComments = (idComment: any, data: any) => {
  let listComments_emp: any = []
  data?.listComments?.map((comment: any) => {
    if (comment?.id !== idComment) {
      listComments_emp.push(comment)
    }
  })
  return { ...data, listComments: [...listComments_emp] }
}
</script>

<template>
  <div class="card__top">
    <div class="card__top__title">{{ dataFetch?.title }}</div>
    <!-- co CRUD -->
    <div v-if="fromPath !== 'product-review'" class="card__top__zzz mt10px">
      <div class="card__top__info">
        <div class="avatar__manager">
          <img :src="dataFetch?.avatarCreatedBy ?? avataradmin" alt="avatar" class="avatar" />
          <div class="manager">{{ dataFetch?.createdBy }}</div>
        </div>
        <div class="createdDate">
          {{ moment(dataFetch?.createdDate).format(DATE_DOT) }}
        </div>
        <div class="icon__eye__viewNumber">
          <div>
            <img class="icon__eye" :src="eye" alt="eye" />
            <div>{{ dataFetch?.viewNumber ?? 0 }}</div>
          </div>
          <ListLike
            v-if="fromPath !== 'notices-events'"
            :item="dataFetch"
            @getArticleList="
              (id: any) => {
                // onGetArticleById
                dataFetch = handleUpdateLike(dataFetch)
              }
            "
          ></ListLike>

          <div v-if="fromPath !== 'notices-events'">
            <img class="icon__eye" :src="commentnau" alt="eye" />
            <div>{{ dataFetch?.totalComments ?? 0 }}</div>
          </div>
        </div>
      </div>

      <ArticleCrud
        v-if="fromPath !== 'notices-events'"
        :backTo="'/best-community-post-list'"
        :item="dataFetch"
      ></ArticleCrud>
    </div>
    <!-- co CRUD -->

    <!-- co STAR -->
    <div v-if="fromPath === 'product-review'" class="card__top__info mt10px">
      <div class="avatar__manager">
        <img :src="dataFetch?.avatarCreatedBy ?? avataradmin" alt="avatar" class="avatar" />
        <div class="position__main">
          <div class="position__main__label">{{ dataFetch?.createdBy }}</div>
          <div class="position__main__value mt5px">컨설팅 지원</div>
        </div>
      </div>
    </div>
    <div v-if="fromPath === 'product-review'" class="card__top__info mt10px">
      <div class="stars">
        <img
          v-for="(ite, index) in Number(dataFetch?.point ? dataFetch?.point.toFixed() : 0)"
          :key="index"
          :src="star"
          alt=""
        />
        <img
          v-for="(ite, index) in 5 - Number(dataFetch?.point ? dataFetch?.point.toFixed() : 0)"
          :key="index"
          :src="starborder"
          alt=""
        />
      </div>
      <div class="createdDate">
        {{ moment(dataFetch?.createdDate).format(DATE_DOT) }}
      </div>
      <div class="icon__eye__viewNumber">
        <div>
          <img class="icon__eye" :src="eye" alt="eye" />
          <div>{{ dataFetch?.viewNumber ?? 0 }}</div>
        </div>

        <ListLike
          :item="dataFetch"
          @getArticleList="
            (id: any) => {
              // onGetArticleById
              dataFetch = handleUpdateLike(dataFetch)
            }
          "
        ></ListLike>

        <div>
          <img class="icon__eye" :src="commentnau" alt="eye" />
          <div>{{ dataFetch?.totalComments ?? 0 }}</div>
        </div>
      </div>
    </div>
    <!-- co STAR -->
  </div>
  <div class="end__box328"></div>
  <div class="card__bottom">
    <img :src="dataFetch?.image" alt="image" class="image" v-if="!!dataFetch?.image" />
    <div
      v-html="dataFetch?.content"
      :class="!!dataFetch?.image ? 'content mt20px' : 'content '"
    ></div>
  </div>
  <!-- co CHAT -->
  <div v-if="!fromPath.includes('my-writing') && !fromPath.includes('notices-events')">
    <div class="end__box360"></div>
    <el-input
      maxlength="120"
      type="text"
      class="mt16px mb16px w328px ml16px"
      v-model="value"
      placeholder="댓글을 작성해보세요"
      @keyup.enter="
        () => {
          onCreateArticleComment(dataFetch?.id)
        }
      "
    />
    <Loading v-if="isLoadingCreate" />
    <div class="end__box360_2"></div>

    <div class="post__chat">
      <ArticleComment
        v-for="(cm, index) in dataFetch?.listComments"
        :cmItem="cm"
        :key="index"
        @onGetArticleById="
          (id: any) => {
            dataFetch = handleUpdateComments(id, dataFetch)
          }
        "
      ></ArticleComment>
    </div>
  </div>
  <!-- co CHAT -->
</template>

<style lang="scss"></style>
