import * as React from 'react';
import { TranslationServiceManager } from '../translator/translation-service-manager';
import { PreferenceService } from '@theia/core/lib/browser';
import { ChangeEvent } from '@theia/core/shared/react';
import { TranslationManager } from '../translation-contribution-manager';
import { ITranslationEntryRoot } from 'src/common/translation-types';

export namespace TranslationKeyDialogComponent {
    export interface Props {
        translationManager: TranslationManager
        translationServiceManager: TranslationServiceManager
        preferenceService: PreferenceService
        translationEntry: ITranslationEntryRoot
    }
    export interface State {
        selectedSource: string
        sourceText: string
        translationService: string
        translatedText: string
    }
}

export class TranslationKeyDialogComponent extends React.Component<TranslationKeyDialogComponent.Props, TranslationKeyDialogComponent.State> {

    constructor(props: TranslationKeyDialogComponent.Props) {
        super(props);
        this.state = {
            selectedSource: '',
            sourceText: '',
            translationService: '',
            translatedText: ''
        };

        this.handleSourceLanguageChange = this.handleSourceLanguageChange.bind(this);
        this.handleTranslationServiceChange = this.handleTranslationServiceChange.bind(this);
        this.handleSourceTextChanged = this.handleSourceTextChanged.bind(this);
        this.handleTranslatedTextChanged = this.handleTranslatedTextChanged.bind(this);
    }

    render(): JSX.Element | null {
        const translationServices = this.props.translationServiceManager.getTranslationServices();
        // const group = this.getTranslationGroup();

        const data = this.props.translationEntry.data;
        const entries = Object.keys(this.props.translationEntry.data);

        /**
         * Render a table with all languages and their translations
         */
        return <>
            <div>
                {/* Render source language for translation */}
                <select className="theia-select localizer-expanded-width" value={this.state.translationService} onChange={this.handleTranslationServiceChange}>
                    {translationServices.map(a => (
                        <option value={a.getID()}>{a.getServiceName()}</option>
                    ))}
                </select>
            </div>

            {/* Render all languages */}
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Language</th>
                            <th>Translation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((value, _) => (
                            <tr key={value}>
                                <td>{value}</td>
                                <input
                                    className="theia-input localizer-expanded-width localizer-translation-input"
                                    value={data[value]}>
                                </input>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>;
    }

    public getResult(): string {
        return this.state.translatedText;
    }

    // private getTranslationGroup(): TranslationGroup {
    //     const groups = this.props.translationManager.getTranslationGroups();
    //     return groups[0];
    // }

    translate(): void {
        // const translationServices = this.props.translationServiceManager.getTranslationServices();
        // const translator = translationServices.find(a => a.getID() === this.state.translationService);
        // if (translator) {
        //     // TODO get selected source language
        //     // source language not set initially of not change by user
        //     translator.translate(this.state.sourceText, this.state.selectedSource, this.props.targetLanguage).then(value => this.setState(state => ({
        //         translatedText: value
        //     })));
        // }
    }

    handleTranslatedTextChanged(event: React.FormEvent<HTMLInputElement>): void {
        const value = event.currentTarget.value;
        this.setState(state => ({
            translatedText: value
        }));
    }

    handleSourceTextChanged(event: React.FormEvent<HTMLInputElement>): void {
        const value = event.currentTarget.value;
        this.setState(state => ({
            sourceText: value
        }));
    }

    handleTranslationServiceChange(event: ChangeEvent<HTMLSelectElement>): void {
        const value = event.currentTarget.value;
        this.setState(state => ({
            translationService: value
        }));
    }

    handleSourceLanguageChange(event: ChangeEvent<HTMLSelectElement>): void {
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error);
    }

    componentDidMount(): void {
    }

}
