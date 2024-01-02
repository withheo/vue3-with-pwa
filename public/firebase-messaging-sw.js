importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');


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



const app = firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging(app);

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

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const { title, content, sended_at } = payload.data;
  const notificationTitle = title ?? 'Background Message Title';
  const notificationOptions = {
    body: content ? `${content} (${sended_at})` : 'Background Message body.',
    icon: '/firebase-logo.png'
  };
  return self.registration.showNotification(notificationTitle,
      notificationOptions);
})
          