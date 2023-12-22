<template>
  <div class = 'closeBtn-button-wrapper' :style = "Style">
    <span class ='close-line' :style= "lineStyle"/>
    <span class ='close-line2' :style= "lineStyle"/>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name:'CloseBtnIcon',
  props: {
    width: {
      type: Number,
      default: 45,
    },
    height: {
      type: Number,
      default: 45,
    },
    lineColor: {
      type: String,
      default: '#fff',
    }
  },
  setup(props) {
    const Style = computed(() => {
      return {
        'width': `${props.width}px`,
        'height': `${props.height}px`
      }
    });
    
    const lineStyle = computed(() => {
      return {
        'backgroundColor': `${props.lineColor}`,
      }
    })

    return {
      Style,
      lineStyle
    }
  },
})
</script>
<style lang="scss" scoped>  
  .close-line, .close-line2 {
    @apply w-[14px] h-[2px] transition-all duration-200 origin-[50%_50%] absolute;

    // width:14px;
    // height:2px;
    // background-color: #fff;
    // transition: all 0.2s;
    // transform-origin: 50% 50%;
    // position: absolute;
  }

  .closeBtn-button-wrapper {   
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    // opacity: 0.8;
    &:hover {
      // opacity: 1;
      .close-line {
        transform: rotate(45deg);
      }

      .close-line2 {
        transform: rotate(-45deg);
      }
    }
  }
</style>
