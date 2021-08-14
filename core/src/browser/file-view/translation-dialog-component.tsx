import * as React from 'react';
// import { JSONSchema6 } from 'json-schema';
// import * as jsoncparser from 'jsonc-parser';
// import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
// import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
// import { DisposableCollection } from '@theia/core';
// import { ITranslationEntry } from '../../common/translation-types';
// import { TranslationResourceParser } from '../../common/parser';
// import { ChangeEventHandler } from '@theia/core/shared/react';
import { TranslationServiceManager } from '../translator/translation-service-manager';
import { PreferenceService } from '@theia/core/lib/browser';
import { ChangeEvent } from '@theia/core/shared/react';
import { TranslationManager } from '../translation-contribution-manager';
// import { TranslationService } from '../translator/translation-service';
// import { TranslationDialog, TranslationDialogProps } from './translation-dialog';

export namespace TranslationDialogComponent {
    export interface Props {
        translationManager: TranslationManager
        translationServiceManager: TranslationServiceManager
        preferenceService: PreferenceService
        targetLanguage: string
    }
    export interface State {
        selectedSource: string
        sourceText: string
        translationService: string // TODO: add id to every service so it can be used as a key
    }
}

export class TranslationDialogComponent extends React.Component<TranslationDialogComponent.Props, TranslationDialogComponent.State> {

    constructor(props: TranslationDialogComponent.Props) {
        super(props);
        this.state = {
            selectedSource: '',
            sourceText: '',
            translationService: ''
        };

        this.handleSourceTextChange = this.handleSourceTextChange.bind(this);
        this.handleTranslationServiceChange = this.handleTranslationServiceChange.bind(this);
    }

    render(): JSX.Element | null {
        //     const test = this.preferenceService;
        //     console.log(test);
        //     console.log(this.translationServiceManager);
        //     const apiKey = this.preferenceService.get<string>(prefDeeplApiKey);
        //     console.log('Received API Key' + apiKey);

        // translationService.translate(sourceValue, undefined, targetLanguage).then(value => (
        //     console.log('Translation returned ' + value)
        // ));

        // render:
        // dropdown for source entry to be translated
        // display of the source entry
        // field for the target language read only
        // dropdown for selection service

        const translationServices = this.props.translationServiceManager.getTranslationServices();
        const groups = this.props.translationManager.getTranslationGroups();
        const firstGroup = groups[0];

        return <>
            <div>
                <div>
                    <select className="localizer-select" value={this.state.selectedSource} onChange={this.handleSourceTextChange}>
                        {firstGroup.resources.map(a => (
                            <option value={a.path.toString()}>{a.path.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <text>{this.state.sourceText}</text>
                </div>
                <div>
                    <text>Target Language:</text>
                    <text>{this.props.targetLanguage}</text>
                </div>
                <div>
                    <select className="localizer-select" value={this.state.translationService} onChange={this.handleTranslationServiceChange}>
                        {translationServices.map(a => (
                            <option value={a.getID()}>{a.getServiceName()}</option>
                        ))}
                    </select>
                </div>
            </div>
        </>;
    }

    handleTranslationServiceChange(event: ChangeEvent<HTMLSelectElement>): void {
        this.setState(state => ({
            translationService: event.currentTarget.value
        }));
    }

    handleSourceTextChange(event: ChangeEvent<HTMLSelectElement>): void {
        this.setState(state => ({
            selectedSource: event.currentTarget.value
        }));
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error);
    }

}
