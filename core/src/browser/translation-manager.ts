
import { FileStat } from '@theia/filesystem/lib/common/files';
import { TextDocumentContentChangeEvent } from 'vscode-languageserver-protocol';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';

/**
 * The `TranslationManager`.
 */
export const TranslationManager = Symbol('ITranslationManager');

// TODO: contribution points for translation file formats...

export interface ITranslationManager {

    /**
     * Returns all available `TranslationNode`s
     */
    getTranslationNodes(): void;

    /*
    * Fired once a translation node changed (renamed, removed or addedS)
    */
    onTranslationNodesChanged(): void;

    onWorkspaceChanged(files: FileStat[]): void;

    onDidChangeTextDocument(model: MonacoEditorModel, event: TextDocumentContentChangeEvent[]): void;

    onDidOpenTextDocument(model: MonacoEditorModel): void;

    onDidSaveTextDocument(model: MonacoEditorModel): void;

}

