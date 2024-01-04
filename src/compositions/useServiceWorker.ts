
const useServiceWorker = () => {
  const state = {
    init: false,
  };

  // 실제 서비스 워커를 등록 하는 함수. 
  // true false 처리해서 
  // 
  const registedServiceWorker = async (js: string) => {
    let findJs: any = undefined;
    if ('serviceWorker' in navigator) {
      const registedServiceWorkers =  await navigator.serviceWorker.getRegistrations();
      const listServiceWokers = registedServiceWorkers.map((worker) => worker.active?.scriptURL);     
      findJs = listServiceWokers.find((worker) => worker.indexOf(js) > -1);
    }

    return new Promise((resolve) => {
      resolve(findJs === undefined ? false : true);
    });
  }

  const init = (serviceWorkerJs: string = './pushServiceWorker.js', scope: string = 'firebase-cloud-messaging-push-scope'): Promise<boolean> => {
    // console.error("serviceWorkerJs >>>> ", serviceWorkerJs)
    return new Promise((resolve, reject) => {
      if ('serviceWorker' in navigator) {
        // console.log("서비스워커 등록 호출 :", serviceWorkerJs)
        navigator.serviceWorker
          .register(serviceWorkerJs, { scope })
          .then(() => {
            state.init = true;
            return resolve(state.init);
          })
          .catch( err => {
            state.init = false;
            return resolve(state.init);
          });
      } else {
        state.init = false;
        return resolve(false);
      }
    });
  }
  
  return {
    init,
    state,
    registedServiceWorker
  }
}

export default useServiceWorker;
