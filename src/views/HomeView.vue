<script setup lang="ts">
import Home6 from '@/components/Home/Home6.vue'
</script>

<template>
  <div class="HomeView">
    <div class="HomeView__content">
      <Home6 />
    </div>
  </div>
</template>

<style lang="scss">
.see__more {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  align-items: center;
}
.HomeView {
  width: 100%;

  .HomeView__content {
    .title__home {
      font-family: SpoqaHanSansNeo;
      font-size: 26px;
      font-weight: 600;
      line-height: 28px;
      letter-spacing: -0.65px;
      color: #000;
    }
    .semi__title {
      font-family: SpoqaHanSansNeo;
      font-size: 15px;
      font-weight: normal;
      line-height: 18px;
      letter-spacing: -0.38px;
      text-align: left;
      color: #52606d;
    }

    .title {
      font-family: SpoqaHanSansNeo;
      font-size: 20px;
      font-weight: bold;
      line-height: 28px;
      letter-spacing: -0.5px;
      color: #000;
    }
    .slide {
      width: 360px;
      height: 320px;
      position: relative;
      .home {
        position: absolute;
      }
      .slide__text {
        position: relative;

        display: flex;
        flex-direction: column;
        .top__slide {
          display: flex;
          justify-content: space-between;
          padding: 15px 10px;
          padding-bottom: 0;
        }
        .title__slide {
          font-family: SpoqaHanSansNeo;
          font-size: 22px;
          font-weight: bold;
          line-height: 28px;
          letter-spacing: -0.55px;
          color: #242a37;
        }
        .semi__slide {
          font-family: SpoqaHanSansNeo;
          font-size: 15px;
          font-weight: normal;
          line-height: 28px;
          letter-spacing: -0.38px;
          color: #242a37;
        }
        .redirect {
          width: 65px;
          height: 23px;
          border-radius: 11.5px;
          border: solid 1px #242a37;
          display: flex;
          gap: 4px;
          justify-content: center;
          align-items: center;
        }
        .num {
          font-family: SpoqaHanSansNeo;
          font-size: 12px;
          font-weight: normal;
          line-height: 28px;
          letter-spacing: -0.3px;
          color: #000;
        }
      }
    }
    .home__row {
      display: flex;
      justify-content: space-between;

      .see__more__text {
        font-family: SpoqaHanSansNeo;
        font-size: 12px;
        font-weight: bold;
        line-height: 16px;
        letter-spacing: -0.3px;
        color: #242a37;
      }
    }
    .home__bot {
      .content__area {
        width: 328px;
        height: 101px;
        border: solid 1px #707070;
        background-color: #fff;

        font-family: SpoqaHanSansNeo;
        font-size: 15px;
        font-weight: normal;
        line-height: 1.47;
        letter-spacing: -0.38px;
        text-align: center;
        color: #242a37;

        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
      }
    }
  }
}
</style>
