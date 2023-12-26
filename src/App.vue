<template>
  <div class = "app-wrapper">
    <div class = "app-allow-icon" v-show ="state.useNotificationService">
      <div class = "allow-icon" @click.stop="onAllowNotification" v-show="!state.allowNotification"> <LockIcon /> </div>
      <div class = "allow-icon"> <MessageIcon /> </div>
      <div class = "allow-icon" @click.stop="onNotification"> <NotificationIcon /> </div>
    </div>
    <div >
      모바일 권한을 체크합니다.<br>
      {{  state.notiMsg }}
    </div>
    <Login/>
  </div>
  <template v-if ="state.isLoaded">
    <component :is="Teleport" to="body" >
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
import useServerWoker from '@/compositions/useServiceWorker';
import useNotification from '@/compositions/useNotification';
import NotificationIcon from './components/icon/NotificationIcon.vue';
import MessageIcon from './components/icon/MessageIcon.vue';
import LockIcon from './components/icon/LockIcon.vue';
import ConfirmUi from '@/components/ui/confirm/Confirm.vue';
import useConfirm from '@/compositions/useConfirm';
import { EModalAction } from './enums/ui';

export default defineComponent({
  name: 'App',
  components: {
    Login,
    NotificationIcon,
    MessageIcon,
    ConfirmUi,
    LockIcon,
  },
  setup() {
    const { showConfirmMessage } = useConfirm();
    /**
     * check 해애할 것들
     * serviceWorker 가 되어야 한다는거..
     */
    
    const state = reactive({
      isLoaded: false,
      showPopupType: "",
      notificationStr : "",
      msg: "",
      notiPermission : "",
      serviceWorkerState: null as any,
      useNotificationService: false,
      confirmPrefix: "",
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
    })

    const Teleport = teleport_ as {
      new (): {
        $props: VNodeProps & TeleportProps;
      }
    }

    const initWebPushWorker = async () => {
      // state.useNotificationService = true;
      state.notiMsg = "서비스를 체크합니다."
      const { state : serviceWorkerState, init } = useServerWoker();
      state.serviceWorkerState = serviceWorkerState;
      const result = await init();
      if (result === false) {
        state.notiMsg = "모바일에서 APP 알림 기능을 사용할 수 없습니다. (서비스워커 미동작)";
        alert("모바일에서 APP 알림 기능을 사용할 수 없습니다.")
      } else {
        const { isGrantedPermission, sendNotification } = useNotification();
        console.log("isGrantedPermission() ", isGrantedPermission())
        state.allowNotification = isGrantedPermission();

        if (state.allowNotification === true) {
          state.sendNotification = sendNotification;
        }
        // Gesture 가 있어야 하기 때문에..
        // if (isGrantedPermission() === false) {
        //   const requestPermissionRes = await requestPermission();
        //   state.useNotificationService = requestPermissionRes;
        //   state.sendNotification = sendNotification;
        //   state.notiMsg = "1. 모바일에서 알림 권한을 얻어왔습니다. 결과 : " + requestPermissionRes + "/ permission : " + Notification.permission;
        // } else {
        //   state.useNotificationService = true;
        //   state.sendNotification = null;
        //   state.notiMsg = "모바일에서 알림 권한이 이미 있습니다. 결과 : " + "/ permission ...";
        // }
      }
      state.useNotificationService = true;
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
      const { requestPermission, notificationPermission } = useNotification();
      if (notificationPermission == "default") {
        const requestPermissionRes = await requestPermission();

        //  성공하면 refresh 함
        console.log(requestPermissionRes);
      } else if (notificationPermission == 'denied') {
        window.alert("알림이 거부로 되어있습닏. 앱 알림 설정을 풀어주세요")
      }
    }

    onMounted(() => {
      state.isLoaded = true;
      setTimeout(() => {
        initWebPushWorker();
      }, 1500)
    
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
