/**
 * 聊天历史
 */
export interface HistoryContentInput  {
    id?: string | null;
    /**
     * 消息Id列表
     */
    messageIdList?: Array<number> | null;
};
