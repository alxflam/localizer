import { ContributionProvider } from '@theia/core/lib/common/contribution-provider';
import { inject, named } from '@theia/core/shared/inversify';
import { injectable } from 'inversify';
import { TranslationService } from './translation-service';

@injectable()
export class TranslationServiceManager {

    @inject(ContributionProvider)
    @named(TranslationService)
    protected readonly contributions: ContributionProvider<TranslationService>;

    getTranslationServices(): TranslationService[] {
        return this.contributions.getContributions();
    }

}
