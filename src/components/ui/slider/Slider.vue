<template>
  <div class = 'slider-ui-wrapper' :style="{ width: state.sliderWidth + 'px' }" @click.stop="onClickSliderWrapper($event)">
    <div
      v-for="(handle, index) in handles"
      :key="index"
      class="slider-handle"
      :style="{ left: handle.left + 'px', width: handle.width + 'px', height: handle.height + 'px' }"
      @mousedown="handleMouseDown(index, $event)"
      @click.passive="handleClick"
    ></div>
    <div class="slider-bar left-bar" :style="{ width: handles[0].left + 'px', background: '#4a5791'}" v-if="handles.length === 1"></div>
    <div class="slider-bar left-bar" :style="{ width: handles[0].left + 'px' }" v-else></div>
    <div
      v-for="(handle, index) in handles.slice(1)"
      :key="index"
      class="slider-bar center-bar"
      :style="{ left: handles[index].left + 'px', width: (handles[index + 1].left - handles[index].left) + 'px' }"
    ></div>
    <div class="slider-bar right-bar" :style="{ left: handles[handles.length - 1].left + 'px' , width: (state.sliderWidth -  handles[handles.length - 1].left) + 'px'}"></div>
  </div>
  
 
</template>, toHandlers
<script lang="ts">
/**
 * input slider 와 유사하지만 1개가 아닌 여러개 값을 선택 조정 할 수 있는 
 * 컴포넌트를 만들어보자.
 * 참고 형태 > wevideo.com crop 기능의 slider 처럼
 * 1. width, height를 조절 할 수 있다. (css 로 하자.)
 * 2. handle 갯수를 만들수 있게 한다.
 *    1~5개 사이로 제한한다. 기본값은 1개로 하자.
 * 3. 전체 길이에서 클릭시 handle에서 가장 가까운 handle이 움직인다.
 * 4. handle click move시 마우스 포인터이동만큼 움직일 수 있다.
 */
import { defineComponent, inject, onMounted, reactive, ref, watch } from 'vue'

export default defineComponent({
  name: 'SliderUi',
  props: {
    handles: {
      type: Array,
      default: []
    },
    sliderWidth: {
      type: Number,
      default: 0
    },
    isLimitedHandle: {
      type:Boolean,
      default : false
    }
  },
  setup(props, context) {
    const state = reactive({
      sliderWidth: props.sliderWidth
    })

    const handles = ref(props.handles as any);
    const handleMouseDown = (index: number, event:MouseEvent) => {
      const handle = handles.value[index];
      const startX = event.clientX;
      const handleLeft = handle.left;
      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        let newLeft = handleLeft + deltaX;

        if(props.isLimitedHandle && handles.value.length > 1) {
          if (index === 1) {
            newLeft = Math.max(newLeft, handles.value[0].left);
          } else if (index === 0) {
            newLeft = Math.min(newLeft, handles.value[1].left);
          }
        }

        handle.left = Math.max(0, Math.min(newLeft, state.sliderWidth));
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    const onClickSliderWrapper = (event: MouseEvent) => {
      const sliderRect = document.querySelector('.slider-ui-wrapper')?.getBoundingClientRect();
      const clickX = event.clientX - sliderRect.left;
      let closestIndex = 0;
      let closestDistance = Math.abs(handles.value[0].left - clickX);
      
      if(handles.value.length > 1) {
        for (let i = 1; i < handles.value.length; i++) {
          const distance = Math.abs(handles.value[i].left - clickX);
          if (distance < closestDistance) {
            closestIndex = i;
            closestDistance = distance;
          }
        }
      }

      handles.value[closestIndex].left = clickX;
    };

    const handleClick = (event: MouseEvent) => {
      event.stopPropagation();
    };

    onMounted(() => {
      console.log(props.handles)
      watch(
        () => props.sliderWidth,
        () => {
          state.sliderWidth = props.sliderWidth
        }
      )
    })


    return {
      handles,
      state,
      handleMouseDown,
      onClickSliderWrapper,
      handleClick
    }
  },
})
</script>
<style lang="scss">
  .slider-ui-wrapper {
    align-items: center;
    display: flex;
    height: 16px;
    position: relative;
    //background-color: #e2e2e2;

    .slider-bar {
      position: absolute;
      border-radius: 3px;
      height: 4px;
      background-color: #ffffff;
    }

    .left-bar {
      left:0;
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

  .slider-handle {
    position: absolute;
    background-color: #e2e2e2;
    border-radius: 50%;
    cursor: pointer;
    transform: translate(-50%, 0%);
  }

  body {
    user-select: none;
  }

</style>
