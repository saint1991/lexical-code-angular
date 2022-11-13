import { Renderer2 } from '@angular/core';

import { LexicalEditor } from 'lexical';
import {
  CodeHighlightNode,
  CodeNode,
  registerCodeHighlighting,
} from '@lexical/code';
import { Tokenizer } from '@lexical/code/CodeHighlighter';

import { LexicalConfig, LexicalPlugin, Unregister } from './plugin';
import { CodeEditorNode, TokenNode } from '../nodes/code';

export class CodePlugin implements LexicalPlugin {
  config: LexicalConfig = {
    nodes: [
      CodeEditorNode,
      TokenNode,
      {
        replace: CodeNode,
        with: (node: CodeNode) => {
          return new CodeEditorNode(node.__language);
        },
      },
      {
        replace: CodeHighlightNode,
        with: (node: CodeHighlightNode) => {
          return new TokenNode(node.__text, false, false, node.__highlightType);
        },
      },
    ],
  };

  constructor(readonly tokenizer?: Tokenizer) {}

  apply(editor: LexicalEditor): Unregister {
    return registerCodeHighlighting(editor, this.tokenizer);
  }
}
