<template>
  <div>
  
    <div class="navi">
      <div class = "text-lg"> 모바일 테스트 페이지</div>
      <div class = 'route'>
        <router-link to= '/fcm'>푸시메세지</router-link>
      </div>
      <div class = 'route'>
        <router-link to= '/streaming1'> 스트리밍 #1</router-link>
      </div>
      <div class = 'route'>
        <router-link to= '/streaming2'> 스트리밍 #2</router-link>
      </div>
      <div class = 'route'>
        <a href="https://www.romenov.com/streaming/">타 스트리밍 페이지</a>
      </div>

      <!-- <div class = 'route'>
        <router-link to= '/audioSample1'> 오디오샘플#1 페이지</router-link>
      </div> -->

      <!-- <div class = 'route'>
        <router-link to= '/audioSample2'> 오디오샘플#2 페이지</router-link>
      </div>
      <div class = 'route'>
        <router-link to= '/audioSample3'> 오디오샘플#3 페이지</router-link>
      </div>
      <div class = 'route'>
        <router-link to= '/audioSample4'> 오디오샘플#4 페이지</router-link>
      </div>
      <div class = 'route'>
        <router-link to= '/audioSample5'> 오디오샘플#5 페이지</router-link>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    
    return {

    }
  },
})
</script>
<style lang="scss" scoped>
  .navi {
    flex-direction: column;
    display: flex;
    width: 100%;
    height:100vh;
    justify-content: center;
    align-items: center;

    .route {
      background: #3f3f3f;
      border-radius: 1rem;
      padding: 1rem;
      margin: 0.5rem;
      cursor: pointer;
    }
  }
</style>
