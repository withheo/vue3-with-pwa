<template>
  <ModalUi
  :isShow = "isShow"
  :useHeader = "true"
  :useFooter = "true"
  @closeAction = "onCloseAction"
  width = "80%"
  ref = "modalEl"
  v-if = "state.isMounted">
  <template #header-slot>
    <div class = "pushpopup-header"> <NotificationIcon /> 
      <div class = ""> 알림 허용 </div>
    </div>
  </template>
  <template #body-slot>
    <div style="padding:10px;margin-left:10px;padding-bottom: 2rem;">
      <FormField>
        <template #label-slot>
          이름
        </template>
        <template #field-slot>
          <div class = 'input-wrapper mb-0'>
            <div class ="input-tag"><input :placeholder="computedNamePlaceHolder" class = 'input-border-none' v-model="state.name" maxlength="20"/></div>
          </div>
        </template>
      </FormField>
    </div>
  </template>

  <template #footer-slot>
    <div class ='footer-wrapper'>
      <template v-if = "getComputePushAllowState === 'init' ">
        <button @click.stop = "onAllowPush"> 허용 </button>
        <button @click.stop = "onCloseModal"> 닫기 </button>
      </template>
      <template v-else-if = "getComputePushAllowState === 'ing'">
        <button @click.stop = "onAllowPush"> 진행중 </button>
      </template>
    </div>
  </template>
  </ModalUi>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, PropType, computed, ref } from 'vue'
import ModalUi from '@/components/ui/modal/Modal.vue';
import NotificationIcon from '@/components/icon/NotificationIcon.vue';
import FormField from '@/components/ui/form/FormField.vue';

interface IPushPopUpState {
  state: "init";
}

export default defineComponent({
  components: {
    ModalUi,
    NotificationIcon,
    FormField,
  },
  emits: ["onAllow:push", "closeAction"],
  props: {
    pushAllowState: {
      type: Object as PropType<IPushPopUpState>,
      default: () => {
        return {
          state: "init",
        } as IPushPopUpState
      } 
    },
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const state = reactive({
      isMounted: false,
      name: "",
    })
    const modalEl = ref<InstanceType<typeof ModalUi>>();
    const getComputePushAllowState = computed(() => props.pushAllowState.state);

    const computedNamePlaceHolder = computed(() => {
      return state.name.length < 1 ? "필수 값입니다" : "";
    });

    const onCloseAction =  () => {
      setTimeout(() => {
        context.emit('closeAction');
      }, 200);
    }

    const onAllowPush = () => {
      if (state.name && state.name.trim().length >0) {
        context.emit('onAllow:push', state.name);
      }
    }

    const onCloseModal = () => {
      modalEl.value?.onCloseAction();
      setTimeout(() => {
        context.emit('closeAction');
      }, 200);
     
    }

    onMounted(() => {
      state.isMounted = true;
    })

    return {
      state,
      onCloseAction,
      onAllowPush,
      onCloseModal,
      getComputePushAllowState,
      computedNamePlaceHolder,
      modalEl
    }
  },
})
</script>
<style lang="scss" scoped>
  .pushpopup-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    fill:white;
  }
  .mb-0 {
    margin-bottom: 0px;
    margin-right: 1rem;
  }
</style>
