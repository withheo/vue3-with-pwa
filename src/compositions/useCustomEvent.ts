
const useCustomEvent = () => {

  const disPatchEvent = (eventNm: string, params: any) => {
    document.dispatchEvent(new CustomEvent(eventNm, {
      detail: params
    }));
  }

  return {
    disPatchEvent
  }
}

export default useCustomEvent;
