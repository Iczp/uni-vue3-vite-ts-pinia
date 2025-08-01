import { FileContentDto } from '@/types/message/FileContentDto';
import { MessageTypes } from './enums';
import { formatText } from './formatWords';
import { SoundContentDto } from '@/types/message/SoundContentDto';
import { LinkContentDto } from '@/types/message/LinkContentDto';
import { HistoryContentOutput } from '@/types/message/HistoryContentOutput';
import { CmdContentDto } from '@/types/message/CmdContentDto';
import { TextContentDto } from '@/types/message/TextContentDto';

export const getSenderNameForMessage = (entity?: Chat.MessageDto | null): string | undefined => {
  if (!entity) {
    return undefined;
  }

  const senderSessionUnit = entity.senderSessionUnit;

  // const displayName = computed(
  //   () => props.entity?.fullPathName?.replace('/', ':') || props.entity?.name,
  // );

  return (
    senderSessionUnit?.owner?.fullPathName?.replace('/', ':') ||
    entity.senderName ||
    entity.senderDisplayName ||
    entity.senderSessionUnit?.displayName
  );
};

export const formatMessageContent = (
  entity?: Chat.MessageDto | null,
  t?: any,
): {
  contentType: string | null | undefined;
  contentText: string;
} => {
  t = t || ((k: string): string => k);
  let contentType: string | undefined;
  let contentText: string = '';

  const isRollbacked = entity?.isRollbacked || entity?.rollbackTime != null;

  if (!entity) {
    return { contentType, contentText };
  }

  if (isRollbacked) {
    contentText = `消息已撤回`;
    return { contentType, contentText };
  }

  const content = entity.content;

  switch (entity.messageType) {
    case MessageTypes.Contacts:
      contentType = `[名片]`;
      break;
    case MessageTypes.Image:
      contentType = `[图片]`;
      break;
    case MessageTypes.Video:
      contentType = `[视频]`;
      break;
    case MessageTypes.File:
      contentType = `[文件]`;
      contentText = formatText((content as FileContentDto).fileName!);
      break;
    case MessageTypes.Sound:
      contentType = `[语音]`;
      contentText = formatText((content as SoundContentDto).time!.toString());
      break;
    case MessageTypes.Link:
      contentType = `[链接]`;
      contentText = formatText((content as LinkContentDto).url!);
      break;
    case MessageTypes.History:
      contentType = `[聊天记录]`;
      contentText = formatText((content as HistoryContentOutput).title!);
      break;
    case MessageTypes.Html:
      contentType = `[HTML]`;
      contentText = formatText((content as HistoryContentOutput).title!);
      break;
    case MessageTypes.Cmd:
      contentType = `[系统]`;
      contentText = formatText((content as CmdContentDto).text!);
      break;
    case MessageTypes.Text:
      contentType = ``;
      contentText = formatText((content as TextContentDto).text!);
      break;
    default:
      contentText = `[未知消息类型: ${entity.messageType}]`;
      break;
  }
  return { contentType, contentText };
};
