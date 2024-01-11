<template>
  <div class ="py-2">
    <div v-if = "!state.isAndroid">
      1. 사파리로 접속한다. 초록색 버튼 클릭
      <img src="images/doc_1.png" style="wdith:100%"/>
      <br>
      2. 홈 화면에 추가 하면 바탕화면에 설치 
      <img src="images/doc_2.png" style="wdith:100%"/>
    </div>
    <div v-else>
      1. 구글 크롬으로 접속한다. 중앙 버튼 클릭
      <img src="images/doc_3.jpg" style="wdith:100%"/>
      <br>
      2. 앱설치 버튼 클릭 앱이 설치
      <img src="images/doc_4.jpg" style="wdith:100%"/>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'

export default defineComponent({
  setup() {

    const state = reactive({
      isAndroid: false,
    })

    onMounted(() => {
      state.isAndroid = navigator.userAgent.indexOf("Safari") === -1;
    })

    return {
      state,
    }
  },
})
</script>
<style lang="scss" scoped>
  div {
    font-size: 1.2rem;
  }
</style>
