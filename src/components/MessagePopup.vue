<template>
  <ModalUi 
  :isShow = "state.isShow"
  :useHeader = "true"
  :useFooter = "true"
  @closeAction = "onCloseAction"
  class = "messageModal" 
  width = "80%"
  ref = "modalEl"
  v-if = "state.isMounted">
  <template #header-slot>
    <div class = "pushpopup-header"> <NotificationIcon /> 
      <div class = ""> 메세지 보내기 </div>
    </div>
  </template>
  <template #body-slot>
    <div style="padding:2rem" class="bg-[#6200b3]">
      <FormField>
        <template #label-slot>
          대상
        </template>
        <template #field-slot>
          <div class = ''>
            <SelectDrop
              :items = "sendMessageUser"
              itemHeight="200"
              :useMultiSelect="false"
              :itemTopMargin = "5"
              :useBackArrow="true"
              class = 'relative modal-select'
              :itemClass="['itemClass']"
              @select:item = "onSelectedMessageUser"
            >
            </SelectDrop>
          </div>
        </template>
      </FormField>
      <FormField>
        <template #label-slot>
          메세지
        </template>
        <template #field-slot>
          <div class = 'input-wrapper mb-0 w-[100%]'>
            <div class ="input-icon" ><MessageIcon width="25" /></div>
            <div class ="input-tag"><input v-model="state.message" class = 'input-border-none' maxlength="20"/></div>
          </div>
        </template>
      </FormField>
    </div>
  </template>

  <template #footer-slot>
    <div class ='footer-wrapper'>
      <template v-if = "getComputePushAllowState === 'init' ">
        <button @click.stop = "onSendMessage"> 보내기 </button>
        <button @click.stop = "onCloseModal"> 닫기 </button>
      </template>
      <template v-else-if = "getComputePushAllowState === 'ing'">
        <button > 진행중 </button>
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
import SelectDrop from '@/components/ui/selectdrop/SelectDrop.vue';
import MessageIcon from '@/components/icon/MessageIcon.vue';
import apiNotification from '@/api/apiNotification';

interface IPushPopUpState {
  state: "init";
}

export default defineComponent({
  components: {
    ModalUi,
    NotificationIcon,
    FormField,
    SelectDrop,
    MessageIcon,
  },
  emits: ["onSend:message", "closeAction"],
  props: {
    pushAllowState: {
      type: Object as PropType<IPushPopUpState>,
      default: () => {
        return {
          state: "init",
        } as IPushPopUpState
      } 
    }
  },
  setup(props, context) {
    const state = reactive({
      isShow: true,
      isMounted: false,
      name: "",
      selectedUser: null,
      message: "",
    })
    const modalEl = ref<InstanceType<typeof ModalUi>>();
    const getComputePushAllowState = computed(() => props.pushAllowState.state);
    const { getSendMessageUserApi } = apiNotification();

    const computedNamePlaceHolder = computed(() => {
      return state.name.length < 1 ? "필수 값입니다" : "";
    });

    const onCloseAction =  () => {
      setTimeout(() => {
        context.emit('closeAction');
      }, 200);
    }

    const sendMessageUser = ref([]);

    const onSendMessage = () => {
      if (state.selectedUser && state.message.trim() !== "") {
        // 보내야지
        context.emit('onSend:message', {
          id: state.selectedUser[0].id,
          message: state.message.trim()
        })
      }
    }

    const onCloseModal = () => {
      modalEl.value?.onCloseAction();
      setTimeout(() => {
        context.emit('closeAction');
      }, 200);
    }

    const getMesasgeUser = async () => {
      const result: any = await getSendMessageUserApi();
      const data = await result.json();
      
      if (data && data.msg && data.msg.length > 0) {
        data.msg.map((msg: any) => {
          sendMessageUser.value.push({
            id: msg.user_id,
            value: msg.user_id,
            label: msg.user_name,
            selected: false,
          });
          // console.log(sendMessageUser);
        })
      }
    }

    const onSelectedMessageUser = (selectedUser: any) => {
      state.selectedUser = selectedUser;
    }

    onMounted(async () => {
      state.isMounted = true;
      getMesasgeUser();
    })

    return {
      state,
      onCloseAction,
      onSendMessage,
      onCloseModal,
      getComputePushAllowState,
      computedNamePlaceHolder,
      sendMessageUser,
      onSelectedMessageUser,
      modalEl
    }
  },
})
</script>
<style lang="scss">
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

  .messageModal  {
    user-select: none;

    .form-field-wrapper {
      margin-bottom: 1rem;
    }


    .form-textarea {
      width:100%;
      border:0px;
      background-color: #e2e2e2;
    }
    

    .toggle-container {
      .toggle-header-wrapper {
        background-color: #480083;
        padding:15px;
        border-radius: 5px;
      }
      .inner-select-wrapper {
        padding:10px 25px 0px 25px;
      }
    }

    .panel-header-wrapper {
      padding:0px;
      background: #260052;
      color:#fff;
      // height:50px;

      .panel-ui-title {
        font-size: 1em;
        padding-left: 15px;
        display: flex;
        align-items: center;
        svg {
          fill: white;
        }
      }
    }

    .region-row {
      display: flex;
      width: 100%;
      color:#fff;
      background: #6200b3;
      padding:0.5rem;

      .region-center {
        flex:2;
        padding:5px;
      }

      header {
        padding: 10px;
        // border-bottom: 3px solid #480083;
        .desc {
          display: flex;
          font-size:10px;
          opacity: 1;
          color:#fff;
          opacity: 0.8;
          align-items: center;
          height:20px;
        }
      }

      .region-body {
        div {
          padding: 15px 0px;
          background-color: transparent;
          text-indent: 20px;
          cursor: pointer;
          transition: 0.2s;
          border-radius: 5px;

          &.selected, &:hover {
            background-color: #480083;
          }

          &:active {
            background-color: #480083;
          }
        }
      }

      .region-left {
        flex:1;
        padding:5px;
      }
    }   

    .panel-footer-wrapper {
      display: flex;
      flex:1;
      align-items: center;
      justify-content: center;
      color:#fff;
      width:100%;      
      button {
        width:100%;
        height:50px;
        // @apply rounded-b-[5px];
        transition: 0.2s;

        &:first-child {
          border-bottom-left-radius: 5px;
        }

        &:last-child {
          border-bottom-right-radius: 5px;
        }

        &:hover {
          background-color: #8c00ff;
        }
      }
    }
  }

  .itemClass {
    background-color: #260052;
    min-height: 2.5rem;
    color:#fff;  
    display: flex;  
    align-items: center;
    text-indent: 0.5rem;
    transition: 0.2s;
    font-size: 0.85rem;   
    justify-content: center;
    line-height: 0.85rem;

    &:hover, &.selected, &.active {
      background-color: #8c00ff;
    }
  }
  .modal-select {
    background-color: #8c00ff;
    display: flex;
    align-items: center;
    justify-content: center;

    .select-label {
      font-size:0.9rem !important;
    }

    .select-icon {
      svg {
        fill: white;
      }
    }
  }
</style>
