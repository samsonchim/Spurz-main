// service-worker.js

// Listen for push event from the server
self.addEventListener('push', function(event) {
  const options = {
    body: 'This is a push notification!',
    icon: 'path/to/icon.png',
    // Other options like actions, title, etc., can be added here
  };

  // Show the notification when receiving a push event
  event.waitUntil(self.registration.showNotification('Push Notification', options));
});
