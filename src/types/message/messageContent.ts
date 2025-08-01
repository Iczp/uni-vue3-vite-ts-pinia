import { CmdContentDto } from './CmdContentDto';
import { TextContentDto } from './TextContentDto';

export interface MessageContent extends TextContentDto, CmdContentDto {}
