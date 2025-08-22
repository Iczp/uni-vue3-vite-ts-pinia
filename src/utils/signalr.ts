export const signlarEvents = {
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
    uni.$on(signlarEvents.received, callback);
  },
};
