export enum ObjectTypes {
  Anonymous = 0,
  Personal = 1,
  Room = 2,
  Official = 3,
  Subscription = 4,
  Square = 5,
  Robot = 6,
  ShopKeeper = 7,
  ShopWaiter = 8,
  Customer = 9,
}

// 定义枚举描述映射对象

export const objectTypeDescriptions: { [key in ObjectTypes]: string } = {
  [ObjectTypes.Anonymous]: '匿名',
  [ObjectTypes.Personal]: '个人',
  [ObjectTypes.Room]: '群',
  [ObjectTypes.Official]: '服务号',
  [ObjectTypes.Subscription]: '订阅号',
  [ObjectTypes.Square]: '广场',
  [ObjectTypes.Robot]: '机器人',
  [ObjectTypes.ShopKeeper]: '掌柜',
  [ObjectTypes.ShopWaiter]: '店小二',
  [ObjectTypes.Customer]: '客户',
};

export enum MessageTypes {
  Text = 0, // 文本类型
  Cmd = 1, // 系统命令消息
  Image = 2, // 图片类型
  Sound = 3, // 语音类型
  Video = 4, // 视频类型
  File = 5, // 文件消息
  Link = 6, // 链接类型
  Location = 7, // 地理位置
  Contacts = 8, // 联系人名片
  RedEnvelope = 9, // 红包
  Html = 10, // HTML
  Article = 11, // 文章
  History = 12, // 聊天历史消息
}

// 为 MessageTypes 枚举添加描述映射对象
export const messageTypeDescriptions: { [key in MessageTypes]: string } = {
  [MessageTypes.Text]: '文本类型',
  [MessageTypes.Cmd]: '系统命令消息',
  [MessageTypes.Image]: '图片类型',
  [MessageTypes.Sound]: '语音类型',
  [MessageTypes.Video]: '视频类型',
  [MessageTypes.File]: '文件消息',
  [MessageTypes.Link]: '链接类型',
  [MessageTypes.Location]: '地理位置',
  [MessageTypes.Contacts]: '联系人名片',
  [MessageTypes.RedEnvelope]: '红包',
  [MessageTypes.Html]: 'HTML',
  [MessageTypes.Article]: '文章',
  [MessageTypes.History]: '聊天历史消息',
};



export enum EditorTypes {
    'Undefined' = 0,
    'Markdown' = 1,
    'Html' = 2,
}

/**
 * 红包发放方式（0：随机金额;1:固定金额）
 */
export enum GrantModes {
  'Undefined' = 0,
  'Markdown' = 1,
  'Html' = 2,
}
