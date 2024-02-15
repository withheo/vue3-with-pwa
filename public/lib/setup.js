///////////////////////////////////////////////////
// KiwiVoiceRecorder                             //
// https://www.kiwisoft.kr                       //
// Copyright © 앤아이비디앤. All rights reserved. //
///////////////////////////////////////////////////

// Kiwi Recorder 서비스 버전
var Kiwi_Recorder_Version = 16; 

// 라이선스 키 (정식 라이선스키로 수정 등록하세요.)
var KVR_LICENSE_KEY = "jkOTHaRMNq4XhKz"; 

// 녹음되는 오디오 파일 인코딩 타입 선택 (mp3만 가능합니다.)
var encodingTypeSelect = "mp3";

// 최대 녹음 시간(초) - 녹음 시간이 설정 값을 초과하면 자동으로 녹음이 종료됩니다.
var recordTimeLimit = 300;

// 녹음 전 버튼 클릭 오류 메시지
var recordingCheckErrorMsg = "녹음을 먼저 진행하세요.";
var preRecordingCheckErrorMsg = "이전 녹음을 먼저 완료해주세요."; // 한 화면에 녹음 기능을 2개 이상 포함시킨 경우 -> 이전 녹음 완료 전 다음 녹음 버튼을 클릭하였을 경우

// 녹음 로그 메시지
var readyMessage = "> 녹음을 시작합니다.";  
var startMessage = "> 녹음이 시작되었습니다."; 
var pauseMessage = "> 녹음을 일시 정지합니다.";  
var resumeMessage = "> 녹음을 계속 진행합니다.";  
var stopMessage = "> 녹음이 종료되었습니다.";  
var endMessage = "> 인코딩이 완료되었습니다.";  
var uploadSuccessMessage = "업로드가 완료되었습니다.";         // 업로드 성공 알림
var uploadFailMessage = "업로드 도중 오류가 발생하였습니다.";   // 업로드 실패 알림

// 웹 브라우저 지원 여부 메시지
var chkbrowsermsg = "현재 웹브라우저에서는 녹음 기능을 지원하지 않습니다. 최신 버전의 구글 크롬(Chrome), 마이크로스프트 엣지(Edge) 또는 애플 사파리(Safari)  웹브라우저에서 접속해주세요.";

// 녹음 파일 서버 업로드 처리 URL 지정
var uploadUrl = "./lib/mp3lib.min.js";

// mp3lib 경로를 지정합니다.(절대경로)
var mp3libUrl = "./lib/mp3lib.min.js";


// 비주얼라이저(visualizer) v1 설정 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var visualizerV1BackColor = "#E2E2E2";  // 배경색상 코드
var visualizerV1LineColor = "#5357FF";  // 라인색상 코드 
var visualizerV1lineWidth = 2;          // 라인두께 (1,2,3 ...) 

// 비주얼라이저(visualizer) v2 설정 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var visualizerV2BackgroundColor = "#E2E2E2";   // 배경색상 코드

/* 
비주얼라이저(visualizer) 바(bar) 색상을 선택하거나 직접 색상코드를 설정합니다.
비주얼라이저(visualizer) 바(bar) 색상은 기본으로 제공하는 a,b,c,d 4가지 중에서 한 가지를 선택하여 설정 할 수 있습니다. 
기본 제공 색상을 선택하지 않고 색상을 직접 설정 할 경우 색상코드를 입력합니다. ( 예: var visualizerV2BarColor = "#FF0000"; )
*/
var visualizerV2BarColor = "a"; 

// 비주얼라이저(visualizer) 바(bar) 민감도 설정 (비주얼라이저 바의 움직임 정도를 설정합니다. 1 이상의 숫자로 지정하세요. 소수 가능, 기본값: 3)
var visualizerV2Sensor = 3;  

/*
주의사항 : 비주얼라이저는 녹음시에 동작하며 V1, V2 중에서 한 가지만 선택하여 사용할 수 있습니다. V1, V2 모두 true로 적용하여 사용하면 오류가 발생합니다.
*/


// 아래 코드는 수정하지 마세요. ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var recordTimeText = function() {
    var recordTimeM = Math.floor(recordTimeLimit / 60);
    var recordTimeS = recordTimeLimit % 60;
    if(recordTimeS<10) {
        recordTimeS = "00";
    }
    if(!recordTimeM || recordTimeM < 1) {
        recordTimeM = "0";
    }
    var resultTime = recordTimeM + ":" + recordTimeS; 
    return resultTime;
};


