import { Renderer2 } from '@angular/core';

import {
  $getSelection,
  $isRangeSelection,
  $nodesOfType,
  $setSelection,
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {
  CodeHighlightNode,
  CodeNode,
  registerCodeHighlighting,
} from '@lexical/code';
import { Tokenizer } from '@lexical/code/CodeHighlighter';

import { LexicalConfig, LexicalPlugin, Unregister } from './plugin';
import { $isTokenNode, CodeEditorNode, TokenNode } from '../nodes/code';
import { mergeRegister } from '@lexical/utils';

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
    return mergeRegister(
      registerCodeHighlighting(editor, this.tokenizer),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection) && selection.isCollapsed()) {
            const anchor = selection.anchor;
            const node = anchor.getNode();
            if ($isTokenNode(node) && !node.getSelected()) {
              editor.update(() => {
                const tokens = $nodesOfType(TokenNode);
                tokens.forEach((t) => t.setSelected(false));
                node.setSelected(true);
              });
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),

      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          editor.update(() => {
            $setSelection(null);
            const tokens = $nodesOfType(TokenNode);
            tokens.forEach((t) => t.setSelected(false));
          });
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }
}
