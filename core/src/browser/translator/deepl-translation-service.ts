import { TranslationService } from './translation-service';
import { injectable } from 'inversify';
import { inject } from '@theia/core/shared/inversify';
import { PreferenceService } from '@theia/core/lib/browser';
import { prefDeeplApiKey } from './deepl-preferences';

@injectable()
export class DeeplTranslationService implements TranslationService {

    @inject(PreferenceService)
    protected readonly preferenceService: PreferenceService;

    getID(): string {
        return 'localizer.translation.services.deepl';
    }

    getServiceName(): string {
        return 'DeepL';
    }

    async translate(value: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
        const sub_domain = 'api-free'; // can also be api for the pro api keys
        const apiKey = this.preferenceService.get<string>(prefDeeplApiKey) ?? '';

        const params = new URLSearchParams({ auth_key: apiKey, text: value, target_lang: targetLanguage });

        const url = `https://${sub_domain}.deepl.com/v2/translate`;
        const response = await fetch(url + '?' + params, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
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
