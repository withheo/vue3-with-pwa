<template>
  <div :style="getHandleStyle()" ref="HandleEl" class="slider-handle">
    <div class="slider-text" :style="getHandleTextStyles(index)" v-if="props.useFigures">
      {{ Math.round((state.handles[props.index].left / props.sliderWidth) * 100) }}
    </div>
  </div>
</template>

<script lang="ts">
import useDragable from '@/compositions/useDrag';
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';

export default defineComponent({
  emits: ['change:Left', 'mouseUpEvt'],
  name: 'HandleUi',
  props: {
    index: {
      type: Number,
      default: 0,
    },
    sliderWidth: {
      type: Number,
      default: 0,
    },
    handles: {
      type: Array,
      default: [],
    },
    isLimitedHandle: {
      type:Boolean,
      default: false
    },
    useMouseClickStyle: {
      type:Boolean,
      default: false
    },
    useFigures: {
      type:Boolean,
      default: false
    }
  },

  setup(props, context) {
    const HandleEl = ref<HTMLDivElement>();
    const { initDragableEl, mouseDownPosition, mouseMovePosition } = useDragable();
    const state = reactive({
      handles: props.handles as any,
      startLeft: 0,
      clickedHandleIndex: -1,
      useStyle: false,
    })

    const onDownCallback = () => {
      state.useStyle = props.useMouseClickStyle;
      state.startLeft = state.handles[props.index].left;
    }

    const getHandleStyle = () => ({
      left: state.handles[props.index].left + 'px',
      width: state.handles[props.index].width + 'px',
      height: state.handles[props.index].height + 'px',
      '--slider-handle-background': (props.index === state.clickedHandleIndex) && state.useStyle ? '#6200b3' : '#e2e2e2',
    });

    const getHandleTextStyles = (index: number) => ({
      width: state.handles[index].width + 'px',
      height: state.handles[index].height + 'px',
      '--slider-text-z-index': (props.index === state.clickedHandleIndex) && state.useStyle ? 999999999 : 0,
      '--slider-text-border': (props.index === state.clickedHandleIndex) && state.useStyle ? '2px solid #6200b3' : '1px solid',
    });

    const onMoveCallback = () => {
      const deltaX = mouseMovePosition.pageX- mouseDownPosition.pageX;
      let newLeft = state.startLeft + deltaX;

      if (props.isLimitedHandle && state.handles.length > 1) {
        for (let i = 0; i < state.handles.length; i++) {
          if (i === props.index && i !== state.handles.length - 1) {
            newLeft = Math.min(newLeft, state.handles[props.index + 1].left);
          } else if (props.index === i + 1) {
            newLeft = Math.max(newLeft, state.handles[i].left);
          }
        }
      }

      context.emit('change:Left', props.index, newLeft);
    }

    const onUpCallback = () => {
      state.useStyle = false;
      context.emit('mouseUpEvt')
    }

    onMounted(() => {
      state.clickedHandleIndex = props.index;
      state.handles = props.handles;
      initDragableEl({
        el: HandleEl.value,
        diffDownTime: 150,
        downCallback: onDownCallback,
        moveCallback: onMoveCallback,
        upCallback: onUpCallback,
        showScreenTransparentBox: true,
      });

      watch(
        () => props.handles,
        () => {
          state.handles = props.handles
        },
        {deep: true}
      )
    });

    return {
      state,
      props,
      HandleEl,
      getHandleStyle,
      getHandleTextStyles
    };
  },
});
</script>

<style lang="scss">
body {
  user-select: none;
}

.slider-handle {
  display: flex;
  justify-content: center;
  align-items:flex-start;
  position: absolute;
  background: var(--slider-handle-background, #e2e2e2);
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, 0%);
  z-index: var(--slider-handle-z-index, 1);
}

.slider-text {
  font-size: 15px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 14px;
  border: var(--slider-text-border, 1px solid);
  background: #15002e;
  z-index: var(--slider-text-z-index, 0);
}
</style>
