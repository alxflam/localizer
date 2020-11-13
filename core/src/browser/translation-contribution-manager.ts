import { ContributionProvider } from '@theia/core';
import URI from '@theia/core/lib/common/uri';
import { injectable, inject, named } from 'inversify';
import { TranslationGroup } from '../common/translation-types';
import { TranslationSupport } from './translation-support';

@injectable()
export class TranslationManager {

    @inject(ContributionProvider)
    @named(TranslationSupport)
    protected readonly contributions: ContributionProvider<TranslationSupport>;

    protected service: TranslationSupport;

    setTranslationSupport(instance: TranslationSupport) {
        this.service = instance
    }

    getTranslationSupport(): TranslationSupport {
        if (this.service === undefined) {
            throw 'No TranslationSupport instance is active!'
        }
        return this.service
    }

    getTranslationSupportForURI(uri: URI): TranslationSupport {
        var result: TranslationSupport | undefined;
        for (const handler of this.contributions.getContributions()) {
            if (handler.supports(uri)) {
                result = handler;
            }
        }
        if (result === undefined) {
            throw 'No TranslationSupport instance supports the resource ' + uri
        }
        return result;
    }

    getTranslationGroups(): TranslationGroup[] {
        return [
            {
                name: 'something',
                resources: []
            }
        ]
    }

}