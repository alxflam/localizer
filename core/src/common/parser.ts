import URI from '@theia/core/lib/common/uri';
import { ITranslationEntry } from './translation-types';

/*
* Parser for translation resources
*/
export interface TranslationResourceParser {

    /*
    * Parse the given resource content
    */
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseByContent(content: any): ITranslationEntry[];

    /*
    * Reads the given resource from disk and returns the parse result
    */
    parseByURI(uri: URI): Promise<ITranslationEntry[]>;

}
