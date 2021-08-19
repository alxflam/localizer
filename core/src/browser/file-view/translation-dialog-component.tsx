import * as React from 'react';
import { TranslationServiceManager } from '../translator/translation-service-manager';
import { PreferenceService } from '@theia/core/lib/browser';
import { ChangeEvent } from '@theia/core/shared/react';
import { TranslationManager } from '../translation-contribution-manager';
import { TranslationGroup } from 'src/common/translation-types';

export namespace TranslationDialogComponent {
    export interface Props {
        translationManager: TranslationManager
        translationServiceManager: TranslationServiceManager
        preferenceService: PreferenceService
        targetLanguage: string
        translationKey: string
    }
    export interface State {
        selectedSource: string
        sourceText: string
        translationService: string
        translatedText: string
    }
}

export class TranslationDialogComponent extends React.Component<TranslationDialogComponent.Props, TranslationDialogComponent.State> {

    constructor(props: TranslationDialogComponent.Props) {
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
        const group = this.getTranslationGroup();

        return <>
            <div>
                <div>
                    <select className="theia-select localizer-expanded-width" value={this.state.selectedSource} onChange={this.handleSourceLanguageChange}>
                        {Object.keys(group.resources).filter(a => a !== this.props.targetLanguage).map(a => (
                            <option value={group.resources[a].resource.path.toString()}>{a}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <input
                        key={this.props.translationKey}
                        className="theia-input localizer-expanded-width localizer-translation-input"
                        value={this.state.sourceText}
                        placeholder="Source..."
                        onChange={event => this.handleSourceTextChanged(event)}
                    />
                </div>
                <div>
                    <text>Target Language:</text>
                    <text>{this.props.targetLanguage}</text>
                </div>
                <div>
                    <select className="theia-select localizer-expanded-width" value={this.state.translationService} onChange={this.handleTranslationServiceChange}>
                        {translationServices.map(a => (
                            <option value={a.getID()}>{a.getServiceName()}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button className="theia-button" onClick={event => this.translate()}>Translate</button>
                </div>
                <div>
                    <input
                        key={this.props.translationKey}
                        className="theia-input localizer-expanded-width localizer-translation-input"
                        value={this.state.translatedText}
                        placeholder=""
                        onChange={event => this.handleTranslatedTextChanged(event)}
                    />

                </div>
            </div>
        </>;
    }

    public getResult(): string {
        return this.state.translatedText;
    }

    private getTranslationGroup(): TranslationGroup {
        const groups = this.props.translationManager.getTranslationGroups();
        return groups[0];
    }

    translate(): void {
        const translationServices = this.props.translationServiceManager.getTranslationServices();
        const translator = translationServices.find(a => a.getID() === this.state.translationService);
        if (translator) {
            // TODO get selected source language
            // source language not set initially of not change by user
            translator.translate(this.state.sourceText, this.state.selectedSource, this.props.targetLanguage).then(value => this.setState(state => ({
                translatedText: value
            })));
        }
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
        const val = event.currentTarget.value;
        this.setState(state => ({
            selectedSource: val,
            sourceText: this.props.translationManager.getTranslation(this.props.translationKey, val) ?? ''
        }));
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error);
    }

    componentDidMount(): void {
        this.setState(state => ({
            sourceText: this.props.translationManager.getTranslation(this.props.translationKey, this.state.selectedSource) ?? '',
            selectedSource: Object.keys(this.getTranslationGroup().resources).filter(a => a !== this.props.targetLanguage).find(a => a !== undefined) ?? ''
        }));
    }

}
