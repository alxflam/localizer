import { ITranslationEntry, ITranslationKeyDescription } from '@localizer/core/src/common/translation-types';
import { TranslationResourceParser } from '@localizer/core/src/common/parser';
import * as jsoncparser from 'jsonc-parser';
        // import { FileUri } from '@theia/core/lib/node/file-uri';
        // import * as fs from 'fs-extra';
import { inject, injectable } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { FileService } from '@theia/filesystem/lib/browser/file-service';

@injectable()
export class ArbFileParser implements TranslationResourceParser {

    @inject(FileService)
    protected fileService: FileService;

    async parseByURI(uri: URI): Promise<ITranslationEntry[]> {
        // read file contents from disk
        const fileContent = await this.fileService.readFile(uri, 'utf-8');
        // transform to string
        const content = fileContent.value.toString();
        // parse as json
        const json = jsoncparser.parse(jsoncparser.stripComments(content)) || {};
        // then forward parsing
        return this.parseByContent(json);
    }

    parseByContent(content: any): ITranslationEntry[] {
        // create an intermediary result structure: the translation key and it's assigned value
        const result = new Map<string, ITranslationEntry>();

        // process every key of the json
        for (const [key, value] of Object.entries(content)) {
            const isTranslation = typeof value === 'string';
            if (key.startsWith('@@')) {
                // a metadata key, ignore for now
                continue;
            } else if (isTranslation) {
                // it's the translation entry
                const entry = result.get(key);
                if (!entry) {
                    // description node has not yet been processed
                    result.set(key, {
                        line: 1,
                        key: key,
                        value: value as string,
                        description: undefined
                    });
                } else {
                    // description node exists, update the translation value
                    entry.value = value as string;
                }
            } else if (key.startsWith('@')) {
                // it's a description node
                const keyValue = value as any;
                // get the parsed node, if already existing, by removing the leading '@'
                const entry = result.get(key.substring(1, key.length));
                const description: ITranslationKeyDescription = {
                    description: keyValue['description'],
                    placeholders: []
                };
                if (entry) {
                    // translation key already processed
                    entry.description = description;
                } else {
                    // create the translation entry with empty values
                    // likely that the tarnslation value entry is written later
                    result.set(key, { line: 1, key: key, value: '', description: description });
                }
            }
        }

        return Array.from(result.values());
    }
}
