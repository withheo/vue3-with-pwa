<template>
   <div class = 'absolute p-5  w-[100%] h-[100%]'>               
      <div class ='h-[100%] relative flex flex-col rounded-t-xl  opacity-70 top-0'>
        <div class = 'absolute w-[100%] h-[100%] bg-slate-400 flex rounded-xl opacity-10  c-b'>
        </div>
        <div class = 'rounded-t-xl h-[50px] bg-[#333] flex items-center'>
          <div class = 'rounded-md m-3 w-[30px] bg-[#999] h-[30px]'>&nbsp;</div>
          <div class = 'flex-1'></div>
          <div class = 'justify-end items-center mr-3 flex'>           
            <div class = 'rounded-[5px] bg-[#666] w-[200px] h-[10px] mr-10'></div>         
            <div class = 'rounded-[50%] bg-[#999] w-[20px] h-[20px] ml-3'></div>
            <div class = 'rounded-[50%] bg-[#999] w-[20px] h-[20px] ml-3'></div>
            <div class = 'rounded-[50%] bg-[#999] w-[20px] h-[20px] ml-3'></div>
          </div>
        </div>
        <div class =' bg-[#444] flex flex-1'>
          <div class = 'flex flex-col'>
            <div class ='rounded-lg w-[100px] h-[100px] bg-[#999] m-4'>&nbsp;</div>
            <div class ='rounded-md w-[100px] h-[10px] bg-[#666] ml-4'> </div>
            <div class ='rounded-md w-[50px] h-[10px] bg-[#666] m-4'> </div>
          </div>
          <div class = 'flex m-4'>
            <div class ='rounded-lg w-[100%] bg-[#666]'>&nbsp; </div>
          </div>
          <div class = 'flex m-4 flex-1 mr-5 relative'>
            <div class ='rounded-lg w-[100%] h-[100%] bg-[#666] flex-1 absolute opacity-10'></div>
            <div class ='rounded-lg w-[100%] bg-[#666] flex-1'>                      
            </div>
          </div>
        </div>
        <div class ='justify-center rounded-b-xl bg-[#444] h-[50px] flex items-center'>
          <div class = 'w-[30%] h-[10px] rounded-md bg-[#666]'></div>
        </div>
      </div>
  </div>    
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BrowserMockupUi',
  setup() {
    
    return {

    }
  },
})
</script>
<style lang="scss" scoped>

</style>
