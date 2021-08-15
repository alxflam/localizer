import { TranslationService } from './translation-service';
import { injectable } from 'inversify';

@injectable()
export class LibreTranslationService implements TranslationService {

    getID(): string {
        return 'localizer.translation.services.libre';
    }

    getServiceName(): string {
        return 'LibreTranslate';
    }

    async translate(value: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        // see https://github.com/LibreTranslate/LibreTranslate#mirrors
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parameters  = <any>{
            q: value,
            target: targetLanguage
        };
        if (sourceLanguage) {
            parameters.source = sourceLanguage;
        }
        const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            body: JSON.stringify(parameters),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 403) {
            throw new Error('Forbidden - Does the mirror now require an API key?');
        }

        if (response.status === 200) {
            const json = await response.json();
            const result = json['translatedText'];

            if (result) {
                return result as string;
            } else {
                throw new Error('Invalid JSON.');
            }
        } else {
            throw new Error('Response has no valid status code: ' + response.status);
        }
    }

}
