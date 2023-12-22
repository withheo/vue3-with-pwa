

const useServiceWorker = () => {
  const state = {
    useServiceWorker: false,
  };

  const init = (serviceWorkerJs: string = './pushServiceWorker.js'): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if ('serviceWorker' in navigator) {
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
