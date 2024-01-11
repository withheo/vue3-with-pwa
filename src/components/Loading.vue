<template>
  <div class ='app-loading-wrapper'>
    <div class = 'app-loading-message'>{{  title  }}</div>
    <LogoLoadingIcon width="300px" class = 'loading-icon-wrapper'/>
    <div class = 'loading-ball-wrapper'>
      <div class ='ball-wrapper'>
        <span class = 'ball' style="--delay: 1.15s"></span>
      </div>
      <div class ='ball-wrapper'>
        <span class = 'ball' style="--delay: 1.30s"></span>
      </div>
      <div class ='ball-wrapper'>
        <span class = 'ball' style="--delay: 1.45s"></span>
      </div>
      <div class ='ball-wrapper'>
        <span class = 'ball' style="--delay: 1.60s"></span>
      </div>
      <div class ='ball-wrapper'>
        <span class = 'ball' style="--delay: 1.75s"></span>
      </div>
      <div class ='ball-wrapper'>
        <span class = 'ball' style="--delay: 1.90s"></span>
      </div>
    </div>
    <div class = 'loading-label'> {{ message }}
      <br>{{ copyRightStr }}
       </div>
  </div>  
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LogoLoadingIcon from '@/components/icon/LogoLoadingIcon.vue';

export default defineComponent({
  name: "AppLoadingUi",
  components: {
    LogoLoadingIcon,
  },  
  props: {
    title: {
      type: String,
      default: 'initailize App',
    },
    message: {
      type: String,
      default: '잠시만 기다려주세요',
    }
  },  
  setup() {
    const copyRightStr =  "";

    return {
      copyRightStr
    }
  },
})
</script>
<style lang="scss" scoped>

.app-loading-message {
  font-size: 3rem;
  position: flex;
  opacity: 0.8;
  justify-content: center;
}

@keyframes ball-animation {
  0% {
    opacity: 0.8;
    translate: 0px 0px;
  }
  
  7% {
    opacity: 1;
    translate: 0px 20px;
  }

  14% {
    opacity: 1;
    translate: 0px -20px;
  }

  21% {
    opacity: 1;
    translate: 0px 0px;
  }

  100% {
    opacity: 0.8;
    translate: 0px 0px;
  }
}

.app-loading-wrapper {
  color:#fff;
  display:flex;
  align-items: center;
  justify-content: center;
  height:100%;
  position:absolute;
  width:100%;
  background: #15002e;
  z-index: 100000;
  flex-direction: column;

  .loading-label {
    font-size: 12px;
    position: relative;
    opacity: 0.6;
    top: 1rem;
    text-align: center;
    line-height:1.4rem;
  }

  .loading-ball-wrapper {
    display: flex;
    position: relative;
    top:-1rem;

    .ball-wrapper {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .ball {
        width:10px;
        height:10px;
        border-radius: 5px;
        background-color: #6200b3;
        // margin-right: 10px;
        opacity: 0.8;
        animation: ball-animation 3s infinite ease-in-out;
        animation-delay: var(--delay);
      }
    }
  }
}
  .loading-icon-wrapper {
    opacity: 0.4;
    cursor: pointer;
  }
</style>

