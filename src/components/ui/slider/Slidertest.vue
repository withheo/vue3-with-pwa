<template>
  <div class="slider-ui-wrapper" :style="{ width: sliderWidth + 'px' }" @click.stop="onClickSliderWrapper($event)" 
  ref="wrapperEl">
    <HandleUi v-for="(handle, index) in state.handles" :key="index" class="slider-handle" @click.passive="handleClick"  @mousedown="onMouseDownHandle"
      :index="index"
      :handles="state.handles"
      :isLimitedHandle = props.isLimitedHandle
      :useMouseClickStyle = props.useMouseClickStyle
      :useFigures = props.useFigures
      :sliderWidth = "state.sliderWidth"
      @change:Left = "changeLeftPosition"
      @mouseUpEvt = "handleMouseUp"
    ></HandleUi>
    <div class="slider-bar left-bar" :style="getLeftBarStyle()"></div>
    <div v-for="(handle, index) in state.handles.slice(1)" :key="index" class="slider-bar center-bar" :style="getCenterStyle(index)"></div>
    <div class="slider-bar right-bar" :style="getRightBarStyle()"></div>
  </div>

</template>

<script lang="ts">
import useDragable from '@/compositions/useDrag';
import HandleUi from '@/components/ui/handle/Handle.vue'
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';

