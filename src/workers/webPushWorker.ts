// 서비스 워크에 등록
navigator.serviceWorker.register('pushServiceWorker.js');

// push 이벤트 정의
self.addEventListener('push', function(event: any) {
  // 알림 데이터 받기
  const notificationData = event.data;

  // 알림 생성
  const notification = new Notification(notificationData.title, {
    body: notificationData.message,
    icon: notificationData.icon
  });

  // 알림 열기
  notification.onclick = function() {
    window.open(notificationData.url);
  };
});