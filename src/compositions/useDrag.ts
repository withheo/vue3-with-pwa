
import {
  reactive,
  ComputedRef,
  ref
} from 'vue';

interface IMousePosition {
  pageX: number,
  pageY: number,
}

interface IElDragableOptions {
  el: HTMLElement | null,
  natural?: Boolean,
  beforeDownEvt?: Function | null,
  downCallback?: Function | null,
  moveCallback?: Function | null,
  upCallback?: Function | null,
  initElPosition?: IMousePosition,
  scale?: String | Number | ComputedRef | Record<any,any>,
  shadowOpts?: {
    copyNode: Node,
  },
  diffDownTime?: number,
  evtOnceOption?: {
    downEvtOnce?: boolean,
    moveEvtOnce?: boolean,
    upEvtOnce?: boolean,
  },
  showScreenTransparentBox ?: boolean,
}

const useShadowEl = () => {

  const shadowInfo = reactive({
    wrapperEl: ref(),
    copyNode: ref(),
    rectInfo: ref()
  });

  const createShadowWrapper = (): HTMLElement | Element => {
    let shadowWarpperEl = getShadowWarpperEl();
    if (!shadowWarpperEl) {
      shadowWarpperEl = document.createElement("div");
      shadowWarpperEl.classList.add('dragShadow-wrapper');
      shadowWarpperEl.classList.add('hide');
      document.body.appendChild(shadowWarpperEl);
    }

    setShadowWrapperEl(shadowWarpperEl);
    return shadowWarpperEl;
  }

  const copyShadowEl = () => {
    shadowInfo.rectInfo = (shadowInfo.copyNode as HTMLElement).getBoundingClientRect();
    const shadowEl = shadowInfo.copyNode.cloneNode(true);

    (shadowEl as HTMLElement).style.width = `${shadowInfo.rectInfo.width}px`;
    (shadowEl as HTMLElement).style.height = `${shadowInfo.rectInfo.height}px`;
    (shadowEl as HTMLElement).style.opacity = '0.5';
    (shadowInfo.wrapperEl as HTMLElement).appendChild(shadowEl);
  }

  const setCopyEl = (el: Node) => {
    shadowInfo.copyNode = el;
  }

  const setShadowWrapperEl = (el: Element) => {
    shadowInfo.wrapperEl = el;
  }

  const hide = (): void => {
    const el = getShadowWarpperEl();
    if (el) {
      el.classList.add('hide');
    }

  }

  const show = (): void => {
    const el = getShadowWarpperEl();
    if (el) {
      el.classList.remove('hide');
    }
  }

  const getShadowWarpperEl = (): Element => {
    return document.getElementsByClassName('dragShadow-wrapper')[0];
  }

  const updateWrapperElPosition = (positionX: number, positionY: number) => {
    const updatePositionY = positionY + shadowInfo.rectInfo.top;
    const updatePositionX = positionX + shadowInfo.rectInfo.left;
    shadowInfo.wrapperEl.style.left = `${updatePositionX}px`;
    shadowInfo.wrapperEl.style.top = `${updatePositionY}px`;
  }

  return {
    createShadowWrapper,
    setCopyEl,
    setShadowWrapperEl,
    copyShadowEl,
    updateWrapperElPosition,
    hide,
    show,
  }
}

