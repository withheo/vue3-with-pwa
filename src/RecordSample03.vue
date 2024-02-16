<template>
  <div class = 'h-full w-full flex justify-center items-center'>
    <div class = 'w-[80%] flex justify-center items-center flex-col'> 
      Record Page 
      (기본 MediaRecorder API 이용)
      <br>useAudioWorklet : {{  state.useAudioWorklet }}
      <div>
        <canvas ref = 'recordVisualizer' width = "100" height = "100"/>
      </div>
      <div class = "flex w-100%">
        <div class ='btn-medium' :class = "{'load' : state.isRecord === true}" @click.stop="onRecord"> Record </div>
        <div class ='btn-medium' @click.stop="onStop"> Stop </div>
      </div>
      <div class = 'record-clip'>  
        <audio ref = 'recordAudio' controls preload="auto"></audio>
        <div id="test"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

export default defineComponent({
  name: 'RecordAudioWPageUi',
  setup() {
    const recordVisualizer = ref<HTMLCanvasElement>();
    const recordAudio = ref<HTMLAudioElement>();   
    //const Waveform = require('./lib/recorder/waveform');
    //const VUMeter = require('./lib/recorder/vumeter');    
    const state = reactive({
      isRecord: false,
      ctx: null,
      input : null,
      gumStream: null,
      audioContext: null,
      processorPort: null,
      useAudioWorklet: false,
      mediaRecorder: null,
      blobs: []
    })

    const onRecord = async () => {
      if (state.isRecord === true) return;
      doRecord();
      state.isRecord = true;   
    }

    const doRecord = async () => {
      state.gumStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      state.mediaRecorder = new MediaRecorder(state.gumStream);
      state.mediaRecorder.ondataavailable = (event: any) => {
        // Let's append blobs for now, we could also upload them to the network.
        if (event.data) {
          state.blobs.push(event.data);
        }
      }

      state.mediaRecorder.onstop = doStop;
      state.mediaRecorder.start();
    }

    const onStop = () => {
      if (state.isRecord === false) return;
      state.mediaRecorder.stop();    
      state.isRecord = false;    
      state.gumStream.getTracks().forEach((track: any) => track.stop());
    }

    const doStop = () => {
      if (!state.blobs || !state.blobs.length) return;
      recordAudio.value.src = URL.createObjectURL(new Blob(state.blobs, { type: state.mediaRecorder.mimeType }));
      state.blobs = [];
    }
      

    onMounted(()=> {   
      state.useAudioWorklet  = window.AudioWorklet && !(["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend"in document) && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);      
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
