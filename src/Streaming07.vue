<template>
  <div class = 'h-full w-full flex justify-center items-center flex-col'>
    <div class= "p-4">비디오 스트리밍 6 (GemisoPlayer)</div>
    <div class = "w-[640px] h-[264px] relative">
      <video ref="videoPlayer" class="video-js gemiso" controls preload="auto" width="640" height="264" crossOrigin="true">        
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
      const controlBar = {
        GemisoTimeTooltip: {},
        remainingTimeDisplay: {},
        progressControl: {},
        CurrentTimeDisplay: {},
        TimeDivider: {},
        DurationDisplay: {},
        liveDisplay: {},
        gemisoLive: {},
        Spacer: {},
        gemisoBackward10Button: { options: { type: 'sec', num: 10 } },
        gemisoBackwardButton: { options: { type: 'sec', num: 2 } },
        playToggle: {},
        gemisoForwardButton: { options: { type: 'sec', num: 2 } },
        gemisoForward10Button: { options: { type: 'sec', num: 10 } },
        CustomControlSpacer: {},
        volumePanel: {
          inline: false,
          vertical: true,
        },
        playbackRateMenuButton: {},
        fullscreenToggle: {},
        children: {},
      }

      const videoOptions = {
        //frameRate: frameRate,
        //drop: true,
        poster:  '',
        notSupportedMessage: '지원하지 않는 포멧입니다.',
        liveui: true, // videoOp.liveui,
        fluid: true,
      
        playbackRates: [0.5, 1, 1.5, 2, 3, 4, 8],
        autoplay: false,
        chartModules: false,
        controls: true,
        inactivityTimeout: 0,        
        muted: false,        
        controlBar: controlBar,
        plugins: {
          smptecode: { frameRate: 29.97, drop: true },
          errors: {
            default: {
              images: '/img/vjs-error-display.png',
            },
            list: [
              {
                code: 3, //디코딩 오류
                message: '',
                images: '/img/vjs-error-display.png',
                click: () => {
                  player.errorDisplay.close();
                },
              },
              {
                code: -1,
                message: 'test',
                images: '/img/vjs-error-display_incoming.png',
              },
            ],
          },
        },
      };

      if (videoPlayer.value) {
        // Video.js 인스턴스 생성
        player = videojs(videoPlayer.value, videoOptions ,() => {});

        player.src({
          src:"https://streaming.ynatv.co.kr/live/mam/ingest/StreamingRoot/2025-01-03/s5_133542_CH03_Clip/Video_000/Video_000.m3u8",
          type: 'application/vnd.apple.mpegurl', // HLS 스트리밍 MIME 타입 설정
        })
      }
    });

    return {
      videoPlayer,
    }
  },
})
</script>