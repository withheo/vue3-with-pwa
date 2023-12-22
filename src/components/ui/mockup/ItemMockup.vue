<template>
  <div class ='item-mockup-wrapper'>
    <div class = 'p-3 bg-slate-100 rounded-md opacity-50'></div>
    <div class = 'mt-3 flex-1 bg-slate-100 rounded-md opacity-60'> </div>
    <div class = 'flex opacity-50 mt-3 mb-3'>
      <div class = 'rounded-md p-2 w-10 bg-slate-100'> </div>
      <div class = 'ml-3 rounded-md p-2 flex-1 bg-slate-100'> </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    
  },
})
</script>
<style lang="scss" scoped>
  .item-mockup-wrapper {
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
  }
</style>
