// src/utils/getLocation.js

export const getLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("❌ Geolocation is not supported by your device");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        let message = "❌ Unknown GPS Error";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = "❌ GPS Permission Denied — Please allow location access.";
            break;

          case err.POSITION_UNAVAILABLE:
            message = "❌ Location unavailable — Try moving to an open area.";
            break;

          case err.TIMEOUT:
            message = "⏳ GPS Timeout — Try again.";
            break;

          default:
            message = "⚠️ Unable to fetch GPS location.";
        }

        reject(message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
