// import { ObjectTypes } from "@/utils/enums";

declare namespace Chat {
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
    verificationMethod?: Number | null;
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
    ownerId?: number | null;
    // 目标聊天对象Id
    destinationId?: number | null;
    destinationObjectType?: number | null;
    isCreator?: boolean | null;
    isTopping?: boolean | null;
    isContacts?: boolean | null;
    isImmersed?: boolean | null;
    isKilled?: boolean | null;
    // 最小消息Id
    minMessageId?: number | null;
    // 最大消息Id
    maxMessageId?: number | null;
    isBadge?: boolean | null;
    isRemind?: boolean | null;
    isFollowing?: boolean | null;
    [key: string]: any; // 允许任意额外的属性
  }

  interface DestinationListInput extends GetListInput {
    // sessionUnitId
    id?: string | null;
    isMuted?: boolean | null;
    isKilled?: boolean | null;
    isPublic?: boolean | null;
    isStatic?: boolean | null;
    // 目标聊天对象Id
    ownerIdList?: Array<string> | null;
    ownerTypeList?: Array<ObjectTypes> | null;
    tabId?: string | null;
    roleId?: string | null;
    joinWay?: Array<number> | null;
    inviterId?: string;
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
    id: number;
    creationTime?: string;
    extraProperties?: object;

    messageType?: number;
    reminderType?: string | null;
    rollbackTime?: string | null;
    senderName?: string | null;
    senderDisplayName?: string | null;
    openedCount?: number;
    quoteDepth?: number;
    quoteMessage?: MessageDto | null;
    quoteMessageId?: number | null;
    readedCount?: number;

    content?: any;
    senderSessionUnit?: SessionUnitDto | null;
    isFavorited?: boolean;
    isFollowing?: boolean;
    isOpened?: boolean;
    isPrivate?: boolean;
    isReaded?: boolean;
    isRemindAll?: boolean;
    isRemindMe?: boolean;
    isRollbacked?: boolean;

    [key: string]: any;
  }

  /**
   * 文本消息
   */
  export interface TextContentDto {
    /**
     * id
     *
     * @type {(string | null)}
     */
    id?: string;
    /**
     * 文本内容
     */
    text: string;
  }

  export interface SessionUnitDto {
    id: string;
    destination?: ChatObjectDto;
    owner?: ChatObjectDto;
    setting?: SessionUnitSettingDto | null;
    lastMessage?: MessageDto | null;
    lastMessageId?: number | null;
    ownerId: number | null;
    ownerObjectType: ObjectTypes | null;
    privateBadge: number | null;
    publicBadge: number | null;
    remindAllCount: number | null;
    remindMeCount: number | null;
    sessionId: string | null;
    sorting: number | null;
    ticks: number | null;
    creationTime?: string | null;
    LastModificationTime?: string | null;
    sessionUnitCount?: number | null;
    localTime?: Date | String | null; // 本地时间
    friendshipSessionUnitId?: string | null;
    friendshipName?: string | null;
    isFriendship?: boolean;
    [key: string]: any; // 允许任意额外的属性
  }

  interface MessageListInput extends GetListInput {
    sessionUnitId?: string | null;
    // 发送人【聊天对象】
    senderId?: number | null;
    // 是否有提醒
    isRemind?: boolean | null;
    // 是否特别关注
    isFollowed?: boolean | null;
    // 转发层级
    forwardDepth?: number | null;
    // 最小消息Id
    minMessageId?: number | null;
    // 最大消息Id
    maxMessageId?: number | null;
    [key: string]: any; // 允许任意额外的属性
  }
}
