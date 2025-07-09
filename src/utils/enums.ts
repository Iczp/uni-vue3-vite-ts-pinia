export enum ObjectType {
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

export const objectTypeDescriptions: { [key in ChatApi.ObjectType]: string } = {
  [ChatApi.ObjectType.Anonymous]: '匿名',
  [ChatApi.ObjectType.Personal]: '个人',
  [ChatApi.ObjectType.Room]: '群',
  [ChatApi.ObjectType.Official]: '服务号',
  [ChatApi.ObjectType.Subscription]: '订阅号',
  [ChatApi.ObjectType.Square]: '广场',
  [ChatApi.ObjectType.Robot]: '机器人',
  [ChatApi.ObjectType.ShopKeeper]: '掌柜',
  [ChatApi.ObjectType.ShopWaiter]: '店小二',
  [ChatApi.ObjectType.Customer]: '客户',
};
