<template>
  <div class = 'h-full w-full flex justify-center items-center'>
    <div class = 'w-[80%] flex justify-center items-center flex-col'> 
      Record Page
      <div>
        <canvas ref = 'recordVisualizer' width = "100" height = "100"/>
      </div>
      <div class = "flex w-100%">
        <div class ='btn-medium' @click.stop="onRecord"> Record </div>
        <div class ='btn-medium' @click.stop="onStop"> Stop </div>
      </div>
      <div class = 'record-clip'>  
        <audio ref = 'recordAudio' controls preload="auto"/>
        <div id="test"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'


export default defineComponent({
  name: 'RecordAudioPageUi',
  setup() {
    const recordVisualizer = ref<HTMLCanvasElement>();
    const recordAudio = ref<HTMLAudioElement>();

    const constraints = { audio: true };

    const onRecord = () => {
      
    }

    const onStop = () => {

    }
   

    onMounted(()=> {
      navigator.mediaDevices.getUserMedia(constraints);     
    })

    return {
      recordVisualizer,
      recordAudio,
      onRecord,
      onStop,
    }

  },
})
</script>
<style lang="scss" scoped>
  .btn-medium {
    padding : 1rem;
    background: #590089;
    border-radius: 0.6rem;
    margin: 1rem;
    cursor: pointer;
  }
</style>
