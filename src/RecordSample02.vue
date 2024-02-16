<template>
  <div class = 'h-full w-full flex justify-center items-center'>
    <div class = 'w-[80%] flex justify-center items-center flex-col'> 
      Record Page
      <bre></bre> (use AudioWorkletNode)
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
    const createLinkFromAudioBuffer = require('./lib/recorder/exporter');

    const state = reactive({
      isRecord: false,
      ctx: null,
      input : null,
      rec: null,
      gumStream: null,
      audioContext: null,
      processorPort: null
    })


    const onRecord = async () => {
      if (state.isRecord === true) return;
      state.audioContext = await new AudioContext();
      await initializeAudio(); 
      state.isRecord = true;   
    }

    const onStop = () => {
      if (state.isRecord === false) return;

      state.processorPort.postMessage({
        message: 'UPDATE_RECORDING_STATE',
        setRecording: false,
      });
      state.isRecord = false;     
    }

    const initializeAudio = async () => {
      if (state.audioContext.state === 'suspended') {
        await state.audioContext.resume();
      }
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          latency: 0
        }
      });

      const micSourceNode = new MediaStreamAudioSourceNode(state.audioContext, { 
        mediaStream: micStream 
      });
      console.log(micStream);
      console.log(micSourceNode);

      const gainNode = new GainNode(state.audioContext);
      const analyserNode = new AnalyserNode(state.audioContext);

      const recordingProperties = {
        numberOfChannels: micSourceNode.channelCount,
        sampleRate: state.audioContext.sampleRate,
        maxFrameCount: state.audioContext.sampleRate * 300
      };

      const recordingNode = await setupRecordingWorkletNode(recordingProperties);
      state.processorPort = recordingNode.port;
      // const waveform = new Waveform('#recording-canvas', analyserNode, 32);
      // const vuMeter = new VUMeter('#vu-meter', -40, analyserNode, 32, 6);

      // const visualizerCallback = setupVisualizers(waveform, vuMeter);
      const recordingCallback = handleRecording(recordingNode.port, recordingProperties);

      recordingNode.port.onmessage = (event) => {
      
        if (event.data.message === 'UPDATE_VISUALIZERS') {
          // visualizerCallback(event);
        } else {
          // console.log("data:", event);
          recordingCallback(event);
        }
      };

      // gainNode.gain.value = 0;
      
      try {
        micSourceNode
          .connect(analyserNode)
          .connect(recordingNode)
          .connect(gainNode)
          .connect(state.audioContext.destination);
      }catch(e) {
        console.error(e);
      }
    }

    const setupRecordingWorkletNode = async (recordingProperties: any) => {
      console.log("setupRecordingWorkletNode " , state.audioContext)
      try {
        await state.audioContext.audioWorklet.addModule('./lib/recorder/recording-processor.js');
        console.log("state.audioContext.audioWorklet ", state.audioContext.audioWorklet)
        const WorkletRecordingNode = new AudioWorkletNode(
          state.audioContext,
          'recording-processor',
          { 
            processorOptions: recordingProperties,
          },
        );  
        return WorkletRecordingNode;
      } catch(e) {
        console.error(e);
      }
    }

    const handleRecording = (processorPort: any, recordingProperties: any) => {
      let recordingLength = 0;
      const recordingEventCallback = async (event: any) => {
        if (event.data.message === 'MAX_RECORDING_LENGTH_REACHED') {
          // stopButton.disabled = true;
          // recordText.textContent = 'Reached the maximum length of';
          // recordingState = RecorderStates.FINISHED;
          createRecord(recordingProperties, recordingLength, state.audioContext.sampleRate,
              event.data.buffer);
        }

        if (event.data.message === 'UPDATE_RECORDING_LENGTH') {
          recordingLength = event.data.recordingLength;
          //document.querySelector('#data-len').textContent =
          //    Math.round(recordingLength / audioContext.sampleRate * 100)/100;
        }

        if (event.data.message === 'SHARE_RECORDING_BUFFER') {
          console.log("recordingLength ", recordingLength)
          createRecord(recordingProperties, recordingLength, state.audioContext.sampleRate,
              event.data.buffer);
        }
      }

      if (state.isRecord === false) {
        console.error(1);
          processorPort.postMessage({
            message: 'UPDATE_RECORDING_STATE',
            setRecording: true,
          });
          //changeButtonStatus();
      }
      return recordingEventCallback;
    }

    const createRecord = (recordingProperties: any, recordingLength: any, sampleRate: any, dataBuffer: any) => {
      const recordingBuffer = state.audioContext.createBuffer(
        recordingProperties.numberOfChannels,
        recordingLength,
        sampleRate
      );

        for (let i = 0; i < recordingProperties.numberOfChannels; i++) {
          recordingBuffer.copyToChannel(dataBuffer[i], i, 0);
        }

        console.log(":createLinkFromAudioBuffer ", createLinkFromAudioBuffer);
        const audioFileUrl = createLinkFromAudioBuffer.default(recordingBuffer, true);
        recordAudio.value.src = audioFileUrl;
    }
    

    onMounted(()=> {   
         
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
