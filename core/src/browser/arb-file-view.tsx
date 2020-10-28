import * as React from "react";
import { JSONSchema6 } from "json-schema";
import * as jsoncparser from "jsonc-parser";
import { MonacoTextModelService } from "@theia/monaco/lib/browser/monaco-text-model-service";
import { MonacoEditorModel } from "@theia/monaco/lib/browser/monaco-editor-model";
import { DisposableCollection } from "@theia/core";
import { ReferencedModelStorage } from "./referenced-model-storage";

export class ArbFileView extends React.Component<ArbFileView.Props, ArbFileView.State> {

    protected readonly schemaStorage: ReferencedModelStorage<JSONSchema6>;

    constructor(props: ArbFileView.Props) {
        super(props);
        this.state = {
            schema: {
                default: {}
            },
            formData: {}
        }
        const { model, modelService } = props;
        this.schemaStorage = new ReferencedModelStorage(model, modelService, '$schema', { default: {} });
    }

    render(): JSX.Element | null {
        return <>
            <h1>ARB File Content</h1>
        </>;
    }

    protected submit = () => {
        const model = this.props.model.textEditorModel;
        const content = model.getValue();
        const formattingOptions = { tabSize: 2, insertSpaces: true, eol: '' };
        const edits = jsoncparser.modify(content, [], this.state.formData, { formattingOptions });
        model.applyEdits(edits.map(e => {
            const start = model.getPositionAt(e.offset);
            const end = model.getPositionAt(e.offset + e.length);
            return {
                range: monaco.Range.fromPositions(start, end),
                text: e.content
            }
        }));
    }

    protected readonly toDispose = new DisposableCollection();
    componentWillMount(): void {
        this.toDispose.push(this.schemaStorage);
        this.toDispose.push(this.schemaStorage.onDidChange(schema => this.setState({ schema })));

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
        this.schemaStorage.update(formData);
    }

}
export namespace ArbFileView {
    export interface Props {
        model: MonacoEditorModel
        modelService: MonacoTextModelService
    }
    export interface State {
        schema: JSONSchema6
        formData: any
    }
}