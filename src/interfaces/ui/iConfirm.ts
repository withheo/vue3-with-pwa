interface IConfirmBtnOpts {
  type: 'ok' | '',
  text: String,
  onClickAction?: Function,
  onclickCloseAction?: boolean,
  beforeClickAction?: Function,
}

export {
  IConfirmBtnOpts,
}