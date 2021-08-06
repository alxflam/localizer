import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { injectable, inject, postConstruct } from 'inversify';
import { BaseWidget, LabelProvider, Message } from '@theia/core/lib/browser';
import { MonacoEditorModel } from '@theia/monaco/lib/browser/monaco-editor-model';
import { Disposable, Reference } from '@theia/core';
import { TranslationManager } from '../translation-contribution-manager';
import { TranslationGroup } from '../../common/translation-types';
import { TranslationView } from './translation-view';

export const TRANSLATION_VIEW_ID = 'translation-view';

@injectable()
export class TranslationViewWidget extends BaseWidget {

    @inject(TranslationManager)
    protected readonly translationManager: TranslationManager;

    @inject(LabelProvider)
    protected readonly labelProvider: LabelProvider;

    protected viewNode: HTMLDivElement;
    protected reference: Reference<MonacoEditorModel> | undefined;
    protected group: TranslationGroup | undefined;

    @postConstruct()
    protected async init(): Promise<void> {
        // const { group } = this.options;
        this.id = TRANSLATION_VIEW_ID;
        this.title.label = 'Translate: '; // + group.name;
        this.title.closable = true;

        this.scrollOptions = {};
        this.viewNode = document.createElement('div');
        this.viewNode.style.paddingLeft = '15px';
        this.viewNode.style.paddingRight = '15px';
        this.node.appendChild(this.viewNode);
        this.toDispose.push(Disposable.create(() => ReactDOM.unmountComponentAtNode(this.viewNode)));

        this.update();
    }

    setGroup(group: TranslationGroup | undefined) {
        this.group = group;
        this.update();
    }

    protected onUpdateRequest(message: Message): void {
        super.onUpdateRequest(message);
        const groups = this.translationManager.getTranslationGroups();
        if (groups.length > 0) {
            this.group = groups[0];
        } else {
            this.group = {} as TranslationGroup;
        }
        // if (this.group) {
        ReactDOM.render(<TranslationView group={this.group} manager={this.translationManager}
        />, this.viewNode);
        // } else {
        //     ReactDOM.render(<>
        //         <h1>No translation group selected</h1>
        //     </>, this.viewNode);
        // }
    }

}
