import { jsonParse } from '@/utils/object';
import { signalrEvents } from '@/utils/signalr';

export const useSignalR = () => {
  const formatArgs = <T>(event: string, callback: (arg0: T | null) => void) => {
    uni.$on(event, (e: string) => {
      const args = jsonParse<T>(e);
      if (args) {
        args['event'] = event;
      }
      callback(args);
    });
  };
  const onReceived = (callback: (arg0: CommandPayload<MessageCommand> | null) => void) =>
    formatArgs(signalrEvents.received, callback);

  const onClose = (callback: (arg0: CommandPayload<any> | null) => void) =>
    formatArgs(signalrEvents.close, callback);

  const onError = (callback: (arg0: CommandPayload<any> | null) => void) =>
    formatArgs(signalrEvents.error, callback);

  const onConnected = (callback: (arg0: CommandPayload<any> | null) => void) =>
    formatArgs(signalrEvents.connected, callback);

  const onReconnected = (callback: (arg0: CommandPayload<any> | null) => void) =>
    formatArgs(signalrEvents.reconnected, callback);

  return {
    onReceived,
    onClose,
    onError,
    onConnected,
    onReconnected,
  };
};
