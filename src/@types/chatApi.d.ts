declare namespace ChatApi {
  interface GetListInput {
    skipCount?: number | null;
    maxResultCount?: number | null;
    keyword?: string | null;
    sorting?: string | null;
    [key: string]: any; // 允许任意额外的属性
  }

  interface PagedResult<T> {
    totalCount: number;
    items: T[];
    [key: string]: any; // 允许任意额外的属性
  }

  interface ChatObjectDto {
    chatObjectTypeId?: number | null;
    code: string;
    description: string;
    gender: number;
    thumbnail: string;
    portrait: string;
    appUserId: string;
    isPublic: boolean;
    isEnabled: boolean;
    isDefault: boolean;
    objectType: number;
    serviceStatus: number;
    id: number;
    parentId?: number | null;
    name: string;
    depth: number;
    childrenCount: number;
    fullPath: string;
    fullPathName: string;
    [key: string]: any; // 允许任意额外的属性
  }

  interface BadgeDto {
    appUserId: string;
    badge: number;
    chatObjectId: number;
    [key: string]: any; // 允许任意额外的属性
  }

  interface SessionUnitListInput extends GetListInput {
    // 所属聊天对象Id
    ownerId?: number;
    // 目标聊天对象Id
    destinationId?: number;
    destinationObjectType?: number;
    isCreator?: boolean;
    isTopping?: boolean;
    isContacts?: boolean;
    isImmersed?: boolean;
    isKilled?: boolean;
    minMessageId?: number;
    maxMessageId?: number;
    isBadge?: boolean;
    isRemind?: boolean;
    isFollowing?: boolean;
    [key: string]: any; // 允许任意额外的属性
  }

  interface SessionUnitSettingDto {
    readedMessageId: number;
    rename: string | null;
    remarks: string | null;
    isContacts: boolean;
    isImmersed: boolean;
    isShowMemberName: boolean;
    isShowReaded: boolean;
    isHideBadge: boolean;
    backgroundImage: string | null;
    memberName: string | null;
    joinWay: number;
    muteExpireTime: Date | null;
    inviterId: string | null;
    isPublic: boolean;
    isStatic: boolean;
    isCreator: boolean;
    isKilled: boolean;
    isInputEnabled: boolean;
    isEnabled: boolean;
    lastSendMessageId: number;
    lastSendTime: string;
    [key: string]: any; // 允许任意额外的属性
  }

  interface SessionUnitDto {
    destination: ChatObjectDto;
    setting: SessionUnitSettingDto;
    [key: string]: any; // 允许任意额外的属性
  }
}
