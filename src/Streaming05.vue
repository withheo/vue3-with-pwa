<template>
  <div class = 'h-full w-full flex justify-center items-center flex-col'>
    <div class= "p-4">비디오 스트리밍 5 (GemisoPlayer)</div>
    <div class = "w-[640px] h-[264px] relative">
      <video ref="videoPlayer" class="video-js gemiso" controls preload="auto" width="640" height="264">        
      </video>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import 'video.js/dist/video-js.css'; // Video.js 기본 스타일
import videojs from 'video.js';
import '@/lib/videojs-gemiso-plugin.css';
import '@/lib/videojs-gemiso-plugin.min.js';

export default defineComponent({
  setup() {
    const videoPlayer = ref<HTMLVideoElement | null>(null);
    let player: any = null;
    onMounted(() => {
      if (videoPlayer.value) {
        // Video.js 인스턴스 생성
        player = videojs(videoPlayer.value, {
          autoplay: false,
          liveui: true, // videoOp.liveui,
          controlBar: {
            GemisoTimeTooltip: {},
            remainingTimeDisplay: {},
            progressControl: {},
            CurrentTimeDisplay: {},
            TimeDivider: {},
            DurationDisplay: {},
            liveDisplay: {},
            gemisoLive: {},
            Spacer: {},
          },
          responsive: true,
          fluid: true,
          plugins: {
            smptecode: { frameRate: 29.97, drop: true },
          },
          sources: [
            {
              // src:"https://streaming.ynatv.co.kr/live/mam/ingest/StreamingRoot/2025-01-03/s2_130256_CH03_Clip/Video_000/Video_000.m3u8",
              src: "https://streaming.ynatv.co.kr/proxy/lowres/test/2025/01/03/10881/proxy_N20250103V00021.m3u8",
              type: 'application/vnd.apple.mpegurl', // HLS 스트리밍 MIME 타입 설정
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