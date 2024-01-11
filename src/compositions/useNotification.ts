import { initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken } from "firebase/messaging";
import apiNotification from "@/api/apiNotification";

const useFCM = (config?: object, key?: string) => {
  const vapidKey = key ?? "BINxsPHrwAAIzNxfZRFVlQQ6jFvib0UOk4wjFThs_B_uy4rLOBCeaEyE1Qa6YdZIW6LNxf9FYRGGCFZRQEKmjxM";
  
  const firebaseConfig = config ?? {
    apiKey: "AIzaSyCQOkJiz7_lXXrarGQDar03MRsCzuPJSP0",
    authDomain: "gemiso-push-message.firebaseapp.com",
    projectId: "gemiso-push-message",
    storageBucket: "gemiso-push-message.appspot.com",
    messagingSenderId: "997337351696",
    appId: "1:997337351696:web:98f69d26501284dfef2c95",
    measurementId: "G-CYQN6NVY2N"
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  const getUrlB64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i)
      outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }


  const subscribe = async (): Promise<string> => {  
    try {
      return await getToken(messaging, { vapidKey: vapidKey});
    } catch(e) {
      return new Promise((resolve) => resolve(""));
    }
  }

  const unsubscribe = async (): Promise<boolean> => {  
    try {
      return await deleteToken(messaging);
    } catch(e) {
      return new Promise((resolve) => resolve(false));
    }
  }

  const getSubscribeVapidKey = (): Uint8Array => {
    return getUrlB64ToUint8Array(vapidKey);
  }

  const getFoundServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const fcmServiceWorker = registrations.find((registration) => registration.scope.indexOf('firebase-cloud-messaging-push-scope'));
    if (fcmServiceWorker && fcmServiceWorker.active) {
      return new Promise((resolve, reject) => resolve(fcmServiceWorker))
    } else {
      return new Promise((resolve, reject) => resolve(null))
    }
  }

  return {
    subscribe,
    unsubscribe,
    getSubscribeVapidKey,
    getFoundServiceWorker
  }
}

  
const useNotification = () => {
  const state = {
    notiPermission: 'default', // default | denied | granted
    msg: "",
    isSupported: false,
  };

  if (!("Notification" in window)) {
    state.msg = "This browser does not support notifications.";
  } else {
    state.isSupported = true;
    state.notiPermission = Notification.permission;
  }

  const { registApi } = apiNotification();

  const  { getSubscribeVapidKey, subscribe, unsubscribe, getFoundServiceWorker } = useFCM();

  const canBrowserSupportNotifaction = (): boolean => {
    let isSupported = false;
    if (navigator.userAgent.indexOf('Safari') !== -1 || navigator.userAgent.indexOf('Chrome') !== -1) {
      if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Version/') !== -1) {
        const version = navigator.userAgent.split('Version/')[1].split(' ')[0];
        isSupported = parseFloat(version) < 16.4;
        state.msg = '사파리 브러우저는 16.4 버전 이상에서만 동작합니다.';
      } else {
        isSupported = true;
      }
    } 
    return isSupported;
  }
 
  const registNotification = async (data: any) => {
    // const url = "https://port-0-web-push-3spy7mg2alqvu3uhv.sel5.cloudtype.app";
    // // "http://localhost:3000";
    // const response = await fetch(`${url}/notification`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });

    const response = await registApi(JSON.stringify(data))
    return await response.json();
  }
  

  const unsubscribeNotification = () => {
    // token도 삭제하고 실제 구독 해지도 해야한다.
  }

  const requestNotificationPermission = async (payload?: object): Promise<NotificationPermission> => {
    try {
      const permissionResult = await Notification.requestPermission();
      state.notiPermission = permissionResult;
      return new Promise((resolve) => resolve(permissionResult));
    } catch(e) {
      console.error(e);
    }
  }

  const subscribePushManager = async (pushManager: PushManager) : Promise<PushSubscription> => {
    return await pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: getSubscribeVapidKey(),
    })
  }

  const unSubscribePushManager = async (pushSubscription: PushSubscription) : Promise<boolean> => {
    return await pushSubscription.unsubscribe();
  }

  // 웃긴건 이거 한번 할때 마다 이상해 지던데.. (ios 버전)
  const getAppNotificationPermission = (): string => {
    return Notification.permission;
  }

  const requestPermission = async (isSubscribe:boolean,  payload?: object) => {
    if (canBrowserSupportNotifaction() === false) return;
    try {
      const registration = await getFoundServiceWorker();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          // 해지하기
          console.log(" 해지 하기" , subscription);
          const unSubscribePushManagerResult = await unSubscribePushManager(subscription);
          if (unSubscribePushManagerResult) {
            if (isSubscribe === false) {
              await unsubscribe();
              await registNotification(Object.assign({
                token: "",
                created_at: new Date(),
                user_id : window.notification_userid,
                use: false,
              },payload))
            } 
            else await unsubscribe();
          }
        } 

        if (isSubscribe) {
          const subscribePushManagerResult = await subscribePushManager(registration.pushManager)
          if (subscribePushManagerResult) {
            // token 넣고 처
            const token = await subscribe();
            return await registNotification(Object.assign({
              token,
              created_at: new Date(),
              user_id : window.notification_userid,
              use: true,
            },payload))
          }
        }
      }
      return;
    } catch(e) {
      console.error(e);
    }
  }

  const isGrantedPermission = (): boolean => {
    // Notification.permission 이코드 넣으면... 호출할때 마다 이상하게 
    // IOS 동작 하지 X
    return state.notiPermission == 'granted';
  }

  // return promise 로
  const sendNotification = (msg: string, title: string = "TEST Notification", timeout = 3000) => {
    if (!navigator.serviceWorker) {
      return;
    }
    navigator.serviceWorker.getRegistrations().then((registration: any) => {
      const res = registration && registration.length > 0 ? registration[0] : null;

      console.log("res > ",registration, res)
      setTimeout(() => {
        res?.showNotification(title, {
          body: msg,
        });
      }, timeout)
    });
  }

  const registedPushApp = async () : Promise<boolean> => {
    const registration = await getFoundServiceWorker();
    const subscription = await registration.pushManager.getSubscription();   
    return new Promise((resolve) => {
      subscription ? resolve(true) : resolve(false);
    })
  }
  


  return {
    state,
    requestPermission,
    requestNotificationPermission,
    isGrantedPermission,
    sendNotification,
    notificationPermission: state.notiPermission,
    getAppNotificationPermission,
    registedPushApp,
    getStateMsg: () => state.msg,
  }
}


export default useNotification;