const useDragable = () => {

  const useShadowDragableEl = useShadowEl();

  const elOptions: IElDragableOptions = reactive({
    el: null,
    natural: false,
    moveCallback: null,
    initElPosition: {
      pageX: 0,
      pageY: 0,
    }as IMousePosition,
    scale: 1,
  });

  const mouseDownTime = ref(0);
  let diffDownTime = 150;
  let showScreenTransparentBox = false;
  let screenTransparentBoxEl: any = null;
  const shadowWrapper = ref();
  const forceHideEl = ref(false);

  const mouseDownPosition: IMousePosition = {
    pageX: 0,
    pageY: 0,
  };

  const mouseMovePosition: IMousePosition = {
    pageX: 0,
    pageY: 0,
  };

  const onMouseDown = (e: MouseEvent) => {
    e.stopPropagation();

    if (elOptions.beforeDownEvt && elOptions.beforeDownEvt instanceof Function) {
      if (elOptions.beforeDownEvt(e) === false) {
        return;
      }
    }

    if (showScreenTransparentBox === true) {
      screenTransparentBoxEl = document.createElement('div');
      screenTransparentBoxEl.className = 'drag-screen-transparent-box-wrapper';
      const fragMentEl =  document.createDocumentFragment();
      fragMentEl.appendChild(screenTransparentBoxEl);
      //console.error("true ... ",showScreenTransparentBox);
      document.body.append(fragMentEl);
    }

    mouseDownTime.value = e.timeStamp;
    mouseDownPosition.pageX = e.pageX;
    mouseDownPosition.pageY = e.pageY;   
    // document.body.classList.add('drag-down-cursor');
    // //console.log('elOptions.evtOnceOption :', elOptions.evtOnceOption);
    // document.addEventListener('mousemove', onMouseMove, elOptions.evtOnceOption?.moveEvtOnce ? {once: true} : false);

    window.addEventListener('mousemove', onMouseMove, elOptions.evtOnceOption?.moveEvtOnce ? {once: true} : false);
    window.addEventListener('mouseup', onMouseUp, elOptions.evtOnceOption?.upEvtOnce ? {once: true} : false);

    if (elOptions.downCallback && elOptions.downCallback instanceof Function) {
      elOptions.downCallback(e);
    }

    if (elOptions.shadowOpts && elOptions.shadowOpts.copyNode) {
      useShadowDragableEl.copyShadowEl();
    }
  }

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    const diffTime = e.timeStamp - mouseDownTime.value;
    if (diffTime < diffDownTime) return false;

    // document.body.classList.add('drag-move-cursor');

    mouseMovePosition.pageX = e.pageX;
    mouseMovePosition.pageY = e.pageY;

    if (elOptions.moveCallback && elOptions.moveCallback instanceof Function) {
      elOptions.moveCallback(e);
    }

    if (elOptions.shadowOpts && elOptions.shadowOpts.copyNode) {
      if (forceHideEl.value === false) useShadowDragableEl.show();
      const movePageX = e.pageX - mouseDownPosition.pageX;
      const movePageY = e.pageY - mouseDownPosition.pageY;

      useShadowDragableEl.updateWrapperElPosition(movePageX, movePageY);
    }
  }

  const onMouseUp = (e: MouseEvent) => {
    window.removeEventListener('mousemove', onMouseMove, false);
    window.removeEventListener('mouseup', onMouseUp, false);

    if (showScreenTransparentBox === true && screenTransparentBoxEl) {
      screenTransparentBoxEl.remove();
      //console.error("remove  ",showScreenTransparentBox);
    }

    if (elOptions.upCallback && elOptions.upCallback instanceof Function) {
      elOptions.upCallback();
    }

    if (elOptions.shadowOpts && elOptions.shadowOpts.copyNode) {
      const shadowEl = elOptions.shadowOpts.copyNode;
      (shadowWrapper.value as HTMLElement).childNodes.forEach((child) => child.remove());
    }

    // document.body.classList.remove('drag-down-cursor');
    // document.body.classList.remove('drag-move-cursor');
    hideDragEl();
  }

  const hideDragEl = () => {
    if (elOptions.shadowOpts && elOptions.shadowOpts.copyNode) {
      useShadowDragableEl.hide();
    }
  }

  const showDragEl = () => {
    if (elOptions.shadowOpts && elOptions.shadowOpts.copyNode) {
      useShadowDragableEl.show();
    }
  }

  const initDragableEl = (opts: IElDragableOptions): void => {
    Object.assign(elOptions, opts);
    if (opts.el) {
      opts.el.addEventListener('mousedown', onMouseDown, elOptions.evtOnceOption?.downEvtOnce ? {once: true} : false );
    }

    if (elOptions.shadowOpts && elOptions.shadowOpts.copyNode) {
      useShadowDragableEl.setCopyEl(elOptions.shadowOpts.copyNode);
      shadowWrapper.value = useShadowDragableEl.createShadowWrapper();
    }

    if ( opts.diffDownTime >= 0) {
      diffDownTime = opts.diffDownTime;
    }

    if ( opts.showScreenTransparentBox) {
      showScreenTransparentBox = opts.showScreenTransparentBox;
    }
  }

  const enableForceHideDragEl = () => {
    forceHideEl.value = true;
  }

  const disableForceHideDragEl = () => {
    forceHideEl.value = false;
  }

  return {
    initDragableEl,
    hideDragEl,
    showDragEl,
    enableForceHideDragEl,
    disableForceHideDragEl,
    mouseDownPosition,
    mouseMovePosition,
  }
}

export {
  IElDragableOptions
};
export default useDragable;
