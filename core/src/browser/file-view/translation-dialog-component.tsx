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
// import { TranslationService } from '../translator/translation-service';
// import { TranslationDialog, TranslationDialogProps } from './translation-dialog';

export namespace TranslationDialogComponent {
    export interface Props {
        translationServiceManager: TranslationServiceManager
        preferenceService: PreferenceService
    }
    export interface State {
        selectedSource: string
        translationService: string // TODO: add id to every service so it can be used as a key
    }
}

export class TranslationDialogComponent extends React.Component<TranslationDialogComponent.Props, TranslationDialogComponent.State> {

    constructor(props: TranslationDialogComponent.Props) {
        super(props);
        this.state = {
            selectedSource: '',
            translationService: ''
        };

        this.handleSourceChange = this.handleSourceChange.bind(this);
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

        return <>
            <div>
                <div>
                    <select className="localizer-select" value={this.state.selectedSource} onChange={this.handleSourceChange}>
                        <option value="grapefruit">Grapefruit</option>
                        <option value="lime">Lime</option>
                        <option value="coconut">Coconut</option>
                        <option value="mango">Mango</option>
                    </select>
                </div>
                <div>
                    <text>to be translated</text>
                </div>
                <div>
                    <text>Target:</text>
                    <text>DE als prop</text>
                </div>
                <div>
                    <select className="localizer-select" value={this.state.translationService} onChange={this.handleSourceChange}>
                        {translationServices.map(a => (
                            <option value={a.getServiceName()}>{a.getServiceName()}</option>
                        ))}
                    </select>
                </div>
            </div>
        </>;
    }

    handleSourceChange(event: ChangeEvent<HTMLSelectElement>): void {
        this.setState(state => ({
            selectedSource: event.currentTarget.value
        }));
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error);
    }

}
