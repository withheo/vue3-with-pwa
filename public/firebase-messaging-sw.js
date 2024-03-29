importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js");
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


let messaging = null;
const CACHE_NAME = 'pwa-test-offline';

const installFiles = [
  '/images/doc_1.png',
  'index.html',
];

self.addEventListener('install', (event) => {
  // cache에 
  console.log("service worker - install")
  event.waitUntil((async() => {
    const cache = await caches.open(CACHE_NAME);
    console.log(" chache 저장 : ", installFiles);
    await cache.addAll(installFiles);
  })());
});

self.addEventListener('activate', () => {
  console.log("service worker - activate")
});

self.addEventListener('fetch', (event)  => {
  console.log("service worker - fetch")
  console.log(" fetch 가 됨: ", event);
});

const firebaseConfig = {
  apiKey: "AIzaSyCQOkJiz7_lXXrarGQDar03MRsCzuPJSP0",
  authDomain: "gemiso-push-message.firebaseapp.com",
  projectId: "gemiso-push-message",
  storageBucket: "gemiso-push-message.appspot.com",
  messagingSenderId: "997337351696",
  appId: "1:997337351696:web:98f69d26501284dfef2c95",
  measurementId: "G-CYQN6NVY2N"
};

firebase.initializeApp(firebaseConfig);
messaging = firebase.messaging();

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.

// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });


// console.log("messaging ", messaging)

// messaging.getToken(messaging, {vapidKey: "BINxsPHrwAAIzNxfZRFVlQQ6jFvib0UOk4wjFThs_B_uy4rLOBCeaEyE1Qa6YdZIW6LNxf9FYRGGCFZRQEKmjxM"}).then((key) => {
//   console.log(key);
// })

// messaging.onMessage((payload) => {
//   console.log("forground message receivce :", payload);
// })

// console.log('messaging.onMessag :', messaging, messaging.onMessag );
// console.log("self ", self)

self.addEventListener('push' , (payload) => {
  // firebase-messaing-sw 인지 파팍  
  try {
    console.log('[firebase-messaging-sw.js] Received foreground message ', payload);
    const { title, content, sended_at } = payload.data.json().data;
    const notificationTitle = title ?? 'Background Message Title';
    const notificationOptions = {
      body: content ? `${content} (${sended_at})` : 'Background Message body.',
      icon: '/icons/maskable_icon.png',
      // image: '/icons/maskable_icon.png', image도 보여줄수 있음
      actions: [{
        title: '화면보기',
        action: 'goTab',
        icon: '/icons/arrow-icon.png',
      }, {
        title: '닫기',
        action: 'close',
      }]
    };
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
  } catch(e) {
    console.error(e);
  }
})


self.addEventListener('notificationclick' , (evt) => {
  const openUrl = `${self.location.origin}`;
  switch(evt.action) {
    case 'goTab':
      evt.waitUntil(
        clients.matchAll({
          type: "window",
          includeUncontrolled: true
        }).then((clientList) => {
          console.log("clientList :" , clientList, self.location.origin)
          if (clientList.length) {
            clientList[0].focus();
          } else {
            clients.openWindow('/').then((wClient) => {
              wClient ? wClient.focus() : null;
            });
          }
        })
      )
      break;
    case 'close':
      evt.waitUntil(evt.notification.close());
      break;
  }
})

// 해당 background 에서 된다는게 아닌가 보다... 
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const { title, content, sended_at } = payload.data;
  const notificationTitle = title ?? 'Background Message Title';
  const notificationOptions = {
    body: content ? `${content} (${sended_at})` : 'Background Message body.',
    icon: '/firebase-logo.png'
  };
  // return self.registration.showNotification(notificationTitle,
  //     notificationOptions);
})
          