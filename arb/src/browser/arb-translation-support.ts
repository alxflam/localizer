import { TranslationSupport } from '@localizer/core/lib/browser/translation-support';
import { MaybePromise } from '@theia/core';
import URI from '@theia/core/lib/common/uri';
import { FileStat } from '@theia/filesystem/lib/common/files';
import { TextDocumentContentChangeEvent } from 'vscode-languageserver-protocol';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { TranslationResourceParser } from '@localizer/core/lib/common/parser';
import { ArbFileParser } from './arb-file-parser';
import { injectable, inject } from 'inversify';
import { ITranslationEntry } from '@localizer/core/lib/common/translation-types';
import { ITranslationManager } from '@localizer/core/lib/browser/translation-manager';


interface valueType {
    uri: URI
    fileStat: FileStat
    entries: ITranslationEntry[]
}

@injectable()
export class ArbTranslationSupport implements TranslationSupport {

    @inject(ArbFileParser)
    protected readonly parser: ArbFileParser

    protected parseResult = new Map<string, valueType>()


    supportedExtensions(): MaybePromise<string | string[]> {
        return 'arb'
    }

    supports(uri: URI): boolean {
        return uri.scheme === 'file' && uri.path.ext === '.arb'
    }

    getParser(): TranslationResourceParser {
        return this.parser
    }

    getTranslationManager(): ITranslationManager {
        return this
    }

    getTranslationNodes() {

    }

    onTranslationNodesChanged() {

    }

    onWorkspaceChanged(files: FileStat[]) : void {
        // initially, parse all files async
        if (files.length === 0) {
            return
        }

        files[0].children?.forEach((child) => {
            if (child.isFile && this.supports(child.resource)) {
               const parsedResource = this.getParser().parseByURI(child.resource)
               this.parseResult.set(child.resource.toString(), {uri: child.resource, fileStat: child, entries: parsedResource })
            }
        })
    }

    onDidChangeTextDocument(model: MonacoEditorModel, event: TextDocumentContentChangeEvent[]): void {
        // update the cached state of the parsed doc
        if(!this.supports(new URI(model.uri))) {
            return
        }
        
        const entry = this.parseResult.get(model.uri.toString())
        if (entry) {
            // TODO: changes are not yet written to disk, so likely the event needs to be used instead
            const parsedResource = this.getParser().parseByURI(new URI(model.uri))
            entry.entries = parsedResource
        }
    }

    onDidOpenTextDocument(model: MonacoEditorModel): void {
        // check whether the cached state is outdated and update if required
        if(!this.supports(new URI(model.uri))) {
            return
        }

        const entry = this.parseResult.get(model.uri.toString())
        if (!entry) {
            console.log('file opened which is not yet parsed!!')
        }
    }

    onDidSaveTextDocument(model: MonacoEditorModel): void {
        // update the cached state of the parsed doc
        if(!this.supports(new URI(model.uri))) {
            return
        }

    }

}