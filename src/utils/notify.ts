export interface Notification extends NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
}

export const notify = (args: Notification): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('Notification' in window)) {
      console.log('Notification API not supported.');
      uni.showToast({ title: '不支持推送', icon: 'none' });
      reject(new Error('Notification API not supported'));
      return;
    }

    Notification.requestPermission()
      .then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          uni.showToast({ title: '已开启推送', icon: 'none' });
          const notification = new Notification(args.title, {
            ...args,
            body: args.body || '',
            icon: args.icon || '',
          });

          // 处理通知点击事件
          notification.onclick = () => {
            window.focus(); // 将浏览器窗口置于前台
            notification.close(); // 关闭通知
            resolve(); // 通知显示成功，解析 Promise
          };

          notification.onerror = () => {
            reject(new Error('Failed to display notification')); // 通知显示失败，拒绝 Promise
          };

          // 用户已授予权限，可以显示通知
        } else if (permission === 'denied') {
          console.log('Notification permission denied.');
          uni.showToast({ title: '已拒绝推送', icon: 'none' });
          reject(new Error('Notification permission denied')); // 权限被拒绝，拒绝 Promise
        }
      })
      .catch(error => {
        console.error('Notification permission denied:', error);
        uni.showToast({ title: '推送权限被拒绝', icon: 'none' });
        reject(error); // 请求权限时出错，拒绝 Promise
      });
  });
};
