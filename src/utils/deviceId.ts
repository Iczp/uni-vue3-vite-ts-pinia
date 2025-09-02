const deviceIdStorageKey = 'deviceId_v1.0';
export const getDeviceId = () => {
  let deviceId = uni.getStorageSync(deviceIdStorageKey);
  if (deviceId) {
    return deviceId;
  }
  const sysInfo = uni.getSystemInfoSync();
  deviceId = `${sysInfo.platform}-${sysInfo.deviceId}`;
  uni.setStorageSync(deviceIdStorageKey, deviceId);
  return `H5-${sysInfo.deviceId}`;
};
