import * as React from "react";
import * as ReactDOM from "react-dom";
import { injectable, inject, postConstruct } from "inversify";
import { BaseWidget, LabelProvider, Message } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { MonacoTextModelService } from "@theia/monaco/lib/browser/monaco-text-model-service";
import { MonacoEditorModel } from "@theia/monaco/lib/browser/monaco-editor-model";
import { Disposable, Reference } from "@theia/core";
import { ArbFileView } from "./arb-file-view";

export const ArbFileWidgetOptions = Symbol('ArbFileWidgetOptions');
export interface ArbFileWidgetOptions {
    uri: URI
}

@injectable()
export class ArbFileWidget extends BaseWidget {

    static id = 'arb-file-widget';

    @inject(ArbFileWidgetOptions)
    protected readonly options: ArbFileWidgetOptions;

    @inject(LabelProvider)
    protected readonly labelProvider: LabelProvider

    @inject(MonacoTextModelService)
    protected readonly modelService: MonacoTextModelService;

    protected viewNode: HTMLDivElement;    
    protected reference: Reference<MonacoEditorModel> | undefined;

    @postConstruct()
    protected async init(): Promise<void> {
        const { uri } = this.options;
        this.id = ArbFileWidget.id + ':' + uri.toString()
        // TODO: title should be the file name
        this.title.label = 'ARB ' + this.labelProvider.getName(uri);
        this.title.closable = true;
        
        this.scrollOptions = {};
        this.viewNode = document.createElement('div');
        this.viewNode.style.paddingLeft = '15px';
        this.viewNode.style.paddingRight = '15px';
        this.node.appendChild(this.viewNode);
        this.toDispose.push(Disposable.create(() => ReactDOM.unmountComponentAtNode(this.viewNode)));

        const reference = await this.modelService.createModelReference(uri);
        if (this.toDispose.disposed) {
            reference.dispose();
            return;
        }
        this.toDispose.push(this.reference = reference);
        this.update();
    }

    protected onUpdateRequest(message: Message): void {
        super.onUpdateRequest(message);
        const model = this.reference && this.reference.object;
        ReactDOM.render(model ? <ArbFileView model={model} modelService={this.modelService} /> : null!, this.viewNode);
    }

}