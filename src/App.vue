<template>
  <div class = "app-wrapper">
    <div class = 'top-nav-warpper'> 
      <div> Push Message </div>
      <div> Web Authn </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted} from 'vue';

// import { getMessaging, getToken } from "firebase/messaging";
// import { initializeApp } from "firebase/app";
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    notification_userid: string;
    crypto: any;
  }
}

export default defineComponent({
  name: 'App',
  components: {
    
  },
  setup() {
    

    onMounted(() => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
          // PWA로 설치된 상태에서 실행 중
          console.log('PWA로 설치되어 실행 중');
      } else {
          // 단순히 모바일 웹에서 실행 중
          console.log('단순히 모바일 웹에서 실행 중');
      }
    })

    return {
      
    }
  }
});
</script>

<style lang="scss">

*{
  box-sizing: border-box;
  font-family: "Open Sans";
}
body {
  width:100%;
  height:100vh;
  padding:0;
  margin:0;
  background-color: #15002e;
  color: #fff;
}

.top-nav-warpper {
  position: relative;
  background: #333;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  
  div {
    padding: 1rem;
    flex:1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  width : 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.btn-large {
  width: 200px;
  height: 50px;
  border-radius: 10px;
  cursor: pointer;
  margin-top:4rem;
}
#app {
  width: 100%;
  height:100%;
  padding:0;
  margin:0;
}

.box {
  padding: 10px;
}

.app-allow-icon {
  position: absolute;
  fill:white;
  top: 0px;
  padding-top:1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width:100%;
  margin-right: 1rem;

  div {
    transition: 0.2s;
    padding: 0.5rem;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }
}

.app-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width:100%;
  height:100%;
  flex-direction: column;
}
</style>
