import { jsonParse } from '@/utils/object';
import { signalrEvents } from '@/utils/signalr';

export const useSignalR = () => {
  const fn = <T>(event: string, callback: (arg0: T | null) => void) => {
    uni.$on(event, (e: string) => {
      const args = jsonParse<T>(e);
      callback(args);
    });
  };
  const onReceived = (callback: (arg0: CommandPayload<MessageCommand> | null) => void) =>
    fn(signalrEvents.received, callback);

  const onClose = (callback: (arg0: CommandPayload<any> | null) => void) =>
    fn(signalrEvents.close, callback);

  const onError = (callback: (arg0: CommandPayload<any> | null) => void) =>
    fn(signalrEvents.error, callback);

  const onConnected = (callback: (arg0: CommandPayload<any> | null) => void) => fn(signalrEvents.connected, callback);
  const onReconnected = (callback: (arg0: CommandPayload<any> | null) => void) => fn(signalrEvents.reconnected, callback);
  return {
    onReceived,
    onClose,
    onError,
    onConnected,
    onReconnected,
  };
};