export default defineComponent({
  emits: ['change:handle','clicked:handle', 'onMouseDown:handle', 'onMouseDown:Wrapper', 'onMouseUp:Wrapper'],
  name: 'SliderUi',
  props: {
    handles: {
      type: Array,
      default: [],
    },
    useMouseClickStyle: {
      type: Boolean,
      default: false,
    },
    sliderWidth: {
      type: Number,
      default: 0,
    },
    isLimitedHandle: {
      type: Boolean,
      default: false,
    },
    useFigures: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0
    },
    id: {
      type: Number,
      default: 0
    }
  },
  components: {
    HandleUi
  },

  setup(props, context) {
    const wrapperEl = ref<HTMLDivElement>();
    const handleEl = ref<HTMLElement>();
    const { initDragableEl, mouseDownPosition, mouseMovePosition } = useDragable();
    const state = reactive({
      handles: ref(props.handles as any),
      clickedHandleIndex: -1,
      sliderWidth: props.sliderWidth,
      useStyle: false,
      leftHandleLeft: 0,
      rightHandleLeft: 0,
      rightHandleWidth: 0,
      isDownHandle: false,
    });

    const copiedHandle = [...state.handles];

    const onClickSliderWrapper = (event: MouseEvent) => {
      context.emit('clicked:handle', true, props.id)
      const sliderRect = wrapperEl?.value.getBoundingClientRect();
      const clickX = event.clientX - sliderRect.left;
      let closestIndex = 0;
      let closestDistance = Math.abs(state.handles[0].left - clickX);

      if (state.handles.length > 1) {
        for (let i = 1; i < state.handles.length; i++) {
          const distance = Math.abs(state.handles[i].left - clickX);
          if (distance < closestDistance) {
            closestIndex = i;
            closestDistance = distance;
          }
        }
      }

      context.emit('change:handle', closestIndex, clickX / state.sliderWidth * props.total);
      state.handles.map((handle: any, i: number) => (handle.ratio = getHandlePositinPercent(state.handles[i].left) * 0.01));
    };

    const handleClick = (event: MouseEvent) => {
      event.stopPropagation();
    };

    const getHandlePositinPercent = (left: number) => Math.round((left / state.sliderWidth) * 100);

    const getLeftBarStyle = () => ({
      width: state.handles.length === 1 ? state.handles[0].left + 'px' : state.leftHandleLeft + 'px',
      background: state.handles.length === 1 ? '#4a5791' :  '#e2e2e2',
    });

    const getCenterStyle = (index: number) => ({
      left: copiedHandle[index].left + 'px',
      width: copiedHandle[index + 1].left - copiedHandle[index].left + 'px',
    });

    const getRightBarStyle = () => ({
      left: state.rightHandleLeft + 'px',
      width: state.rightHandleWidth + 'px',
    });

    const changeLeftPosition = (index: number, newLeft: number) => {
      context.emit('clicked:handle', true, props.id);
      context.emit('change:handle', index, newLeft / state.sliderWidth * props.total);
    }

    const handleMouseUp = () => {
      context.emit('clicked:handle', false)
      state.handles.map((handle: any, i: number) => (handle.ratio = getHandlePositinPercent(state.handles[i].left) * 0.01));
    };

    const onMouseDownHandle = () => {
      state.isDownHandle = true;
      context.emit('onMouseDown:handle');
    }

    const onDownCallback = () => {
      state.isDownHandle = false;
      context.emit('onMouseDown:Wrapper');
    }

    const onUpCallback = () => {
      if(!state.isDownHandle) {
        const sliderRect = wrapperEl?.value.getBoundingClientRect();
        const clickX = mouseDownPosition.pageX - sliderRect.left;
        let closestIndex = 0;
        let closestDistance = Math.abs(state.handles[0].left - clickX);

        if (state.handles.length > 1) {
          for (let i = 1; i < state.handles.length; i++) {
            const distance = Math.abs(state.handles[i].left - clickX);
            if (distance < closestDistance) {
              closestIndex = i;
              closestDistance = distance;
            }
          }
        }

        context.emit('onMouseUp:Wrapper', props.id, closestIndex, clickX / state.sliderWidth * props.total);

        state.handles.map((handle: any, i: number) => (handle.ratio = getHandlePositinPercent(state.handles[i].left) * 0.01));
      }
    }

    onMounted(() => {
      initDragableEl({
        el: wrapperEl.value,
        diffDownTime: 150,
        downCallback: onDownCallback,
        upCallback: onUpCallback,
        showScreenTransparentBox: true,
      });
      state.handles.map((handle: any, i: number) => {
        handle.ratio = 0;
        handle.left = 0;
      });
      
      if(state.handles.length > 0) {
        state.rightHandleLeft = state.handles[state.handles.length - 1].left;
        state.rightHandleWidth = state.sliderWidth - state.rightHandleLeft;
        state.leftHandleLeft = state.handles[0].left;
      }
      
      watch(
        () => state.handles,
        () => {
          if(props.total > 0 && state.handles.length > 0) {
            state.handles.map((handle: any, i: number) => {
              handle.ratio = handle.value / props.total;
              handle.left = state.sliderWidth * handle.ratio;
           });
            copiedHandle.sort((a: any, b: any) => a.left - b.left);
            const newLeft = state.handles.find((handle: any) => handle.left === copiedHandle[copiedHandle.length-1].left);
            state.leftHandleLeft = copiedHandle[0].left
            state.rightHandleLeft = newLeft.left;
            state.rightHandleWidth = (props.sliderWidth - newLeft.left);
          }
          
        },
        { deep: true }
      );

      watch(
        [() => props.sliderWidth],
        () => {
          if(props.total > 0 && state.handles.length > 0) {
            state.sliderWidth = props.sliderWidth;
            state.rightHandleWidth = state.sliderWidth - state.handles[state.handles.length - 1].left;
            state.handles.map((handle: any, i: number) => (handle.ratio = getHandlePositinPercent(state.handles[i].left) * 0.01));
          }
          
        }
      );

      watch(
        () => props.total,
        () => {
          if(props.total > 0 && state.handles.length > 0) {
            state.handles.map((handle: any, i: number) => {
              handle.ratio = handle.value / props.total;
              handle.left = state.sliderWidth * handle.ratio;
            });
          }
        }
      )
    });

    return {
      state,
      props,
      wrapperEl,
      handleEl,
      changeLeftPosition,
      handleMouseUp,
      getHandlePositinPercent,
      onClickSliderWrapper,
      handleClick,
      getLeftBarStyle,
      getCenterStyle,
      getRightBarStyle,
      onMouseDownHandle
    };
  },
});
</script>

<style lang="scss">
.slider-ui-wrapper {
  align-items: center;
  display: flex;
  height: 16px;
  position: relative;

  .slider-bar {
    position: absolute;
    border-radius: 3px;
    height: 4px;
    background-color: #ffffff;
  }

  .left-bar {
    left: 0;
  }

  .center-bar {
    background-color: #4a5791;
  }
}

.range_container {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 35% auto;
}

body {
  user-select: none;
}
</style>
