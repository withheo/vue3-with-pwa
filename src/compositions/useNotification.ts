import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCQOkJiz7_lXXrarGQDar03MRsCzuPJSP0",
  authDomain: "gemiso-push-message.firebaseapp.com",
  projectId: "gemiso-push-message",
  storageBucket: "gemiso-push-message.appspot.com",
  messagingSenderId: "997337351696",
  appId: "1:997337351696:web:98f69d26501284dfef2c95",
  measurementId: "G-CYQN6NVY2N"
};
  
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

  function urlB64ToUint8Array(base64String: string)
  {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i)
      outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }

  const getAppkey = async (): Promise<any> => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {vapidKey: "BINxsPHrwAAIzNxfZRFVlQQ6jFvib0UOk4wjFThs_B_uy4rLOBCeaEyE1Qa6YdZIW6LNxf9FYRGGCFZRQEKmjxM"});

    console.log("messaging token : ", token);
    return new Promise((resolve, reject) => {
      resolve(token)
    })
  }

  const registNotification = async (data: any) => {
    const url = "https://port-0-web-push-3spy7mg2alqvu3uhv.sel5.cloudtype.app";
    // "http://localhost:3000";
    const response = await fetch(`${url}/notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    alert("등록 ? " + result)
    console.log("Success:", result);
  }

  const requestPermission = () : Promise<boolean> => {
    const convertedVPkey = urlB64ToUint8Array('BINxsPHrwAAIzNxfZRFVlQQ6jFvib0UOk4wjFThs_B_uy4rLOBCeaEyE1Qa6YdZIW6LNxf9FYRGGCFZRQEKmjxM');
    return new Promise((resolve, reject) => {
      Notification.requestPermission().then( (result) => {
        state.notiPermission = result;
        if (result === "granted") {

          navigator.serviceWorker.ready.then(async (registration: any) => {
            console.log(registration);
            registration.pushManager.getSubscription().then(async (subscription: any) =>{
              console.log("subscription : ", subscription);
              if (!subscription) {
                const t =  registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: convertedVPkey,
                }).then( async (x: any) => {

                  console.log(x.endpoint);
                  console.log(x.getKey('p256dh'));
                  console.log(x.getKey('auth'));
                  console.log(JSON.stringify(x));
                  const token = await getAppkey();
                  await registNotification({
                    token,
                    created_at: new Date(),
                    user_id : window.notification_userid,
                  })
                  // 서버에 등록 한다..
                });

              } else {
                console.error(" 없다 ... ")
              }
            }, (error: any) => {
              console.error(error);
            })
          });
          // navigator.serviceWorker.getRegistrations().then((registration: any) => {
          //   registration.pushManager
          //   .getSubscription()
          //   .then(async (subscription: any) => {
          //     // registration part
          //     console.log("subscription , ", subscription)

          //   });
          // });
          resolve(false)
        } else {
          resolve(false)
        }
      });
    });
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


  return {
    state,
    requestPermission,
    isGrantedPermission,
    sendNotification,
    notificationPermission: state.notiPermission,
    getAppkey,
  }
}


export default useNotification;