import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { LexicalEditor } from 'lexical';

import {
  initializeEditor,
  LexicalConfig,
  LexicalPlugin,
  Unregister,
} from './plugins';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editor')
  rootElement: ElementRef | undefined = undefined;

  private editor: LexicalEditor | undefined = undefined;
  private unregister: Unregister | undefined = undefined;

  @Input() config?: LexicalConfig = undefined;
  @Input() plugins: LexicalPlugin[] = [];

  @Output() editorInitEvent = new EventEmitter<LexicalEditor>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initEditor();
  }

  ngOnDestroy(): void {
    if (this.unregister != null) {
      this.unregister();
    }
  }

  private initEditor() {
    [this.editor, this.unregister] = initializeEditor(
      this.rootElement?.nativeElement,
      this.plugins,
      this.config
    );

    this.editorInitEvent.emit(this.editor);
  }
}
