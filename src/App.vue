<template>
  <div class = "app-wrapper">
    <div class = "app-allow-icon" v-show ="state.useNotificationService">
      <div class = "allow-icon" @click.stop="onAllowNotification" v-show="!state.allowNotification"> <LockIcon /> </div>
      <div class = "allow-icon" @click.stop="onOpenMessagePopup" v-show="state.allowNotification && state.isRegistedPushApp"> <MessageIcon /> </div>
      <div class = "allow-icon" @click.stop="onEnablePushPopup" v-show="state.allowNotification && !state.isRegistedPushApp"> <NotificationIcon /> </div>
      <div class = "allow-icon" @click.stop="onDisablePushPopup" v-show="state.allowNotification && state.isRegistedPushApp"> <NotificaionOffIcon /> </div>
    </div>
    <div >
      모바일 권한을 체크합니다.<br>
      {{ state.notiMsg }}
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
      <PushPopup v-if = "isShowPopup('pushPopup')" 
        @closeAction = "onPopupClose"
        @onAllow:push = "onAllowPush"
        :isShow="state.isShow"
        class="confirm-wrapper"
        :pushAllowState = "state.pushAllowState"
      >
      </PushPopup>
      <MessagePopup  v-if = "isShowPopup('messagePopup')" 
        @closeAction = "onPopupClose"
        @onSend:message = "onSendMessage"
        :isShow="state.isShow"
        class="confirm-wrapper"
      >
      </MessagePopup>
    </component>
  </template>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import Login from './components/Login.vue';
import { Teleport as teleport_, TeleportProps, VNodeProps} from 'vue';
import useServerWoker from '@/compositions/useServiceWorker';
import useNotification from '@/compositions/useNotification';
import NotificationIcon from './components/icon/NotificationIcon.vue';
import NotificaionOffIcon from '@/components/icon/NotificaionOffIcon.vue';
import MessageIcon from './components/icon/MessageIcon.vue';
import LockIcon from './components/icon/LockIcon.vue';
import ConfirmUi from '@/components/ui/confirm/Confirm.vue';
import useConfirm from '@/compositions/useConfirm';
import { EModalAction } from './enums/ui';
import Alert from '@/components/ui/alert/Alert.vue';
import PushPopup from './components/PushPopup.vue';
import MessagePopup from '@/components/MessagePopup.vue'
import apiNotification from '@/api/apiNotification';
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
    NotificaionOffIcon,
    MessageIcon,
    ConfirmUi,
    LockIcon,
    Alert,
    PushPopup,
    MessagePopup
  },
  setup() {
    const { showConfirmMessage } = useConfirm();
    const { registedPushApp, getAppNotificationPermission, requestNotificationPermission, requestPermission } = useNotification();
    const { sendMessageApi } = apiNotification();
    
    let notification_userid = localStorage.getItem("notification_userid") ?? window.crypto.randomUUID();
   
    if (notification_userid) {
      localStorage.setItem("notification_userid", notification_userid);
      
    } 
    window.notification_userid = notification_userid;

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
      pushAllowState: {
        state: "init"
      },
      sendNotification: null as any,
      confirmModalAction: EModalAction.Show,
      allowNotification: false,
      initAllowNotification: false,
      isShow: true,
      notiMsg: "",
      token: "",
      user_id: "",
      isRegistedPushApp: true,
    })

    const Teleport = teleport_ as {
      new (): {
        $props: VNodeProps & TeleportProps;
      }
    }

    const initWebPushWorker = async () => {
      const loadJs = 'firebase-messaging-sw.js';
      // state.useNotificationService = true;
      state.notiMsg = "서비스를 체크합니다."
      const { state : serviceWorkerState, init, registedServiceWorker } = useServerWoker();      
      const activatedWorker = await registedServiceWorker(loadJs);

      if (activatedWorker === false) {
        // 등록
        const result = await init(`./${loadJs}`);
        if (result === false) {
          state.notiMsg = "모바일에서 APP 알림 기능을 사용할 수 없습니다. (서비스워커 미동작)";
          // alert("모바일에서 APP 알림 기능을 사용할 수 없습니다.");
          state.useNotificationService = false;
        } else {
          state.useNotificationService = true;
        }
      } else {
        state.useNotificationService = true;
      }
      initNotificationPermission();      
      state.serviceWorkerState = serviceWorkerState;
    } 

    const initNotificationPermission = async () => {
      if (getAppNotificationPermission() === 'granted') {        
        state.allowNotification = true;
        state.isRegistedPushApp = await registedPushApp();
      }
    }


    const isShowPopup = (type: string) => {      
      return state.showPopupType === type;
    }

    const onEnablePushPopup = () => {
      state.showPopupType = 'pushPopup';
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
      state.pushAllowState = {
        state: "init"
      };
    }

    const showAlert = (message: string) => {
      state.showPopupType = 'alert';
      state.alertConfig.message = message;
    }

    const onAllowNotification = async () => {
      const result = await requestNotificationPermission();
      if (result === 'granted') { 
        initNotificationPermission();
        //state.allowNotification = true;
      } else {
        showAlert("브라우저에서 알림이 거부되었습니다.\n\r브라우저에서 알림을 다시 설정해주세요")
      }
    }

    const onSendMessage = async (sendInfo: any) => {
     
      const result = await sendMessageApi(sendInfo.id, JSON.stringify({
        title: "알림",
        content: sendInfo.message,
      }));

      if (result.status === 200) {
        // 닫기
        state.isShow = false;
        setTimeout(() => {
          onPopupClose();
        }, 500)
      }
    }

    const onAllowPush = async (user_name: string) => {
      state.pushAllowState.state = "ing";
      const rtn = await requestPermission(true, {
        user_name,
      });
      state.isRegistedPushApp = await registedPushApp();
      state.isShow = false;
      setTimeout(() => {
        onPopupClose();
      }, 500)
      console.error(rtn);      
    }

    const doDisablePushPopup = async () => {
      const rtn = await requestPermission(false);
      state.isRegistedPushApp = await registedPushApp();
      console.error(rtn);      
      state.isShow = false;
      setTimeout(() => {
        onPopupClose();
      }, 500)
    }

    const onDisablePushPopup = () => {
      const message ="알림";
      const desp = "알림 설정을 해제 하시겠습니까?";

      const { btns } = showConfirmMessage(
        message,
        {
          desp,
          evt: {
            beforeOkClick: () => true,
            okClick:() => doDisablePushPopup()
          }
        }
      );
      state.showPopupType = 'confirm';
      // state.confirmPrefix = event.detail.class;
      state.confirmConfig.confirmMessage.message = message;
      state.confirmConfig.confirmMessage.desp = desp;
      state.confirmConfig.btns = btns;
    }

    const onOpenMessagePopup = () => {
      state.showPopupType = 'messagePopup';
    }

    onMounted(() => {
      state.isLoaded = true;
      state.user_id = notification_userid;
      console.log(state.serviceWorkerState);
      initWebPushWorker();
    })

    return {
      state,
      Teleport,
      onNotification,
      onEnablePushPopup,
      onDisablePushPopup,
      isShowPopup,
      onPopupClose,
      onAllowNotification,
      onAllowPush,
      onOpenMessagePopup,
      onSendMessage
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
