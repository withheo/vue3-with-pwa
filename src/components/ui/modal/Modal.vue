<template>
  <div ref = 'el' :class = "getClassPrefix('modal-ui-background-wrapper')"
  @keyup.esc.passive= "useCloseEscKey === true ? onCloseAction() : null" tabindex="0"
  >
    <div class = 'modal-ui-background' @click.stop = "onOuterClick"/>    
    <PanelUi class = 'modal-ui-content-panel show'
        :style = "{'min-width':width}"
       >
      <template #header-slot="data">
        <div class = 'modal-ui-close-btn-wrapper' :class = 'getHeaderSlotCss()'
          v-if ="!disableCloseButton"           
          @click.stop.prevent="onCloseAction">
          <CloseBtnIcon :width="40" :height="40" :lineColor = "closeLineColor"/>
        </div>
        <slot name = "header-slot" v-bind="data"/>
      </template>
      <template #body-slot="data">
        <slot name = "body-slot" v-bind="data"/>
      </template>
      <template #footer-slot="data">
        <slot name = "footer-slot" v-bind="data"/>
      </template>
    </PanelUi>
  </div>
</template>
<script lang="ts">
import { 
  defineComponent, 
  onMounted, 
  ref, 
  PropType, 
  watch, 
  SetupContext } from 'vue'
import useCssApi from '@/compositions/useCssApi';
import useContext  from '@/compositions/useContext';
import PanelUi from '@/components/ui/panel/Panel.vue';
import CloseBtnIcon from '@/components/icon/CloseButtonIcon.vue';
import { EModalAction } from '@/enums/ui';

export default defineComponent({
  name:'ModalUi',
  components: { PanelUi, CloseBtnIcon },
  emit:['onOuterClick', 'closeAction'],
  props: {
    cssPrefix: {
      type: String,
      default: '',
    },
    modalAction: {
      type: String as PropType<EModalAction>,
      default : EModalAction.Close,
    },
    useOuterClose: {
      type: Boolean,
      default: false,
    },
    useCloseEscKey: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '300px'
    },
    animationTime: {
      type: Number,
      default: 200,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    closeLineColor: {
      type: String,
      default: '#fff'
    },
    disableCloseButton: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, context: SetupContext) {  
    const el = ref<HTMLDivElement>();
    const { useSlot } = useContext(context);
    const { getClassPrefix, addClass, removeClass } = useCssApi(props.cssPrefix ?? '');    

    const onOuterClick = () =>{
      props.useOuterClose === true ? onCloseAction() : context.emit('onOuterClick');
    } 

    const getHeaderSlotCss = () => {
      return useSlot('header-slot') === true ? 'panel-header-title' : '';      
    }

    const onCloseAction = () => {
      removeClass(el.value, 'show');
      addClass(el.value, 'hide');      
      doDestroy('closeAction');
    }

    const doDestroy = (emitStr: 'onOuterClick' | 'closeAction') => {
      setTimeout(() => {
        context.emit(emitStr);
      }, props.animationTime);
    }

    const onShowAction = () => {
      setTimeout(() => {
        removeClass(el.value, 'hide');
        addClass(el.value, 'show');
        el.value.focus();
      });
    }

    onMounted(() => {     
      watch(
        () => props.isShow,
        (changeValue: boolean) => {
          changeValue === true ? onShowAction() : onCloseAction();
        },
        {immediate: true}
      );
    })

    return {
      getClassPrefix,
      onOuterClick,
      onCloseAction,
      useSlot,
      getHeaderSlotCss,
      el
    }
  },
})
</script>
<style lang="scss" scoped>
  @import "@/scss/ui/modal/index.scss";
</style>