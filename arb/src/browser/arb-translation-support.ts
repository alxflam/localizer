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
import { ITranslationTreeNodeData, TranslationGroup } from '@localizer/core/src/common/translation-types';


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

        this.processWorkspaceRoot(files[0])
    }

    async processWorkspaceRoot(root: FileStat) {
        root.children?.forEach(async (child) => {
            if (child.isFile && this.supports(child.resource)) {
               const parsedResource = await this.getParser().parseByURI(child.resource)
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
            const parsedResource = this.getParser().parseByContent(model.getText())
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

    isActive(): boolean {
        return true;
    }

    getTranslationGroups(): TranslationGroup[] {
        let groupNames = new Set();
        for (const resource of this.parseResult.entries()) {
            let name = resource[1].fileStat.name
            const index = name.lastIndexOf('_')
            if (index > -1) {
                name = name.substring(0, index)
            }
            groupNames.add(name)
        }

        return Array.from(groupNames).map(a => <TranslationGroup>{ name: a, resources: [] });
    }

    getTranslationKeys(group: TranslationGroup): ITranslationTreeNodeData[] {
        let keys = new Set();
        for (const resource of this.parseResult.entries()) {
            let name = resource[1].fileStat.name
            const index = name.lastIndexOf('_')
            if (index > -1) {
                name = name.substring(0, index)
            }
            if (name === group.name) {
                resource[1].entries.map(item => item.key).forEach(a => keys.add(a))
            }
        }

        return Array.from(keys).map(a => <ITranslationTreeNodeData>{ key: a});

    }
}