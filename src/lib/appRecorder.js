////////////////////////////////////////////////////
// KiwiVoiceRecorder                              //
// https://www.kiwisoft.kr                        //
// Copyright © 앤아이비디앤. All rights reserved. //
////////////////////////////////////////////////////

// 녹음 시작(start) 
function startRecording(visualizer_canvas_id,visualizer_canvas_ver,timer_id,audio_player,audio_button,audio_log) { 
	_startRecording(visualizer_canvas_id,visualizer_canvas_ver,timer_id,audio_player,audio_button,audio_log); 
}

// 녹음 일시 정지(pause)
function pauseRecording(audio_log) {
	_pauseRecording(audio_log);
}

// 녹음 다시 시작(resume)
function resumeRecording(audio_log) {
	_resumeRecording(audio_log);
}

// 녹음 종료(stop)
function stopRecording(audio_log) {
	_stopRecording(audio_log);	
}

// 녹음 진행 과정 로그 표시 
/*
audio_log : example.html 소스 코드에서 로그 표시 div id -> "audio_log1"
viewLog 함수명 및 매개변수 변경 금지
*/
function viewLog(str, url = null, audio_log) {
	if($("#"+audio_log).length > 0) {
		const newDiv = document.createElement("div");
		newDiv.appendChild(document.createTextNode(str));
		document.getElementById(audio_log).prepend(newDiv);
	}
}

// 녹음 종료 후 재생 플레이어,다운로드,업로드 버튼 표시 
/*
audio_player : example.html 소스 코드에서 플레이어 표시 div id -> "audio_player1" 
audio_button : example.html 소스 코드에서 다운로드 및 업로드 버튼 표시 div id -> "audio_button1"
viewRecording 함수명 및 매개변수 변경 금지
*/
function viewRecording(url,blobvalue,audio_player,audio_button) { 
	if($("#"+audio_button).length > 0) {
		$("#"+audio_button).empty();
	}

	// 녹음 파일 재생 오디오 플레이어 실행(Embedded audio player)
	if($("#"+audio_player).length > 0) {
		$("#"+audio_player).empty();
		const newAudio = document.createElement("audio");
		newAudio.src = url;
		newAudio.controls = true;
		document.getElementById(audio_player).prepend(newAudio);
	}

    // mp3 파일 다운로드 링크 생성 (사용 시 아래 주석을 제거합니다.)
	/*
	if($("#"+audio_button).length > 0) {
		const downLink = document.createElement("a");
		downLink.href = url;
		downLink.download = "record_" + Date.now() + ".mp3"; // mp3 파일명 지정
		downLink.appendChild(document.createTextNode("mp3 다운로드")); 
		document.getElementById(audio_button).prepend(downLink);
	}
	*/

	// mp3 파일 다운로드 버튼 생성
	if($("#"+audio_button).length > 0) {
		var dbuttonID = "downloadButton" + Date.now();
		var dbutton = document.createElement("button");
		dbutton.type = 'button';
		dbutton.id = dbuttonID;
		dbutton.innerHTML = 'mp3 다운로드';
		dbutton.className = 'BUTTON';
		dbutton.onclick = function() {
			const downLink = document.createElement("a");
			downLink.href = url;
			downLink.download = "record_" + Date.now() + ".mp3"; // mp3 파일명 지정
			downLink.click();
		};
		document.getElementById(audio_button).prepend(dbutton);
	}

	// mp3 서버 업로드 버튼 생성
	if($("#"+audio_button).length > 0) {
		var ubuttonID = "uploadButton" + Date.now();
		var ubutton = document.createElement("button");
		ubutton.type = 'button';
		ubutton.id = ubuttonID;
		ubutton.innerHTML = 'mp3 업로드';
		ubutton.className = 'BUTTON';
		ubutton.onclick = function() {
			uploadRecording(blobvalue);
		};
		document.getElementById(audio_button).prepend(ubutton);
	}

	// 녹음 종료 버튼 클릭 후 mp3 서버 업로드 자동 실행 (사용 시 아래 주석을 제거합니다.)
	// uploadRecording(blobvalue);
}

// 녹음 파일 웹서버 업로드
function uploadRecording(blobData) { 
	var upload_file_name = "voice_record"; // 음성 녹음 업로드 파일명을 지정합니다. upload.php -> $_FILES['voice_record'] 파일 변수명과 일치해야 합니다. 업로드 파일명 변경 및 파일 확장자는 upload.php에서 직접 지정할 수 있습니다.
	if(!blobData) {
		alert(recordingCheckErrorMsg);
	} else if(blobData) {
		console.log("Upload Recording");
		var formData = new FormData(); 
		formData.append(upload_file_name,blobData); 
		$.ajax({ 
			url : uploadUrl, 
			async:true,
			type: "POST", 
			enctype: 'multipart/form-data',
			data : formData,
			processData: false,
			contentType: false,
			success: function(data, textStatus, jqXHR)
			{			
				console.log(data);

				/* 녹음 파일 업로드 처리 서버 스크립트 페이지에서 리턴 받은 값을 확인하여 결과를 처리합니다. 리턴 값은 추가 또는 변경 할 수 있습니다. 
				예제 upload.php 파일에서 결과 리턴 처리 방법을 확인하세요. */
				if($.trim(data) == 'upload_success') {
					/* 리턴 값이 upload_success인 경우 : 업로드에 성공 했을 경우 결과를 처리합니다. 원하는 처리 코드를 여기에 추가하세요. */
					alert(uploadSuccessMessage);
				} else if($.trim(data) == 'upload_fail') {
					/* 리턴 값이 upload_fail인 경우 : 업로드에 실패 했을 경우 결과를 처리합니다. 원하는 처리 코드를 여기에 추가하세요. */
					alert(uploadFailMessage);
				} else {
					alert(uploadFailMessage);
				}
			}, 
			error: function (jqXHR, textStatus, errorThrown)
			{
				console.log(jqXHR);
			} 
		}); 
	}	
}

// 녹음 종료(stop) 후 자동 호출되는 이벤트 함수 (함수명 및 매개변수 변경 금지)
/*
timer_id : example.html 소스 코드에서 타이머 표시 div id -> "id_timer1" 
audio_player : example.html 소스 코드에서 플레이어 표시 div id -> "audio_player1" 
audio_button : example.html 소스 코드에서 다운로드 및 업로드 버튼 표시 div id -> "audio_button1"
audio_log : example.html 소스 코드에서 녹음 진행 로그 표시 div id -> "audio_log1"
*/
function eventStopRecording(timer_id,audio_player,audio_button,audio_log) {
	console.log('Stop Recording Event');

	// 녹음 종료(stop) 후 실행해야 할 코드가 있을 경우 여기에 추가하세요.
	console.log(timer_id);
	console.log(audio_player);
	console.log(audio_button);
	console.log(audio_log);
}

// 녹음 시작 시 마이크(미디어 디바이스) 사용 권한 획득 관련 등의 오류로 녹음에 실패하는 경우 자동 호출되는 이벤트 함수 (함수명 변경 금지) 
function _startRecording_error() {
	alert('녹음 시작 도중 오류가 발생하였습니다.');
}
