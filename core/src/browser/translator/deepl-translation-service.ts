import { TranslationService } from './translation-service';
import { injectable } from 'inversify';

@injectable()
export class DeeplTranslationService implements TranslationService {

    getID(): string {
        return 'localizer.translation.services.deepl';
    }

    getServiceName(): string {
        return 'DeepL';
    }

    async translate(value: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        const sub_domain = 'api-free'; // can also be api for the pro api keys
        const url = `https://${sub_domain}.deepl.com/v2/translate`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            keepalive: true,
            body: JSON.stringify({ auth_key: '', text: value, target_lang: targetLanguage })
        });

        if (response.status === 403) {
            throw new Error('Forbidden - Check API key');
        }

        if (response.status === 200) {
            const json = await response.json();
            const translations = json['translations'];

            if (Array.isArray(translations)) {
                return translations[0]['text'] as string;
            } else {
                throw new Error('Received invalid long polling response.');
            }
        } else {
            throw new Error('Response has no valid status code: ' + response.status);
        }
    }

}
