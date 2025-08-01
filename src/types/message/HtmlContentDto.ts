import { EditorTypes } from '@/utils/enums';

/**
 * HTML消息
 */
export interface HtmlContentDto {
  id?: string | null;
  /**
   * 编辑器类型
   */
  editorType?: EditorTypes;
  /**
   * 文本内容
   */
  title?: string | null;
  /**
   * 内容
   */
  content?: string | null;
  /**
   * 原始地址
   */
  originalUrl?: string | null;
}
