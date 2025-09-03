import { isHtml5Plus } from "./platform";

export const signalrEvents = {
  connecting: 'connecting@signalr',
  connected: 'connected@signalr',
  reconnecting: 'reconnecting@signalr',
  reconnected: 'reconnected@signalr',
  close: 'close@signalr',
  error: 'error@signalr',
  received: 'received@signalr',
};
var a = {
  scopes: [{ sessionUnitId: '845be709-c3bf-f58c-251f-3a1bcd46f5af', chatObjectId: 6092 }],
  payload: {
    messageId: 7277737,
    cacheKey: 'SessionId_6933b564-8c59-d618-bbb3-0986c84080fe',
    command: 'UpdateBadge',
    hostName: 'd2015bc5e536',
  },
  command: 'UpdateBadge',
  appUserId: '3c204f98-4494-4c7d-bb19-b287e0ab0170',
};

export const signalr = {
  received(callback) {
    uni.$on(signalrEvents.received, callback);
  },
};



export const subscriptionSignalrEvents = () => {
  if (!isHtml5Plus) {
    return;
  }

  Object.entries(signalrEvents).forEach(([key, event]) => {
    console.log(`uni.$on: ${event}`);
    uni.$on(event, (...args) => {
      console.log(`#--H5--# Event: ${key}`, ...args);
      setTimeout(() => {
        uni.showToast({ title: `收到事件@${key}:${args}`, icon: 'none', duration: 5000 });
      }, 1000);
    });
  });
};


