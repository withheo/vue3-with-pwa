<template>
  <div class = 'h-full w-full flex justify-center items-center flex-col'>
    <div class= "p-4">비디오 스트리밍 #2 </div>
    <div class = "w-[640px] h-[264px] relative">
      <video
        ref="videoPlayer"
        controls
        width="640"
        height="360"
        src="/hls/test.m3u8"
        type="application/vnd.apple.mpegurl"
      ></video>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import 'video.js/dist/video-js.css'; // Video.js 기본 스타일
import videojs from 'video.js';

export default defineComponent({
  setup() {
    const videoPlayer = ref<HTMLVideoElement | null>(null);
    let player: any = null;
    onMounted(() => {
     
    });

    return {
      videoPlayer,
    }
  },
})
</script>