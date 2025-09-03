// 确保这是模块声明
export {};

declare global {
  interface CommandScope {
    sessionUnitId: string;
    chatObjectId: number;
  }

  interface MessageCommand {
    messageId?: number;
    cacheKey?: string;
    command?: string;
    hostName?: string;
    message?: Chat.MessageDto;
    [key: string]: any;
  }

  interface CommandPayload<T> {
    scopes: CommandScope[];
    payload: T;
    command: string | 'Created' | 'UpdateBadge' | 'Updated' | 'Rollback' | 'IncrementCompleted';
    appUserId: string;
  }
}
