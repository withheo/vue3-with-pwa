interface IMessage {
  id: any,
  title: string,
  type?: string,
  message: string,
  date?: string,
  fromUserName?: string,
  isRead?: boolean,
  [key: string]: any,
}


export {
  IMessage,
}