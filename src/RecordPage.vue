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
import { defineComponent, onMounted, reactive, ref } from 'vue'

export default defineComponent({
  name: 'RecordPageUi',
  setup() {
    const recordVisualizer = ref<HTMLCanvasElement>();
    const recordAudio = ref<HTMLAudioElement>();

    // eslint-disable-next-line no-undef
    let chunks: BufferSource[] = [];

    const state = reactive({
      isRecord: false,
      mediaRecorder: null,
      audioCtx: null,
    })

    const constraints = { audio: true };


    const onRecord = () => {
      if (state.isRecord === true) return;
      doRecord();
      state.isRecord = true;
    }

    const doRecord = () => {
      if (state.mediaRecorder) {
        state.mediaRecorder.start(5000);
        console.log(state.mediaRecorder.state);
        console.log("Recorder started.");
      }
    }


    const onStop = () => {
      if (state.isRecord === false) return;
      state.mediaRecorder.stop();
      console.log(state.mediaRecorder.state);
      console.log("Recorder stopped.");      
      state.isRecord = false;
    }

    const onSuccess = (stream: any) => {
      console.log(stream);
      state.mediaRecorder = new MediaRecorder(stream);
      console.log(state.mediaRecorder);

      state.mediaRecorder.onstop = (e: any) => {
        console.log('stop ::: ',e);
        const newAudio = document.createElement("audio");
        recordAudio.value.controls = true;
        //const blob = new Blob(chunks, { type: state.mediaRecorder.mimeType});
        const blob = new Blob(chunks, { type: 'audio/mp3 codecs=opus'});
        
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        recordAudio.value.src = audioURL;
        newAudio.controls = true;
        newAudio.src = audioURL;
        console.log(recordAudio.value);

        document.getElementById('test').prepend(newAudio);
        
      

        newAudio.preload = "auto";
        setTimeout(() => {
          recordAudio.value.load();
          newAudio.load();  
        })
        

      }

      state.mediaRecorder.ondataavailable = (e:any) => {
        chunks.push(e.data);
      }
    }

    const onError = () => {
      
    }


    const draw = () => {
      // const WIDTH = recordVisualizer.value.width;
      // const HEIGHT = recordVisualizer.value.height;

      // requestAnimationFrame(draw);
      // analyser.getByteTimeDomainData(dataArray);

      // canvasCtx.fillStyle = "rgb(200, 200, 200)";
      // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      // canvasCtx.lineWidth = 2;
      // canvasCtx.strokeStyle = "rgb(0, 0, 0)";

      // canvasCtx.beginPath();

      // let sliceWidth = (WIDTH * 1.0) / bufferLength;
      // let x = 0;

      // for (let i = 0; i < bufferLength; i++) {
      //   let v = dataArray[i] / 128.0;
      //   let y = (v * HEIGHT) / 2;

      //   if (i === 0) {
      //     canvasCtx.moveTo(x, y);
      //   } else {
      //     canvasCtx.lineTo(x, y);
      //   }

      //   x += sliceWidth;
      // }

      // canvasCtx.lineTo(canvas.width, canvas.height / 2);
      // canvasCtx.stroke();
    }

    const visualize = (stream: any) => {
      console.log(stream);
      // let audioCtx = state.audioCtx;
      // if (!audioCtx) {
      //   audioCtx = new AudioContext();
      //   const source = audioCtx.createMediaStreamSource(stream);
      //   const analyser = audioCtx.createAnalyser();
      //   analyser.fftSize = 2048;
      //   const bufferLength = analyser.frequencyBinCount;
      //   const dataArray = new Uint8Array(bufferLength);

      //   source.connect(analyser);
      // }
    }

    onMounted(()=> {
      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
      draw();
      visualize(1);
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
