import * as React from 'react';
import { JSONSchema6 } from 'json-schema';
import * as jsoncparser from 'jsonc-parser';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { DisposableCollection } from '@theia/core';
import { ITranslationEntry } from '../../common/translation-types';
import { TranslationResourceParser } from '../../common/parser';
import { ChangeEventHandler } from '@theia/core/shared/react';
import { TranslationServiceManager } from '../translator/translation-service-manager';
import { PreferenceService } from '@theia/core/lib/browser';
import { TranslationDialog, TranslationDialogProps } from './translation-dialog';
import { TranslationManager } from '../translation-contribution-manager';

export class TranslationFileView extends React.Component<TranslationFileView.Props, TranslationFileView.State> {

    constructor(props: TranslationFileView.Props) {
        super(props);
        this.state = {
            schema: {
                default: {}
            },
            formData: {}
        };
        this.onChange = this.onChange.bind(this);
    }

    render(): JSX.Element | null {
        const { formData } = this.state;
        // TODO: get language code, better at construction as won't ever change
        // once componentDidMount got fired we'll have the file content
        // then just parse it
        // and display a form for each entry
        // enhance model: add line to each key entry
        const groups = this.props.translationManager.getTranslationGroups();
        // const allTranslations = this.props.translationManager.getTranslationEntries(groups[0]);

        // TODO all that static stuff needs to be done outside of rendering...
        const resourceUri = this.props.model.uri;
        const langKeys = Object.keys(groups[0].resources);
        let resourceLang: string | undefined = undefined;
        // let comparisonLang: string | undefined = undefined;

        // TODO: extract utility method to translation support
        for (let index = 0; index < langKeys.length; index++) {
            const lang = langKeys[index];
            if (groups[0].resources[lang].resource.toString() === resourceUri) {
                resourceLang = lang;
                break;
            }
        }

        // for (let index = 0; index < langKeys.length; index++) {
        //     const lang = langKeys[index];
        //     if (groups[0].resources[lang].resource.toString() === resourceUri) {
        //         resourceLang = lang;
        //     }
        //     if (resourceLang && lang !== resourceLang) {
        //         comparisonLang = lang;
        //         break;
        //     }
        //     comparisonLang = lang;
        // }

        let entries: ITranslationEntry[] = [];
        if (formData) {
            entries = this.props.parser.parseByContent(formData);
        }
        return <>
            {entries.map((value, index) => (
                <div key={index}>
                    <div className="localizer-horizontal">
                        <h3>{value.key}</h3>
                        <button className="theia-button localizer-translation-service-btn"
                            onClick={event => this.onClickTranslate(value, resourceLang!)}>Translate</button>
                    </div>

                    {value.description && value.description.description && value.description.description.length > 0 ?
                        <p>{value.description?.description}</p> : undefined
                    }

                    {/* {comparisonLang ?? allTranslations.data.find(a => a.key === value.key) ?
                        <p>{comparisonLang}: {allTranslations.data.find(a => a.key === value.key)?.data[comparisonLang!]}</p> : undefined
                    } */}

                    <textarea
                        key={value.key}
                        className="theia-input localizer-expanded-width localizer-translation-input"
                        value={value.value}
                        placeholder="Translation..."
                        onChange={event => this.onChange(event, value.key)}
                    />
                </div>
            ))}
        </>;
    }

    // React.FormEvent<HTMLInputElement>
    onChange(event: React.ChangeEvent<HTMLTextAreaElement>, key: string): ChangeEventHandler<HTMLInputElement> | undefined {
        // TODO add params, update internal model - this.state.formData (how..create json and replace?), then on save only trigger persistence?
        const val = event.currentTarget.value;
        console.log(val);

        this.updateTranslation(key, val);

        return undefined;
    };

    updateTranslation(key: string, value: string): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { formData } = this.state as any;
        formData[key] = value;

        // then modify form data using new value
        const model = this.props.model.textEditorModel;
        const content = model.getValue();
        const formattingOptions = { tabSize: 2, insertSpaces: true, eol: '' };

        // modify the single changed key
        const edits = jsoncparser.modify(content, [key], value, { formattingOptions });
        model.applyEdits(edits.map(e => {
            const start = model.getPositionAt(e.offset);
            const end = model.getPositionAt(e.offset + e.length);
            return {
                range: monaco.Range.fromPositions(start, end),
                text: e.content
            };
        }));
    }

    onClickTranslate(entry: ITranslationEntry, targetLanguage: string): void {
        const dialogProperties = {
            title: `Translate ${entry.key} to ${targetLanguage}`,
            translationEntry: entry,
            targetLanguage: targetLanguage,
            translationKey: entry.key
        } as TranslationDialogProps;

        const dialog = new TranslationDialog(dialogProperties, this.props.translationServiceManager, this.props.preferenceService, this.props.translationManager);

        dialog.open().then(async result => {
            if (result) {
                this.updateTranslation(entry.key, result);
            }
        });
    };

    protected readonly toDispose = new DisposableCollection();

    componentDidMount(): void {
        this.reconcileFormData();
        this.toDispose.push(this.props.model.onDidChangeContent(() => this.reconcileFormData()));
    }

    componentWillUnmount(): void {
        this.toDispose.dispose();
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error);
    }

    protected async reconcileFormData(): Promise<void> {
        const formData = jsoncparser.parse(jsoncparser.stripComments(this.props.model.getText())) || {};
        this.setState({ formData });
    }

}
export namespace TranslationFileView {
    export interface Props {
        model: MonacoEditorModel
        modelService: MonacoTextModelService
        parser: TranslationResourceParser
        translationServiceManager: TranslationServiceManager
        preferenceService: PreferenceService
        translationManager: TranslationManager
    }
    export interface State {
        schema: JSONSchema6
        formData: unknown
    }
}
