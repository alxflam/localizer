import { NavigatableWidgetOpenHandler } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { injectable, inject, named } from 'inversify';
import { EditorManager } from '@theia/editor/lib/browser';
import { TranslationFileWidget } from './translation-file-widget';
import { ContributionProvider } from '@theia/core';
import { TranslationSupport } from '../translation-support';

@injectable()
export class TranslationFileOpenHandler extends NavigatableWidgetOpenHandler<TranslationFileWidget> {

    readonly id = TranslationFileWidget.id;
    readonly label = 'Translation';

    @inject(EditorManager)
    protected readonly editorManager: EditorManager;

    @inject(ContributionProvider)
    @named(TranslationSupport)
    protected readonly contributions: ContributionProvider<TranslationSupport>;

    getContributions(): TranslationSupport[] {
        return this.contributions.getContributions();
    }

    canHandle(uri: URI): number {
        let supportedHandler: TranslationSupport | undefined;

        for (const handler of this.getContributions()) {
            if (handler.supports(uri)) {
                supportedHandler = handler;
                break;
            }
        }

        if (!supportedHandler) {
            return 0;
        }

        if (uri.path.name.endsWith('-data')) {
            return this.editorManager.canHandle(uri) * 2;
        }

        return this.editorManager.canHandle(uri) / 2;
    }
}
