<template>
  <ModalUi :class = "getClassPrefix('alert-wrapper')" ref = 'modalEl'
    :useFooter = "true"
    :useOuterClose = "state.useOuterClose"
    v-model:modalAction = "state.modalAction"
    @closeAction = "onCloseAction"
    v-if = '!state.destroied'>
    <template #body-slot>
      <template v-if = "useSlot('body-slot')">
       <slot name = 'body-slot'/>
      </template>
      <template v-else>
        <div class = 'confirm-body' :data-message = "state.message">
          <div class = 'confirm-content'>
            <AttentionMarkAniIcon :width ="40" :height = "40" class ='confirmIcon'/>
            <slot name = 'content'>
              {{ state.title }}
            </slot>
          </div>
          <div class = 'confirm-desp'>
            <slot name = 'desp' >
              {{ state.message }}
            </slot>
          </div>
        </div>
      </template>
    </template>

    <template #footer-slot >
      <div class ='footer-wrapper'>
        <slot name = 'btns' >
          <button  @click.stop = "onBtnClick" @mousedown.stop>
            {{ $t('btns.ok') }}
          </button>
        </slot>
      </div>
    </template>
  </ModalUi>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref } from 'vue'
import ModalUi from '@/components/ui/modal/Modal.vue';
import AttentionMarkAniIcon from '@/components/icon/AttentionMarkAniIcon.vue';
import { EModalAction } from '@/enums/ui';
import { useI18n } from 'vue-i18n';
import useContext from '@/compositions/useContext'
import useCssApi from '@/compositions/useCssApi';


export default defineComponent({
  name:'Alert-Ui',
  components: {
    ModalUi,
    AttentionMarkAniIcon,
    
  },
  emits:['closeAction'],
  props: {
    modalAction: {
      type: String as PropType<EModalAction>,
    },
    useOuterClose: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: '',
    },
    cssPrefix: {
      type: String,
      default: '',
    }
  },
  setup(props, ctx: any) {
    const modalEl = ref<InstanceType<typeof ModalUi>>();
    const el = ref<HTMLElement>();
    const { t } = useI18n();
    const { getClassPrefix } = useCssApi(props.cssPrefix ?? '');
    const { useSlot } = useContext(ctx);
    const state = reactive({
      destroied: false,
      modalAction: props.modalAction,
      useOuterClose: props.useOuterClose,
      message: computed(() => props.message ?? ''),
      title: computed(() => props.title ?? t('btns.confirm')),
    });

    const onCloseAction = () => {
      setTimeout(() => {
        ctx.emit('closeAction');
        state.destroied = true;
      }, 200);
    }

    const onBtnClick = () => {
      modalEl.value.onCloseAction();
    }

    return {
      modalEl,
      el,
      state,
      onCloseAction,
      onBtnClick,
      getClassPrefix,
      useSlot,
    }
  },
})
</script>
<style lang="scss" >

  .alert-wrapper {
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    .modal-ui-content-panel {
      // background-color: $base-over-color !important;
    }

    .confirm-content {
      color: #fff;
    }

    .confirm-content {
      flex-direction: column;
    }

    .confirmIcon {
      fill: #f1f1f1;
      stroke: #f1f1f1;
    }
    .panel-wrapper {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      .panel-body-wrapper {
        flex:1;
        align-items: center;
        justify-content: center;
        display: flex;
      }
      .confirm-body {
        align-items: center;
        justify-content: center;
        font-size:20px;
        display: flex;
        flex-direction: column;
        padding:5px 20px;
        transition: all 0.2s ease;
        position: relative;
        top:-20px;

        div {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirm-desp {
          padding-top:10px;
          font-size: 0.65em;
          color:#ccc;
          white-space: break-spaces;
          text-align: center;
        }
      }
    }

    .panel-footer-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: static;
      bottom:0;
      flex:1;
      transition: 0.2s;
      @apply bg-btn-base;
      cursor: pointer;

      .footer-wrapper {
        flex:1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      button:last-child {
        border-radius: 0 0 0.25em 0.25em !important;
      }

      &:hover {
        @apply bg-base-dark;
      }

      button {
        // background-color: $base-btn-color;
        flex:1;
        height: 50px;
        cursor: pointer;
        font-size:14px;
        transition: all 0.2s ease;
        @apply text-white;

        &.ok {
         
        }
        &:active {
          opacity: 1;
          // background-color: $base-over-color;
        }
      }
    }
  }



</style>
