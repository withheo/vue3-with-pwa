import { Component } from 'vue';

interface ITabItem {
  tabName: string,
  setActivate?: Function,
  isManual?: boolean,
  canDelete?: boolean,
  delete?: Function,
  activated?: boolean,
  slotComponent?: Component,
  tabObj?: Object,
  [key: string]: any,
}

export {
  ITabItem
}