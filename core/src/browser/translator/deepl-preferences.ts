import { PreferenceContribution, PreferenceSchema } from '@theia/core/lib/browser';
import { interfaces } from '@theia/core/shared/inversify';

export const prefDeeplApiKey: string = 'localizer.deepl.apiKey';

export const deeplPreferenceSchema: PreferenceSchema = {
    'type': 'object',
    properties: {
        'localizer.deepl.apiKey': {
            'type': 'string',
            'description': 'The DeepL API Key'
        }
    }
};

export function bindDeeplPreferences(bind: interfaces.Bind): void {
    bind(PreferenceContribution).toConstantValue({ schema: deeplPreferenceSchema });
}
