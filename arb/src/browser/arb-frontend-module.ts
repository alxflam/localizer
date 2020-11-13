import { TranslationSupport } from '@localizer/core/lib/browser/translation-support';
import { ContainerModule } from 'inversify';
import { ArbFileParser } from './arb-file-parser';
import { ArbTranslationSupport } from './arb-translation-support';

export default new ContainerModule(bind => {
    bind(ArbFileParser).toSelf().inSingletonScope();
    bind(TranslationSupport).to(ArbTranslationSupport).inSingletonScope();
});

