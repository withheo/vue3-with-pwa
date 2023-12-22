
const useCssApi = (cssPrefix: string) => {
  const getClassPrefix = (cssName: string): string => {
    return cssPrefix ? `${cssPrefix}-${cssName}` : `${cssName}`
  };

  const addClass = (tartgetEl:HTMLElement, className: string) => {
    tartgetEl?.classList.add(className);
  }

  const removeClass = (tartgetEl:HTMLElement, className: string) => {
    tartgetEl?.classList.remove(className);
  }

  return {
    getClassPrefix,
    addClass,
    removeClass,
  }
}

export default useCssApi;
