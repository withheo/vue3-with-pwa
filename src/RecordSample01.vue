<template>
  <div class = 'h-full w-full flex justify-center items-center'>
    <div class = 'w-[80%] flex justify-center items-center flex-col'> 
      Record Page 
      (기본 MediaRecorder API 이용)
      <bre></bre>useAudioWorklet : {{  state.useAudioWorklet }}
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
      rec: null,
      gumStream: null,
      audioContext: null,
      processorPort: null,
      useAudioWorklet: false,
    })

    const onRecord = async () => {
      if (state.isRecord === true) return;
      doRecord();
      state.isRecord = true;   
    }

    const doRecord = () => {
      if (navigator.mediaDevices) {
        console.log("getUserMedia supported.");
        const constraints = { audio: true };
        let chunks: any[] = [];

        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            const options = {
              audioBitsPerSecond: 128000,
              mimeType:'audio/webm'
            };
            state.rec = new MediaRecorder(stream, options);
            state.rec.start();


            state.rec.onstop = (e: any) => {
              // state.rec.stream.stop();
              // console.log("data available after MediaRecorder.stop() called.");

              // const clipName = prompt("Enter a name for your sound clip");

              // const clipContainer = document.createElement("article");
              // const clipLabel = document.createElement("p");
              // const audio = document.createElement("audio");
              // const deleteButton = document.createElement("button");
              //const mainContainer = document.querySelector("body");

              // clipContainer.classList.add("clip");
              // audio.setAttribute("controls", "");
              // deleteButton.textContent = "Delete";
              // clipLabel.textContent = clipName;

              //clipContainer.appendChild(audio);
             // clipContainer.appendChild(clipLabel);
             // clipContainer.appendChild(deleteButton);
            //  mainContainer.appendChild(clipContainer);

             // audio.controls = true;
              const blob = new Blob(chunks, { type: "audio/webm; codecs=opus" });
              chunks = [];
              const audioURL = URL.createObjectURL(blob);
              //audio.src = audioURL;
              recordAudio.value.src = audioURL;
             // audio.controls = true;
            //  audio.preload = "auto";
            //  console.log("recorder stopped");

              // deleteButton.onclick = (e: any) => {
              //   // const evtTgt = e.target;
              //   // evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
              // };
            };

            state.rec.ondataavailable = (e: any) => {
              console.log(state.rec.mimeType)
              chunks.push(e.data);
            };
          })
          .catch((err) => {
            console.error(`The following error occurred: ${err}`);
          });
      }
    }

    const onStop = () => {
      if (state.isRecord === false) return;
      state.rec.stop();
     
      state.isRecord = false;     
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
