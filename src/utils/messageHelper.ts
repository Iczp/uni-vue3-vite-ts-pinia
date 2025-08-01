import { MessageTypes } from "./enums";
import { formatText } from "./formatWords";

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
  entity?: Chat.MessageDto,
  t?: any,
): {
  contentType: string | undefined;
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
    contentText = t('Message is rollbacked');
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
      contentType = `[${t('MessageType.Cmd')}]`;
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
