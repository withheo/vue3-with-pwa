<template>
  <div class = 'h-full w-full flex justify-center items-center'>
    <div class = 'w-[80%] flex justify-center items-center flex-col'> 
      Record Page
      <div>
        <canvas ref = 'recordVisualizer' width = "100" height = "100"/>
      </div>
      <div class = "flex w-100%">
        <div class ='btn-medium' :class = "{'load' : state.isRecord === true}" @click.stop="onRecord"> Record </div>
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
import { defineComponent, onMounted, reactive, ref } from 'vue';
const Recorder = require('./lib/recorder');

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

export default defineComponent({
  name: 'RecordAudioPageUi',
  setup() {
    const recordVisualizer = ref<HTMLCanvasElement>();
    const recordAudio = ref<HTMLAudioElement>();

    const constraints = { audio: true };
    let AudioContext = window.AudioContext || window.webkitAudioContext;
  

    const state = reactive({
      isRecord: false,
      ctx: null,
      input : null,
      rec: null,
      gumStream: null
    })


    const onRecord = () => {
      if (state.isRecord === true) return;
      state.isRecord = true;
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        state.gumStream = stream;
        state.ctx = new AudioContext({sampleRate: 16000});
        state.input = state.ctx.createMediaStreamSource(stream);
        state.rec = new Recorder(state.input, {numChannels: 1})
        state.rec.record();
        
        console.log("Recording started");
      });
    }

    const onStop = () => {
      if (state.isRecord === false) return;
      state.isRecord = false;
      state.rec.stop(); //stop microphone access
      state.gumStream.getAudioTracks()[0].stop();
      state.rec.exportWAV(craeteDownloadLink);
    }

    const craeteDownloadLink = (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      recordAudio.value.src = url;
    }

    onMounted(()=> {
    
      console.log(Recorder);     
    })

    return {
      recordVisualizer,
      recordAudio,
      state,
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

    &.load {
      background: red;
    }
  }
</style>
