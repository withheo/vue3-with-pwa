

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
  }

  const requestPermission = () : Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Notification.requestPermission().then((result) => {
        state.notiPermission = result;
        if (result === "granted") {
          resolve(true)
        } else {
          resolve(false)
        }
      });
    });
  }

  const isGrantedPermission = (): boolean => {
   
    return state.notiPermission === 'granted';
  }

  // return promise 로
  const sendNotification = (msg: string, title: string = "TEST Notification", timeout = 3000) => {
    if (!navigator.serviceWorker) {
      return;
    }
    navigator.serviceWorker.getRegistrations().then((registration) => {
      const res = registration && registration.length > 0 ? registration[0] : null;
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
  }
}


export default useNotification;