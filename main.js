// Function to request notification permission and send push notification
function requestAndSendNotification() {
  // Check if the browser supports notifications
  if (!('Notification' in window)) {
    console.error('This browser does not support notifications.');
    return;
  }

  // Request permission
  Notification.requestPermission().then(function(permission) {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // Send push notification
      sendPushNotification();
    } else {
      console.warn('Notification permission denied.');
    }
  });
}

// Function to send push notification
function sendPushNotification() {
  Push.create('Push Notification', {
    body: 'This is a push notification!',
    icon: 'path/to/icon.png',
    timeout: 4000, // Duration the notification will be displayed (in milliseconds)
    onClick: function () {
      // Handle notification click event
      window.focus();
      this.close();
    }
  });
}

// Event listener to request permission when the button is clicked
document.getElementById('notificationButton').addEventListener('click', requestAndSendNotification);
