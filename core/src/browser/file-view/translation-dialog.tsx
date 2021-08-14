import * as React from 'react';
import { inject, injectable } from '@theia/core/shared/inversify';
import { DialogProps, PreferenceService } from '@theia/core/lib/browser';
import { ITranslationEntry } from 'src/common/translation-types';
import { ReactDialog } from '@theia/core/lib/browser/dialogs/react-dialog';
import { TranslationServiceManager } from '../translator/translation-service-manager';
import { TranslationDialogComponent } from './translation-dialog-component';

@injectable()
export class TranslationDialogProps extends DialogProps {

    translationEntry: ITranslationEntry;

}

export class TranslationDialog extends ReactDialog<string> {
    protected render(): React.ReactNode {
        return <TranslationDialogComponent
            translationServiceManager={this.translationServiceManager}
            preferenceService={this.preferenceService}
        />;
    }

    constructor(
        @inject(TranslationDialogProps) protected readonly props: TranslationDialogProps,
        @inject(TranslationServiceManager) protected readonly translationServiceManager: TranslationServiceManager,
        @inject(PreferenceService) protected readonly preferenceService: PreferenceService
    ) {
        super({
            title: props.title,
        });
        this.appendAcceptButton('Ok');
    }

    get value(): string {
        return '';
    }

}