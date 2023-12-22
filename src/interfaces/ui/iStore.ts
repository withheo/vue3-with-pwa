interface IStoreMethodList {
  get?: string,
  post?: string,
  delete?: string,
  put?: string,
}

interface IPagingOption {
  page: string,
  perPage: string,
  total: string,
}

interface IStoreEventList {
  storebeforeload?: Function,
  storeload?: Function,
  storeerror?: Function,
}

interface IStoreOption {
  url: string,
  params?: object,
  method?: IStoreMethodList,
  timeout?: number,
  paging?: IPagingOption,
  events?: IStoreEventList,
  autoLoad?: boolean,
  keyProperty?: string,
  baseParams?: object,
  methodUrl?: any,
  buildParam?: Function,
}

export {
  IStoreMethodList,
  IPagingOption,
  IStoreEventList,
  IStoreOption
}