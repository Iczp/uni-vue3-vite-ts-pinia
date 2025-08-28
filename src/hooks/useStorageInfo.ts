export const useStorageInfo = () => {
  const storageInfo = ref(uni.getStorageInfoSync());
  console.log('storageInfo', storageInfo);

  const clearStorage = () => {
    uni.showActionSheet({
      itemList: ['清除全部缓存'],
      success: function (res) {
        console.log('ActionSheet success', res);
        if (res.tapIndex === 0) {
          uni.showModal({
            title: '清除缓存',
            content: '确定要清除全部缓存吗？',
            success: function (res) {
              if (res.confirm) {
                uni.clearStorageSync();
                uni.showToast({ title: '缓存已清除', icon: 'success' });
                storageInfo.value = uni.getStorageInfoSync();
                // authStore.logout();
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            },
            fail: function (res) {
              console.log('接口调用失败的回调函数', res);
            },
          });
        }
      },
      fail: function (res) {
        console.log('ActionSheet fail', res);
      },
    });
  };
  return {
    storageInfo,
    clearStorage,
  };
};
