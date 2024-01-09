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
    <Login/>
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
import { defineComponent, onMounted, reactive } from 'vue';
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

    const Teleport = teleport_ as {
      new (): {
        $props: VNodeProps & TeleportProps;
      }
    }

    const state = reactive({
      version: "0.0.0.2",
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
    })

    const {
        RP_ID = 'localhost',
      } = process.env;

    const options = {
      challenge: ((crypto) as any).randomUUID(),
      rp: {
        name:  "WebAuthn Test",
        id: RP_ID,
      },
      user: {
        id: 'tester',
        name: '테스터',
        displayName: '테스터 디스플레이'
      },
      timeout: 60000,
      // authenticatorSelection: {
      //   authenticatorAttachment: "cross-platform",
      //   requireResidentKey: true,
      //   userVerification: "preferred"
      // },
      pubKeyCredParams: [{
        alg: -7,
        type: 'public-key',
      },{
        alg: -257,
        type: 'public-key',
      }]
    };

    const publicKey: any = {
      // The challenge is produced by the server; see the Security Considerations
      challenge: new Uint8Array([
        21,
        31,
        105 /* 29 more random bytes generated by the server */
      ]),

      // Relying Party:
      rp: {
        name: "ACME Corporation"
      },

      // User:
      user: {
        id: Uint8Array.from(
          window.atob("MIIBkzCCATigAwIBAjCCAZMwggE4oAMCAQIwggGTMII="),
          c => c.charCodeAt(0)
        ),
        name: "mynet81@gmail.com", // 이건 받아와야 겠지
        displayName: "Alex P. Müller" // 이것도 
      },

      // This Relying Party will accept either an ES256 or RS256 credential, but
      // prefers an ES256 credential.
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7 // "ES256" as registered in the IANA COSE Algorithms registry
        },
        {
          type: "public-key",
          alg: -257 // Value registered by this specification for "RS256"
        }
      ],

      authenticatorSelection: {
        // Try to use UV if possible. This is also the default.
        // authenticatorAttachment: "platform",
        // requireResidentKey: true,
        authenticatorAttachment: "platform",
        requireResidentKey: true, // 사용자 인증 정보 기능이 있는 플랫폼 인증자가 가능
        userVerification: "required" // 지문 사용 여부 
      },

      timeout: 360000, // 6 minutes
      excludeCredentials: [], // No exclude list of PKCredDescriptors
      extensions: { loc: true } // Include location information
      // in attestation
    };

    const onFingerPrint = async () => {
      if (!window.PublicKeyCredential) {
        /* Client not capable. Handle error. */
      }
      // 서버에 공개키를 받아온다.
      // user 정보를 받아와야 겠찌.

      // Note: The following call will cause the authenticator to display UI.
      // navigator.credentials
      //   .create({ publicKey })
      //   // eslint-disable-next-line no-unused-vars
      //   .then((newCredentialInfo: any) => {
      //     // Send new credential info to server for verification and registration.
      //     // eslint-disable-next-line no-unused-vars, no-undef
          
      //     // eslint-disable-next-line no-undef
      //     console.log("save", newCredentialInfo);
      //   })
      //   .catch(() => {
      //     // No acceptable authenticator or user refused consent. Handle appropriately.
      //     console.log("fail");
      //   });
    
      try {
        const credential  = await navigator.credentials.create({
          publicKey: publicKey
        });        

        state.credential = credential;

        if (credential.id) {
          localStorage.setItem("credentialId", credential.id);
        }
        console.log("credential ", credential.id);


      } catch(err) {
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
      const encoder = new TextEncoder();
      // const acceptableCredential1 = {
      //     type: "public-key",
      //     id: encoder.encode(localStorage.getItem("credentialId"))
      // };

      const credentialId = new Uint8Array([183, 148, 245 /* more random bytes previously generated by the authenticator */]);
      const options = {
        // The challenge is produced by the server; see the Security Considerations
        challenge: new Uint8Array([4,101,15 /* 29 more random bytes generated by the server */]),
        timeout: 120000,  // 2 minutes
        allowCredentials: [{ type: "public-key", id: credentialId }]
      };
   
     
      // const options = {
      //   // The challenge is produced by the server; see the Security Considerations
      //   challenge: new Uint8Array([8,18,33 /* 29 more random bytes generated by the server */]),
      //   timeout: 120000,  // 2 minutes
      //   allowCredentials: [ acceptableCredential1 ],
      //   // extensions: { 'credProps': true }
      // };

      try {
        const credential  = await navigator.credentials.get({
          publicKey: options as any
        });
      } catch(error) {
        showAlert(error as string);
        // console.error(error);
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
