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
}
