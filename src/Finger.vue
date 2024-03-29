<template>
  <div class = "app-wrapper">
    <div class = "app-allow-icon" v-show ="state.useNotificationService">
      <!-- <div class = "allow-icon" @click.stop="onAllowNotification" v-show="!state.allowNotification"> <LockIcon /> </div>
      <div class = "allow-icon" @click.stop="onOpenMessagePopup" v-show="state.allowNotification && state.isRegistedPushApp"> <MessageIcon /> </div>
      <div class = "allow-icon" @click.stop="onEnablePushPopup" v-show="state.allowNotification && !state.isRegistedPushApp"> <NotificationIcon /> </div>
      <div class = "allow-icon" @click.stop="onDisablePushPopup" v-show="state.allowNotification && state.isRegistedPushApp"> <NotificaionOffIcon /> </div> -->
      <div class = "allow-icon" @click.stop="onFingerPrint">
        <fingerPrint />
      </div>
      <div class = "allow-icon" @click.stop="onstartFingerPrint">
        <fingerPrint />
      </div>
    </div>
    <div >
      모바일 권한을 체크합니다.<br>
      {{ state.notiMsg }}
    </div>
    <Login ref ="LoginComponent"/>
    <div> {{ state.version }}</div>
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
import { defineComponent, onMounted, reactive, ref } from 'vue';
import Login from './components/Login.vue';
import { Teleport as teleport_, TeleportProps, VNodeProps} from 'vue';

import NotificationIcon from './components/icon/NotificationIcon.vue';
import NotificaionOffIcon from '@/components/icon/NotificaionOffIcon.vue';
import MessageIcon from './components/icon/MessageIcon.vue';
import LockIcon from './components/icon/LockIcon.vue';
import ConfirmUi from '@/components/ui/confirm/Confirm.vue';
import { EModalAction } from './enums/ui';
import Alert from '@/components/ui/alert/Alert.vue';
import PushPopup from './components/PushPopup.vue';
import MessagePopup from '@/components/MessagePopup.vue'
import fingerPrint from '@/components/icon/FingerPrintIcon.vue';
import ApiWebAuthn from '@/api/apiWebAuthn';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    notification_userid: string;
    crypto: any;
  }
}
export default defineComponent({
  name: "FingerPage",
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
    fingerPrint
  },
  setup() {
    let notification_userid = localStorage.getItem("notification_userid") ?? window.crypto.randomUUID();
   
    if (notification_userid) {
      localStorage.setItem("notification_userid", notification_userid);
    } 
    window.notification_userid = notification_userid;

    const LoginComponent = ref<InstanceType<typeof Login>>();

    const Teleport = teleport_ as {
      new (): {
        $props: VNodeProps & TeleportProps;
      }
    }
    const { getResitrationOptions, 
      postVerifyRegistration, 
      getAuthenticationOptions, 
      postVerifyAuthentication } = ApiWebAuthn();

    const state = reactive({
      version: "0.0.0.5",
      isLoaded: false,
      showPopupType: "",
      notificationStr : "",
      msg: "",
      notiPermission : "",
      serviceWorkerState: null as any,
      useNotificationService: true,
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
      credential: null as any
    });    

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

  

    const isShowPopup = (type: string) => {      
      return state.showPopupType === type;
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

    const showAlert = (message: string) => {
      state.showPopupType = 'alert';
      state.alertConfig.message = message;
    }

    const onPopupClose = () => {
      state.showPopupType = '';
      state.isShow = true;
      state.pushAllowState = {
        state: "init"
      };
    }

    onMounted(async () => {
      state.isLoaded = true;
     
    });

    return {
      state,
      Teleport,
      onFingerPrint,
      isShowPopup,
      onPopupClose,
      onstartFingerPrint,
      LoginComponent,
    }
  },
})
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
