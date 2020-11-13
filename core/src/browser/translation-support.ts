import { MaybePromise } from "@theia/core";
import URI from "@theia/core/lib/common/uri";
import { TranslationResourceParser } from "../common/parser";
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

}