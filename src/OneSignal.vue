<template>
  <div class = "app-wrapper">
    <div class = "app-allow-icon" v-show ="state.useNotificationService">
      <div class = "allow-icon" @click.stop="onAllowNotification" v-show="!state.allowNotification"> <LockIcon /> </div>
      <div class = "allow-icon" v-show="state.allowNotification"> <MessageIcon /> </div>
      <div class = "allow-icon" @click.stop="onNotification" v-show="state.allowNotification"> <NotificationIcon /> </div>
    </div>
    <div >
      모바일 권한을 체크합니다.<br>
      {{  state.notiMsg }}
    </div>
    <Login/>
    <div style ="display:flex;padding:10px;"> {{  state.token }} </div>
    
  </div>
  <template v-if ="state.isLoaded">
    <component :is="Teleport" to="body" >
      <Alert v-if = "isShowPopup('alert')"
        :useOuterClose="true"
        :isShow="true"
        :message = "state.alertConfig.message"
        @closeAction="onPopupClose"
        :class = "state.alertConfig.cssPrefix"
      > 
      </Alert>       
      
      <ConfirmUi v-if = "isShowPopup('confirm')" 
          @closeAction = "onPopupClose"
          :modalAction = "state.confirmModalAction"
          :btns = "state.confirmConfig.btns"
          :useOuterClose = "true"  
          :isShow="state.isShow"
          :class = "state.confirmPrefix" 
          ref = 'confirmComp'    
          width = "80%"
        >
          <template #content>
            <!-- {{ confirmMessage.message }} -->
            {{ state.confirmConfig.confirmMessage.message }}
          </template>
          <template #desp>
            {{ state.confirmConfig.confirmMessage.desp }}
          </template>
        </ConfirmUi>
    </component>
  </template>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import Login from './components/Login.vue';
import { Teleport as teleport_, TeleportProps, VNodeProps} from 'vue';
// //import useServerWoker from '@/compositions/useServiceWorker';
// import useNotification from '@/compositions/useNotification';
import NotificationIcon from './components/icon/NotificationIcon.vue';
import MessageIcon from './components/icon/MessageIcon.vue';
import LockIcon from './components/icon/LockIcon.vue';
import ConfirmUi from '@/components/ui/confirm/Confirm.vue';
import useConfirm from '@/compositions/useConfirm';
import { EModalAction } from './enums/ui';
import Alert from '@/components/ui/alert/Alert.vue';

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
    Login,
    NotificationIcon,
    MessageIcon,
    ConfirmUi,
    LockIcon,
    Alert,
  },
  setup() {
    const { showConfirmMessage } = useConfirm();
    let notification_userid = localStorage.getItem("notification_userid") ?? window.crypto.randomUUID();
   
    if (notification_userid) {
      localStorage.setItem("notification_userid", notification_userid);
    } 
    window.notification_userid = notification_userid;

  
    /**
     * check 해애할 것들
     * serviceWorker 가 되어야 한다는거..
     */

    // const firebaseConfig = {
    //   apiKey: "AIzaSyCQOkJiz7_lXXrarGQDar03MRsCzuPJSP0",
    //   authDomain: "gemiso-push-message.firebaseapp.com",
    //   projectId: "gemiso-push-message",
    //   storageBucket: "gemiso-push-message.appspot.com",
    //   messagingSenderId: "997337351696",
    //   appId: "1:997337351696:web:98f69d26501284dfef2c95",
    //   measurementId: "G-CYQN6NVY2N"
    // };

    // const app = initializeApp(firebaseConfig);
    
    const state = reactive({
      isLoaded: false,
      showPopupType: "",
      notificationStr : "",
      msg: "",
      notiPermission : "",
      serviceWorkerState: null as any,
      useNotificationService: false,
      confirmPrefix: "",
      alertConfig: {
        message: "",
        cssPrefix: "",
      },
      confirmConfig: {
        confirmMessage: {
          message: '',
          desp: '',
        },
        btns: null as any,
      },
      sendNotification: null as any,
      confirmModalAction: EModalAction.Show,
      allowNotification: false,
      initAllowNotification: false,
      isShow: true,
      notiMsg: "",
      token: "",
      user_id: "",
    })

    const Teleport = teleport_ as {
      new (): {
        $props: VNodeProps & TeleportProps;
      }
    }

    const initWebPushWorker = async () => {
     //  console.log( window.OneSignal);
      // await window.OneSignal.Notifications.requestPermission();
    }

    const isShowPopup = (type: string) => {      
      return state.showPopupType === type;
    }

    const onNotification = () => {
      const message ="알림";
      const desp = "테스트 메세지를 보내시겠습니까?";

      const { btns } = showConfirmMessage(
        message,
        {
          desp,
          evt: {
            beforeOkClick: () => true,
            okClick:() => doSendTestNotification()
          }
        }
      );
      state.showPopupType = 'confirm';
      // state.confirmPrefix = event.detail.class;
      state.confirmConfig.confirmMessage.message = message;
      state.confirmConfig.confirmMessage.desp = desp;
      state.confirmConfig.btns = btns;
    }

    const doSendTestNotification = () => {
      if (state.sendNotification) {
        state.sendNotification();
        state.isShow = false;
        setTimeout(() => {
          onPopupClose();
        }, 500)
      }
    }

    const onPopupClose = () => {
      state.showPopupType = '';
      state.isShow = true;
    }

    const onAllowNotification = async () => {
      // const { requestPermission, notificationPermission } = useNotification();
      // if (notificationPermission == "default") {
      //   if (await requestPermission() === true) {
      //     window.location.reload();
      //   } else {
      //     const message ="알림 권한 설정이 설정하지 못하였습니다.";
      //     state.showPopupType = 'alert';
      //     state.alertConfig.message = message;
      //   }
      // } else if (notificationPermission == 'denied') {
      //   const message ="알림이 거부로 설정되었습니다.\r\n 앱 알림 설정을 초기화 또는 허용으로 해주세요";
      //   state.showPopupType = 'alert';
      //   state.alertConfig.message = message;
      // }
    }

    onMounted(() => {
      state.isLoaded = true;
      state.user_id = notification_userid;
      setTimeout(async () => {
        initWebPushWorker();
       // const { getAppkey } = useNotification();
       // state.token =  await getAppkey();
        // useNotification().getAppkey();
        // const messaging = getMessaging(app);
        // console.log("messaging :", messaging);
        // getToken(messaging, {vapidKey: "BINxsPHrwAAIzNxfZRFVlQQ6jFvib0UOk4wjFThs_B_uy4rLOBCeaEyE1Qa6YdZIW6LNxf9FYRGGCFZRQEKmjxM"})
        // .then((token :any) => {
        //   console.error(token);
        //   navigator.serviceWorker.getRegistrations().then((a: any) => {
        //     console.error("a : ", a)
        //   })
        //   console.error("navigator.serviceWorker.getRegistrations() >", navigator.serviceWorker.getRegistrations())
        // })
      }, 1000)
    
    })

    return {
      state,
      Teleport,
      onNotification,
      isShowPopup,
      onPopupClose,
      onAllowNotification
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
