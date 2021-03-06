import * as React from 'react';
import { inject, injectable } from '@theia/core/shared/inversify';
import { DialogProps, PreferenceService } from '@theia/core/lib/browser';
import { ITranslationEntry } from 'src/common/translation-types';
import { ReactDialog } from '@theia/core/lib/browser/dialogs/react-dialog';
import { TranslationServiceManager } from '../translator/translation-service-manager';
import { TranslationDialogComponent } from './translation-dialog-component';
import { TranslationManager } from '../translation-contribution-manager';

@injectable()
export class TranslationDialogProps extends DialogProps {

    translationEntry: ITranslationEntry;
    targetLanguage: string;
    translationKey: string;

}

export class TranslationDialog extends ReactDialog<string> {

    private component: TranslationDialogComponent | undefined;

    protected render(): React.ReactNode {
       return <TranslationDialogComponent
       translationManager={this.translationManager}
       translationServiceManager={this.translationServiceManager}
       preferenceService={this.preferenceService}
       targetLanguage={this.props.targetLanguage}
       translationKey={this.props.translationKey}
       ref={comp => this.component = comp ?? undefined} />;
    }

    constructor(
        @inject(TranslationDialogProps) protected readonly props: TranslationDialogProps,
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
