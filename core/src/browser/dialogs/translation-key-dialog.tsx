import * as React from 'react';
import { inject, injectable } from '@theia/core/shared/inversify';
import { DialogProps, PreferenceService } from '@theia/core/lib/browser';
import { ITranslationEntryRoot } from 'src/common/translation-types';
import { ReactDialog } from '@theia/core/lib/browser/dialogs/react-dialog';
import { TranslationServiceManager } from '../translator/translation-service-manager';
import { TranslationManager } from '../translation-contribution-manager';
import { TranslationKeyDialogComponent } from './translation-key-dialog-comp';

@injectable()
export class TranslationKeyDialogProps extends DialogProps {

    translationEntry: ITranslationEntryRoot;

}

export class TranslationKeyDialog extends ReactDialog<string> {

    private component: TranslationKeyDialogComponent | undefined;

    protected render(): React.ReactNode {
       return <TranslationKeyDialogComponent
       translationManager={this.translationManager}
       translationServiceManager={this.translationServiceManager}
       preferenceService={this.preferenceService}
       translationEntry={this.props.translationEntry}
       ref={comp => this.component = comp ?? undefined} />;
    }

    constructor(
        @inject(TranslationKeyDialogProps) protected readonly props: TranslationKeyDialogProps,
        @inject(TranslationServiceManager) protected readonly translationServiceManager: TranslationServiceManager,
        @inject(PreferenceService) protected readonly preferenceService: PreferenceService,
        @inject(TranslationManager) protected readonly translationManager: TranslationManager
    ) {
        super({
            title: props.title,
        });
        this.appendCloseButton('Cancel');
        this.appendAcceptButton('Apply');
    }

    get value(): string {
        if (this.component) {
            return this.component.getResult();
        }
        return '';
    }

}
