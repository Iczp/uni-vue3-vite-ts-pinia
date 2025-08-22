// 确保这是模块声明
export {};

declare global {
  interface SignalrScope {
    sessionUnitId: string;
    chatObjectId: number;
  }

  interface SignalrPayload {
    messageId?: number;
    cacheKey?: string;
    command?: string;
    hostName?: string;
    message?: any;
    [key: string]: any;
  }

  interface SignalrReceived {
    scopes: SignalrScope[];
    payload: SignalrPayload;
    command: string | 'Created' | 'UpdateBadge' | 'Updated' | 'Rollback' | 'IncrementCompleted';
    appUserId: string;
  }
}
