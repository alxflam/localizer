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
import { prefDeeplApiKey } from '../translator/deepl-preferences';
import { TranslationService } from '../translator/translation-service';

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
        const translationServices = this.props.translationServiceManager.getTranslationServices();
        // TODO: get language code, better at construction as won't ever change
        // once componentDidMount got fired we'll have the file content
        // then just parse it
        // and display a form for each entry
        // enhance model: add line to each key entry
        let entries: ITranslationEntry[] = [];
        if (formData) {
            entries = this.props.parser.parseByContent(formData);
        }
        return <>
            {entries.map((value, index) => (
                <div key={index}>
                    <div className="localizer-horizontal">
                        <h3>{value.key}</h3>
                        {translationServices.map(a => (
                            <button className="theia-button localizer-translation-service-btn"
                                onClick={event => this.onClickTranslate(a, value.key, value.value, 'DE')}>{a.getServiceName()}</button>
                        ))}
                    </div>

                    {value.description && value.description.description && value.description.description.length > 0 ?
                        <p>{value.description?.description}</p> : undefined
                    }

                    <textarea
                        key={value.key}
                        className="localizer-translation-input"
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { formData } = this.state as any;
        formData[key] = val;

        // then modify form data using new value
        const model = this.props.model.textEditorModel;
        const content = model.getValue();
        const formattingOptions = { tabSize: 2, insertSpaces: true, eol: '' };

        // modify the single changed key
        const edits = jsoncparser.modify(content, [key], val, { formattingOptions });
        model.applyEdits(edits.map(e => {
            const start = model.getPositionAt(e.offset);
            const end = model.getPositionAt(e.offset + e.length);
            return {
                range: monaco.Range.fromPositions(start, end),
                text: e.content
            };
        }));

        return undefined;
    };

    onClickTranslate(translationService: TranslationService, key: string, sourceValue: string, targetLanguage: string): void {
        const apiKey = this.props.preferenceService.get<string>(prefDeeplApiKey);
        console.log('Received API Key' + apiKey);

        translationService.translate(sourceValue, undefined, targetLanguage).then(value => (
            console.log('Translation returned ' + value)
        ));

        // TODO: instead of directly invoking translation, show a dialog so user can set source file for source values to be translated
        // and display of translation (so user can approve / edit / reject)
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
    }
    export interface State {
        schema: JSONSchema6
        formData: unknown
    }
}
