import { ObjectTypes } from '@/utils/enums';

/**
 * 联系人消息
 */
export interface ContactsContentDto {
  id?: string | null;
  /**
   *
   *
   * @type {number}
   */
  destinationId?: number;
  /**
   * 联系人名称
   */
  name?: string | null;
  /**
   *
   *
   * @type {(string | null)}
   */
  code?: string | null;
  /**
   * 头像
   */
  portrait?: string | null;

  /**
   *
   *
   * @type {(ObjectTypes | null)}
   */
  objectType?: ObjectTypes | null;
  /**
   * 说明
   */
  description?: string | null;
  /**
   * 备注
   */
  remark?: string | null;
}
