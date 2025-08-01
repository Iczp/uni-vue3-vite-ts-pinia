import { MessageContent } from './messageContent';

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
