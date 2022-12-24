import { Component, Renderer2 } from '@angular/core';

import {
  CodePlugin,
  LexicalConfig,
  LexicalPlugin,
  PlainTextPlugin,
} from './editor/plugins';
import { Token, Tokenizer } from '@lexical/code/CodeHighlighter';
import { LexicalEditor, $createTextNode, $getRoot } from 'lexical';
import { $createCodeEditorNode } from './editor/nodes/code';

const tokenizer: Tokenizer = {
  defaultLanguage: 'custom',
  tokenize(code: string, language?: string): (string | Token)[] {
    const trimmed = code.trim();
    const braceIndex = trimmed.indexOf('(');
    const closeBraceIndex = trimmed.indexOf(')');
    const funcName = code.substring(0, braceIndex);

    const enclosed = trimmed.substring(braceIndex + 1, closeBraceIndex);
    const args = enclosed.split(',');

    const tokens: Token[] = [
      {
        type: 'function',
        content: funcName,
      },
      {
        type: 'brace',
        content: '(',
      },
    ];

    args.forEach((arg, index) => {
      tokens.push({
        type: 'arg',
        content: arg,
      });
      if (index !== args.length - 1) {
        tokens.push({
          type: 'comma',
          content: ',',
        });
      }
    });
    tokens.push({
      type: 'brace',
      content: ')',
    });

    return tokens;
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'lexical-code-angular';

  plugins: LexicalPlugin[] = [PlainTextPlugin, new CodePlugin(tokenizer)];

  config: LexicalConfig = {
    namespace: 'lexical-code-sample',
    onError: console.error,
    theme: {
      codeHighlight: {
        function: 'function',
        brace: 'brace',
        arg: 'arg',
        comma: 'comma',
      },
    },
  };

  initialText: string = 'SUM(a,b)';

  constructor(private readonly renderer: Renderer2) {}

  onInitEditor(editor: LexicalEditor) {
    editor.update(() => {
      const root = $getRoot();
      const code = $createCodeEditorNode();
      const text = $createTextNode(this.initialText);
      code.append(text);
      root.append(code);
    });
  }
}
