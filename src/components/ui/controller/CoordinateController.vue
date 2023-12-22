<template>
  <div class = 'coordinate-continaer'>
    <div class = 'coordinate-row'
      v-for = "coordinateRowData in coordinateDatas"
      :key ="getRandomKey(coordinateRowData)">
      <div class = 'coordinate-col'
        v-for = "cols in coordinateRowData"
        :key = "cols"
        @click.stop.prevent = "onCoordinateClick($event, cols)"
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import { ECoodianateOpts } from '@/enums/ui';
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CoordinateControlUi',
  emits: ['itemSelect'],
  props: {
    selected: {
      type: Number,
      default: -1,
    }
  },
  setup(props, context) {

    const coordinateDatas: ECoodianateOpts[][] = [
      [ECoodianateOpts.TopLeft, ECoodianateOpts.TopCenter, ECoodianateOpts.TopRight],
      [ECoodianateOpts.MiddleLeft, ECoodianateOpts.MiddleCenter, ECoodianateOpts.MiddleRight],
      [ECoodianateOpts.BottomLeft, ECoodianateOpts.BottomCenter, ECoodianateOpts.BottomRight],
    ];

    const getRandomKey = (): number => {
      return Math.floor(Math.random() * 1000000) + 1;
    }

    const onCoordinateClick = (e: MouseEvent, colName: string) => {
      context.emit('itemSelect', colName);
    }

    return {
      getRandomKey,
      coordinateDatas,
      onCoordinateClick,
    }
    
  },
})
</script>
<style lang="scss" scoped>
  .coordinate-continaer {
    // width: 300px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    // padding:10px;
  }

  .coordinate-row {
    flex: 1;
    //height:20px;
   // width:80px;
    // background: #e2e2e2;
    display: flex;
    flex-direction: row;
  }

  .coordinate-col {
    flex:1;
    margin:2px;
    // background: #e2e2e2;
    height:20px;
    width:20px;
    box-sizing: border-box;
    border: 1px solid #e2e2e2;
    transition: background 0.2s ease;
    opacity: 0.5;
    cursor: pointer;

    &:hover {
      opacity: 1;
      border:1px solid transparent;
      @apply bg-over;
      // background: $base-over-color;
      cursor: pointer;
    }
  }
</style>
