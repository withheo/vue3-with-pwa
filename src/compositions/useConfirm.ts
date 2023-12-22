import { EEventList } from "@/enums";
import { nextTick, ref } from "vue";
import useCustomEvent from '@/compositions/useCustomEvent';
const { disPatchEvent } = useCustomEvent();

interface IUseConfirmOpts {
  desp?: string | null,
  evt?: {
    beforeOkClick?: Function | null,
    okClick?: Function | null,
    cancelClick?: Function | null,
  }
}

const useConfirm = () => {
  const showConfirmMessage = (message: string, opts: IUseConfirmOpts) => {
    const confirmMessage = ref({
      message: message,
      desp: opts?.desp ?? '',
    });
  
    const btns = ref([
      {
        type: 'ok',
        text: 'YES',
        onclickCloseAction: false,
        onClickAction: async () => {         
          if (opts.evt?.beforeOkClick instanceof Function) {
            const canCloseConfirm: any = await opts.evt.beforeOkClick(); 
            if (canCloseConfirm === true) {
              setTimeout(() => {
                disPatchEvent(EEventList.CloseAllPopup, {});
              })
            }         
          }  
          
          if (opts.evt?.okClick instanceof Function) {
            opts.evt.okClick(); 
          }
         
          confirmMessage.value = null;
        }
      },
      {
        type: '',
        text: 'NO',
        onclickCloseAction: true,
        onClickAction: () => {
          if (opts.evt?.cancelClick instanceof Function) {
            opts.evt?.cancelClick();
          }
         
          confirmMessage.value = null;
        }
      }
    ]);
  
    nextTick(() => {
      disPatchEvent(EEventList.ConfirmMessage, {
        msg: '삭제를 진행중입니다.',
        class: 'delete-process',
        confirmMessageRef: confirmMessage,
        btns: btns
      });
    });

    return {
      message,
      opts,
      btns,
    }
  };

  return {
    showConfirmMessage
  }
}

export default useConfirm;