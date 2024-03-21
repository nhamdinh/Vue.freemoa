<script setup lang="ts">
import { useCustomDialogStore } from '@/stores/customDialog'
import { RepositoryFactory } from '@/repository/RepositoryFactory'
import { ref, watch } from 'vue'
import { COMPLETE_SUCCESS, FAIL } from '@/common/constance'
import router from '@/router'

const store = useCustomDialogStore()
const { closeDialog, trueReport } = store

const value = ref<any>('')

const props = defineProps(['prStData'])
const { openDialog } = store
const openDialogProp = (text: any) => {
  openDialog({
    stType: 'info',
    stTitle: text,
    stCancelText: 'THOII',
    stOkText: '확인',
    stClosable: false,
    actionConfirm: () => {
      if (props.prStData?.type === 1) {
        router.push({ path: '/best-community-post-list' })
      } else {
        trueReport()
      }
    },
    actionCancel: () => {},
    actionAfterClose: () => {}
  })
}
const CompanyRepo = RepositoryFactory.get('company')

const onCreateArticleReport = async () => {
  console.log(props.prStData?.articleId)
  console.log(props.prStData?.type)
  // console.log(data?.data)
  // onGetProfile()
  // closeDialog()
  if (value.value.trim()) {
    await CompanyRepo.createArticleReport({
      articleId: props.prStData?.articleId,
      content: value.value.trim(),
      type: props.prStData?.type
    })
      .then((res: any) => {
        const data = res?.data
        if (data?.status === 'OK') {
          openDialogProp(COMPLETE_SUCCESS)
        } else {
          openDialogProp(FAIL)
        }
      })
      .catch((err: any) => {
        openDialogProp(FAIL)

        console.log(err)
      })
  }
}
</script>

<template>
  <div class="Report">
    <div class="Report__content">
      <div class="content__title">신고</div>

      <el-input
        v-model="value"
        type="textarea"
        :rows="5"
        class="mt30px h120px w288px"
        placeholder="신고 내용을 입력하세요"
      />
    </div>
    <div class="Report__btns mt30px">
      <div @click="closeDialog" class="btn__cancel">취소</div>
      <div @click="onCreateArticleReport" class="btn__ok">변경</div>
    </div>
  </div>
</template>

<style lang="scss">
.Report {
  .Report__content {
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

  .Report__btns {
    display: flex;
    border-top: 1px solid #0067b9;
    @mixin Report__btn {
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
      @include Report__btn;
      background-color: #fff;
      color: #0067b9;
      border-bottom-left-radius: 10px;
    }
    .btn__ok {
      @include Report__btn;
      background-color: #0067b9;
      color: #fff;
      border-bottom-right-radius: 10px;
    }
  }
}
</style>
