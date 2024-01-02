

const useServiceWorker = () => {
  const state = {
    useServiceWorker: false,
  };

  const init = (serviceWorkerJs: string = './pushServiceWorker.js'): Promise<boolean> => {
    console.error("serviceWorkerJs >>>> ", serviceWorkerJs)
    return new Promise((resolve, reject) => {
      if ('serviceWorker' in navigator) {
        console.log("서비스워커 등록 호출 :", serviceWorkerJs)
        navigator.serviceWorker
          .register(serviceWorkerJs)
          .then(() => {
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
  
  return {
    init,
    state
  }
}

export default useServiceWorker;
