<template>
  <div class = 'h-full w-full flex justify-center items-center flex-col'>
    <div class= "p-4">비디오 스트리밍 3</div>
    <div class = "w-[640px] h-[264px] relative">
      <video ref="videoPlayer" class="video-js" controls preload="auto" width="640" height="264">        
      </video>
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
      if (videoPlayer.value) {
        // Video.js 인스턴스 생성
        player = videojs(videoPlayer.value, {
          autoplay: false,
          controls: true,
          responsive: true,
          fluid: true,
          sources: [
            {
              src:"/hls/test2.m3u8",
              type: 'application/x-mpegURL', // HLS 스트리밍 MIME 타입 설정
            },
          ],
        });
      }
    });

    return {
      videoPlayer,
    }
  },
})
</script>