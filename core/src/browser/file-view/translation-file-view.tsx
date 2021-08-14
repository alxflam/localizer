import * as React from 'react';
import { JSONSchema6 } from 'json-schema';
import * as jsoncparser from 'jsonc-parser';
import { MonacoTextModelService } from '@theia/monaco/lib/browser/monaco-text-model-service';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { DisposableCollection } from '@theia/core';
import { ReferencedModelStorage } from '../referenced-model-storage';
import { ITranslationEntry } from '../../common/translation-types';
import { TranslationResourceParser } from '../../common/parser';
import { ChangeEventHandler } from '@theia/core/shared/react';

export class TranslationFileView extends React.Component<TranslationFileView.Props, TranslationFileView.State> {

    protected readonly schemaStorage: ReferencedModelStorage<JSONSchema6>;

    constructor(props: TranslationFileView.Props) {
        super(props);
        this.state = {
            schema: {
                default: {}
            },
            formData: {}
        };
        const { model, modelService } = props;
        this.schemaStorage = new ReferencedModelStorage(model, modelService, '$schema', { default: {} });
        this.onChange = this.onChange.bind(this);
    }

    render(): JSX.Element | null {
        const { formData } = this.state;
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
                    <h3>{value.key}</h3>
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

    protected readonly toDispose = new DisposableCollection();

    componentDidMount(): void {
        this.toDispose.push(this.schemaStorage);
        this.toDispose.push(this.schemaStorage.onDidChange(schema => this.setState({ schema })));

        this.reconcileFormData();
        this.toDispose.push(this.props.model.onDidChangeContent(() => this.reconcileFormData()));
    }

    // componentWillMount(): void {
    // }
    componentWillUnmount(): void {
        this.toDispose.dispose();
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error);
    }

    protected async reconcileFormData(): Promise<void> {
        const formData = jsoncparser.parse(jsoncparser.stripComments(this.props.model.getText())) || {};
        this.setState({ formData });
        this.schemaStorage.update(formData);
    }

}
export namespace TranslationFileView {
    export interface Props {
        model: MonacoEditorModel
        modelService: MonacoTextModelService
        parser: TranslationResourceParser
    }
    export interface State {
        schema: JSONSchema6
        formData: unknown
    }
}
