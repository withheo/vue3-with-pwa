importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js");
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCQOkJiz7_lXXrarGQDar03MRsCzuPJSP0",
  authDomain: "gemiso-push-message.firebaseapp.com",
  projectId: "gemiso-push-message",
  storageBucket: "gemiso-push-message.appspot.com",
  messagingSenderId: "997337351696",
  appId: "1:997337351696:web:98f69d26501284dfef2c95",
  measurementId: "G-CYQN6NVY2N"
};

console.log("firebase  > ", firebase)



firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

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

console.log('messaging.onMessag :', messaging, messaging.onMessag );

self.addEventListener('push' , (payload) => {
  // firebase-messaing-sw 인지 파팍  
  try {
    console.log('[firebase-messaging-sw.js] Received foreground message ', payload);
    const { title, content, sended_at } = payload.data.json().data;
    const notificationTitle = title ?? 'Background Message Title';
    const notificationOptions = {
      body: content ? `${content} (${sended_at})` : 'Background Message body.',
      icon: '/firebase-logo.png'
    };
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
  } catch(e) {
    console.error(e);
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
          