<template>
  <div class="spin__infinite">
    <div class="spinner-border text-success" role="status"></div>

  </div>
</template>

<style scoped lang="scss">
    .spin__infinite{
      display: flex;
      align-items: baseline;
      justify-content: center;
      background-color: transparent;
    }
.text-success {
  color: #f58220 !important;
}
.spinner-border {
  display: inline-block;
  width: 24px;
  height: 24px;
  vertical-align: -0.125em;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: 0.75s linear infinite spinner-border;
  animation: 0.75s linear infinite spinner-border;
}
@keyframes spinner-border {
  100% {
    transform: rotate(360deg);
  }
}
</style>
