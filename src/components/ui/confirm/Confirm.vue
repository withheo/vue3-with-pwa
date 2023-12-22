<template>
  <!-- <div  ref ="el"> -->
  <ModalUi class ='confirm-wrapper' ref = 'modalEl'
    :useFooter = "true"
    :isShow = "isShow"
    :width = "width"
    :useOuterClose = "state.useOuterClose"
    v-model:modalAction = "state.modalAction"
    @closeAction = "onCloseAction"
    >
    <template #body-slot>
      <div class = 'confirm-body' :data-message = "state.message">
        <div class = 'confirm-content'>
          <AttentionMarkAniIcon :width ="40" :height = "40" class ='confirmIcon'/>
          <slot name = 'content'>
          </slot>
        </div>
        <div class = 'confirm-desp'>
          <slot name = 'desp' />
        </div>
      </div>
    </template>

    <template #footer-slot >
      <div class ='footer-wrapper'>
        <slot name = 'btns' >
          <button v-for = "btn in state.btns"
          :key="btn.id"
          :class ="btn.type" @click.stop = "onBtnClick(btn)" @mousedown.stop>
            {{ btn.text }}
          </button>
        </slot>
      </div>
    </template>
  </ModalUi>
  <!-- </div> -->
</template>
<script lang="ts">
import {defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue';
import ModalUi from '@/components/ui/modal/Modal.vue';
import AttentionMarkAniIcon from '@/components/icon/AttentionMarkAniIcon.vue';
import { EModalAction } from '@/enums/ui';
import { IConfirmBtnOpts } from '@/interfaces/ui/iConfirm';

export default defineComponent({
  name: 'Confirm-Ui',
  emits:['closeAction','update:message'],
  props: {
    modalAction: {
      type: String as PropType<EModalAction>,
    },
    btns: {
      type: Array as PropType<Array<IConfirmBtnOpts>>,
    },
    useOuterClose: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    isShow: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: "450px"
    }
  },
  components: {
    ModalUi,
    AttentionMarkAniIcon,
  },
  setup(props, context) {
    const modalEl = ref<InstanceType<typeof ModalUi>>();
    const el = ref<HTMLElement>();
    //console.log("props.btns", props.btns);
    const state = reactive({
      modalAction: props.modalAction,
      useOuterClose: props.useOuterClose,
      btns: props.btns,
      message: '' as string,
    });

    const onCloseAction = () => {
      setTimeout(() => {
        context.emit('closeAction');
      }, 200);
    }

    const updateShowMessage = () => {
      setTimeout(() => {
        el.value?.classList.add('emphasize');
        state.message = props.message;
      },200);
    }

    const onBtnClick = (btn: IConfirmBtnOpts) => {
      el.value?.classList.remove('emphasize');
      if (btn.beforeClickAction && btn.beforeClickAction instanceof Function) {
        if (btn.beforeClickAction() === false){
          updateShowMessage();
          return false;
        }
      }

      if (btn.onclickCloseAction === true) {
        modalCloseAction();
      }

      if (btn.onClickAction && btn.onClickAction instanceof Function) {
        setTimeout(() => {
          btn.onClickAction();
        },200);
      }
    }

    const modalCloseAction = () => {
      modalEl.value.onCloseAction();
    }

    onMounted(() => {
      state.message = props.message;

      watch(
        () => props.modalAction,
        () => {
          state.modalAction = props.modalAction;
        }
      )
      
      watch(
        () => props.btns, 
        () => {
          state.btns = props.btns;
        }
      )

      watch(
        () => props.message,
        () => updateShowMessage,
      )
    })

    return {
      state,
      onCloseAction,
      onBtnClick,
      modalEl,
      modalCloseAction,
      el,
    }
  },
})
</script>
<style lang="scss">
  // @import '~@/scss/ui/button.scss';
  // @import '~@/scss/variables.scss';

  .confirm-wrapper {
    
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    .modal-ui-content-panel {
      @apply bg-over;
      // background-color: $base-over-color !important;
    }

    .confirmIcon {
      fill: #f1f1f1;
      stroke: #f1f1f1;
      margin-right: 10px;
    }
    .confirm-body {
        align-items: center;
        justify-content: center;
        font-size:20px;
        display: flex;
        flex-direction: column;
        padding:5px 20px 30px 20px;
        transition: all 0.2s ease;

        .confirm-content {
          color:#fff;
        }

        div {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirm-desp {
          padding-top:10px;
          font-size: 0.65em;
          color:#ccc;
        }
      }
  }

  .footer-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: static;
    bottom:0;
    flex:1;

    button:first-child {
      border-radius: 0 0 0 0.25em;
    }

    button:last-child {
      border-radius: 0 0 0.25em 0;
    }

    button {
      // background-color: $base-btn-color;
      flex:1;
      height: 50px;
      cursor: pointer;
      font-size:0.9rem;
      transition: all 0.2s ease;
      @apply text-white bg-btn-base;

      &.ok {
        @apply text-white bg-btn-base;
        // background-color: $base-color;
      }

      &:hover {
         @apply text-white bg-btn-over;
        // background-color: $base-dark-color;
      }

      &:active {
        opacity: 1;
        // background-color: $base-over-color;
      }
    }
  }

  .confirm-message {
    color:red;
    font-size: 16px;
    font-weight: 400;
    padding:5px;
    letter-spacing: 0px;
    flex:1;
  }

  .emphasize {
    .confirm-body {
      transition-delay: 0s;
      transform: translateY(-15px);
      transition: all 1s ease;
      &:before {
        font-size: 0.9em;
        color: #ff1d1d;
        opacity: 0;
        content: attr(data-message);
        position:absolute;
        bottom:-30px;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: emphasize 0.2s linear 0.1s forwards ;
      }
    }
  }


  @keyframes emphasize {
    0% {
      transform: scale(1);
      opacity: 0;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
