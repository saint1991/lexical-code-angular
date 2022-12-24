import {
  LexicalEditor,
  Klass,
  LexicalNode,
  EditorThemeClasses,
  createEditor,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { ErrorHandler } from 'lexical/LexicalEditor';
import { merge } from 'lodash-es';

export type Unregister = () => void;

export interface LexicalConfig {
  disableEvents?: boolean;
  namespace?: string;
  nodes?: ReadonlyArray<
    | Klass<LexicalNode>
    | {
        replace: Klass<LexicalNode>;
        with: <
          T extends {
            new (...args: any): any;
          }
        >(
          node: InstanceType<T>
        ) => LexicalNode;
      }
  >;
  onError?: ErrorHandler;
  parentEditor?: LexicalEditor;
  editable?: boolean;
  theme?: EditorThemeClasses;
}

export interface LexicalPlugin {
  config?: LexicalConfig;
  apply(editor: LexicalEditor): Unregister;
}

export const initializeEditor = (
  element: HTMLElement,
  plugins: LexicalPlugin[],
  config?: LexicalConfig
): [LexicalEditor, Unregister] => {
  const configs = plugins
    .map((plugin) => plugin.config)
    .filter((config) => config != null);
  const baseConfig = config != null ? config : { onError: console.error };
  const editorConfig = merge(baseConfig, ...configs);

  const editor = createEditor(editorConfig);
  editor.setRootElement(element);

  const unregister = mergeRegister(
    ...plugins.map((plugin) => plugin.apply(editor))
  );
  return [editor, unregister];
};
