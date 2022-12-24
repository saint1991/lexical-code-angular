import { CodeHighlightNode, CodeNode } from '@lexical/code';
import {
  addClassNamesToElement,
  removeClassNamesFromElement,
} from '@lexical/utils';
import {
  $applyNodeReplacement,
  EditorConfig,
  ElementNode,
  LexicalNode,
  NodeKey,
} from 'lexical';

export class CodeEditorNode extends CodeNode {
  static override getType(): string {
    return 'code-editor';
  }

  static override clone(node: CodeEditorNode): CodeEditorNode {
    return new CodeEditorNode(node.__language);
  }

  override collapseAtStart(): true {
    return true;
  }
}

export class TokenNode extends CodeHighlightNode {
  /** @internal */
  __error: boolean;
  __selected: boolean;

  static SELECTED_CLASS = 'selected';
  static ERROR_CLASS = 'error';

  static override getType(): string {
    return 'token';
  }

  static override clone(node: TokenNode): TokenNode {
    return new TokenNode(
      node.__text,
      node.__selected,
      node.__error,
      node.__highlightType,
      node.__key
    );
  }

  constructor(
    text: string,
    selected: boolean = false,
    error: boolean = false,
    highlightType?: string | null | undefined,
    key?: NodeKey
  ) {
    super(text, highlightType, key);
    this.__selected = selected;
    this.__error = error;
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    if (this.__selected) {
      addClassNamesToElement(element, TokenNode.SELECTED_CLASS);
    }
    if (this.__error) {
      addClassNamesToElement(element, TokenNode.ERROR_CLASS);
    }
    return element;
  }

  override updateDOM(
    prevNode: TokenNode,
    dom: HTMLElement,
    config: EditorConfig
  ): boolean {
    const updated = super.updateDOM(prevNode, dom, config);

    if (!prevNode.__selected && this.__selected) {
      addClassNamesToElement(dom, TokenNode.SELECTED_CLASS);
    } else if (prevNode.__selected && !this.__selected) {
      removeClassNamesFromElement(dom, TokenNode.SELECTED_CLASS);
    }

    if (!prevNode.__error && this.__error) {
      addClassNamesToElement(dom, TokenNode.ERROR_CLASS);
    } else if (prevNode.__error && !this.__error) {
      removeClassNamesFromElement(dom, TokenNode.ERROR_CLASS);
    }

    return updated;
  }

  getError(): boolean {
    const self = this.getLatest();
    return self.__error;
  }

  setError(error: boolean) {
    const self = this.getWritable();
    self.__error = error;
  }

  getSelected(): boolean {
    const self = this.getLatest();
    return self.__selected;
  }

  setSelected(selected: boolean) {
    const self = this.getWritable();
    self.__selected = selected;
  }
}

export const $createCodeEditorNode = (language?: string): ElementNode => {
  return $applyNodeReplacement(new CodeEditorNode(language));
};

export const $isTokenNode = (node: any): node is TokenNode => {
  return node instanceof TokenNode;
};
