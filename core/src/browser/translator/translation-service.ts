/**
 * handler contribution for the `TranslationSupport`.
 */
export const TranslationService = Symbol('TranslationService');
export interface TranslationService {

    /**
     * The service ID
     */
    getID(): string;

    /**
     * The name of the translation service
     */
    getServiceName(): string;

    /**
     * Translates the given string
     *
     * @param value the string to be translated
     * @param sourceLanguage the language of string to be translated
     * @param targetLanguage the language to be translated to
     */
    translate(value: string, sourceLanguage: string | undefined, targetLanguage: string): Promise<string>;

}
