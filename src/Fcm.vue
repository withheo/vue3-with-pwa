<template>
  <div class = "app-wrapper" v-if = "state.activedWpa && state.isLoaded">
    <div class = "app-header-wrapper">
      <div class ='app-auth-wrapper'>
        <div class = "allow-icon" @click.stop="onFingerPrint">
          <fingerPrint />
          <div class = 'allow-icon-text'>지문등록</div>
        </div>
        <div class = "allow-icon" @click.stop="onstartFingerPrint">
          <fingerPrint />
           <div class = 'allow-icon-text'>지문로그인</div>
        </div>
      </div>
      <div class = 'app-fcm-wrapper' v-show ="state.useNotificationService">
        <div class = "allow-icon" @click.stop="onAllowNotification" v-show="!state.allowNotification"> 
          <LockIcon /> 
          <div class = 'allow-icon-text'>알림설정</div>
        </div>
        <div class = "allow-icon" @click.stop="onOpenMessagePopup" v-show="state.allowNotification && state.isRegistedPushApp"> 
          <MessageIcon /> 
          <div class = 'allow-icon-text'>알림전송</div>
        </div>
        <div class = "allow-icon" @click.stop="onEnablePushPopup" v-show="state.allowNotification && !state.isRegistedPushApp"> 
          <NotificationIcon /> 
          <div class = 'allow-icon-text'>알림등록</div>
        </div>
        <div class = "allow-icon" @click.stop="onDisablePushPopup" v-show="state.allowNotification && state.isRegistedPushApp"> 
          <NotificaionOffIcon /> 
          <div class = 'allow-icon-text'>알림해제</div>
        </div>
      </div>
    </div>
    <!-- <div class = "app-allow-icon" v-show ="state.useNotificationService">
      <div class = "allow-icon" @click.stop="onAllowNotification" v-show="!state.allowNotification"> <LockIcon /> </div>
      <div class = "allow-icon" @click.stop="onOpenMessagePopup" v-show="state.allowNotification && state.isRegistedPushApp"> <MessageIcon /> </div>
      <div class = "allow-icon" @click.stop="onEnablePushPopup" v-show="state.allowNotification && !state.isRegistedPushApp"> <NotificationIcon /> </div>
      <div class = "allow-icon" @click.stop="onDisablePushPopup" v-show="state.allowNotification && state.isRegistedPushApp"> <NotificaionOffIcon /> </div>
    </div> -->     
    
    <div >
      모바일 권한을 체크합니다.<br>
      {{ state.notiMsg }}
    </div>
    <Login ref ="LoginComponent"/>
    <div style ="display:flex;padding:10px;"> {{  state.token }} </div>
    
  </div>
  <div class = "app-check-wrapper" v-else-if = "!state.activedWpa">
    <SmileIcon height ="50%" width="50%"/>
    PWA 모드로 실행 하는지 체크합니다.
    <br>PWA 로 설치 진행 후 실행해 주세요.
  </div>
  <div v-else> 
    <LoadingVue :title = "state.loadding.title" :message="state.loadding.message"/>
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
import { defineComponent, onMounted, reactive, ref } from 'vue';
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
import fingerPrint from '@/components/icon/FingerPrintIcon.vue';
import SmileIcon from '@/components/icon/smileIcon.vue';
import LoadingVue from '@/components/Loading.vue';
import ApiWebAuthn from '@/api/apiWebAuthn';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
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
    MessagePopup,
    fingerPrint,
    SmileIcon,
    LoadingVue
  },
  setup() {
    const { showConfirmMessage } = useConfirm();
    const { registedPushApp, getAppNotificationPermission, requestNotificationPermission, requestPermission, getStateMsg } = useNotification();
    const { sendMessageApi, getLivedServer } = apiNotification();
    const { getResitrationOptions, 
      postVerifyRegistration, 
      getAuthenticationOptions, 
      postVerifyAuthentication } = ApiWebAuthn();

    const LoginComponent = ref<InstanceType<typeof Login>>();
    
    let notification_userid = localStorage.getItem("notification_userid") ?? window.crypto.randomUUID();
   
    if (notification_userid) {
      localStorage.setItem("notification_userid", notification_userid);
    } 
    window.notification_userid = notification_userid;

    const state = reactive({
      activedWpa: false,
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
      loadding: {
        title: "Initialize App",
        message: "잠시만 기다려 주세요."
      }
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
      try {
        state.pushAllowState.state = "ing";
        const rtn = await requestPermission(true, {
          user_name,
        });
        if (rtn === false) {
          const msg = getStateMsg();
          showAlert(`오류 - ${msg}`);
          return;
        }
        
        state.isRegistedPushApp = await registedPushApp();
        state.isShow = false;
        setTimeout(() => {
          onPopupClose();
        }, 500)
      } catch(err) {
        const msg = getStateMsg();
        showAlert(` catch 오류 - ${msg}`);
        return;
      }
      
      // console.error(rtn);      
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

    const checkPWAMode = () => {
      return ["fullscreen", "standalone", "minimal-ui"].some(
        (displayMode) => window.matchMedia('(display-mode: ' + displayMode + ')').matches
      );
    }

    const onFingerPrint = async () => {
      if (!window.PublicKeyCredential) {
        /* lient not capable. Handle error. */
      }
      const loginId = LoginComponent.value.getLoginId().trim();

      if (loginId.length < 1) {
        LoginComponent.value.focusLoginId();
        showAlert("인증 등록하려면 아이디가 있어야 합니다.\r\nID 값을 넣어 채워주세요");
        return;
      }
    
      try {
        const resistData = `${window.notification_userid}:${loginId}`;
        const options = await getResitrationOptions({data: resistData});
        const optionsJson = await options.json();
        if (options.status == 500) {
          showAlert(optionsJson.msg);
          return;
        }

        const { data } = optionsJson;
        const credential  = await startRegistration(data);
        // state.credential = credential;

        // 해당 값으로 vertify 체크를 해야한다.
        const postVerifyRegitrationResp = await postVerifyRegistration({
          key: window.notification_userid,
          user_id: loginId,
          credential
        });
        // showAlert('여긴 왔찌')
        const verificationJSON = await postVerifyRegitrationResp.json();
        // if (credential.id) {
        //   localStorage.setItem("credentialId", credential.id);
        // }
        // Show UI appropriate for the `verified` status
        if (verificationJSON && verificationJSON.verified) {
          showAlert("등록이 완료 되었습니다.");
        } else {
          showAlert( `Oh no, something went wrong! Response: <pre>${JSON.stringify(
            verificationJSON,
          )}</pre>`);
        }        

      } catch(err) {
        showAlert(err as any)
        console.log(err);
      }
      

      // 해당 방법으로 만들어도 해당 생체 인식 정보는 표시X 
      // 해당 정보는 서버 및 인증자 외부로 유출 되지 않는다.
      

      // try {
      //   const resp = await startRegistration(options as any);
      // } catch(error) {
      //   console.error(error);
      // }
    }

    const onstartFingerPrint = async () => {    
      try {       
        const options = await getAuthenticationOptions({
          data: window.notification_userid,
        });
        const optionsJson = await options.json();
        if (options.status == 500) {
          showAlert(optionsJson.msg);
          return;
        }

        const { data } = optionsJson;
        const authenticationRes  = await startAuthentication(data);

        if (authenticationRes) {
          const postVerifyAuthenticationResp = await postVerifyAuthentication({
            key: window.notification_userid,
            data: authenticationRes
          });
          const verificationJSON = await postVerifyAuthenticationResp.json();
          // if (credential.id) {
          //   localStorage.setItem("credentialId", credential.id);
          // }
          // Show UI appropriate for the `verified` status
          if (verificationJSON && verificationJSON.verified) {
            showAlert("정상적인 값으로 로그인 처리가 되었습니다.");
          } else {
            showAlert( `Oh no, something went wrong! Response: <pre>${JSON.stringify(
              verificationJSON,
            )}</pre>`);
          }
        }
      } catch(err) {
        showAlert(err as any)
        console.log(err);
      }
    
    }

    onMounted(async () => {
      // state.isLoaded = true;
      state.user_id = notification_userid;
      const isPWA = checkPWAMode();
      if (isPWA === true) {
        state.activedWpa = true;  
        initWebPushWorker();      
      } else {
        state.activedWpa = false;
      }

      try {
        const isLivedServerApiResponse = await getLivedServer();
        if (isLivedServerApiResponse.status === 200) {
          state.isLoaded = true;
        } else {
          state.loadding.title = "Error";
          state.loadding.message = "서버 접속에 문제가 발생하였습니다.";
        }
      } catch(err) {
        state.loadding.title = "Error";
        state.loadding.message = "서버 접속에 문제가 발생하였습니다.";
      }
      
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
      onSendMessage,
      onFingerPrint,
      onstartFingerPrint,
      LoginComponent
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

.app-check-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  fill: white;
}

.app-header-wrapper {
  position: absolute;
  fill:white;
  top: 0px;
  // padding-top:1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // justify-content: flex-end;
  width:100%;
  // margin-right: 1rem;

  .app-auth-wrapper {
    display: flex;
    padding:0.6rem;

    .allow-icon {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      margin-left: 0.6rem;
    }
  }

  .app-fcm-wrapper {
    display: flex;
    padding:0.6rem;
  }

  .allow-icon {
    transition: 0.2s;
    padding: 0.5rem;
    opacity: 0.7;
    position: relative;
    margin-left: 0.6rem;

    .allow-icon-text {
      font-size: 0.6rem;
      position:absolute;
      bottom: -10px;
    }

    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
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
