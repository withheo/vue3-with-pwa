<template>
  <div class = 'splitter-wrapper' :class = "getWrapperElClass" 
     :style  = 'splitterStyle'
     @mouseover.stop.prevent="onSplitterMouseOver"
     @mouseleave.stop.prevent="onSplitterMouseLeave"
     ref = "wrapperEl">
    <slot name = 'toggle-slot'>
      
    </slot> 
    <div class = 'splitter' ref = "splitterEl"></div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, SetupContext } from 'vue'
import { ESplitterDirection, ESplitterPosition } from '@/enums/ui';
import useDragable from '@/compositions/useDrag';

export default defineComponent({
  name: 'FlexSplitterUi',
  emit: ['callback:move','callback:up'],
  components: {
    // toggleIcon
  },
  props: {
    position: {
      type: String as PropType<ESplitterPosition>,
      required: true,
    },
    direction: {
      type: String as PropType<ESplitterDirection>,
      required: true,
    },
    el: {
      type: Object as PropType<HTMLElement>,
      required: true,      
    }, 
    splitterWidth: {
      type: Number,
      default: 10,
    },
    splitterBackgroundColor: {
      type: String,
      default: 'transparent'
    },
    spliterOverWidth: {
      type: Number,
      default: 2,
    },
    hoverColor: {
      type: String,
      default : '#000',
    },
    minSize: {
      type: Number,
      default: 0,
    },
    splitterPosition: {
      type: String,
      default: 'end'
    }
  },
  setup(props, { emit }: SetupContext) {

    const wrapperEl = ref<HTMLElement>();
    const splitterEl = ref<HTMLElement>();

    const state = reactive({
      elInitPosition: 0,
      isActive: false,
    });

    const { initDragableEl, mouseDownPosition, mouseMovePosition } = useDragable();

    const getWrapperElClass = computed(() => {
      return [props.position, props.direction];
    });

    const getSpliiterPosition = () => {
      if (props.splitterPosition === 'center') {
        return `-${props.splitterWidth / 2}px`;
      }

      return `-${props.splitterWidth}px`;
    }

    const splitterStyle = computed(() => {
      if (props.direction === ESplitterDirection.Vertical){
        return {
          'width' : `${props.splitterWidth}px`,
          'right' : getSpliiterPosition(),
          'backgroundColor': `${props.splitterBackgroundColor}`,
        }
      } else {
        return {
          'height' : `${props.splitterWidth}px`,
          'top' : getSpliiterPosition(),
          'backgroundColor': `${props.splitterBackgroundColor}`,
        }
      }
    })

    const rememberTargetWidth = () => {
      const targetElRect = props.el.getBoundingClientRect();
      state.elInitPosition = props.direction === ESplitterDirection.Vertical ? targetElRect.width : targetElRect.height;
    }

    const onSplitterMouseOver = () => {
      splitterEl.value.style.backgroundColor = `${props.hoverColor}`;
    }

    const onSplitterMouseLeave = () => {
      if (state.isActive === false)
      splitterEl.value.style.backgroundColor = 'transparent';
    }

    const getMovePositionX = (): number => {
      const movedX = mouseMovePosition.pageX - mouseDownPosition.pageX;
      return  state.elInitPosition + movedX;
    }

    const getMovePositionY = (): number => {
      const movedY = mouseMovePosition.pageY - mouseDownPosition.pageY;
      return state.elInitPosition - movedY;
    }

    const onMoveCallback = () => {
      let newPosition = 0;
      if (props.direction === ESplitterDirection.Vertical) {
        newPosition = getMovePositionX();
      } else {
        newPosition = getMovePositionY();
      }

      rePaintTarget(newPosition);
      emit('callback:move', newPosition);
    }

    const onBeforeMove = () => {
      state.isActive = true;
    }

    const rePaintTarget = (position?: number) => {
      let newPosition = position ?? state.elInitPosition;
      const el = props.el as HTMLDivElement;

      if (newPosition <= 0 ) {
        el.classList.add('overflow-hidden');
      } else {
        el.classList.remove('overflow-hidden');
      }

      newPosition = newPosition <= 0 ? 0 : newPosition;

      if (props.direction === ESplitterDirection.Vertical) {
        el.style.width = `${newPosition}px`;
      } else {
        el.style.height = `${newPosition}px`;
      }
    }

    const onDownCallback = () => {
      onSplitterMouseOver();
      rememberTargetWidth();
    }

    const onUpCallback = () => {
      state.isActive = false;      
      onSplitterMouseLeave();
      emit('callback:up');
    }

    onMounted(() => {
      rememberTargetWidth();
      const el = props.el as HTMLDivElement;
      const styleType = props.direction === ESplitterDirection.Vertical ? 'width' : 'height';
      const minStyleType = props.direction === ESplitterDirection.Vertical ? 'minWidth' : 'minHeight';
      splitterEl.value.style[styleType as any] = `${props.spliterOverWidth}px`;
      if (props.minSize > 0 && el) {
        el.style[minStyleType] = `${props.minSize}px`;
      }

      initDragableEl({
        el: wrapperEl.value,
        diffDownTime: 150,
        beforeDownEvt: onBeforeMove,
        moveCallback: onMoveCallback,
        downCallback: onDownCallback,
        upCallback: onUpCallback,
        showScreenTransparentBox: true,
      });
    })    

    return {
      getWrapperElClass,
      splitterEl,
      wrapperEl,
      splitterStyle,
      onSplitterMouseOver,
      onSplitterMouseLeave,
      onBeforeMove,
    }
  },
})
</script>
<style lang="scss" scoped>

$spliiter-base-border-color: transparent;
$spliiter-base-border-hover-color: #5A4CDB;

.splitter-wrapper {
  display: flex;
  position: absolute;
  z-index: 1;
  justify-content: center;
  align-items: center;

  &.right {
    right:0;   
  }

  &.left {
    left: 0;   
  }

  &.top {
    top: 0;
  }

  &.bottom {
    bottom: 0;
  }

  &.vertical {
    cursor: ew-resize;
    height: 100%;
    .splitter {
      height: 100%;
    }
  }

  &.horizon {
    cursor: ns-resize;
    width: 100%;
    .splitter {
      width: 100%;
    }
  }

  .splitter {  
    transition: 0.2s;
  }
}

</style>