import { CmdContentDto } from './CmdContentDto';
import { MessageInputTyped } from './MessageInputTyped';
import { TextContentDto } from './TextContentDto';

export interface MessageInput extends MessageInputTyped<any> {
  content?: TextContentDto | CmdContentDto;
}
