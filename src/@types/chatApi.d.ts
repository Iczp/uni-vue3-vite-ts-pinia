// import { ObjectTypes } from "@/utils/enums";

declare namespace ChatApi {
  // 定义枚举
  export enum ObjectTypes {
    Anonymous = 0, // 匿名
    Personal = 1, // 个人
    Room = 2, // 群
    Official = 3, // 服务号
    Subscription = 4, // 订阅号
    Square = 5, // 广场
    Robot = 6, // 机器人
    ShopKeeper = 7, // 掌柜
    ShopWaiter = 8, // 店小二
    Customer = 9, // 客户
  }

  // enum MessageTypes {
  //   Text = 0, // 文本类型
  //   Cmd = 1, // 系统命令消息
  //   Image = 2, // 图片类型
  //   Sound = 3, // 语音类型
  //   Video = 4, // 视频类型
  //   File = 5, // 文件消息
  //   Link = 6, // 链接类型
  //   Location = 7, // 地理位置
  //   Contacts = 8, // 联系人名片
  //   RedEnvelope = 9, // 红包
  //   Html = 10, // HTML
  //   Article = 11, // 文章
  //   History = 12, // 聊天历史消息
  // }

  interface GetListInput {
    skipCount?: number | null;
    maxResultCount?: number | null | undefined;
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

  interface MessageDto {
    creationTime: string;
    extraProperties: object;
    id: number;
    isPrivate: false;
    isRollbacked: false;
    messageType: number;
    reminderType: string | null;
    rollbackTime: string | null;
    senderName: string | null;
    content: any;
    senderSessionUnit?: SessionUnitDto;
    [key: string]: any;
  }

  interface SessionUnitDto {
    destination?: ChatObjectDto;
    setting?: SessionUnitSettingDto;
    lastMessage: MessageDto;
    lastMessageId: number;
    ownerId: number;
    ownerObjectType: number;
    privateBadge: number;
    publicBadge: number;
    remindAllCount: number;
    remindMeCount: number;
    sessionId: string;
    sorting: number;
    ticks: number;
    [key: string]: any; // 允许任意额外的属性
  }
}
