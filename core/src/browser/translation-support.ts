import { MaybePromise } from "@theia/core";
import URI from "@theia/core/lib/common/uri";
import { TranslationResourceParser } from "../common/parser";
import { ITranslationGroupData, ITranslationTreeNodeData, TranslationGroup } from "../common/translation-types";
import { ITranslationManager } from "./translation-manager";

/**
 * handler contribution for the `TranslationSupport`.
 */
export const TranslationSupport = Symbol('TranslationSupport');
export interface TranslationSupport extends ITranslationManager {

    /**
     * Returns with or resolves to the file extensions supported by the current `TranslationSupport` handler.
     * The file extension must not start with the leading `.` (dot). For instance; `'arb'` or `['json', 'properties']`.
     * The file extensions are handled case insensitive.
     */
    supportedExtensions(): MaybePromise<string | string[]>;

    /*
    * Returns true if the given resource is a supported translation resource
    */
    supports(uri: URI): boolean;

    /*
    * Parses the given resource
    */
    getParser(): TranslationResourceParser;

    getTranslationManager(): ITranslationManager;

    /*
    * Whether the contribution actively manages some resources currently or not
    */
    isActive(): boolean;

    /*
    * Returns the available translation groups
    */
    getTranslationGroups(): TranslationGroup[];

    /*
    * Returns the translation keys for the given translation group
    */
    getTranslationKeys(group: TranslationGroup): ITranslationTreeNodeData[];

    /*
    * Returns the data of the given translation group: translation keys, the available languages and the corresponding translation values. 
    */
    getTranslationEntries(group: TranslationGroup): ITranslationGroupData;

}