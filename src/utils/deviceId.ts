import FingerprintJS from '@fingerprintjs/fingerprintjs';

const deviceIdStorageKey = 'deviceId_v1.0';
const deviceIdPrefix = 'H5-';

export const getDeviceId = async () => {
  try {
    return await getDeviceIdByFingerprintJS();
  } catch (error) {
    console.error('getDeviceIdByFingerprintJS error', error);
    return await getDeviceIdByUniapp();
  }
};

export const getDeviceIdByFingerprintJS = () => {
  let deviceId = uni.getStorageSync(deviceIdStorageKey);
  if (deviceId) {
    return deviceId;
  }
  const fpPromise = FingerprintJS.load();
  fpPromise
    .then(fp => fp.get())
    .then(result => {
      // This is the visitor identifier:
      console.log(result.visitorId);
      deviceId = `${deviceIdPrefix}${result.visitorId}`;
      uni.setStorageSync(deviceIdStorageKey, deviceId);
    });
};

export const getDeviceIdByUniapp = async () => {
  let deviceId = uni.getStorageSync(deviceIdStorageKey);
  if (deviceId) {
    return deviceId;
  }
  const sysInfo = uni.getSystemInfoSync();
  deviceId = `${deviceIdPrefix}${sysInfo.deviceId}`;
  uni.setStorageSync(deviceIdStorageKey, deviceId);
  return deviceId;
};
