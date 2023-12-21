

const useServiceWorker = () => {
  const state = {
    useServiceWorker: false,
    notiPermission: 'deny',
  };

  const init = (serviceWorkerJs: string = './pushServiceWorker.js'): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register(serviceWorkerJs)
          .then(() => {
            state.notiPermission = Notification.permission;
            return resolve(true);
          })
          .catch( err => {
            return resolve(false);
          });
      } else {
        state.useServiceWorker = false;
        return resolve(false);
      }
    });
  }

  const getNotiPermission = () => {
    return Notification.permission;
  }

  const isGrantedPermission = (): boolean => {
    return Notification.permission === 'granted';
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

  return {
    init,
    state,
    isGrantedPermission,
    requestPermission,
  }
}

export default useServiceWorker;
