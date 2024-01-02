// self.addEventListener("push", (event) => {
//   const payload = event.data?.text() ?? "no payload";
//   event.waitUntil(
//     self.registration.showNotification("ServiceWorker Cookbook", {
//       body: payload,
//     }),
//   );
// });




self.addEventListener('install', (e) => {
  console.log("pushServiceWorker Service worker Installing!");
  // e.waitUntil(self.clients.claim());
});

self.addEventListener('activate', (e) => {
  console.log("pushServiceWorker Service worker activated!");
});


// push 이벤트 정의
self.addEventListener('push', (event) =>{
  // 알림 데이터 받기
  const notificationData = event.data;
  console.log(event);
  // navigator.serviceWorker.getRegistrations().then((registration) => {
  //   const res = registration && registration.length > 0 ? registration[0] : null;
  //   res?.showNotification(notificationData.title, {
  //     body: notificationData.message,
  //   });
  // });

  // 알림 생성 //이거 쓰면 안될지도 모른다..
  const notification = new Notification(notificationData.title, {
    body: notificationData.message,
    icon: notificationData.icon
  });

  // 알림 열기
  notification.onclick = function() {
    window.open(notificationData.url);
  };
});