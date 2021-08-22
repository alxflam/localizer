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
import { ITranslationEntryRoot, ITranslationGroupData, ITranslationTreeNodeData, TranslationGroup } from '@localizer/core/src/common/translation-types';

interface valueType {
    uri: URI
    fileStat: FileStat
    entries: ITranslationEntry[]
}

@injectable()
export class ArbTranslationSupport implements TranslationSupport {

    @inject(ArbFileParser)
    protected readonly parser: ArbFileParser;

    protected parseResult = new Map<string, valueType>();

    supportedExtensions(): MaybePromise<string | string[]> {
        return 'arb';
    }

    supports(uri: URI): boolean {
        return uri.scheme === 'file' && uri.path.ext === '.arb';
    }

    getParser(): TranslationResourceParser {
        return this.parser;
    }

    getTranslationManager(): ITranslationManager {
        return this;
    }

    getTranslationNodes(): void {

    }

    onTranslationNodesChanged(): void {

    }

    onWorkspaceChanged(files: FileStat[]): void {
        // initially, parse all files async
        if (files.length === 0) {
            return;
        }

        this.processWorkspaceRoot(files[0]);
    }

    async processWorkspaceRoot(root: FileStat): Promise<void> {
        root.children?.forEach(async child => {
            if (child.isFile && this.supports(child.resource)) {
                const parsedResource = await this.getParser().parseByURI(child.resource);
                this.parseResult.set(child.resource.toString(), { uri: child.resource, fileStat: child, entries: parsedResource });
            }
        });
    }

    onDidChangeTextDocument(model: MonacoEditorModel, event: TextDocumentContentChangeEvent[]): void {
        // update the cached state of the parsed doc
        if (!this.supports(new URI(model.uri))) {
            return;
        }

        const entry = this.parseResult.get(model.uri.toString());
        if (entry) {
            // TODO: changes are not yet written to disk, so likely the event needs to be used instead
            const parsedResource = this.getParser().parseByContent(model.getText());
            entry.entries = parsedResource;
        }
    }

    onDidOpenTextDocument(model: MonacoEditorModel): void {
        // check whether the cached state is outdated and update if required
        if (!this.supports(new URI(model.uri))) {
            return;
        }

        const entry = this.parseResult.get(model.uri.toString());
        if (!entry) {
            console.log('file opened which is not yet parsed!!');
        }
    }

    onDidSaveTextDocument(model: MonacoEditorModel): void {
        // update the cached state of the parsed doc
        if (!this.supports(new URI(model.uri))) {
            return;
        }
    }

    isActive(): boolean {
        return true;
    }

    getTranslationGroups(): TranslationGroup[] {
        const result: TranslationGroup[] = [];

        for (const resource of this.parseResult.entries()) {
            const fileName = resource[1].fileStat.name;
            const name = this.getGroupNameFromFileName(fileName);
            const language = this.getLanguageFromFileName(fileName);

            let groupForModification = result.find(a => a.name === name);
            if (!groupForModification) {
                groupForModification = <TranslationGroup>{
                    name: name,
                    resources: {}
                };
                result.push(groupForModification);
            }

            groupForModification.resources[language] = { resource: resource[1].uri};
        }

        return result;
   }

   getTranslation(key: string, uri: string): string | undefined {
    const entries = this.parseResult.entries();

    const resource = Array.from(entries).find(a => a[0].includes(uri));

    if (resource) {
       const val = resource[1].entries.find(a => a.key === key);
       if (val) {
           return val.value;
       }
    }
    return undefined;
   }

    private getLanguageFromFileName(fileName: string): string {
            let language = 'unknown';
            const index = fileName.indexOf('_');
            if (index > -1) {
                const suffix = fileName.substring(index, fileName.length);
                const dotIndex = suffix.lastIndexOf('.');
                language = suffix.substring(1, dotIndex);
            }
            return language;
    }

    private getGroupNameFromFileName(fileName: string): string {
        let group = 'unknown';
        const index = fileName.lastIndexOf('_');
        if (index > -1) {
            group = fileName.substring(0, index);
        }
        return group;
}

    getTranslationKeys(group: TranslationGroup): ITranslationTreeNodeData[] {
        const keys = new Set<string>();
        for (const resource of this.parseResult.entries()) {
            const fileName = resource[1].fileStat.name;
            const name = this.getGroupNameFromFileName(fileName);
            if (name === group.name) {
                resource[1].entries.map(item => item.key).forEach(a => keys.add(a));
            }
        }

        return Array.from(keys).map(a => <ITranslationTreeNodeData>{ key: a });
    }

    getTranslationEntries(group: TranslationGroup): ITranslationGroupData {
        const result: ITranslationGroupData = {
            languages: new Map(),
            data: [],
        };

        for (const resource of this.parseResult.entries()) {
            const fileName = resource[1].fileStat.name;
            const name = this.getGroupNameFromFileName(fileName);
            const language = this.getLanguageFromFileName(fileName);

            // verify group
            if (name !== group.name) {
                continue;
            }

            for (const key of resource[1].entries) {
                const keyData = result.data.find(i => i.key === key.key);
                if (keyData) {
                    keyData.data[language] = key.value;
                } else {
                    const keyDataNew: ITranslationEntryRoot = {
                        key: key.key,
                        description: key.description,
                        data: {}
                    };
                    keyDataNew.data[language] = key.value;
                    result.data.push(keyDataNew);
                }
            }
            result.languages.set(language, resource[1].fileStat.name);
        }

        return result;
    }

    getTranslationEntry(group: TranslationGroup, key: string): ITranslationEntryRoot {
        const keys = this.getTranslationEntries(group);
        const result = keys.data.find(a => a.key === key);
        if (result) {
            return result;
        }
        throw new Error('Key not found');
    }
}
