import * as React from "react";
import * as ReactDOM from "react-dom";
import { injectable, inject, postConstruct } from "inversify";
import { BaseWidget, LabelProvider, Message } from "@theia/core/lib/browser";
import { MonacoEditorModel } from "@theia/monaco/lib/browser/monaco-editor-model";
import { Disposable, Reference } from "@theia/core";
import { TranslationManager } from "../translation-contribution-manager";
import { TranslationGroup } from "../../common/translation-types";
import { TranslationView } from "./translation-view";

@injectable()
export class TranslationViewWidgetOptions {
    group: TranslationGroup
}

export const TRANSLATION_VIEW_ID = 'translation-view';

@injectable()
export class TranslationViewWidget extends BaseWidget {
    
    @inject(TranslationManager)
    protected readonly translationSupport: TranslationManager;

    @inject(TranslationViewWidgetOptions)
    protected readonly options: TranslationViewWidgetOptions;

    @inject(LabelProvider)
    protected readonly labelProvider: LabelProvider

    protected viewNode: HTMLDivElement;    
    protected reference: Reference<MonacoEditorModel> | undefined;

    @postConstruct()
    protected async init(): Promise<void> {
        const { group } = this.options;
        this.id = TRANSLATION_VIEW_ID
        this.title.label = 'Translate: ' + group.name;
        this.title.closable = true;
        
        this.scrollOptions = {};
        this.viewNode = document.createElement('div');
        this.viewNode.style.paddingLeft = '15px';
        this.viewNode.style.paddingRight = '15px';
        this.node.appendChild(this.viewNode);
        this.toDispose.push(Disposable.create(() => ReactDOM.unmountComponentAtNode(this.viewNode)));

        this.update();
    }

    protected onUpdateRequest(message: Message): void {
        super.onUpdateRequest(message);
        const group = {} as TranslationGroup;
        ReactDOM.render(group ? <TranslationView group={group} 
            /> : null!, this.viewNode);
    }

}