import { LexicalEditor } from 'lexical';
import { registerPlainText } from '@lexical/plain-text';

import { LexicalPlugin, Unregister } from './plugin';

export const PlainTextPlugin: LexicalPlugin = {
  apply(editor: LexicalEditor): Unregister {
    return registerPlainText(editor);
  },
};
